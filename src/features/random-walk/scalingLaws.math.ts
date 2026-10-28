import { SCALING_STEP_GRID, type ScalingPoint, type ScalingResult } from "./scalingLaws.types";

const STREAM_STRIDE = 1_000_003;

/// Standard deviation of Sₙ for a batch of symmetric walks sharing one seed.
/// Each walk reuses the same inlined mulberry32 stream as the rescaled-walk lab,
/// so the first k increments are stable as the grid is extended, and records the
/// running sum at every grid checkpoint in a single pass.
export function scalingData(seed: number, paths: number): ScalingResult {
  const grid = SCALING_STEP_GRID;
  const maxN = grid[grid.length - 1];
  const sums = grid.map(() => new Float64Array(paths));

  for (let path = 0; path < paths; path++) {
    let a = (seed * STREAM_STRIDE + path) >>> 0;
    let sum = 0;
    let gi = 0;
    for (let k = 1; k <= maxN; k++) {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      sum += ((t ^ (t >>> 14)) >>> 0) < 0x80000000 ? 1 : -1;
      if (k === grid[gi]) {
        sums[gi][path] = sum;
        gi++;
      }
    }
  }

  const points: ScalingPoint[] = grid.map((n, i) => ({ n, empirical: standardDeviation(sums[i]) }));
  return { points, slope: logLogSlope(points) };
}

function standardDeviation(values: Float64Array): number {
  if (values.length < 2) return 0;
  let mean = 0;
  for (let i = 0; i < values.length; i++) mean += values[i];
  mean /= values.length;
  let squared = 0;
  for (let i = 0; i < values.length; i++) squared += (values[i] - mean) ** 2;
  return Math.sqrt(squared / (values.length - 1));
}

/// Least-squares slope of log(empirical) on log(n): the measured scaling exponent.
export function logLogSlope(points: ScalingPoint[]): number {
  const usable = points.filter((p) => p.empirical > 0);
  if (usable.length < 2) return 0;
  const xs = usable.map((p) => Math.log(p.n));
  const ys = usable.map((p) => Math.log(p.empirical));
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

/// The exact √n law, which the symmetric walk's spread tracks.
export function referenceCurve(points: ScalingPoint[]): number[] {
  return points.map((p) => Math.sqrt(p.n));
}

/// Points (n, √n) for n = 0…steps — the upper half of the ±√n envelope.
export function sqrtEnvelope(steps: number): { x: number; y: number }[] {
  return Array.from({ length: steps + 1 }, (_, n) => ({ x: n, y: Math.sqrt(n) }));
}

/// Sample standard deviation across paths at every step of a step-major cloud
/// (`positions[step * pathCount + path]`): the measured counterpart of √n.
export function stdByStep(positions: ArrayLike<number>, pathCount: number, steps: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let n = 0; n <= steps; n++) {
    const base = n * pathCount;
    let mean = 0;
    for (let p = 0; p < pathCount; p++) mean += positions[base + p];
    mean /= pathCount;
    let squared = 0;
    for (let p = 0; p < pathCount; p++) squared += (positions[base + p] - mean) ** 2;
    out.push({ x: n, y: pathCount > 1 ? Math.sqrt(squared / (pathCount - 1)) : 0 });
  }
  return out;
}

/// Largest relative gap |sd − √n| / √n over 1…steps — shrinks toward 0 as paths are added.
export function maxRelativeGap(std: { x: number; y: number }[]): number {
  let worst = 0;
  for (const { x, y } of std) {
    if (x < 1) continue;
    const rel = Math.abs(y - Math.sqrt(x)) / Math.sqrt(x);
    if (rel > worst) worst = rel;
  }
  return worst;
}

/// Log-scale slider mapping for path counts, so the noisy few-path range gets as
/// much track as the converged one.
export const pathsToSlider = (paths: number) => Math.log10(paths);
export const sliderToPaths = (value: number) => Math.round(10 ** value);

/// Growth of the typical spread when the step count is multiplied by k: sd ∝ √n ⇒ ×√k.
export function spreadFactor(k: number): number {
  return Math.sqrt(k);
}
