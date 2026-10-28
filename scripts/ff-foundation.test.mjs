import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { ols } = await importSrc("lib/stats/ols.ts");
const { linearRegression } = await importSrc("lib/stats/regression.ts");
const math = await importSrc("features/fama-french/famaFrench.math.ts");

const JSON_URL = new URL("../src/features/fama-french/data/famaFrench.json", import.meta.url);
const raw = JSON.parse(readFileSync(JSON_URL, "utf8"));
const data = math.toFfData(raw);
const full = { from: 0, to: data.months.length - 1 };
const avg = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} ${a} vs ${b}`);

test("ols recovers exact coefficients on noise-free data", () => {
  const x1 = [1, 2, 3, 4, 5, 6, 7, 8];
  const x2 = [2, 1, 4, 3, 7, 5, 9, 8];
  const y = x1.map((v, i) => 0.5 + 2 * v - 3 * x2[i]);
  const fit = ols(y, [x1, x2]);
  [0.5, 2, -3].forEach((c, i) => close(fit.coef[i], c, 1e-9, `coef ${i}`));
  close(fit.r2, 1, 1e-12);
  close(fit.sigma, 0, 1e-9);
  assert.equal(fit.k, 3);
  assert.equal(fit.n, 8);
});

test("one-regressor ols equals linearRegression", () => {
  const x = [0.01, -0.02, 0.03, 0.005, -0.01, 0.02, 0.04];
  const y = [0.02, -0.01, 0.05, 0.0, -0.03, 0.01, 0.06];
  const fit = ols(y, [x]);
  const ref = linearRegression(x, y);
  close(fit.coef[0], ref.intercept, 1e-12);
  close(fit.coef[1], ref.slope, 1e-12);
  close(fit.r2, ref.r2, 1e-12);
});

test("hand-checked t-statistic on a 6-point example", () => {
  // Sxx = 17.5, Sxy = 16, Syy = 70/3: slope 16/17.5, RSS = 70/3 − 256/17.5, s² = RSS/4
  const fit = ols([2, 1, 4, 3, 7, 5], [[1, 2, 3, 4, 5, 6]]);
  close(fit.coef[1], 0.9142857, 1e-6, "slope");
  close(fit.coef[0], 0.4666667, 1e-6, "intercept");
  close(fit.se[1], 0.352644, 1e-5, "se(slope)");
  close(fit.t[1], 2.59270, 1e-4, "t(slope)");
  close(fit.r2, 1 - 8.704762 / (70 / 3), 1e-6, "r2");
  close(fit.adjR2, 1 - (8.704762 / 4) / ((70 / 3) / 5), 1e-6, "adjR2");
});

test("ols without an intercept fits through the origin", () => {
  const fit = ols([2, 4, 6, 8], [[1, 2, 3, 4]], false);
  assert.equal(fit.k, 1);
  close(fit.coef[0], 2, 1e-12);
});

test("ols throws when n ≤ k or X'X is singular", () => {
  assert.throws(() => ols([1, 2], [[1, 2], [3, 4]]));
  assert.throws(() => ols([1, 2, 3, 4], [[1, 2, 3, 4], [2, 4, 6, 8]]));
});

test("snapshot integrity", () => {
  const n = raw.factors.mkt.length;
  const series = [...Object.values(raw.factors), ...raw.p25.returns, ...raw.industries.returns];
  assert.ok(series.every((s) => s.length === n), "all series have equal length");
  assert.equal(raw.p25.returns.length, 25);
  assert.equal(raw.industries.returns.length, 10);
  assert.equal(data.months.length, n);
  assert.equal(data.months[0], "1963-07");
  data.months.forEach((m, i) => {
    if (i === 0) return;
    const [y0, m0] = data.months[i - 1].split("-").map(Number);
    const [y1, m1] = m.split("-").map(Number);
    assert.equal(y1 * 12 + m1, y0 * 12 + m0 + 1, `contiguous at ${m}`);
  });
  assert.equal(data.months[n - 1], raw.end);
  assert.ok(series.every((s) => s.every((v) => Number.isFinite(v) && Math.abs(v) < 50)), "|value| < 50%");
  assert.ok(raw.factors.rf.every((v) => v >= -0.5), "rf ≥ −0.5%");
  assert.ok(statSync(JSON_URL).size < 300 * 1024, "JSON under 300 KB");
});

test("toFfData converts percent to decimals", () => {
  close(data.factors.mkt[0], raw.factors.mkt[0] / 100, 1e-15);
  close(data.p25.returns[7][11], raw.p25.returns[7][11] / 100, 1e-15);
  assert.throws(() => math.toFfData({ ...raw, factors: { ...raw.factors, smb: raw.factors.smb.slice(1) } }));
});

test("real-data sanity: market premium and a big-growth portfolio", () => {
  const m = avg(data.factors.mkt);
  assert.ok(m > 0.003 && m < 0.009, `mean Mkt-RF ${m}`);
  const s5b1 = data.p25.labels.indexOf("S5B1");
  assert.ok(s5b1 >= 0);
  const excess = data.p25.returns[s5b1].map((r, t) => r - data.factors.rf[t]);
  const fit = math.factorFit(excess, data, "ff3", full);
  assert.ok(Math.abs(fit.alpha) < 0.003, `FF3 alpha of S5B1 ${fit.alpha}`);
  assert.ok(fit.betas[0].b > 0.9 && fit.betas[0].b < 1.1);
  assert.ok(fit.betas[2].b < 0, "growth portfolio loads negatively on HML");
});

test("a synthetic fund's fit recovers its hidden loadings within 3 s.e.", () => {
  for (const spec of math.FUND_SPECS) {
    const excess = math.syntheticFund(spec, data, 7);
    // FF5 has no momentum factor, so the momentum fund needs the model that spans its truth
    const model = spec.loadings.mom ? "carhart" : "ff5";
    const fit = math.factorFit(excess, data, model, full);
    for (const { id, b, se } of fit.betas) {
      const truth = spec.loadings[id] ?? 0;
      assert.ok(Math.abs(b - truth) <= 3 * se, `${spec.id} ${id}: ${b} vs ${truth} (se ${se})`);
    }
    const alphaSe = fit.alpha / fit.alphaT;
    assert.ok(Math.abs(fit.alphaAnnual - spec.alpha) <= 3 * 12 * Math.abs(alphaSe), `${spec.id} alpha ${fit.alphaAnnual}`);
  }
});

test("synthetic funds are deterministic per seed and differ across seeds", () => {
  const spec = math.FUND_SPECS[0];
  assert.deepEqual(math.syntheticFund(spec, data, 3), math.syntheticFund(spec, data, 3));
  assert.notDeepEqual(math.syntheticFund(spec, data, 3), math.syntheticFund(spec, data, 4));
});

test("returnAttribution steps sum to the total", () => {
  const w = { from: 120, to: 480 };
  const excess = math.syntheticFund(math.FUND_SPECS[4], data, 2);
  const fit = math.factorFit(excess, data, "ff3", w);
  const steps = math.returnAttribution(fit, data, w);
  const deltas = steps.filter((s) => s.kind === "delta").reduce((s, x) => s + x.value, 0);
  const total = steps.find((s) => s.kind === "total").value;
  close(deltas, total, 1e-12);
  close(total, avg(math.slice(excess, w)) * 12, 1e-12);
});

test("premia and cumulative", () => {
  const p = math.premia(data, full);
  close(p.mkt.mean, avg(data.factors.mkt) * 12, 1e-12);
  assert.ok(p.mkt.vol > 0.1 && p.mkt.vol < 0.25);
  const cum = math.cumulative([0.1, -0.1]);
  close(cum[0], 1.1, 1e-12);
  close(cum[1], 0.99, 1e-12);
});

test("model factor sets nest", () => {
  assert.deepEqual(math.MODEL_FACTORS.capm, ["mkt"]);
  assert.deepEqual(math.MODEL_FACTORS.ff5, ["mkt", "smb", "hml", "rmw", "cma"]);
  assert.deepEqual(math.MODEL_FACTORS.carhart.slice(-1), ["mom"]);
});
