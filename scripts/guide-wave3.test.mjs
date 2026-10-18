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

const m = await import(await load(new URL("../src/features/guide/guide.wave3.math.ts", import.meta.url)));
const bs = await import(await load(new URL("../src/features/black-scholes/blackScholes.math.ts", import.meta.url)));

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) < tol, `${msg}: ${a} vs ${b}`);

test("a real option is worth at least its static NPV and never negative", () => {
  for (const I of [70, 100, 130]) {
    const o = m.realOption(100, I, 0.3, 0.05, 0.06, 3, 3);
    assert.ok(o.expanded >= Math.max(o.staticNpv, 0) - 1e-12, `I=${I}`);
    close(o.waitingValue, o.expanded - Math.max(o.staticNpv, 0), 1e-12, "waiting value");
  }
  // Deep in the money with forgone cash flows: investing at once is optimal; without them, waiting never hurts.
  assert.ok(m.realOption(100, 20, 0.1, 0.05, 0.08, 3, 3).investNow);
  assert.ok(!m.realOption(100, 90, 0.3, 0.05, 0, 3, 3).investNow);
});

test("Monte Carlo exotics: vanilla near Black–Scholes, barrier below vanilla and converging as B grows", () => {
  const stats = m.simulatePathStats(100, 0.05, 0.2, 1, 20000, 100, 3);
  const p = m.exoticPrices(stats, 100, 1e9, 0.05, 1);
  close(p.vanilla, bs.blackScholesCall(100, 100, 1, 0.05, 0.2), 0.35, "vanilla");
  close(p.upOut, p.vanilla, 1e-12, "barrier at infinity");
  assert.ok(m.exoticPrices(stats, 100, 120, 0.05, 1).upOut < p.vanilla);
  assert.ok(p.asian < p.vanilla);
  const d2 = (Math.log(1) + (0.05 - 0.02) * 1) / 0.2;
  close(p.digital, Math.exp(-0.05) * bs.normalCdf(d2), 0.01, "digital");
});

test("Merton density is a proper density that reduces to the normal without jumps", () => {
  const rows = m.mertonDensityRows(0.2, 0.5, -0.1, 0.15, 2, 801);
  const dx = rows[1].x - rows[0].x;
  close(rows.reduce((a, r) => a + r.jump * dx, 0), 1, 1e-3, "mass");
  const flat = m.mertonDensityRows(0.2, 0, -0.1, 0.15);
  for (const r of flat) close(r.jump, r.normal, 1e-9, "lambda 0");
  const mom = m.mertonMoments(0.2, 0.5, -0.1, 0.15);
  assert.ok(mom.skewness < 0 && mom.excessKurtosis > 0);
});

test("credit spread vanishes without default or with full recovery, and is close to lambda(1-R)", () => {
  close(m.riskyZero(0.03, 0, 0.4, 5).spread, 0, 1e-12, "no default");
  close(m.riskyZero(0.03, 0.02, 1, 5).spread, 0, 1e-12, "full recovery");
  close(m.riskyZero(0.03, 0.02, 0.4, 1).spread, m.cdsSpread(0.02, 0.4), 5e-4, "approx");
});

test("single-index portfolio volatility falls to the systematic floor", () => {
  const big = m.singleIndexVol(1e6, 1.1, 0.18, 0.35);
  close(big.vol, 1.1 * 0.18, 1e-4, "floor");
  assert.ok(m.singleIndexVol(1, 1.1, 0.18, 0.35).vol > m.singleIndexVol(10, 1.1, 0.18, 0.35).vol);
  assert.deepEqual(m.parameterCount(100), { full: 5050, singleIndex: 201 });
});
