export const PORTFOLIO_IDS = ["SL", "SM", "SH", "BL", "BM", "BH"] as const;
export type PortfolioId = (typeof PORTFOLIO_IDS)[number];
export type Weighting = "equal" | "value";

/// One simulated stock: fixed characteristics and the factor loadings they imply.
export type Stock = { id: number; logSize: number; logBm: number; beta: number; s: number; h: number; idio: number };

/// Breakpoints as universe percentiles in [0, 1]: the size cut, and the low / high book-to-market cuts.
export type Cuts = { sizeCut: number; bmLo: number; bmHi: number };

/// The same breakpoints expressed as characteristic values (for drawing and classification).
export type CutValues = { size: number; lo: number; hi: number };

export type SortResult = { series: Record<PortfolioId, number[]>; counts: Record<PortfolioId, number> };

/// Annualised mean and volatility of a monthly series, and the t-statistic of its mean.
export type SeriesStats = { mean: number; vol: number; t: number };

export type SweepPoint = { cut: number; t: number };

export type OwnFactors = { smb: number[]; hml: number[] };
