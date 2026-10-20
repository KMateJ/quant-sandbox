import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

// Plans 08–12 of docs/plans/guides-audit append their own test() blocks here.
test("wave 4 placeholder", () => {});

// #region Options on other underlyings
const wave4 = await importSrc("features/guide/guide.wave4.math.ts");
const bs = await importSrc("features/black-scholes/blackScholes.math.ts");

test("bsmPrice reduces to Black–Scholes for q = 0 and keeps put–call parity with a yield", () => {
  const call = wave4.bsmPrice(100, 100, 0.05, 0, 0.2, 1, "call");
  assert.ok(Math.abs(call - bs.blackScholesCall(100, 100, 1, 0.05, 0.2)) < 1e-4);
  assert.ok(Math.abs(call - 10.4506) < 1e-4);
  const [C, P] = ["call", "put"].map((type) => wave4.bsmPrice(100, 95, 0.05, 0.03, 0.25, 0.5, type));
  assert.ok(Math.abs(C - P - (100 * Math.exp(-0.03 * 0.5) - 95 * Math.exp(-0.05 * 0.5))) < 1e-6);
});

test("Black-76: the yield q = r prices an option on a futures price", () => {
  const F = 80, K = 85, r = 0.04, sigma = 0.3, T = 0.75;
  const { d1, d2 } = wave4.bsmD(F, K, r, r, sigma, T);
  const cdf = (x) => (1 + erf(x / Math.SQRT2)) / 2;
  const black76 = Math.exp(-r * T) * (F * cdf(d1) - K * cdf(d2));
  assert.ok(Math.abs(wave4.bsmPrice(F, K, r, r, sigma, T, "call") - black76) < 1e-6);
  assert.ok(Math.abs(wave4.forwardPrice(100, 0.05, 0.03, 1) - 100 * Math.exp(0.02)) < 1e-12);
});

/// Abramowitz–Stegun 7.1.26, good to ~1.5e-7; enough for the Black-76 identity above.
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
// #endregion

// #region Law of large numbers and CLT, correlated Brownian motions
const stoch = await importSrc("features/guide/guide.wave4.math.ts");

test("standardised means have mean ≈ 0 and sd ≈ 1 (n = 30, m = 20 000)", () => {
  for (const dist of ["uniform", "exponential", "bernoulli"]) {
    const { mean, sd } = stoch.standardisedMeans(dist, 30, 20000, 11);
    assert.ok(Math.abs(mean) < 0.03, `${dist} mean ${mean}`);
    assert.ok(Math.abs(sd - 1) < 0.03, `${dist} sd ${sd}`);
  }
});

test("the Kolmogorov distance to the normal shrinks from n = 1 to n = 30 for the exponential source", () => {
  const d1 = stoch.normalDistance(stoch.standardisedMeans("exponential", 1, 20000, 5).z);
  const d30 = stoch.normalDistance(stoch.standardisedMeans("exponential", 30, 20000, 5).z);
  assert.ok(d30 < d1 / 3, `${d1} -> ${d30}`);
});

test("the running mean ends within 3σ/√n of the true mean", () => {
  for (const dist of ["uniform", "exponential", "bernoulli"]) {
    const n = 5000;
    const path = stoch.runningMean(dist, n, 3);
    assert.equal(path.length, n);
    assert.ok(Math.abs(path[n - 1] - stoch.SOURCES[dist].mean) < 3 * stoch.sourceStandardError(dist, n), dist);
  }
});

test("cholesky of a 2×2 correlation is [[1,0],[ρ,√(1−ρ²)]], reproduces a 3×3, and rejects non-positive-definite input", () => {
  const rho = -0.7;
  const L = stoch.cholesky([[1, rho], [rho, 1]]);
  assert.ok(Math.abs(L[1][0] - rho) < 1e-12 && Math.abs(L[1][1] - Math.sqrt(1 - rho * rho)) < 1e-12 && L[0][1] === 0);
  const C = [[1, 0.3, -0.2], [0.3, 1, 0.5], [-0.2, 0.5, 1]];
  const L3 = stoch.cholesky(C);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const v = L3[i].reduce((a, _, k) => a + L3[i][k] * L3[j][k], 0);
    assert.ok(Math.abs(v - C[i][j]) < 1e-12);
  }
  assert.equal(stoch.cholesky([[1, 1.2], [1.2, 1]]), null);
  assert.equal(stoch.cholesky([[1, 1], [1, 1]]), null);
});

test("increments of the correlated paths have sample correlation ≈ ρ", () => {
  for (const rho of [-0.7, 0.4]) {
    const r = stoch.incrementCorrelation(stoch.correlatedPaths(rho, 20000, 1, 9));
    assert.ok(Math.abs(r - rho) < 0.02, `${rho}: ${r}`);
  }
});
// #endregion

