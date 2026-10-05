import { sharpeRatio } from "../../lib/finance/capm";
import type { CalPoint } from "./riskReturn.types";

/// Expected return when `weight` of wealth sits in the risky asset and the rest earns `riskFree`.
export function allocationReturn(mu: number, riskFree: number, weight: number): number {
  return riskFree + weight * (mu - riskFree);
}

/// Volatility of an allocation that puts `weight` in the risky asset (cash is risk-free).
export function allocationVolatility(sigma: number, weight: number): number {
  return weight * sigma;
}

/// Sharpe ratio of the risky asset: (μ − rf) / σ. Equals the slope of the capital allocation line.
export function riskyAssetSharpe(mu: number, sigma: number, riskFree: number): number {
  return sharpeRatio(mu, riskFree, sigma);
}

/// Risky weight implied by a portfolio volatility (inverse of σp = w·σ), clamped to [0, maxWeight].
export function weightFromVolatility(vol: number, sigma: number, maxWeight: number): number {
  const w = vol / (sigma || 1e-6);
  return Math.max(0, Math.min(maxWeight, w));
}

/// Points along the capital allocation line from weight 0 (all cash) to `maxWeight` (levered).
export function capitalAllocationLine(
  mu: number,
  sigma: number,
  riskFree: number,
  maxWeight: number,
  steps: number
): CalPoint[] {
  const points: CalPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const w = (i / steps) * maxWeight;
    points.push({
      vol: allocationVolatility(sigma, w),
      ret: allocationReturn(mu, riskFree, w),
    });
  }
  return points;
}
