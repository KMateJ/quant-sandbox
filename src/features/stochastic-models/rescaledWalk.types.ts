import type { ChartDatum } from "../../components/charts";

/// Refinement slider runs over n = 2^0 … 2^MAX steps; the finest level is the walk itself.
export const RESCALED_MAX_EXPONENT = 12;
export const RESCALED_FINE_STEPS = 2 ** RESCALED_MAX_EXPONENT;

export type RescaledPathData = {
  /// One row per t = k/n with a column per overlaid path (`p0`, `p1`, …).
  rows: ChartDatum[];
  pathKeys: string[];
};

export type DensityPoint = {
  x: number;
  empirical: number;
  normal: number;
};

export type TerminalSummary = {
  mean: number;
  variance: number;
};
