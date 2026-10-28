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
const mod = (p) => load(new URL(`../src/${p}`, import.meta.url)).then((u) => import(u));

const euler = await mod("features/gbm/gbm.euler.math.ts");
const ou = await mod("features/gbm/gbm.ou.math.ts");
const jumps = await mod("features/gbm/gbm.jumps.math.ts");
const corr = await mod("features/gbm/gbm.corr.math.ts");
const moments = await mod("lib/stats/moments.ts");
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("Euler strong error falls by about sqrt(2) per halving of dt; weak error by about 2", () => {
  const e = euler.errorCurves(0.08, 0.4);
  const strong = euler.loglogSlope(e.map((r) => ({ dt: r.dt, value: r.strong })));
  const weak = euler.loglogSlope(e.map((r) => ({ dt: r.dt, value: r.weak })));
  close(strong, 0.5, 0.12, "strong slope");
  close(weak, 1, 0.05, "weak slope");
  close(e[1].strong / e[2].strong, Math.SQRT2, 0.3, "ratio");
});

test("Euler and exact paths share increments: same start, error shrinks with more steps", () => {
  const coarse = euler.eulerComparison(5, 4, 0.08, 0.3);
  const fine = euler.eulerComparison(5, 256, 0.08, 0.3);
  assert.equal(fine.rows.length, 257);
  assert.equal(fine.rows[0].exact, fine.rows[0].euler);
  assert.ok(fine.terminalError < coarse.terminalError);
});

test("OU: stationary variance and mean reversion", () => {
  const [x0, th, k, s, n] = [-1, 2, 3, 0.8, 4000];
  const v = ou.simulateOu(x0, th, k, s, 5, 100, n, 3);
  const end = Array.from({ length: n }, (_, p) => v[100 * n + p]);
  const m = end.reduce((a, b) => a + b, 0) / n;
  const variance = end.reduce((a, b) => a + (b - m) ** 2, 0) / n;
  close(m, th, 0.05, "mean");
  close(variance, ou.ouStationarySd(k, s) ** 2, 0.03, "variance");
  close(ou.ouMeanAt(x0, th, k, ou.ouHalfLife(k)), (x0 + th) / 2, 1e-9, "half-life halves the gap");
});

test("OU: simulated negative share matches the exact normal probability", () => {
  const n = 6000;
  const v = ou.simulateOu(0.01, 0.02, 1.5, 0.03, 1, 50, n, 9);
  const r = ou.negativeShares(v, n, 51, 0.01, 0.02, 1.5, 0.03, 1);
  close(r.end, r.exact, 0.02, "terminal share");
  assert.ok(r.ever >= r.end);
});

test("Merton: mean log-return and excess kurtosis match the closed form", () => {
  const p = { mu: 0.05, sigma: 0.15, lambda: 20, jumpMean: -0.03, jumpSd: 0.05 };
  const steps = 252;
  const paths = 400;
  const { returns, levels } = jumps.simulateMerton(100, p, 1, steps, paths, 21);
  const law = jumps.mertonReturnLaw(p, 1 / steps);
  const m = returns.reduce((a, b) => a + b, 0) / returns.length;
  close(m, law.mean, 4 * Math.sqrt(law.variance / returns.length), "mean log-return");
  const k = moments.excessKurtosis(returns);
  assert.ok(law.excessKurtosis > 1 && k > 1, `fat tails ${k} vs ${law.excessKurtosis}`);
  close(k / law.excessKurtosis, 1, 0.35, "kurtosis ratio");
  let sum = 0;
  for (let q = 0; q < paths; q++) sum += levels[steps * paths + q];
  close(sum / paths, 100 * Math.exp(0.05), 5, "E[S_T] = S0 e^{mu T}");
});

test("Merton without jumps has zero excess kurtosis", () => {
  const p = { mu: 0.05, sigma: 0.2, lambda: 0, jumpMean: 0, jumpSd: 0.1 };
  assert.equal(jumps.mertonReturnLaw(p, 0.01).excessKurtosis, 0);
});

test("correlated Brownian increments reproduce rho", () => {
  for (const rho of [-0.8, 0, 0.6, 0.95]) {
    const { dW1, dW2, w1 } = corr.correlatedBrownian(rho, 1, 20000, 4);
    close(moments.correlation(dW1, dW2), rho, 0.03, `rho ${rho}`);
    assert.equal(w1.length, 20001);
  }
});
