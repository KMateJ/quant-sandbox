// Mean–variance utility on the capital allocation line, for the "utility-indifference" guide figure.

/// The risky portfolio P and the risk-free rate used by the figure (the lesson's worked example).
export const UTILITY_MARKET = { muP: 0.11, sigmaP: 0.2, rf: 0.03 } as const;

/// Risk-aversion coefficients offered by the figure; 4 is the lesson's default.
export const RISK_AVERSIONS = [2, 4, 8] as const;

/// Largest weight in P the figure lets the reader drag to (borrowing up to 60% of capital).
export const MAX_WEIGHT = 1.6;

/// How close (in weight) a dragged point must come to y* before it snaps onto the optimum.
export const SNAP_TOLERANCE = 0.03;

export type Market = { muP: number; sigmaP: number; rf: number };
export type CompletePortfolio = { y: number; mu: number; sigma: number };

/// Mean–variance utility U = μ − ½Aσ². With rates as decimals, U is itself a rate: the certainty equivalent.
export function utility(mu: number, sigma: number, A: number): number {
  return mu - 0.5 * A * sigma * sigma;
}

/// Complete portfolio with weight `y` in P and 1 − y in the risk-free asset.
export function completePortfolio(y: number, m: Market = UTILITY_MARKET): CompletePortfolio {
  return { y, mu: m.rf + y * (m.muP - m.rf), sigma: y * m.sigmaP };
}

/// Optimal weight in P, y* = (μ_P − r_f) / (Aσ_P²); above 1 it means borrowing at r_f.
export function optimalWeight(A: number, m: Market = UTILITY_MARKET): number {
  return (m.muP - m.rf) / (A * m.sigmaP * m.sigmaP);
}

/// Sharpe ratio of P, the slope of the capital allocation line.
export function sharpeRatio(m: Market = UTILITY_MARKET): number {
  return (m.muP - m.rf) / m.sigmaP;
}

/// Points (σ, μ) of the indifference curve μ = U + ½Aσ² for σ from 0 to `sigmaMax`.
export function indifferenceCurve(U: number, A: number, sigmaMax: number, n = 60): { sigma: number; mu: number }[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const sigma = (sigmaMax * i) / n;
    return { sigma, mu: U + 0.5 * A * sigma * sigma };
  });
}

/// Clamps a weight to [0, MAX_WEIGHT].
export function clampWeight(y: number): number {
  return Math.min(MAX_WEIGHT, Math.max(0, y));
}

/// Clamps a weight and snaps it onto y* when it is within SNAP_TOLERANCE (used for pointer drags only,
/// so arrow-key steps can still move away from the optimum).
export function snapWeight(y: number, yStar: number): number {
  const clamped = clampWeight(y);
  return Math.abs(clamped - yStar) <= SNAP_TOLERANCE && yStar <= MAX_WEIGHT ? yStar : clamped;
}
