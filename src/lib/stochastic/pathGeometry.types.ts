/// Grid resolution of the Chapter 3 Brownian paths on [0, 1].
export const PG_GRID_STEPS = 400;
/// Monitoring resolutions offered in the hitting-probability lesson.
export const PG_MONITORING_STEPS = [25, 100, 400, 1600] as const;

export type CurvePoint = { x: number; y: number };

/// Step-major Brownian samples on [0, 1]: `values[step * pathCount + path]`, W(0) = 0.
export type GeometryCloud = {
  values: Float64Array;
  pathCount: number;
  steps: number;
};

export type Extrema = {
  /// Running maximum max_{s ≤ t} W(s) of every path.
  max: Float64Array;
  /// Running minimum min_{s ≤ t} W(s) of every path.
  min: Float64Array;
};

/// Histogram bin centre with the empirical density and the theoretical one.
export type DensityRow = { x: number; empirical: number; theory: number };
