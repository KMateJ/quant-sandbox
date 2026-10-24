import { normCdf } from "../../lib/stats/distributions";
import { KEY_RATES, zeroAt, priceOnCurve, curveDuration, keyWeight, keyRateDurations, bulletCashflows, barbellCashflows } from "../../lib/finance/curveRisk";
import type { CashFlow, ZeroPoint } from "../../lib/finance/curveRisk";
import { cholesky } from "../../lib/math/matrix";
import { makeRng, nextNormal } from "../../lib/math/random";
import { factorContribution, scenarioDelta } from "../yield-curve/yieldCurve.math";
import type { FactorScenario } from "../yield-curve/yieldCurve.types";

// #region Options on other underlyings

function d1d2(S: number, K: number, r: number, q: number, sigma: number, T: number) {
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  return { d1, d2: d1 - sigma * Math.sqrt(T) };
}

/// Black–Scholes–Merton price with a continuous yield q (dividend yield, foreign rate, or r for a futures contract).
export function bsmPrice(S: number, K: number, r: number, q: number, sigma: number, T: number, type: "call" | "put"): number {
  if (T <= 0) return Math.max(type === "call" ? S - K : K - S, 0);
  const { d1, d2 } = d1d2(S, K, r, q, sigma, T);
  const dq = Math.exp(-q * T);
  const dr = Math.exp(-r * T);
  return type === "call" ? S * dq * normCdf(d1) - K * dr * normCdf(d2) : K * dr * normCdf(-d2) - S * dq * normCdf(-d1);
}

/// Forward price S e^{(r−q)T}; with it, call = e^{−rT}[F N(d1) − K N(d2)] (the Black-76 form).
export function forwardPrice(S: number, r: number, q: number, T: number): number {
  return S * Math.exp((r - q) * T);
}

/// The d1 and d2 of the generalised formula.
export const bsmD = d1d2;

/// Call and put against spot with the yield q and with q = 0, for the figure.
export function dividendYieldSeries(K: number, r: number, q: number, sigma: number, T: number, S: number[]) {
  return S.map((s) => ({
    S: s,
    callQ: bsmPrice(s, K, r, q, sigma, T, "call"),
    call0: bsmPrice(s, K, r, 0, sigma, T, "call"),
    putQ: bsmPrice(s, K, r, q, sigma, T, "put"),
    put0: bsmPrice(s, K, r, 0, sigma, T, "put"),
  }));
}
// #endregion

// #region Law of large numbers and CLT

/// Replications and seed behind the CLT figure, fixed so the readouts quoted in the lesson stay true.
export const CLT_SAMPLES = 4000;
export const CLT_SEED = 1;

export type SourceDist = "uniform" | "exponential" | "bernoulli";

/// Mean, standard deviation and inverse-CDF draw of each source law (Bernoulli with p = 0.1 is strongly skewed).
export const SOURCES: Record<SourceDist, { mean: number; sd: number; draw: (u: number) => number }> = {
  uniform: { mean: 0.5, sd: Math.sqrt(1 / 12), draw: (u) => u },
  exponential: { mean: 1, sd: 1, draw: (u) => -Math.log(1 - u) },
  bernoulli: { mean: 0.1, sd: 0.3, draw: (u) => (u < 0.1 ? 1 : 0) },
};

/// Standard error σ/√n of the mean of n draws from the source.
export function sourceStandardError(dist: SourceDist, n: number): number {
  return SOURCES[dist].sd / Math.sqrt(n);
}

/// n-sample means of a source distribution, standardised, `m` seeded replications; plus mean and sd of the means.
export function standardisedMeans(dist: SourceDist, n: number, m: number, seed: number): { z: number[]; mean: number; sd: number } {
  const { mean: mu, sd, draw } = SOURCES[dist];
  const rng = makeRng(seed);
  const z = Array.from({ length: m }, () => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += draw(rng());
    return ((sum / n - mu) * Math.sqrt(n)) / sd;
  });
  const mean = z.reduce((a, b) => a + b, 0) / m;
  const variance = z.reduce((a, b) => a + (b - mean) * (b - mean), 0) / m;
  return { z, mean, sd: Math.sqrt(variance) };
}

