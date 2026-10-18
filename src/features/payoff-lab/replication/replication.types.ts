/// A clicked node of the target terminal payoff (S_T, payoff).
/// `steepness` overrides the shape-wide value for the edge towards the next node.
export type PayoffNode = { x: number; y: number; steepness?: number };

/// User-drawn terminal payoff: nodes joined by edges of adjustable steepness.
export type PayoffShape = {
  nodes: PayoffNode[];
  /// 0 = straight line between nodes, 1 = near-vertical jump at the midpoint.
  steepness: number;
  leftSlope: number;
  rightSlope: number;
};

/// Piecewise-linear function on [0, ∞): `xs[0] = 0`, linear between points, `rightSlope` after the last.
export type PiecewiseLinear = { xs: number[]; ys: number[]; rightSlope: number };

/// Black–Scholes market with a linear-in-log-moneyness volatility skew.
export type MarketParams = {
  spot: number;
  rate: number;
  sigma: number;
  maturity: number;
  skew: number;
  /// Spacing of listed strikes; 0 = every strike trades (exact replication).
  strikeStep: number;
};

export type InstrumentKind = "bond" | "stock" | "forward" | "call" | "put";

/// One position of a replicating portfolio; negative quantity = short.
export type ReplicationLeg = {
  kind: InstrumentKind;
  /// Strike for options/forward, face value for the bond (quantity scales it).
  strike?: number;
  quantity: number;
  unitPrice: number;
};

export type ReplicationMethod = "calls" | "puts" | "carr-madan";

export type ReplicationPortfolio = {
  method: ReplicationMethod;
  legs: ReplicationLeg[];
  total: number;
};

export type DensityPoint = { S: number; density: number; flat?: number };
