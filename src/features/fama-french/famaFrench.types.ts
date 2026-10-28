export type FactorId = "mkt" | "smb" | "hml" | "rmw" | "cma" | "mom";
export type ModelId = "capm" | "ff3" | "carhart" | "ff5";
export type FfTabId = "fund" | "alpha" | "sort" | "cross";

/// The bundled snapshot exactly as stored on disk: percent per month, series aligned from `start`.
export type FfRaw = {
  source: string;
  url: string;
  retrieved: string;
  start: string;
  end: string;
  unit: string;
  factors: Record<FactorId | "rf", number[]>;
  p25: { labels: string[]; returns: number[][] };
  industries: { labels: string[]; returns: number[][] };
};

/// Snapshot in decimals per month with a `YYYY-MM` label for every index.
export type FfData = {
  months: string[];
  factors: Record<FactorId | "rf", number[]>;
  p25: { labels: string[]; returns: number[][] };
  industries: { labels: string[]; returns: number[][] };
  source: string;
  url: string;
  retrieved: string;
};

/// Inclusive month-index window into the snapshot.
export type Window = { from: number; to: number };

export type FfTabProps = { data: FfData; window: Window };

export type FactorFit = {
  /// Monthly intercept, its t-statistic and the x12 annualised value.
  alpha: number;
  alphaT: number;
  alphaAnnual: number;
  betas: { id: FactorId; b: number; se: number; t: number }[];
  r2: number;
};

export type FactorPremium = { mean: number; vol: number; sharpe: number; t: number };

/// A synthetic fund built on the real factors: hidden loadings, annual alpha and idiosyncratic vol.
export type FundSpec = {
  id: string;
  salt: number;
  loadings: Partial<Record<FactorId, number>>;
  alpha: number;
  idioVol: number;
};
