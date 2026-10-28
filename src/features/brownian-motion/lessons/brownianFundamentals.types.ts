/// Grid resolution of the simulated Brownian paths on [0, 1].
export const BM_GRID_STEPS = 200;
/// Window ends snap to this step (a multiple of 1 / BM_GRID_STEPS, so both land on grid points).
export const BM_TIME_STEP = 0.01;
/// Smallest allowed window length t − s.
export const BM_MIN_GAP = 0.05;
/// Range for both window ends; s stays above 0 so W(s) has positive variance.
export const BM_WINDOW_BOUNDS: [number, number] = [0.05, 1];
/// Paths drawn in colour and tracked across every linked chart.
export const BM_FEATURED_PATHS = 5;

export type BrownianCloud = {
  /// Step-major samples: `values[step * pathCount + path]`, with W(0) = 0.
  values: Float64Array;
  pathCount: number;
  steps: number;
};

/// Window segments u ↦ W(s + u) − W(s), step-major like `BrownianCloud`.
export type RebasedWindow = {
  values: Float64Array;
  pathCount: number;
  /// Points per segment (window steps + 1).
  points: number;
};

/// Centred 2×2 covariance matrix [[xx, xy], [xy, yy]].
export type Cov2 = { xx: number; xy: number; yy: number };

/// Pair shown on the joint chart: (W(s), W(t)) or (W(s), W(t) − W(s)).
export type JointMode = "levels" | "increments";

export type HistogramBin = { from: number; to: number; density: number };

export type Point = { x: number; y: number };
