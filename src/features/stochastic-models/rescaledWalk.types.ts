import type { ChartDatum } from "../../components/charts";

/// The refinement levels n offered for W⁽ⁿ⁾(t) = S₍⌊nt⌋₎ / √n.
export const RESCALED_LEVELS = [10, 50, 100, 500, 1000, 5000, 10000] as const;

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
