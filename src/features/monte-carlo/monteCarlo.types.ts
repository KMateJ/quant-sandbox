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