// #region Curve risk and real rates
const ZEROS = wave4.CURVE_ZEROS;
const bullet = wave4.bulletCashflows(0.04, 5);
const barbell = wave4.barbellCashflows(bullet, ZEROS, 2, 30);
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("key-rate durations add up to the parallel duration, which the barbell matches", () => {
  const krd = wave4.keyRateDurations(bullet, ZEROS, wave4.KEY_RATES);
  const sum = krd.reduce((a, c) => a + c, 0);
  close(sum, wave4.curveDuration(bullet, ZEROS), 1e-6, "bullet KRD sum");
  close(wave4.keyRateDurations(barbell, ZEROS, wave4.KEY_RATES).reduce((a, c) => a + c, 0), sum, 1e-4, "barbell KRD sum");
  close(wave4.priceOnCurve(barbell, ZEROS), wave4.priceOnCurve(bullet, ZEROS), 1e-9, "same price");
  close(krd[1], 4.2328, 1e-3, "5y key-rate duration");
});

test("a parallel shock moves bullet and barbell alike; slope and curvature shocks separate them", () => {
  const r = (c, shock) => wave4.shockReturn(c, ZEROS, shock, 50);
  assert.ok(r(bullet, "parallel") < 0 && Math.abs(r(bullet, "parallel") - r(barbell, "parallel")) < 0.001);
  assert.ok(r(bullet, "steepen") > r(barbell, "steepen") && r(bullet, "steepen") > 0);
  assert.ok(r(bullet, "flatten") < r(barbell, "flatten") && r(bullet, "flatten") < 0);
  assert.ok(r(bullet, "curvature") < r(barbell, "curvature"));
  close(r(bullet, "steepen") * 100, 0.74, 0.005, "lesson steepener return");
});

test("Fisher, linker pricing and breakeven are consistent", () => {
  close(wave4.fisher(0.02, 0.03).nominalExact, 0.0506, 1e-12, "exact Fisher");
  close(wave4.fisher(0.02, 0.03).nominalExact - wave4.fisher(0.02, 0.03).nominalApprox, 0.02 * 0.03, 1e-12, "cross term");
  for (const pi of [0, 0.03, 0.08]) close(wave4.linkerPrice(0.02, 10, 0.01), wave4.linkerNominalPrice(0.02, 10, 0.01, pi), 1e-9, "linker price independent of inflation");
  close(wave4.linkerPrice(0.02, 10, 0.01), 109.4713, 1e-4, "lesson linker price");
  const i = wave4.fisher(0.01, 0.03).nominalExact;
  close(wave4.breakeven(i, 0.01).exact, 0.03, 1e-12, "breakeven recovers inflation");
  close(wave4.breakeven(0.045, 0.015).exact * 100, 2.96, 0.005, "lesson breakeven");
  close(wave4.nominalBondRealValue(0.01, 0.03, 10, 0.03), 100, 1e-9, "nominal par bond at expected inflation");
  close(wave4.nominalBondRealValue(0.01, 0.03, 10, 0.05), 85.17, 0.005, "figure default readout");
});
// #endregion

// #region Portfolio constraints and input estimation
const A = wave4.CONSTRAINT_ASSETS;

test("the no-short-sales frontier never lies above the free one; the ban costs Sharpe ratio", () => {
  const free = wave4.threeAssetFrontier(A.mu, A.sigma, A.rho, true);
  const banned = wave4.threeAssetFrontier(A.mu, A.sigma, A.rho, false);
  const sorted = [...free].sort((a, b) => a.mu - b.mu);
  const sigmaAt = (mu) => {
    const i = sorted.findIndex((p) => p.mu >= mu);
    if (i <= 0) return undefined;
    const [a, b] = [sorted[i - 1], sorted[i]];
    return a.sigma + ((b.sigma - a.sigma) * (mu - a.mu)) / (b.mu - a.mu);
  };
  for (const p of banned) {
    const u = sigmaAt(p.mu);
    if (u !== undefined) assert.ok(p.sigma >= u - 5e-4, `constrained sigma ${p.sigma} below free ${u} at mu ${p.mu}`);
    assert.ok(Math.abs(p.w.reduce((s, x) => s + x, 0) - 1) < 1e-9);
    assert.ok(p.w.every((x) => x >= 0));
  }
  const tf = wave4.tangency(free, 0.02);
  const tb = wave4.tangency(banned, 0.02);
  assert.ok(tf.sharpe >= tb.sharpe);
  assert.ok(Math.abs(tf.sharpe - 0.4164) < 2e-3 && Math.abs(tb.sharpe - 0.3938) < 2e-3);
  assert.ok(Math.min(...tf.w) < -0.4, "the free tangency shorts an asset");
});

