import { normCdf, normInv, normPdf } from "../../../lib/stats";
import type { CurvePoint, DensityRow, Extrema, GeometryCloud } from "../../../lib/stochastic/pathGeometry.types";

/// −ζ(½)/√(2π): Broadie–Glasserman–Kou shift for discretely monitored barriers.
export const BGK_BETA = 0.5826;

// #region Path extraction

/// Running maximum of a path, point by point.
export function runningMax(points: CurvePoint[]): CurvePoint[] {
  let best = -Infinity;
  return points.map((p) => ({ x: p.x, y: (best = Math.max(best, p.y)) }));
}

/// Running minimum of a path, point by point.
export function runningMin(points: CurvePoint[]): CurvePoint[] {
  let best = Infinity;
  return points.map((p) => ({ x: p.x, y: (best = Math.min(best, p.y)) }));
}

/// Path reflected in the level a after its first passage: 2a − W(t) for t ≥ τ_a.
/// Returns the unchanged path when it never reaches a.
export function reflectAfterHit(points: CurvePoint[], a: number): CurvePoint[] {
  const hit = points.findIndex((p) => p.y >= a);
  if (hit < 0) return points;
  return points.map((p, i) => (i < hit ? p : { x: p.x, y: 2 * a - p.y }));
}

/// Next path after `from` (cyclically) whose first-passage time is finite.
export function nextHittingPath(times: Float64Array, from: number): number {
  for (let k = 1; k <= times.length; k++) {
    const path = (from + k) % times.length;
    if (Number.isFinite(times[path])) return path;
  }
  return from;
}

// #endregion

// #region Ensemble statistics

/// Running max and min of every path over the grid points 0…step.
export function extremaUpTo(cloud: GeometryCloud, step: number): Extrema {
  const { values, pathCount } = cloud;
  const max = new Float64Array(pathCount);
  const min = new Float64Array(pathCount);
  for (let k = 1; k <= step; k++) {
    const base = k * pathCount;
    for (let p = 0; p < pathCount; p++) {
      const v = values[base + p];
      if (v > max[p]) max[p] = v;
      if (v < min[p]) min[p] = v;
    }
  }
  return { max, min };
}

/// First grid time with W(t) + μt ≥ a for every path (Infinity if not reached by t = 1).
export function firstPassageTimes(cloud: GeometryCloud, a: number, drift = 0): Float64Array {
  const { values, pathCount, steps } = cloud;
  const times = new Float64Array(pathCount).fill(Infinity);
  let open = pathCount;
  for (let k = 1; k <= steps && open > 0; k++) {
    const t = k / steps;
    const base = k * pathCount;
    for (let p = 0; p < pathCount; p++) {
      if (times[p] === Infinity && values[base + p] + drift * t >= a) {
        times[p] = t;
        open--;
      }
    }
  }
  return times;
}

/// The same paths observed only at every `stride`-th grid point (coarser monitoring).
export function subsampleCloud(cloud: GeometryCloud, stride: number): GeometryCloud {
  const { values, pathCount } = cloud;
  const steps = Math.floor(cloud.steps / stride);
  const out = new Float64Array((steps + 1) * pathCount);
  for (let k = 0; k <= steps; k++) out.set(values.subarray(k * stride * pathCount, (k * stride + 1) * pathCount), k * pathCount);
  return { values: out, pathCount, steps };
}

/// X(t) = W(t) + μt on the same grid.
export function withDrift(cloud: GeometryCloud, drift: number): GeometryCloud {
  if (drift === 0) return cloud;
  const { values, pathCount, steps } = cloud;
  const out = new Float64Array(values.length);
  for (let k = 0; k <= steps; k++) {
    const shift = (drift * k) / steps;
    for (let p = 0; p < pathCount; p++) out[k * pathCount + p] = values[k * pathCount + p] + shift;
  }
  return { values: out, pathCount, steps };
}

/// Next path after `from` whose fine-grid maximum reaches a while its coarsely
/// monitored maximum does not — a crossing the monitoring dates miss.
export function nextMissedCrossing(fineMax: Float64Array, coarseMax: Float64Array, a: number, from: number): number | undefined {
  for (let k = 1; k <= fineMax.length; k++) {
    const path = (from + k) % fineMax.length;
    if (fineMax[path] >= a && coarseMax[path] < a) return path;
  }
  return undefined;
}

/// Paths frozen at the barrier after their first passage — the stopped process W(t ∧ τ_a).
export function stoppedCloud(cloud: GeometryCloud, a: number): GeometryCloud {
  const { values, pathCount, steps } = cloud;
  const out = new Float64Array(values.length);
  for (let p = 0; p < pathCount; p++) {
    let stopped = false;
    for (let k = 0; k <= steps; k++) {
      const i = k * pathCount + p;
      if (!stopped && values[i] >= a) stopped = true;
      out[i] = stopped ? a : values[i];
    }
  }
  return { values: out, pathCount, steps };
}

