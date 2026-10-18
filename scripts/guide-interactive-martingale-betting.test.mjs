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
const m = await import(await load(new URL("../src/features/guide/guide.interactive.martingaleBetting.math.ts", import.meta.url)));
const rnd = await import(await load(new URL("../src/lib/math/random.ts", import.meta.url)));
const STRATEGIES = ["constant", "doubling", "fraction"];

test("stakes come from the past only and never exceed wealth", () => {
  const p = { wealth: 5, streak: 4, path: [5] };
  assert.equal(m.stakeFor(p, "constant"), 1);
  assert.equal(m.stakeFor(p, "doubling"), 5); // wants 16, capped at wealth
  assert.equal(m.stakeFor({ wealth: 200, streak: 6, path: [] }, "doubling"), 64);
  assert.equal(m.stakeFor({ wealth: 200, streak: 7, path: [] }, "doubling"), 1); // gives up after 6 doublings
  assert.equal(m.stakeFor({ wealth: 80, streak: 0, path: [] }, "fraction"), 4);
});

test("every strategy keeps the expected final wealth at the start (within 3 SE)", () => {
  for (const s of STRATEGIES) {
    const r = m.simulateCrowd(s, 11, 20000);
    assert.ok(Math.abs(r.mean - 100) < 3 * r.se, `${s}: ${r.mean} ± ${r.se}`);
  }
});

test("same mean, different distributions", () => {
  const c = m.simulateCrowd("constant", 1);
  const d = m.simulateCrowd("doubling", 1);
  assert.ok(d.shareAhead > 0.6 && c.shareAhead < 0.5, `${d.shareAhead} vs ${c.shareAhead}`);
  assert.equal(d.worst, 0);
  assert.ok(c.worst > 50);
});

test("a played round moves wealth by exactly the stake, and paths grow by one point", () => {
  const rng = rnd.makeRng(3);
  const p = m.playRounds(m.newPlayer(), "doubling", rng, 10);
  assert.equal(p.path.length, 11);
  for (let i = 1; i < p.path.length; i++) assert.ok(Math.abs(p.path[i] - p.path[i - 1]) >= 1);
});

test("doubling over 5 rounds: lose all with probability 1/32, losing 31, expected gain 0", () => {
  const o = m.doublingOutcome(5);
  assert.equal(o.pLoseAll, 1 / 32);
  assert.equal(o.lossAll, 31);
  assert.equal(o.expectedGain, 0);
});

test("histogram counts every value; constant-stake bins hold the same number of possible values", () => {
  for (const s of ["constant", "doubling", "fraction"]) {
    const r = m.simulateCrowd(s, 2);
    const h = m.histogram(r.finals);
    assert.equal(h.counts.reduce((a, b) => a + b, 0), r.finals.length, s);
  }
  const h = m.histogram(m.simulateCrowd("constant", 2).finals);
  assert.equal(h.width % 2, 0);
  assert.ok(h.counts.length >= 12 && h.counts.length <= 26, `${h.counts.length} bins`);
});