/// Running sample mean along one seeded path of `n` draws, for the LLN panel.
export function runningMean(dist: SourceDist, n: number, seed: number): number[] {
  const { draw } = SOURCES[dist];
  const rng = makeRng(seed);
  let sum = 0;
  return Array.from({ length: n }, (_, i) => {
    sum += draw(rng());
    return sum / (i + 1);
  });
}

/// Maximum gap between the empirical CDF of `z` and the standard normal CDF (Kolmogorov distance).
export function normalDistance(z: number[]): number {
  const sorted = [...z].sort((a, b) => a - b);
  const m = sorted.length;
  return sorted.reduce((d, x, i) => {
    const F = normCdf(x);
    return Math.max(d, Math.abs((i + 1) / m - F), Math.abs(i / m - F));
  }, 0);
}
// #endregion

// #region Correlated Brownian motions

/// Two correlated Brownian paths on a grid: W1 and W2 = ρ W1 + sqrt(1 − ρ²) W⊥, seeded.
export function correlatedPaths(rho: number, steps: number, T: number, seed: number): { t: number; w1: number; w2: number }[] {
  const rng = makeRng(seed);
  const dt = T / steps;
  const root = Math.sqrt(dt);
  const orth = Math.sqrt(Math.max(0, 1 - rho * rho));
  let w1 = 0;
  let w2 = 0;
  const out = [{ t: 0, w1, w2 }];
  for (let i = 1; i <= steps; i++) {
    const z1 = nextNormal(rng);
    const z2 = nextNormal(rng);
    w1 += root * z1;
    w2 += root * (rho * z1 + orth * z2);
    out.push({ t: i * dt, w1, w2 });
  }
  return out;
}

export { cholesky };

/// Sample correlation of the increments of two paths.
export function incrementCorrelation(paths: { w1: number; w2: number }[]): number {
  const d1 = paths.slice(1).map((p, i) => p.w1 - paths[i].w1);
  const d2 = paths.slice(1).map((p, i) => p.w2 - paths[i].w2);
  const n = d1.length;
  const m1 = d1.reduce((a, b) => a + b, 0) / n;
  const m2 = d2.reduce((a, b) => a + b, 0) / n;
  let c = 0;
  let v1 = 0;
  let v2 = 0;
  for (let i = 0; i < n; i++) {
    c += (d1[i] - m1) * (d2[i] - m2);
    v1 += (d1[i] - m1) ** 2;
    v2 += (d2[i] - m2) ** 2;
  }
  return c / Math.sqrt(v1 * v2);
}
// #endregion

// #region Curve risk and key-rate durations

export type CurveShock = FactorScenario;
export type { CashFlow, ZeroPoint };
export { KEY_RATES, zeroAt, priceOnCurve, curveDuration, keyWeight, keyRateDurations, bulletCashflows, barbellCashflows };

/// Upward-sloping annually compounded zero curve used by the lesson and its figure.
export const CURVE_ZEROS: ZeroPoint[] = [
  { t: 1, z: 0.03 }, { t: 2, z: 0.034 }, { t: 5, z: 0.039 }, { t: 10, z: 0.043 }, { t: 30, z: 0.046 },
];

/// Zero curve after a shock of `bp` basis points, with the yield-curve lab's shapes (signed `bp`).
export function shockCurve(zeros: ZeroPoint[], shock: CurveShock, bp: number): ZeroPoint[] {
  const delta = scenarioDelta(shock, bp);
  return zeros.map((k) => ({ t: k.t, z: k.z + factorContribution(k.t, delta) }));
}

/// Relative price change of `cashflows` when the curve is shocked by `bp` basis points.
export function shockReturn(cashflows: CashFlow[], zeros: ZeroPoint[], shock: CurveShock, bp: number): number {
  return priceOnCurve(cashflows, shockCurve(zeros, shock, bp)) / priceOnCurve(cashflows, zeros) - 1;
}
// #endregion

