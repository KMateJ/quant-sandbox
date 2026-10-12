/// The four defining properties of the standard Wiener process, one experiment each.
export const WIENER_PROPERTIES = ["start", "independence", "gaussian", "roughness"] as const;
export type WienerProperty = (typeof WIENER_PROPERTIES)[number];

/// Increment source for the independence experiment: true Brownian increments or a
/// moving-average noise whose neighbours share a shock (lag-1 correlation ½).
export type IncrementSource = "brownian" | "movingAverage";

/// Window lengths Δt whose increments are compared in the Gaussian experiment.
export const COLLAPSE_WINDOWS = [0.01, 0.05, 0.25] as const;

/// Deepest dyadic level the zoom experiments may refine to (resolution 2⁻⁴⁰).
export const MAX_DYADIC_LEVEL = 40;

export type TimePoint = { x: number; y: number };

/// One row per log-scale h: |ΔW|/h for the path, its √(2/(πh)) mean, and the smooth function's quotient.
export type QuotientRow = { level: number; brownian: number; theory: number; smooth: number };
