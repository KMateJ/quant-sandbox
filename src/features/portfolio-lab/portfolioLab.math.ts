import { dot, inverse, matVec } from "../../lib/math/matrix";
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

/// N×N covariance matrix from per-asset volatilities and a single shared correlation.
export function buildCov(sigmas: number[], rho: number): number[][] {
  return sigmas.map((si, i) =>
    sigmas.map((sj, j) => (i === j ? si * si : rho * si * sj))
  );
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
