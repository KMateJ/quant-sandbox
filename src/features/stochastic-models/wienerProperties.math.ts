import { makeRng, nextNormal } from "../../lib/math/random";
import { gaussianDensity, histogram } from "./brownianFundamentals.math";
import type { BrownianCloud } from "./brownianFundamentals.types";
import { MAX_DYADIC_LEVEL, type IncrementSource, type QuotientRow, type TimePoint } from "./wienerProperties.types";

// #region Lévy construction

/// Deterministic N(0,1) attached to dyadic node (level, index) of a path, so any zoom
/// window regenerates exactly the same path.
function nodeNormal(seed: number, level: number, index: number): number {
  let h = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(level + 1, 0xc2b2ae35);
  h ^= Math.imul(index | 0, 0x27d4eb2f) ^ Math.imul(Math.floor(index / 4294967296), 0x165667b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  return nextNormal(makeRng(h >>> 0));
}

/// A Brownian path on [0, 1] defined at every dyadic time by Lévy's midpoint refinement:
/// W(1) ~ N(0, 1), and the midpoint of an interval of length ℓ is the average of its
/// endpoints plus N(0, ℓ/4). Values are exact samples of W, not interpolations.
export function levyPath(seed: number) {
  const memo = new Map<number, number>();
  const at = (level: number, index: number): number => {
    if (index === 0) return 0;
    if (level === 0) return nodeNormal(seed, 0, 1);
    if (index % 2 === 0) return at(level - 1, index / 2);
    const key = level * 2 ** (MAX_DYADIC_LEVEL + 1) + index;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;
    const mid = (at(level - 1, (index - 1) / 2) + at(level - 1, (index + 1) / 2)) / 2;
    const value = mid + Math.sqrt(2 ** -(level + 1)) * nodeNormal(seed, level, index);
    memo.set(key, value);
    return value;
  };
  return { at };
}

export type LevyPath = ReturnType<typeof levyPath>;

/// Dyadic level giving at least `points` samples across [a, b].
export function levelFor(a: number, b: number, points: number): number {
  return Math.min(MAX_DYADIC_LEVEL, Math.max(0, Math.ceil(Math.log2(points / (b - a)))));
}

/// The path sampled at every dyadic point of the chosen level inside [a, b].
export function sampleWindow(path: LevyPath, a: number, b: number, points: number): TimePoint[] {
  const level = levelFor(a, b, points);
  const scale = 2 ** level;
  const first = Math.max(0, Math.floor(a * scale));
  const last = Math.min(scale, Math.ceil(b * scale));
  return Array.from({ length: last - first + 1 }, (_, i) => ({ x: (first + i) / scale, y: path.at(level, first + i) }));
}

/// Several Lévy paths on the same window, step-major for the path-cloud chart.
export function levyCloud(seed: number, pathCount: number, a: number, b: number, points: number) {
  const samples = Array.from({ length: pathCount }, (_, p) => sampleWindow(levyPath(seed * 7919 + p), a, b, points));
  const stepCount = samples[0].length;
  const values = new Float64Array(stepCount * pathCount);
  samples.forEach((path, p) => path.forEach((point, k) => (values[k * pathCount + p] = point.y)));
  return { values, pathCount, stepCount, x0: samples[0][0].x, dx: stepCount > 1 ? samples[0][1].x - samples[0][0].x : 1 };
}

// #endregion

// #region Roughness

/// A smooth comparison curve on [0, 1].
export const smoothCurve = (t: number) => 0.8 * Math.sin(2 * Math.PI * t) + 0.35 * Math.sin(6 * Math.PI * t + 1);

/// Snap a time to the dyadic grid of `level`.
export const snapDyadic = (t: number, level: number) => Math.round(t * 2 ** level) / 2 ** level;

/// Difference quotients |f(c ± h) − f(c)| / h for h = 2⁻ʲ (backward when c + h leaves
/// [0, 1]): the Brownian one grows like h^(−1/2) (mean √(2/(πh))), the smooth one
/// settles at |f′(c)|.
export function differenceQuotients(path: LevyPath, center: number, maxLevel: number): QuotientRow[] {
  const base = 2 ** maxLevel;
  const kc = Math.round(center * base);
  const c = kc / base;
  return Array.from({ length: maxLevel - 1 }, (_, j) => {
    const level = j + 2;
    const h = 2 ** -level;
    const step = 2 ** (maxLevel - level);
    const sign = kc + step <= base ? 1 : -1;
    const brownian = Math.abs(path.at(maxLevel, kc + sign * step) - path.at(maxLevel, kc)) / h;
    return {
      level,
      brownian,
      theory: Math.sqrt(2 / (Math.PI * h)),
      smooth: Math.abs(smoothCurve(c + sign * h) - smoothCurve(c)) / h,
    };
  });
}

/// A single sampled path as chart rows on window-relative time u = (t − a)/(b − a).
export function relativeRows(points: TimePoint[], a: number, b: number, key: string) {
  return points.map((p) => ({ u: (p.x - a) / (b - a), [key]: p.y }));
}

// #endregion

// #region Independence

/// Standardised increment sequence: i.i.d. N(0,1) for Brownian motion, or the moving
/// average (Zₖ + Zₖ₊₁)/√2, which has the same N(0,1) marginal but lag-1 correlation ½.
export function incrementSequence(seed: number, n: number, source: IncrementSource): Float64Array {
  const rng = makeRng(seed * 31 + 17);
  const z = Array.from({ length: n + 1 }, () => nextNormal(rng));
  return Float64Array.from({ length: n }, (_, k) => (source === "brownian" ? z[k] : (z[k] + z[k + 1]) / Math.SQRT2));
}

/// Running sum of increments scaled by √dt — the path the increments build.
export function cumulativePath(increments: Float64Array, steps: number): TimePoint[] {
  const dt = 1 / steps;
  const out: TimePoint[] = [{ x: 0, y: 0 }];
  let level = 0;
  for (let k = 0; k < steps; k++) {
    level += increments[k] * Math.sqrt(dt);
    out.push({ x: (k + 1) * dt, y: level });
  }
  return out;
}

/// Sample autocorrelation at lags 1…maxLag.
export function autocorrelation(xs: Float64Array, maxLag: number): TimePoint[] {
  const n = xs.length;
  let mean = 0;
  for (const x of xs) mean += x / n;
  let denom = 0;
  for (const x of xs) denom += (x - mean) ** 2;
  return Array.from({ length: maxLag }, (_, i) => {
    const lag = i + 1;
    let num = 0;
    for (let k = 0; k + lag < n; k++) num += (xs[k] - mean) * (xs[k + lag] - mean);
    return { x: lag, y: num / denom };
  });
}

/// Pairs (Xₖ, Xₖ₊ₗₐ₉) for the lag scatter.
export function lagPairs(xs: Float64Array, lag: number, limit = 900): TimePoint[] {
  const count = Math.min(limit, xs.length - lag);
  return Array.from({ length: count }, (_, k) => ({ x: xs[k], y: xs[k + lag] }));
}

// #endregion

// #region Gaussian collapse

/// Non-overlapping increments over windows of length Δ from every path of the cloud.
export function windowIncrements(cloud: BrownianCloud, delta: number): Float64Array {
  const stride = Math.round(delta * cloud.steps);
  const windows = Math.floor(cloud.steps / stride);
  const n = cloud.pathCount;
  const out = new Float64Array(windows * n);
  for (let w = 0; w < windows; w++) {
    for (let p = 0; p < n; p++) out[w * n + p] = cloud.values[(w + 1) * stride * n + p] - cloud.values[w * stride * n + p];
  }
  return out;
}

/// Density rows on a shared grid: per window, the empirical density (`d0`, `d1`, …) and
/// its theoretical N(0, Δ) density (`n0`, …), raw or standardised by √Δ (then all → N(0,1)).
export function collapseRows(samples: Float64Array[], deltas: readonly number[], standardised: boolean) {
  const range = standardised ? 4 : 1.6;
  // Raw bins must resolve the narrowest bell (sd √0.01 = 0.1).
  const bins = standardised ? 48 : 96;
  const hists = samples.map((values, i) => {
    const scaled = standardised ? values.map((v) => v / Math.sqrt(deltas[i])) : values;
    return histogram(scaled, bins, -range, range);
  });
  return hists[0].map((bin, b) => {
    const x = (bin.from + bin.to) / 2;
    const row: Record<string, number> = { x };
    hists.forEach((hist, i) => {
      row[`d${i}`] = hist[b].density;
      row[`n${i}`] = gaussianDensity(x, 0, standardised ? 1 : deltas[i]);
    });
    return row;
  });
}

// #endregion
