import { dot, inverse, matVec, symmetricEig } from "../../lib/math/matrix";
import { makeRng } from "../../lib/math/random";
import {
  minVarianceWeights,
  portfolioReturn,
  portfolioSharpe,
  portfolioVolatility,
  tangencyWeights,
} from "../../lib/finance/portfolio";
import type { Asset, CloudPoint, FrontierPoint, PortfolioMetrics } from "./portfolioLab.types";

/// Default multi-asset universe (expected annual return μ and volatility σ).
export const DEFAULT_ASSETS: Asset[] = [
  { id: "aapl", name: "AAPL", color: "#60a5fa", mu: 0.14, sigma: 0.26 },
  { id: "msft", name: "MSFT", color: "#f59e0b", mu: 0.12, sigma: 0.22 },
  { id: "amzn", name: "AMZN", color: "#a78bfa", mu: 0.16, sigma: 0.3 },
  { id: "googl", name: "GOOGL", color: "#34d399", mu: 0.11, sigma: 0.2 },
  { id: "tlt", name: "TLT", color: "#f472b6", mu: 0.04, sigma: 0.1 },
];

/// Palette for newly added assets, cycled by index.
export const ASSET_PALETTE = ["#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#f472b6", "#f87171", "#22d3ee", "#facc15"];

/// Default pairwise correlations for the starting 5-asset universe.
export const DEFAULT_CORR: number[][] = [
  [1, 0.68, 0.55, 0.61, -0.22],
  [0.68, 1, 0.63, 0.7, -0.18],
  [0.55, 0.63, 1, 0.58, -0.12],
  [0.61, 0.7, 0.58, 1, -0.2],
  [-0.22, -0.18, -0.12, -0.2, 1],
];

const clampCorr = (v: number) => Math.max(-0.999, Math.min(0.999, v));

/// N×N covariance matrix from per-asset volatilities and a correlation matrix: Σij = ρij σi σj.
export function covFromCorr(sigmas: number[], corr: number[][]): number[][] {
  return sigmas.map((si, i) =>
    sigmas.map((sj, j) => (i === j ? si * si : corr[i][j] * si * sj))
  );
}

/// N×N identity correlation matrix (all off-diagonal entries zero).
export function identityCorr(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

/// N×N correlation matrix with a single shared off-diagonal value.
export function uniformCorr(n: number, rho: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : rho))
  );
}

/// Correlation matrix sized to `n`, reusing DEFAULT_CORR where the indices overlap.
export function defaultCorr(n: number): number[][] {
  const out = identityCorr(n);
  const d = DEFAULT_CORR.length;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j && i < d && j < d) out[i][j] = DEFAULT_CORR[i][j];
  return out;
}

/// Copy of `corr` with entry (i,j) set to `v` and mirrored to (j,i); diagonal stays 1.
export function setCorrEntry(corr: number[][], i: number, j: number, v: number): number[][] {
  if (i === j) return corr;
  const c = clampCorr(v);
  const next = corr.map((row) => row.slice());
  next[i][j] = c;
  next[j][i] = c;
  return next;
}

/// Grow a correlation matrix by one asset: new row/column, diagonal 1, off-diagonal `fill`.
export function appendCorr(corr: number[][], fill = 0.2): number[][] {
  const n = corr.length;
  const next = corr.map((row) => [...row, fill]);
  next.push([...new Array<number>(n).fill(fill), 1]);
  return next;
}

/// Remove asset `idx` from a correlation matrix, preserving the remaining pairwise values.
export function removeCorr(corr: number[][], idx: number): number[][] {
  return corr.filter((_, i) => i !== idx).map((row) => row.filter((_, j) => j !== idx));
}

/// Smallest eigenvalue of a symmetric matrix (negative ⇒ not positive semidefinite).
export function minEigenvalue(m: number[][]): number {
  return Math.min(...symmetricEig(m).values);
}

/// A correlation matrix is valid when it is positive semidefinite (no negative eigenvalues).
export function isValidCorrelation(corr: number[][]): boolean {
  return minEigenvalue(corr) > -1e-8;
}