/// Fraction of a sample with value ≥ level.
export function tailFraction(values: ArrayLike<number>, level: number): number {
  let count = 0;
  for (let i = 0; i < values.length; i++) if (values[i] >= level) count++;
  return values.length ? count / values.length : 0;
}

/// Fraction of first-passage times ≤ t, i.e. the empirical P(τ_a ≤ t).
export function hitFraction(times: Float64Array, t: number): number {
  let count = 0;
  for (let i = 0; i < times.length; i++) if (times[i] <= t) count++;
  return times.length ? count / times.length : 0;
}

export function sampleMean(values: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < values.length; i++) sum += values[i];
  return values.length ? sum / values.length : 0;
}

/// Median of the finite entries, or undefined when fewer than half are finite.
export function finiteMedian(values: Float64Array): number | undefined {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return Number.isFinite(sorted[mid]) ? sorted[mid] : undefined;
}

/// Histogram over [lo, hi] normalised by the full sample size, so a sample with
/// entries outside the range (e.g. τ > 1) yields a defective density integrating to < 1.
export function densityRows(
  values: ArrayLike<number>,
  lo: number,
  hi: number,
  bins: number,
  theory: (x: number) => number
): DensityRow[] {
  const width = (hi - lo) / bins;
  const counts = new Array<number>(bins).fill(0);
  for (let i = 0; i < values.length; i++) {
    const index = Math.floor((values[i] - lo) / width);
    if (index >= 0 && index < bins) counts[index]++;
    else if (values[i] === hi) counts[bins - 1]++;
  }
  const norm = Math.max(1, values.length) * width;
  return counts.map((count, index) => {
    const x = lo + (index + 0.5) * width;
    return { x, empirical: count / norm, theory: theory(x) };
  });
}

// #endregion

// #region Theory

/// P(max_{s≤t} (W(s) + μs) ≥ a) for a > 0; with μ = 0 the reflection principle gives 2·P(W(t) ≥ a).
export function maxTailProbability(a: number, t: number, drift = 0): number {
  if (a <= 0) return 1;
  if (t <= 0) return 0;
  const sd = Math.sqrt(t);
  return 1 - normCdf((a - drift * t) / sd) + Math.exp(2 * drift * a) * normCdf((-a - drift * t) / sd);
}

/// Density of the running maximum M(t): 2φ(m/√t)/√t for m ≥ 0 (M(t) has the law of |W(t)|).
export function maxDensity(m: number, t: number): number {
  if (m < 0) return 0;
  const sd = Math.sqrt(t);
  return (2 * normPdf(m / sd)) / sd;
}

/// E[M(t)] = √(2t/π).
export const expectedMax = (t: number) => Math.sqrt((2 * t) / Math.PI);

/// Inverse-Gaussian first-passage density of a > 0 for W(t) + μt.
export function firstPassageDensity(tau: number, a: number, drift = 0): number {
  if (tau <= 0) return 0;
  return (a / Math.sqrt(2 * Math.PI * tau ** 3)) * Math.exp(-((a - drift * tau) ** 2) / (2 * tau));
}

/// Median of τ_a for driftless W: solves 2(1 − Φ(a/√t)) = ½.
export const firstPassageMedian = (a: number) => (a / normInv(0.75)) ** 2;

/// Continuous-monitoring probability with the BGK barrier shift, approximating the
/// discretely monitored P(max_k X(t_k) ≥ a) on a grid of spacing dt.
export function discreteMonitoringApprox(a: number, t: number, drift: number, dt: number): number {
  return maxTailProbability(a + BGK_BETA * Math.sqrt(dt), t, drift);
}

// #endregion

// #region First-passage calibration

/// Track of the τₐ range guess in log₁₀ time: 0.001 … 10 000.
export const FP_LOG_TIME_DOMAIN: readonly [number, number] = [-3, 4];

/// P(W(t) ≥ a): the share of paths that merely end above a (half the hitting probability).
export const terminalTailProbability = (a: number, t: number) => 1 - normCdf(a / Math.sqrt(t));

/// A time on the log track, with significant digits that suit 0.001 … 10 000.
export function formatPassageTime(t: number): string {
  return t >= 100 ? t.toFixed(0) : t >= 1 ? t.toFixed(2) : t.toPrecision(2);
}

/// p-quantile of τₐ for driftless motion: P(τₐ ≤ t) = 2(1 − Φ(a/√t)) gives t = (a / Φ⁻¹(1 − p/2))².
export function firstPassageQuantile(a: number, p: number): number {
  return (a / normInv(1 - p / 2)) ** 2;
}

/// One exact draw of τₐ: τₐ has the law of a² / Z² with Z ~ N(0, 1) (so it may exceed any horizon).
export function drawFirstPassageTime(a: number, z: number): number {
  return (a * a) / Math.max(z * z, 1e-12);
}

// #endregion
