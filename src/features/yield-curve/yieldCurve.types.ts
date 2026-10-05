/// A single curve node: maturity `t` (years), its display `label` (e.g. "5Y") and the
/// par (market-quote) rate entered or dragged by the user, as a fraction.
export type CurveNode = {
  t: number;
  label: string;
  rate: number;
};

/// A fully derived point on the term structure. All rates are fractions, `df` a factor.
/// `fwd` is the annualised forward from the previous node (`fwdFrom`) to this maturity.
export type TermPoint = {
  t: number;
  label: string;
  par: number;
  zero: number;
  df: number;
  fwd: number;
  fwdFrom: number;
};

export type PresetId = "normal" | "flat" | "inverted" | "humped";

/// Yield-curve shape factors (Nelson–Siegel style), expressed as rate deltas (fractions).
export type Factors = {
  level: number;
  slope: number;
  curvature: number;
};

export type FactorScenario = "parallel" | "steepen" | "flatten" | "curvature";