/// Project an invalid correlation matrix to a nearby valid one (eigenvalue clipping plus
/// unit-diagonal renormalisation), preserving the user's inputs as closely as practical.
export function nearestCorrelation(corr: number[][], iterations = 12): number[][] {
  const n = corr.length;
  const eps = 1e-8;
  let a = corr.map((row) => row.slice());
  for (let it = 0; it < iterations; it++) {
    const { values, vectors } = symmetricEig(a);
    const next = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    for (let k = 0; k < n; k++) {
      const lam = Math.max(values[k], eps);
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) next[i][j] += lam * vectors[i][k] * vectors[j][k];
    }
    const d = next.map((row, i) => Math.sqrt(row[i] > 0 ? row[i] : eps));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        next[i][j] = i === j ? 1 : clampCorr(next[i][j] / (d[i] * d[j]));
    a = next;
    if (isValidCorrelation(a)) break;
  }
  return a;
}

/// Rescale weights so they sum to 1 (falls back to equal weights if the sum is ~0).
export function normalize(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (Math.abs(sum) < 1e-9) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

/// Volatility and return of a weighted portfolio.
export function portfolioPoint(weights: number[], mus: number[], cov: number[][]): FrontierPoint {
  return { vol: portfolioVolatility(weights, cov), ret: portfolioReturn(weights, mus) };
}

/// Full metrics (return, volatility, Sharpe) for a weighted portfolio.
export function portfolioMetrics(
  weights: number[],
  mus: number[],
  cov: number[][],
  riskFree: number
): PortfolioMetrics {
  const p = portfolioPoint(weights, mus, cov);
  return {
    ret: p.ret,
    vol: p.vol,
    sharpe: p.vol > 0 ? portfolioSharpe(weights, mus, cov, riskFree) : 0,
  };
}

/// Combine a risky sub-portfolio with a risk-free (cash) allocation λ.
/// Return scales linearly; volatility shrinks with the risky share (cash is riskless).
export function withCash(
  risky: FrontierPoint,
  cashWeight: number,
  riskFree: number
): FrontierPoint {
  const riskyShare = 1 - cashWeight;
  return {
    ret: cashWeight * riskFree + riskyShare * risky.ret,
    vol: Math.max(0, riskyShare) * risky.vol,
  };
}

/// Capital market line: risk-free point blended with the tangency portfolio, to `maxVol`.
export function capitalMarketLine(
  tangency: FrontierPoint,
  riskFree: number,
  maxVol: number
): FrontierPoint[] {
  const slope = tangency.vol > 0 ? (tangency.ret - riskFree) / tangency.vol : 0;
  return [
    { vol: 0, ret: riskFree },
    { vol: maxVol, ret: riskFree + slope * maxVol },
  ];
}

/// Global minimum-variance portfolio weights (may be long/short).
export function gmvWeights(cov: number[][]): number[] {
  return minVarianceWeights(cov);
}

/// Tangency (max-Sharpe) portfolio weights for a given risk-free rate.
export function maxSharpeWeights(mus: number[], cov: number[][], riskFree: number): number[] {
  return tangencyWeights(cov, mus, riskFree);
}

// Closed-form efficient-frontier constants A, B, C from Σ⁻¹, μ and 1.
function frontierConstants(mus: number[], cov: number[][]) {
  const inv = inverse(cov);
  const ones = mus.map(() => 1);
  const invOnes = matVec(inv, ones);
  const invMu = matVec(inv, mus);
  const a = dot(ones, invOnes);
  const b = dot(ones, invMu);
  const c = dot(mus, invMu);
  return { a, b, c, d: a * c - b * b };
}

/// Variance of the long/short frontier portfolio achieving a target return.
export function frontierVariance(targetReturn: number, mus: number[], cov: number[][]): number {
  const { a, b, c, d } = frontierConstants(mus, cov);
  if (d === 0) return NaN;
  return (a * targetReturn * targetReturn - 2 * b * targetReturn + c) / d;
}

/// Efficient-frontier curve sweeping target returns around the asset range.
export function frontierCurve(mus: number[], cov: number[][], steps: number): FrontierPoint[] {
  const { a, b } = frontierConstants(mus, cov);
  const gmvRet = b / a;
  const hi = Math.max(...mus) * 1.15;
  const lo = Math.min(gmvRet, Math.min(...mus) * 0.6);
  const points: FrontierPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ret = lo + (i / steps) * (hi - lo);
    const v = frontierVariance(ret, mus, cov);
    if (v > 0) points.push({ vol: Math.sqrt(v), ret });
  }
  return points;
}

