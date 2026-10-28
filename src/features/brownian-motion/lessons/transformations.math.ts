import { variancePop } from "../../../lib/stats";
import { simulateBrownian } from "./brownianFundamentals.math";

/// Which transformation of the base path is applied.
export type TransformKind = "negate" | "scale" | "invert" | "shift";

export const TRANSFORM_KINDS: TransformKind[] = ["negate", "scale", "invert", "shift"];

/// The base paths live on [0, BASE_HORIZON] so that W(1/t) is defined down to `INVERT_T_MIN`.
export const BASE_HORIZON = 50;
export const BASE_STEPS = 5000;
/// Time inversion t·W(1/t) is only evaluated from here on (1/t explodes near 0).
export const INVERT_T_MIN = 0.02;
/// Fixed shift s of W(t + s) − W(s).
export const SHIFT_S = 0.5;
const GRID = 100;

/// Seeded Brownian paths on [0, BASE_HORIZON], step-major like `BrownianCloud`.
export type BaseCloud = { values: Float64Array; pathCount: number; dt: number };

export type TransformParams = { c: number; s: number };

/// `pathCount` Brownian paths on [0, 50] (a rescaled copy of the unit-horizon simulation).
export function simulateBase(seed: number, pathCount: number): BaseCloud {
  const unit = simulateBrownian(seed, pathCount, BASE_STEPS);
  const k = Math.sqrt(BASE_HORIZON);
  return { values: unit.values.map((v) => v * k), pathCount, dt: BASE_HORIZON / BASE_STEPS };
}

/// W(time) of one path by linear interpolation between grid points.
export function levelAt(base: BaseCloud, path: number, time: number): number {
  const x = Math.min(Math.max(time, 0), BASE_HORIZON) / base.dt;
  const i = Math.min(Math.floor(x), BASE_STEPS - 1);
  const a = base.values[i * base.pathCount + path];
  const b = base.values[(i + 1) * base.pathCount + path];
  return a + (b - a) * (x - i);
}

/// The transformed value at time t ∈ [0, 1]: −W(t), W(ct)/√c, t·W(1/t) or W(t + s) − W(s).
export function transformedAt(base: BaseCloud, path: number, kind: TransformKind, t: number, p: TransformParams): number {
  const w = (u: number) => levelAt(base, path, u);
  if (kind === "negate") return -w(t);
  if (kind === "scale") return w(p.c * t) / Math.sqrt(p.c);
  if (kind === "invert") return t < INVERT_T_MIN ? 0 : t * w(1 / t);
  return w(t + p.s) - w(p.s);
}

/// One path of the original W and its transform on [0, 1], for drawing side by side.
export function transformSeries(base: BaseCloud, path: number, kind: TransformKind, p: TransformParams) {
  return Array.from({ length: GRID + 1 }, (_, k) => {
    const x = k / GRID;
    return { x, original: levelAt(base, path, x), transformed: transformedAt(base, path, kind, x, p) };
  });
}

/// Empirical Var of the transformed process at each grid time, across all paths of the cloud.
export function varianceProfile(base: BaseCloud, kind: TransformKind, p: TransformParams, points = 20): { x: number; y: number }[] {
  return Array.from({ length: points }, (_, k) => {
    const t = (k + 1) / points;
    const sample = Array.from({ length: base.pathCount }, (_, path) => transformedAt(base, path, kind, t, p));
    return { x: t, y: variancePop(sample) };
  });
}
