/// The optimization objective driving the selected portfolio.
export type OptObjective = "minVariance" | "maxSharpe" | "targetReturn" | "targetVolatility";

/// Portfolio constraints applied to every optimization. Weights are fractions.
export type OptConstraints = {
  longOnly: boolean;
  allowShort: boolean;
  minWeight: number;
  maxWeight: number;
  useRiskFree: boolean;
  riskFree: number;
  allowLeverage: boolean;
  maxGross: number;
};

/// A solved portfolio: risk/return point, Sharpe ratio and asset weights.
export type OptPoint = {
  vol: number;
  ret: number;
  sharpe: number;
  weights: number[];
};

/// Per-asset lower/upper weight bounds derived from the constraints.
export type Bounds = { lo: number[]; hi: number[] };