// Deterministic pseudo-random generator so the cloud is stable across renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/// Cloud of random long-only portfolios in risk/return space (for scatter context).
/// Uses a Dirichlet-style draw with a randomised concentration so samples span the
/// whole opportunity set — from near equal-weight to single-asset corners — instead
/// of clustering at the centroid.
export function randomPortfolios(
  mus: number[],
  cov: number[][],
  count: number,
  seed = 1
): CloudPoint[] {
  const rng = mulberry32(seed);
  const out: CloudPoint[] = [];
  for (let i = 0; i < count; i++) {
    const conc = 0.12 + Math.pow(rng(), 2) * 2.5;
    let sum = 0;
    const raw = mus.map(() => {
      const g = Math.pow(-Math.log(rng() + 1e-12), 1 / conc);
      sum += g;
      return g;
    });
    const weights = raw.map((w) => w / sum);
    out.push({ ...portfolioPoint(weights, mus, cov), weights });
  }
  return out;
}

/// Each asset's share of total portfolio variance (percent risk contributions, sum to 1).
export function riskContributions(weights: number[], cov: number[][]): number[] {
  const marginal = matVec(cov, weights);
  const variance = dot(weights, marginal);
  if (variance <= 0) return weights.map(() => 0);
  return weights.map((w, i) => (w * marginal[i]) / variance);
}

/// Diversification benefit: 1 − portfolio volatility ÷ weighted-average asset volatility.
export function diversificationBenefit(
  weights: number[],
  sigmas: number[],
  portfolioVol: number
): number {
  const weightedAvg = weights.reduce((acc, w, i) => acc + Math.abs(w) * sigmas[i], 0);
  if (weightedAvg <= 0) return 0;
  return 1 - portfolioVol / weightedAvg;
}

/// Interval of values ρij can take, with every other correlation held fixed, while the matrix stays positive
/// definite with smallest eigenvalue above `margin` (the PSD cone cut along one entry is an interval; the margin keeps
/// Σ safely invertible for the frontier). Bisection from the current value; a matrix already at or past the edge
/// gives the full range (the caller repairs after the edit).
export function feasibleCorrRange(corr: number[][], i: number, j: number, margin = 1e-3, iterations = 24): [number, number] {
  const limit = 0.999;
  const valid = (m: number[][]) => minEigenvalue(m) > margin;
  if (i === j || !valid(corr)) return [-limit, limit];
  const validAt = (v: number) => valid(setCorrEntry(corr, i, j, v));
  const edge = (to: number) => {
    if (validAt(to)) return to;
    let inside = corr[i][j];
    let outside = to;
    for (let k = 0; k < iterations; k++) {
      const mid = (inside + outside) / 2;
      if (validAt(mid)) inside = mid;
      else outside = mid;
    }
    return inside;
  };
  return [edge(-limit), edge(limit)];
}

/// Index of the point nearest to (px, py) in pixel space, or -1 when none lies within `maxDist` pixels.
export function nearestPointIndex(
  points: FrontierPoint[],
  toPx: (p: FrontierPoint) => [number, number],
  px: number,
  py: number,
  maxDist: number
): number {
  let best = -1;
  let bestD = maxDist * maxDist;
  points.forEach((p, i) => {
    const [x, y] = toPx(p);
    const d = (x - px) ** 2 + (y - py) ** 2;
    if (d <= bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/// Slider domain for guessing a long-only portfolio's σ: [0, largest asset σ + 5%], snapped up to 5% steps.
/// σₚ never exceeds the largest asset σ when the weights are non-negative and sum to at most 1.
export function volGuessDomain(sigmas: readonly number[]): [number, number] {
  const top = Math.max(0.05, ...sigmas);
  return [0, Math.ceil(top * 20) / 20 + 0.05];
}

/// A random long-only quiz mix in whole percent (sums to exactly 1), reproducible from `seed`; at least two assets
/// get weight so the answer depends on correlation, not just one σ.
export function quizMix(n: number, seed: number): number[] {
  const rng = makeRng(seed);
  const raw = Array.from({ length: n }, () => -Math.log(1 - rng()));
  if (n > 1) {
    const order = raw.map((_, i) => i).sort((a, b) => raw[b] - raw[a]);
    for (const i of order.slice(2)) if (rng() < 0.4) raw[i] = 0;
  }
  const total = raw.reduce((a, b) => a + b, 0);
  const pct = raw.map((r) => Math.floor((r / total) * 100));
  pct[raw.indexOf(Math.max(...raw))] += 100 - pct.reduce((a, b) => a + b, 0);
  return pct.map((p) => p / 100);
}