// #region Real rates and inflation

/// Exact Fisher relation (1+i) = (1+r)(1+π) and its linear approximation i ≈ r + π.
export function fisher(real: number, inflation: number): { nominalExact: number; nominalApprox: number } {
  return { nominalExact: (1 + real) * (1 + inflation) - 1, nominalApprox: real + inflation };
}

/// Breakeven inflation from nominal and real yields: exact (1+i)/(1+r) − 1 and the approximation i − r.
export function breakeven(nominal: number, real: number): { exact: number; approx: number } {
  return { exact: (1 + nominal) / (1 + real) - 1, approx: nominal - real };
}

/// Price of an inflation-linked bond per 100 of indexed principal: real coupon and principal discounted at the real rate.
export function linkerPrice(realCoupon: number, years: number, realRate: number): number {
  let pv = 0;
  for (let t = 1; t <= years; t++) pv += (100 * realCoupon) / Math.pow(1 + realRate, t);
  return pv + 100 / Math.pow(1 + realRate, years);
}

/// The same bond priced the other way: nominal cash flows indexed by (1+π)^t, discounted at the Fisher nominal rate.
export function linkerNominalPrice(realCoupon: number, years: number, realRate: number, inflation: number): number {
  const nominal = fisher(realRate, inflation).nominalExact;
  const index = (t: number) => Math.pow(1 + inflation, t);
  let pv = 0;
  for (let t = 1; t <= years; t++) pv += (100 * realCoupon * index(t)) / Math.pow(1 + nominal, t);
  return pv + (100 * index(years)) / Math.pow(1 + nominal, years);
}

/// Value in today's money of a fixed-coupon nominal bond priced at par for `expectedInflation`, when inflation actually
/// runs at `realised`: its nominal flows are deflated at the realised rate and discounted at the real rate.
export function nominalBondRealValue(realRate: number, expectedInflation: number, years: number, realised: number): number {
  const coupon = fisher(realRate, expectedInflation).nominalExact;
  let pv = 0;
  for (let t = 1; t <= years; t++) pv += (100 * coupon) / Math.pow((1 + realised) * (1 + realRate), t);
  return pv + 100 / Math.pow((1 + realised) * (1 + realRate), years);
}
// #endregion

// #region Portfolio constraints

export type FrontierPoint = { sigma: number; mu: number; w: number[] };

/// Three-asset defaults for the constraints figure.
export const CONSTRAINT_ASSETS = {
  mu: [0.05, 0.06, 0.1],
  sigma: [0.1, 0.18, 0.24],
  rho: [[1, 0.3, 0.3], [0.3, 1, 0.85], [0.3, 0.85, 1]],
};

const covariance = (sigma: number[], rho: number[][]) => sigma.map((si, i) => sigma.map((sj, j) => si * sj * rho[i][j]));
const portfolio = (w: number[], mu: number[], cov: number[][]) => ({
  mu: w.reduce((s, wi, i) => s + wi * mu[i], 0),
  sigma: Math.sqrt(w.reduce((s, wi, i) => s + wi * w.reduce((t, wj, j) => t + wj * cov[i][j], 0), 0)),
});

