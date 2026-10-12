import { makeRng, nextNormal } from "../../lib/math/random";
import { covariance } from "../../lib/stats";
import type { ScatterPoint } from "../../components/charts";
import type {
  BrownianCloud,
  Cov2,
  HistogramBin,
  JointMode,
  Point,
  RebasedWindow,
} from "./brownianFundamentals.types";

const STREAM_STRIDE = 1_000_003;

// #region Simulation

/// Brownian paths on [0, 1] from independent N(0, dt) increments, one seeded stream per
/// path so adding paths keeps the existing ones unchanged.
export function simulateBrownian(seed: number, pathCount: number, steps: number): BrownianCloud {
  const values = new Float64Array((steps + 1) * pathCount);
  const sd = Math.sqrt(1 / steps);
  for (let path = 0; path < pathCount; path++) {
    const rng = makeRng((seed * STREAM_STRIDE + path) >>> 0);
    let level = 0;
    for (let k = 1; k <= steps; k++) {
      level += sd * nextNormal(rng);
      values[k * pathCount + path] = level;
    }
  }
  return { values, pathCount, steps };
}

/// Grid index of time t ∈ [0, 1].
export const timeToStep = (t: number, steps: number) => Math.round(t * steps);

/// Cross-section W(t) of every path.
export function valuesAt(cloud: BrownianCloud, t: number): Float64Array {
  const start = timeToStep(t, cloud.steps) * cloud.pathCount;
  return cloud.values.slice(start, start + cloud.pathCount);
}

/// One path's points (t, W(t)) between two grid times.
export function pathPoints(cloud: BrownianCloud, path: number, from = 0, to = 1): Point[] {
  const a = timeToStep(from, cloud.steps);
  const b = timeToStep(to, cloud.steps);
  return Array.from({ length: b - a + 1 }, (_, i) => ({
    x: (a + i) / cloud.steps,
    y: cloud.values[(a + i) * cloud.pathCount + path],
  }));
}

/// Every path's window segment restarted at zero: u ↦ W(s + u) − W(s) for u ∈ [0, t − s].
export function rebasedWindow(cloud: BrownianCloud, s: number, t: number): RebasedWindow {
  const a = timeToStep(s, cloud.steps);
  const points = timeToStep(t, cloud.steps) - a + 1;
  const n = cloud.pathCount;
  const values = new Float64Array(points * n);
  for (let k = 0; k < points; k++) {
    for (let p = 0; p < n; p++) values[k * n + p] = cloud.values[(a + k) * n + p] - cloud.values[a * n + p];
  }
  return { values, pathCount: n, points };
}

/// Pairwise difference b − a (e.g. the increments W(t) − W(s)).
export function difference(a: Float64Array, b: Float64Array): Float64Array {
  return b.map((value, i) => value - a[i]);
}

/// Symmetric y extent of the whole cloud, padded slightly.
export function cloudExtent(cloud: BrownianCloud): [number, number] {
  let max = 1;
  for (let i = 0; i < cloud.values.length; i++) max = Math.max(max, Math.abs(cloud.values[i]));
  return [-max * 1.05, max * 1.05];
}

/// Points (u, √u) for u on the grid up to `horizon` — the upper half of the ±√u envelope.
export function sqrtTimeEnvelope(steps: number, horizon = 1): Point[] {
  return Array.from({ length: timeToStep(horizon, steps) + 1 }, (_, k) => ({ x: k / steps, y: Math.sqrt(k / steps) }));
}

// #endregion

// #region Distributions

/// Density-normalised histogram on [lo, hi]; values outside are dropped.
export function histogram(values: Float64Array, bins: number, lo: number, hi: number): HistogramBin[] {
  const width = (hi - lo) / bins;
  const counts = new Array<number>(bins).fill(0);
  for (let i = 0; i < values.length; i++) {
    const index = Math.floor((values[i] - lo) / width);
    if (index >= 0 && index < bins) counts[index]++;
  }
  return counts.map((count, i) => ({
    from: lo + i * width,
    to: lo + (i + 1) * width,
    density: count / (values.length * width),
  }));
}

/// N(mean, variance) density at y.
export function gaussianDensity(y: number, mean: number, variance: number): number {
  return Math.exp(-((y - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);
}

/// Theoretical covariance of the joint-chart pair: levels share min(s, t) = s; the
/// increment is independent of W(s), so its off-diagonal is 0.
export function jointCovariance(s: number, t: number, mode: JointMode): Cov2 {
  return mode === "levels" ? { xx: s, xy: s, yy: t } : { xx: s, xy: 0, yy: t - s };
}

/// Sample covariance matrix of paired draws.
export function empiricalCovariance(xs: Float64Array, ys: Float64Array): Cov2 {
  const x = Array.from(xs);
  const y = Array.from(ys);
  return { xx: covariance(x, x), xy: covariance(x, y), yy: covariance(y, y) };
}

export const correlationOf = (c: Cov2) => c.xy / Math.sqrt(c.xx * c.yy);

/// Contour of N(0, Σ) at Mahalanobis radius k, traced through the Cholesky factor of Σ.
export function covarianceEllipse(c: Cov2, k: number, segments = 72): Point[] {
  const l11 = Math.sqrt(c.xx);
  const l21 = c.xy / l11;
  const l22 = Math.sqrt(Math.max(0, c.yy - l21 * l21));
  return Array.from({ length: segments + 1 }, (_, i) => {
    const angle = (2 * Math.PI * i) / segments;
    const u = k * Math.cos(angle);
    const v = k * Math.sin(angle);
    return { x: l11 * u, y: l21 * u + l22 * v };
  });
}

/// Law of Y given X = a for a centred bivariate normal: N(a·Σxy/Σxx, Σyy − Σxy²/Σxx).
export function conditionalGaussian(c: Cov2, a: number): { mean: number; variance: number } {
  return { mean: (a * c.xy) / c.xx, variance: c.yy - (c.xy * c.xy) / c.xx };
}

/// N(mean, variance) density drawn sideways from x = anchor, peak reaching anchor + width.
export function sidewaysDensity(anchor: number, mean: number, variance: number, width: number, range = 3.2): Point[] {
  const sd = Math.sqrt(variance);
  return Array.from({ length: 81 }, (_, i) => {
    const z = -range + (2 * range * i) / 80;
    return { x: anchor + width * Math.exp(-(z * z) / 2), y: mean + z * sd };
  });
}

/// Paired samples as scatter points, capped so dense clouds stay cheap to render.
export function scatterPoints(xs: Float64Array, ys: Float64Array, limit = 900): ScatterPoint[] {
  const count = Math.min(limit, xs.length);
  return Array.from({ length: count }, (_, i) => ({ x: xs[i], y: ys[i] }));
}

// #endregion
