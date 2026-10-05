import { dot, inverse, matVec } from "../../lib/math/matrix";
import type { FrontierPoint, PortfolioSummary } from "./efficientFrontier.types";

/// n×n covariance matrix from per-asset volatilities and a shared pairwise correlation.
export function covMatrixShared(sigmas: number[], rho: number): number[][] {
  const n = sigmas.length;
  const m: number[][] = [];
  for (let i = 0; i < n; i++) {
    m[i] = [];
    for (let j = 0; j < n; j++) {
      m[i][j] = i === j ? sigmas[i] * sigmas[i] : rho * sigmas[i] * sigmas[j];
    }
  }
  return m;
}

type FrontierConstants = { a: number; b: number; c: number; d: number };

/// The efficient-set scalars A, B, C, D from Σ⁻¹, the ones vector and expected returns.
function frontierConstants(mus: number[], cov: number[][]): FrontierConstants {
  const inv = inverse(cov);
  const ones = mus.map(() => 1);
  const invOnes = matVec(inv, ones);
  const invMu = matVec(inv, mus);
  const a = dot(ones, invOnes);
  const b = dot(ones, invMu);
  const c = dot(mus, invMu);
  return { a, b, c, d: a * c - b * b };
}

/// Minimum achievable portfolio variance for a target return (the frontier parabola).
export function frontierVariance(targetReturn: number, mus: number[], cov: number[][]): number {
  const { a, b, c, d } = frontierConstants(mus, cov);
  return (a * targetReturn * targetReturn - 2 * b * targetReturn + c) / d;
}

/// Volatility on the minimum-variance frontier for a target return.
export function frontierVolatility(targetReturn: number, mus: number[], cov: number[][]): number {
  return Math.sqrt(Math.max(frontierVariance(targetReturn, mus, cov), 0));
}

/// Global minimum-variance portfolio return (B/A) and volatility (√(1/A)).
export function globalMinVariance(mus: number[], cov: number[][]): FrontierPoint {
  const { a, b } = frontierConstants(mus, cov);
  return { ret: b / a, vol: Math.sqrt(1 / a) };
}

/// Sample the minimum-variance frontier across target returns in [minRet, maxRet].
export function efficientFrontier(
  mus: number[],
  cov: number[][],
  minRet: number,
  maxRet: number,
  steps: number
): FrontierPoint[] {
  const points: FrontierPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ret = minRet + (i / steps) * (maxRet - minRet);
    points.push({ vol: frontierVolatility(ret, mus, cov), ret });
  }
  return points;
}

/// Return, volatility and weights of an arbitrary weight vector.
export function portfolioStats(weights: number[], mus: number[], cov: number[][]): PortfolioSummary {
  const ret = dot(weights, mus);
  const variance = dot(weights, matVec(cov, weights));
  return { ret, vol: Math.sqrt(Math.max(variance, 0)), weights };
}

/// Weights of the global minimum-variance portfolio (Σ⁻¹·1 normalised).
export function gmvWeights(mus: number[], cov: number[][]): number[] {
  const inv = inverse(cov);
  const ones = mus.map(() => 1);
  const invOnes = matVec(inv, ones);
  const a = dot(ones, invOnes);
  return invOnes.map((x) => x / a);
}

/// Frontier weights achieving a given target return (closed-form w = g + h·tr).
export function frontierWeights(targetReturn: number, mus: number[], cov: number[][]): number[] {
  const inv = inverse(cov);
  const ones = mus.map(() => 1);
  const invOnes = matVec(inv, ones);
  const invMu = matVec(inv, mus);
  const { a, b, c, d } = frontierConstants(mus, cov);
  return mus.map(
    (_, i) => ((c - b * targetReturn) * invOnes[i] + (a * targetReturn - b) * invMu[i]) / d
  );
}

/// Tangency (maximum-Sharpe) portfolio weights for a given risk-free rate.
export function tangencyWeights(mus: number[], cov: number[][], riskFree: number): number[] {
  const inv = inverse(cov);
  const excess = mus.map((m) => m - riskFree);
  const w = matVec(inv, excess);
  const sum = w.reduce((acc, x) => acc + x, 0);
  return sum === 0 ? w : w.map((x) => x / sum);
}

/// Sharpe ratio of a portfolio given the risk-free rate.
export function sharpeRatio(p: FrontierPoint, riskFree: number): number {
  return p.vol === 0 ? 0 : (p.ret - riskFree) / p.vol;
}