function inverse3(m: number[][]): number[][] {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  return [
    [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
    [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
    [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det],
  ];
}

/// Minimum-variance frontier of three assets with short sales (closed form) or without (grid over the simplex, step 0.01).
/// The no-short-sales frontier is the upper-left envelope of the grid, one point per return bin.
export function threeAssetFrontier(mu: number[], sigma: number[], rho: number[][], allowShort: boolean): FrontierPoint[] {
  const cov = covariance(sigma, rho);
  if (allowShort) {
    const inv = inverse3(cov);
    const mul = (v: number[]) => inv.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
    const iOnes = mul([1, 1, 1]);
    const iMu = mul(mu);
    const A = iOnes.reduce((s, x) => s + x, 0);
    const B = iMu.reduce((s, x) => s + x, 0);
    const C = iMu.reduce((s, x, i) => s + x * mu[i], 0);
    const D = A * C - B * B;
    const out: FrontierPoint[] = [];
    for (let m = 0.04; m <= 0.2001; m += 0.0025) {
      const w = iOnes.map((x, i) => ((C - B * m) / D) * x + ((A * m - B) / D) * iMu[i]);
      out.push({ ...portfolio(w, mu, cov), mu: m, w });
    }
    return out;
  }
  const lo = Math.min(...mu);
  const hi = Math.max(...mu);
  const bins = 60;
  const best: (FrontierPoint | undefined)[] = new Array(bins + 1).fill(undefined);
  for (let i = 0; i <= 100; i++) {
    for (let j = 0; j <= 100 - i; j++) {
      const w = [i / 100, j / 100, (100 - i - j) / 100];
      const p = portfolio(w, mu, cov);
      const k = Math.round(((p.mu - lo) / (hi - lo)) * bins);
      if (!best[k] || p.sigma < best[k]!.sigma) best[k] = { ...p, w };
    }
  }
  // Keep the efficient part: from the minimum-variance point upwards.
  const pts = best.filter((p): p is FrontierPoint => Boolean(p));
  const start = pts.reduce((a, p, i) => (p.sigma < pts[a].sigma ? i : a), 0);
  return pts.slice(start);
}

/// Maximum Sharpe ratio on a frontier, with its weights.
export function tangency(frontier: FrontierPoint[], rf: number): { sharpe: number; w: number[]; sigma: number; mu: number } {
  let best = { sharpe: -Infinity, w: [] as number[], sigma: 0, mu: 0 };
  for (const p of frontier) {
    const sharpe = (p.mu - rf) / p.sigma;
    if (sharpe > best.sharpe) best = { sharpe, w: p.w, sigma: p.sigma, mu: p.mu };
  }
  return best;
}
// #endregion

// #region Input estimation

/// Standard error of a mean from n observations of volatility sigma (sigma/√n), and of a volatility estimate (sigma/√(2n)).
export function momentStandardErrors(sigma: number, n: number): { mean: number; vol: number } {
  return { mean: sigma / Math.sqrt(n), vol: sigma / Math.sqrt(2 * n) };
}

/// Annualised sample means, volatilities and correlation from n seeded monthly draws of two assets with true annual parameters.
export function sampleMoments(seed: number, n: number, mu: number[], sigma: number[], rho: number): { mu: number[]; sigma: number[]; rho: number } {
  const rng = makeRng(seed);
  const xs: number[][] = [[], []];
  for (let t = 0; t < n; t++) {
    const z1 = nextNormal(rng);
    const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * nextNormal(rng);
    xs[0].push(mu[0] / 12 + (sigma[0] / Math.sqrt(12)) * z1);
    xs[1].push(mu[1] / 12 + (sigma[1] / Math.sqrt(12)) * z2);
  }
  const mean = xs.map((x) => x.reduce((s, v) => s + v, 0) / n);
  const sd = xs.map((x, i) => Math.sqrt(x.reduce((s, v) => s + (v - mean[i]) ** 2, 0) / (n - 1)));
  const corr = xs[0].reduce((s, v, t) => s + (v - mean[0]) * (xs[1][t] - mean[1]), 0) / ((n - 1) * sd[0] * sd[1]);
  return { mu: mean.map((m) => m * 12), sigma: sd.map((s) => s * Math.sqrt(12)), rho: corr };
}

/// Shrunk mean: (1 − k) · sample + k · grand mean.
export function shrinkMeans(sample: number[], k: number): number[] {
  const grand = sample.reduce((s, v) => s + v, 0) / sample.length;
  return sample.map((m) => (1 - k) * m + k * grand);
}

/// Weight of asset 1 in the two-asset tangency portfolio for the given moments and risk-free rate.
export function tangencyWeight(mu: number[], sigma: number[], rho: number, rf: number): number {
  const e1 = mu[0] - rf;
  const e2 = mu[1] - rf;
  const cov = rho * sigma[0] * sigma[1];
  const num = e1 * sigma[1] ** 2 - e2 * cov;
  const den = e1 * sigma[1] ** 2 + e2 * sigma[0] ** 2 - (e1 + e2) * cov;
  return num / den;
}

/// Sharpe ratio of a two-asset portfolio with weight w1 in asset 1, under the given (true) moments.
export function twoAssetSharpe(w1: number, mu: number[], sigma: number[], rho: number, rf: number): number {
  const m = w1 * mu[0] + (1 - w1) * mu[1];
  const v = (w1 * sigma[0]) ** 2 + ((1 - w1) * sigma[1]) ** 2 + 2 * w1 * (1 - w1) * rho * sigma[0] * sigma[1];
  return (m - rf) / Math.sqrt(v);
}

/// True parameters of the estimation figure.
export const ESTIMATION_TRUTH = { mu: [0.04, 0.1], sigma: [0.1, 0.2], rho: 0, rf: 0.02 };

/// Tangency weight and Sharpe shortfall (under the true moments) for each of `samples` seeded samples of n months,
/// with the sample means shrunk by k.
export function resampledTangencies(n: number, k: number, samples = 20, seed = 11, t = ESTIMATION_TRUTH): { w: number[]; lost: number[]; trueW: number } {
  const trueW = tangencyWeight(t.mu, t.sigma, t.rho, t.rf);
  const best = twoAssetSharpe(trueW, t.mu, t.sigma, t.rho, t.rf);
  const w: number[] = [];
  const lost: number[] = [];
  for (let s = 0; s < samples; s++) {
    const est = sampleMoments(seed + s, n, t.mu, t.sigma, t.rho);
    const wi = tangencyWeight(shrinkMeans(est.mu, k), est.sigma, est.rho, t.rf);
    w.push(wi);
    lost.push(best - twoAssetSharpe(wi, t.mu, t.sigma, t.rho, t.rf));
  }
  return { w, lost, trueW };
}

/// First and third quartile of a sample (linear interpolation), a spread measure that a few wild weights do not dominate.
export function quartiles(values: number[]): { q1: number; q3: number } {
  const v = [...values].sort((a, b) => a - b);
  const at = (p: number) => {
    const x = p * (v.length - 1);
    const lo = Math.floor(x);
    return v[lo] + (v[Math.min(lo + 1, v.length - 1)] - v[lo]) * (x - lo);
  };
  return { q1: at(0.25), q3: at(0.75) };
}
// #endregion

// #region Input estimation: frontiers for the figure

/// Two-asset frontier points (weight in asset 1 from −0.2 to 1.2) for the given moments.
export function twoAssetFrontier(mu: number[], sigma: number[], rho: number): { sigma: number; mu: number }[] {
  const out: { sigma: number; mu: number }[] = [];
  for (let w = -0.2; w <= 1.2001; w += 0.02) {
    const v = (w * sigma[0]) ** 2 + ((1 - w) * sigma[1]) ** 2 + 2 * w * (1 - w) * rho * sigma[0] * sigma[1];
    out.push({ sigma: Math.sqrt(v), mu: w * mu[0] + (1 - w) * mu[1] });
  }
  return out;
}

/// Frontiers implied by `samples` seeded samples of n months (means shrunk by k), same seeds as `resampledTangencies`.
export function resampledFrontiers(n: number, k: number, samples = 20, seed = 11): { sigma: number; mu: number }[][] {
  const t = ESTIMATION_TRUTH;
  return Array.from({ length: samples }, (_, s) => {
    const est = sampleMoments(seed + s, n, t.mu, t.sigma, t.rho);
    return twoAssetFrontier(shrinkMeans(est.mu, k), est.sigma, est.rho);
  });
}
// #endregion
