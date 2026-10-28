import { makeRng } from "../math/random";
import { normPdf } from "../stats/distributions";
import { RESCALED_FINE_STEPS } from "./rescaledWalk.types";
import type {
  DensityPoint,
  RescaledPathData,
  TerminalSummary,
} from "./rescaledWalk.types";

const STREAM_STRIDE = 1_000_003;

type ChartRow = Record<string, number>;

/// Independent ±1 increment stream for one (seed, path) pair. Re-deriving from the
/// same seed means the first n increments are identical for every n, so refinements
/// share their underlying randomness.
function streamRng(seed: number, pathIndex: number) {
  return makeRng((seed * STREAM_STRIDE + pathIndex) >>> 0);
}

/// One finest-level rescaled walk per path: S_k / √N for k = 0…N with N = RESCALED_FINE_STEPS.
export function fineWalks(seed: number, pathCount: number): Float64Array[] {
  const scale = 1 / Math.sqrt(RESCALED_FINE_STEPS);
  return Array.from({ length: pathCount }, (_, path) => {
    const rng = streamRng(seed, path);
    const walk = new Float64Array(RESCALED_FINE_STEPS + 1);
    for (let k = 1; k <= RESCALED_FINE_STEPS; k++) walk[k] = walk[k - 1] + (rng() < 0.5 ? scale : -scale);
    return walk;
  });
}

/// View of the fine walks on n equal steps of [0, 1] (n a power of two dividing N).
/// Every level samples the same paths, so W(0) = 0 and W(1) never move and each
/// doubling keeps the existing points while inserting a new one between each pair.
export function rescaledPaths(walks: Float64Array[], n: number): RescaledPathData {
  const stride = RESCALED_FINE_STEPS / n;
  const pathKeys = walks.map((_, i) => `p${i}`);
  const rows: ChartRow[] = [];
  for (let k = 0; k <= n; k++) {
    const row: ChartRow = { t: k / n };
    walks.forEach((walk, path) => (row[pathKeys[path]] = walk[k * stride]));
    rows.push(row);
  }
  return { rows, pathKeys };
}

/// Symmetric y extent of the fine walks, so the axes stay put across refinement levels.
export function walksExtent(walks: Float64Array[]): [number, number] {
  let max = 1;
  for (const walk of walks) for (let k = 0; k < walk.length; k++) max = Math.max(max, Math.abs(walk[k]));
  const padded = Math.ceil(max * 1.1 * 4) / 4;
  return [-padded, padded];
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
