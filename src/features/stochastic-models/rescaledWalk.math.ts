import { makeRng } from "../../lib/math/random";
import { normPdf } from "../../lib/stats/distributions";
import type {
  DensityPoint,
  RescaledPathData,
  TerminalSummary,
} from "./rescaledWalk.types";

const STREAM_STRIDE = 1_000_003;
const MAX_DRAW_POINTS = 1600;

type ChartRow = Record<string, number>;

/// Independent ±1 increment stream for one (seed, path) pair. Re-deriving from the
/// same seed means the first n increments are identical for every n, so refinements
/// share their underlying randomness.
function streamRng(seed: number, pathIndex: number) {
  return makeRng((seed * STREAM_STRIDE + pathIndex) >>> 0);
}

/// Rescaled walk W⁽ⁿ⁾(t) = S₍⌊nt⌋₎ / √n on t ∈ [0, 1] for a few overlaid paths.
/// Long paths are subsampled for rendering while keeping the ±1/√n step scale.
export function rescaledPaths(seed: number, n: number, pathCount: number): RescaledPathData {
  const sqrtN = Math.sqrt(n);
  const stride = Math.max(1, Math.ceil(n / MAX_DRAW_POINTS));
  const pathKeys = Array.from({ length: pathCount }, (_, i) => `p${i}`);
  const levels = new Array<number>(pathCount).fill(0);
  const rngs = pathKeys.map((_, path) => streamRng(seed, path));

  const first: ChartRow = { t: 0 };
  for (const key of pathKeys) first[key] = 0;
  const rows: ChartRow[] = [first];

  for (let k = 1; k <= n; k++) {
    for (let path = 0; path < pathCount; path++) {
      levels[path] += rngs[path]() < 0.5 ? 1 : -1;
    }
    if (k % stride === 0 || k === n) {
      const row: ChartRow = { t: k / n };
      for (let path = 0; path < pathCount; path++) row[pathKeys[path]] = levels[path] / sqrtN;
      rows.push(row);
    }
  }
  return { rows, pathKeys };
}

/// Terminal values W⁽ⁿ⁾(1) = Sₙ / √n across many independent paths. The PRNG is
/// inlined (mulberry32) and thresholded on the raw 32-bit word so the large-n
/// recompute stays responsive; the stream matches `streamRng` for consistency.
export function rescaledTerminalSamples(seed: number, n: number, sampleCount: number): Float64Array {
  const out = new Float64Array(sampleCount);
  const sqrtN = Math.sqrt(n);
  for (let path = 0; path < sampleCount; path++) {
    let a = (seed * STREAM_STRIDE + path) >>> 0;
    let sum = 0;
    for (let k = 0; k < n; k++) {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      // value / 2³² < 0.5  ⟺  the unsigned word < 2³¹ (top bit clear).
      sum += ((t ^ (t >>> 14)) >>> 0) < 0x80000000 ? 1 : -1;
    }
    out[path] = sum / sqrtN;
  }
  return out;
}

export function terminalSummary(values: Float64Array): TerminalSummary {
  let mean = 0;
  for (let i = 0; i < values.length; i++) mean += values[i];
  mean /= values.length;
  let squared = 0;
  for (let i = 0; i < values.length; i++) squared += (values[i] - mean) ** 2;
  return { mean, variance: values.length > 1 ? squared / (values.length - 1) : 0 };
}

/// Empirical density of the terminal values on a fixed grid, paired with the
/// standard-normal density W⁽ⁿ⁾(1) converges to under Donsker's theorem.
export function densityComparison(
  values: Float64Array,
  bins = 41,
  range = 4
): DensityPoint[] {
  const width = (2 * range) / bins;
  const counts = new Array<number>(bins).fill(0);
  for (let i = 0; i < values.length; i++) {
    const index = Math.floor((values[i] + range) / width);
    if (index >= 0 && index < bins) counts[index]++;
  }
  return counts.map((count, index) => {
    const x = -range + (index + 0.5) * width;
    return { x, empirical: count / (values.length * width), normal: normPdf(x) };
  });
}
