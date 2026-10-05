/// A point on the minimum-variance frontier: portfolio volatility and return.
export type FrontierPoint = {
  vol: number;
  ret: number;
};

/// A named portfolio with its return, volatility and asset weights.
export type PortfolioSummary = {
  ret: number;
  vol: number;
  weights: number[];
};
