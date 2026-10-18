import { sharpeRatio } from "../../lib/finance/capm";
import { nextGaussian, type Rng } from "../../lib/math/random";
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

/// Clamps `value` into [min, max].
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/// Mean–variance utility of an allocation: U = E[r] − ½·A·σ².
export function meanVarianceUtility(ret: number, vol: number, riskAversion: number): number {
  return ret - 0.5 * riskAversion * vol * vol;
}

/// Unconstrained optimal risky weight for a mean–variance investor: y* = (μ − rf) / (A·σ²).
export function optimalRiskyWeight(mu: number, sigma: number, riskFree: number, riskAversion: number): number {
  return (mu - riskFree) / (riskAversion * sigma * sigma || 1e-9);
}

/// Best feasible weight on the CAL when it is limited to [0, maxWeight]. Utility is concave in the
/// weight, so the constrained optimum is simply y* clamped to the allowed range.
export function constrainedOptimalWeight(
  mu: number,
  sigma: number,
  riskFree: number,
  riskAversion: number,
  maxWeight: number
): number {
  return clamp(optimalRiskyWeight(mu, sigma, riskFree, riskAversion), 0, maxWeight);
}

/// Indifference curve of utility level `utility`: E[r] = U + ½·A·σ², sampled for σ in [0, maxVol].
export function indifferenceCurve(utility: number, riskAversion: number, maxVol: number, steps: number): CalPoint[] {
  const points: CalPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const vol = (i / steps) * maxVol;
    points.push({ vol, ret: utility + 0.5 * riskAversion * vol * vol });
  }
  return points;
}

/// Two-sided 90% standard normal quantile.
export const Z_90 = 1.6449;

/// Central interval mean ± z·sd of a normal distribution.
export function normalInterval(mean: number, sd: number, z = Z_90): [number, number] {
  return [mean - z * sd, mean + z * sd];
}

/// One year's realised portfolio return, drawn from N(mean, sd²).
export function drawAnnualReturn(mean: number, sd: number, rng: Rng = Math.random): number {
  return nextGaussian(mean, sd, rng);
}

/// Slider domain for guessing a return from N(mean, sd²): mean ± max(10%, 3.5·sd), snapped outward to 5% steps.
export function returnGuessDomain(mean: number, sd: number): [number, number] {
  const half = Math.max(0.1, 3.5 * sd);
  return [Math.floor((mean - half) * 20) / 20, Math.ceil((mean + half) * 20) / 20];
}
