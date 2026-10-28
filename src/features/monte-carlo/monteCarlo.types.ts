/// A convergence point: number of simulations `n`, the running MC estimate and the analytic price.
export type MonteCarloPoint = {
  n: number;
  estimate: number;
  analytic: number;
};

/// Result of a Monte Carlo option-pricing run.
export type MonteCarloResult = {
  estimate: number;
  analytic: number;
  standardError: number;
  data: MonteCarloPoint[];
};

export type McEstimator = "plain" | "antithetic" | "control";

/// Inputs of one lab run.
export type McLabParams = {
  s0: number;
  strike: number;
  maturity: number;
  rate: number;
  vol: number;
  sims: number;
  seed: number;
};

/// A convergence sample: draws used so far, the running estimate and its 95% band per estimator.
export type McRacePoint = { n: number; analytic: number } & Record<McEstimator, number> &
  Record<`${McEstimator}Lo` | `${McEstimator}Hi`, number>;

/// Final estimate and standard error of one estimator after all draws.
export type McEstimatorSummary = { estimate: number; standardError: number };

/// Everything the lab draws: the plain run (identical to `monteCarloCall`), the variance-reduction race,
/// every terminal price and discounted payoff, and a few sample paths that end at the first draws.
export type McLabResult = {
  analytic: number;
  race: McRacePoint[];
  summary: Record<McEstimator, McEstimatorSummary>;
  terminal: Float64Array;
  payoff: Float64Array;
  /// Step-major path values (`paths[step * pathCount + path]`); path i ends at `terminal[i]`.
  paths: Float64Array;
  pathCount: number;
  pathSteps: number;
};

/// The variance-reduction page adds the combination of both techniques.
export type McVrMethod = McEstimator | "both";

export type McVrRacePoint = { n: number; analytic: number } & Record<McVrMethod, number> &
  Record<`${McVrMethod}Lo` | `${McVrMethod}Hi`, number>;

export type McVrResult = {
  analytic: number;
  race: McVrRacePoint[];
  summary: Record<McVrMethod, McEstimatorSummary>;
};

/// Feynman-Kac page: price u(t, x) of a call with strike K expiring at T, started at time t from spot x.
export type FkParams = { x: number; t: number; strike: number; maturity: number; rate: number; vol: number; sims: number; seed: number };

export type FkCurvePoint = { x: number; closed: number; mc: number; payoff: number };

export type FkResult = {
  closed: number;
  estimate: number;
  standardError: number;
  /// Discounted payoff of every draw started at x.
  payoffs: Float64Array;
  /// Share of the draws that end in the money.
  payingShare: number;
  curve: FkCurvePoint[];
};
