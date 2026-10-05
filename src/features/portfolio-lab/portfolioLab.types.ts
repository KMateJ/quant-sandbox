/// A point in risk/return space: portfolio volatility and expected return.
export type FrontierPoint = {
  vol: number;
  ret: number;
};

/// A random-portfolio sample: its risk/return point plus the weights that produced it.
export type CloudPoint = FrontierPoint & {
  weights: number[];
};

/// An investable asset in the lab: display meta plus expected return and volatility.
export type Asset = {
  id: string;
  name: string;
  color: string;
  mu: number;
  sigma: number;
};

/// Summary statistics of a weighted portfolio.
export type PortfolioMetrics = {
  ret: number;
  vol: number;
  sharpe: number;
};
