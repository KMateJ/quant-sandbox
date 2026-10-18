import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const cache = new Map();

/// Transpiles a TS module and its relative imports into data: URLs (type-only imports vanish).
async function load(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const source = await readFile(url, "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [, spec] of outputText.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
    const dep = await load(new URL(`${spec}.ts`, url));
    outputText = outputText.replaceAll(`"${spec}"`, `"${dep}"`);
  }
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}


const m = await import(await load(new URL("../src/features/guide/guide.interactive.mcHistogram.math.ts", import.meta.url)));
const rnd = await import(await load(new URL("../src/lib/math/random.ts", import.meta.url)));
const bs = await import(await load(new URL("../src/features/black-scholes/blackScholes.math.ts", import.meta.url)));
const { S0, K, r, sigma, T } = m.MC_SETUP;
const price = bs.blackScholesCall(S0, K, T, r, sigma);
const d2 = (Math.log(S0 / K) + (r - 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));

test("bins cover 40–220 in steps of 4 and reject prices outside", () => {
  assert.equal(m.MC_BIN_COUNT, 45);
  assert.equal(m.binIndex(40), 0);
  assert.equal(m.binIndex(99.99), 14);
  assert.equal(m.binIndex(100), 15);
  assert.equal(m.binIndex(219.99), 44);
  assert.equal(m.binIndex(220), -1);
  assert.equal(m.binIndex(39.9), -1);
});

test("call payoff is (S_T − K)+", () => {
  assert.equal(m.callPayoff(120, 100), 20);
  assert.equal(m.callPayoff(80, 100), 0);
});

test("20 000 seeded draws price the call within 3 SE of Black–Scholes", () => {
  const state = m.addDraws(m.emptyMcState(), 20000, m.MC_SETUP, rnd.makeRng(1));
  const s = m.mcStats(state, m.MC_SETUP);
  assert.equal(state.n, 20000);
  assert.ok(Math.abs(s.estimate - price) < 3 * s.se, `estimate ${s.estimate} vs ${price} (se ${s.se})`);
  assert.ok(Math.abs(s.itmShare - bs.normalCdf(d2)) < 0.015, `itm ${s.itmShare} vs ${bs.normalCdf(d2)}`);
  assert.ok(s.se > 0.08 && s.se < 0.13);
});

test("adding draws in batches equals adding them at once, and the input state is left untouched", () => {
  const empty = m.emptyMcState();
  const once = m.addDraws(empty, 300, m.MC_SETUP, rnd.makeRng(7));
  let step = empty;
  const rng = rnd.makeRng(7);
  for (const k of [1, 99, 200]) step = m.addDraws(step, k, m.MC_SETUP, rng);
  assert.deepEqual(step.counts, once.counts);
  assert.equal(step.sumPayoff, once.sumPayoff);
  assert.equal(empty.n, 0);
  assert.equal(empty.counts.reduce((a, b) => a + b, 0), 0);
});

test("the estimate trail ends at the current draw count and its band narrows", () => {
  const state = m.addDraws(m.emptyMcState(), 5000, m.MC_SETUP, rnd.makeRng(3));
  const trail = m.estimateTrail(state, m.MC_SETUP);
  assert.equal(trail[trail.length - 1].n, 5000);
  const early = trail.find((p) => p.n >= 100);
  const last = trail[trail.length - 1];
  assert.ok(last.upper - last.lower < (early.upper - early.lower) / 4);
  assert.ok(trail.length < 300);
});

test("draws per frame start at one and are capped", () => {
  assert.equal(m.drawsPerFrame(0), 1);
  assert.ok(m.drawsPerFrame(60) > 30);
  assert.equal(m.drawsPerFrame(500), 400);
});
