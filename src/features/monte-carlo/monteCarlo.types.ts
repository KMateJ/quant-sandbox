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
