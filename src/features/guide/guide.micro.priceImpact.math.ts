// Price impact and Almgren–Chriss execution for the "Price impact and optimal execution" lesson.
// Costs and standard deviations are fractions of the order's initial value unless stated.

/// Parameters of a liquidation of `X` over `N` equal intervals spanning time `T` (one trading day = 1).
export type AcParams = {
  /// Order size, as a multiple of the order's own size (1 for the figure).
  X: number;
  N: number;
  T: number;
  /// Volatility per square-root day, as a fraction of price.
  sigma: number;
  /// Temporary impact per unit of trading rate (order per day).
  eta: number;
  /// Permanent impact per unit traded.
  gamma: number;
  /// Risk aversion λ_risk (not Kyle's λ).
  lambdaRisk: number;
};

export type AcPoint = { lambdaRisk: number; cost: number; sd: number; x: number[] };

/// Square-root rule `ΔP/P ≈ Y σ √(Q/V)`: σ daily volatility, `participation` = Q/V the order as a share of daily volume.
export function squareRootImpact(sigma: number, participation: number, Y = 1): number {
  return Y * sigma * Math.sqrt(participation);
}

/// Interval length τ = T/N.
const step = (p: AcParams) => p.T / p.N;

/// Effective temporary impact η̃ = η − γτ/2.
export const etaTilde = (p: AcParams) => p.eta - (p.gamma * step(p)) / 2;

/// Optimal holdings `x_0 … x_N`: `X sinh(κ(T−t_j))/sinh(κT)`, a straight line when λ_risk is 0.
export function acTrajectory(p: AcParams): number[] {
  const tau = step(p);
  const k2 = (p.lambdaRisk * p.sigma ** 2) / etaTilde(p);
  const kappa = k2 > 1e-12 ? Math.acosh(1 + (k2 * tau * tau) / 2) / tau : 0;
  return Array.from({ length: p.N + 1 }, (_, j) => {
    const left = p.T - j * tau;
    return kappa === 0 ? (p.X * left) / p.T : (p.X * Math.sinh(kappa * left)) / Math.sinh(kappa * p.T);
  });
}

/// Expected cost `½γX² + (η̃/τ) Σ n_j²` and variance `σ² τ Σ x_j²` of the holdings `x`.
export function acCostVariance(p: AcParams, x: number[]): { cost: number; variance: number } {
  const tau = step(p);
  let sumN = 0;
  let sumX = 0;
  for (let j = 1; j < x.length; j++) {
    sumN += (x[j - 1] - x[j]) ** 2;
    sumX += x[j] ** 2;
  }
  return { cost: 0.5 * p.gamma * p.X ** 2 + (etaTilde(p) / tau) * sumN, variance: p.sigma ** 2 * tau * sumX };
}

/// One (cost, standard deviation) point for each risk aversion in `lambdas`.
export function acFrontier(p: AcParams, lambdas: number[]): AcPoint[] {
  return lambdas.map((lambdaRisk) => {
    const q = { ...p, lambdaRisk };
    const x = acTrajectory(q);
    const { cost, variance } = acCostVariance(q, x);
    return { lambdaRisk, cost, sd: Math.sqrt(variance), x };
  });
}

/// Exponents e with λ_risk = 10^e, from `lo` to `hi` in steps of 0.1.
export const lambdaExponents = (lo = -2, hi = 3) => Array.from({ length: Math.round((hi - lo) * 10) + 1 }, (_, i) => +(lo + i / 10).toFixed(1));

/// Exponent of the frontier point whose standard deviation is closest to `sd`.
export function nearestExponent(points: AcPoint[], exps: number[], sd: number): number {
  let best = 0;
  points.forEach((pt, i) => {
    if (Math.abs(pt.sd - sd) < Math.abs(points[best].sd - sd)) best = i;
  });
  return exps[best];
}

/// Share of the order sold in the first quarter of the horizon.
export function firstQuarterShare(p: AcParams, x: number[]): number {
  return (x[0] - x[Math.round(p.N / 4)]) / p.X;
}
