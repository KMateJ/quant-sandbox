/// The base bond definition shared by every measure and curve on the page.
export type BondParams = {
  face: number;
  couponRate: number;
  ytm: number;
  years: number;
  freq: number;
};

/// Current price and interest-rate risk measures of the base bond.
export type BondMeasures = {
  price: number;
  macaulay: number;
  modified: number;
  convexity: number;
  dv01: number;
};

/// Exact and approximate price change (in %) at a given yield shock Δy (in bp).
export type PriceChangePoint = {
  dyBp: number;
  exact: number;
  duration: number;
  durConvex: number;
};

/// Approximation error (estimate − exact, in %) at a given yield shock Δy (in bp).
export type ErrorPoint = {
  dyBp: number;
  durationError: number;
  durConvexError: number;
};

/// Exact and approximate bond response to a single selected yield shock.
export type ShockResult = {
  dyBp: number;
  exactPct: number;
  newPrice: number;
  durationPct: number;
  durationErrPct: number;
  durationErrBp: number;
  durConvexPct: number;
  durConvexErrPct: number;
  durConvexErrBp: number;
};