test("standard errors, sample moments and shrinkage", () => {
  assert.ok(Math.abs(wave4.momentStandardErrors(0.2, 100).mean - 0.02) < 1e-12);
  assert.ok(Math.abs(wave4.momentStandardErrors(0.2, 20).mean - 0.2 / Math.sqrt(20)) < 1e-12);
  const big = wave4.sampleMoments(5, 100000, [0.06, 0.09], [0.15, 0.22], 0.3);
  assert.ok(Math.abs(big.sigma[0] / 0.15 - 1) < 0.01 && Math.abs(big.sigma[1] / 0.22 - 1) < 0.01);
  assert.ok(Math.abs(big.rho - 0.3) < 0.01);
  const grand = wave4.shrinkMeans([0.04, 0.1], 1);
  assert.ok(Math.abs(grand[0] - 0.07) < 1e-12 && Math.abs(grand[1] - 0.07) < 1e-12);
  assert.deepEqual(wave4.shrinkMeans([0.04, 0.1], 0).map((x) => +x.toFixed(10)), [0.04, 0.1]);
});

test("resampled tangencies are seeded, and more data means less Sharpe lost", () => {
  const a = wave4.resampledTangencies(60, 0);
  assert.deepEqual(a.w, wave4.resampledTangencies(60, 0).w);
  const avg = (r) => r.lost.reduce((s, x) => s + x, 0) / r.lost.length;
  assert.ok(avg(wave4.resampledTangencies(600, 0)) < avg(a));
  assert.ok(avg(wave4.resampledTangencies(60, 0.5)) < avg(a));
  assert.ok(Math.abs(a.trueW - 0.5) < 1e-9);
});
// #endregion

// #region Capital budgeting under uncertainty; dividend policy
const corp = await importSrc("features/guide/guide.wave4.corporate.math.ts");

test("projectNpv matches the annuity-factor hand calculation and break-even zeroes it", () => {
  const p = corp.PROJECT_DEFAULTS;
  const af = (1 - 1.08 ** -5) / 0.08;
  assert.ok(Math.abs(corp.projectNpv(p) - (500 * af - 1000)) < 1e-9);
  assert.ok(Math.abs(corp.projectNpv(p) - 996.36) < 0.005);
  for (const key of ["units", "price", "unitCost"]) {
    assert.ok(Math.abs(corp.projectNpv({ ...p, [key]: corp.breakEven(p, key) })) < 1e-6, key);
  }
  assert.ok(Math.abs(corp.breakEven(p, "units") - 64.35) < 0.005);
  const s = corp.sensitivity(p, "units", 0.1);
  assert.ok(Math.abs(s.low - 716.87) < 0.005 && Math.abs(s.high - 1275.84) < 0.005);
});

test("npvSimulation with zero sds is deterministic; defaults match the lesson", () => {
  const p = corp.PROJECT_DEFAULTS;
  const flat = corp.npvSimulation(p, { units: 0, price: 0 }, 200, 3);
  assert.ok(Math.abs(flat.mean - corp.projectNpv(p)) < 1e-9);
  assert.ok(flat.probLoss === 0 || flat.probLoss === 1);
  const sim = corp.npvSimulation(p, corp.PROJECT_SD, corp.PROJECT_SIMS, corp.PROJECT_SEED);
  assert.ok(Math.abs(sim.mean - 993.77) < 0.005);
  assert.ok(Math.abs(sim.probLoss - 0.1096) < 1e-9);
  assert.ok(Math.abs(sim.p5 + 271.85) < 0.005);
});

test("Gordon price: payout irrelevant iff ROE = k; retention helps iff ROE > k; PVGO", () => {
  for (const d of [0.1, 0.4, 0.8, 1]) {
    const { price } = corp.gordonPrice(5, d, 0.1, 0.1);
    assert.ok(Math.abs(price - 50) < 1e-9);
    assert.ok(Math.abs(corp.pvgo(price, 5, 0.1)) < 1e-9);
  }
  const prices = (roe) => corp.payoutSeries(5, roe, 0.1).filter((r) => r.payout >= 0.4).map((r) => r.price);
  const falls = (xs) => xs.every((v, i) => i === 0 || v < xs[i - 1]);
  assert.ok(falls(prices(0.12)), "ROE > k: price falls as payout rises");
  assert.ok(falls(prices(0.08).reverse()), "ROE < k: price rises with payout");
  const g = corp.gordonPrice(5, 0.4, 0.12, 0.1);
  assert.ok(Math.abs(g.g - 0.072) < 1e-12 && g.d1 === 2 && Math.abs(g.price - 71.4286) < 1e-4);
  assert.ok(Math.abs(corp.pvgo(g.price, 5, 0.1) - 21.4286) < 1e-4);
  assert.ok(Number.isNaN(corp.gordonPrice(5, 0.1, 0.2, 0.1).price));
});
// #endregion
