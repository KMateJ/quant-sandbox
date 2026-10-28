import { makeRng, nextNormal } from "../../lib/math/random";

/// Terminal values X_T = θT + W_T of `count` paths under P, with Radon–Nikodym weights dQ/dP = exp(−θX_T + ½θ²T)
/// that turn the drifted law into driftless Brownian motion (Girsanov).
export type GirsanovSample = { x: Float64Array; w: Float64Array; meanWeight: number; weightedMean: number; ess: number; essShare: number };

/// Effective sample size (Σw)² / Σw²: how many equally weighted draws the weighted sample is worth.
export function effectiveSampleSize(w: ArrayLike<number>): number {
  let s = 0;
  let s2 = 0;
  for (let i = 0; i < w.length; i++) {
    s += w[i];
    s2 += w[i] * w[i];
  }
  return s2 > 0 ? (s * s) / s2 : 0;
}

/// Draws the sample and its weights from a fixed seed.
export function girsanovSample(theta: number, horizon: number, count: number, seed: number): GirsanovSample {
  const rng = makeRng(seed);
  const x = new Float64Array(count);
  const w = new Float64Array(count);
  let sum = 0;
  let wx = 0;
  for (let i = 0; i < count; i++) {
    x[i] = theta * horizon + Math.sqrt(horizon) * nextNormal(rng);
    w[i] = Math.exp(-theta * x[i] + 0.5 * theta * theta * horizon);
    sum += w[i];
    wx += w[i] * x[i];
  }
  const ess = effectiveSampleSize(w);
  return { x, w, meanWeight: sum / count, weightedMean: wx / sum, ess, essShare: ess / count };
}

/// Weighted equal-width bin masses over `domain` (sum of w per bin), normalised by the total weight.
export function weightedCounts(x: ArrayLike<number>, w: ArrayLike<number> | null, domain: [number, number], bins: number): number[] {
  const out = new Array<number>(bins).fill(0);
  const width = (domain[1] - domain[0]) / bins;
  let total = 0;
  for (let i = 0; i < x.length; i++) total += w ? w[i] : 1;
  for (let i = 0; i < x.length; i++) {
    const b = Math.floor((x[i] - domain[0]) / width);
    if (b >= 0 && b < bins) out[b] += (w ? w[i] : 1) / total;
  }
  return out;
}

/// Display paths with drift θ as rows `{ t, p0, p1, … }` on `steps` steps, plus the same paths minus θt (the Q view).
export function driftedPaths(theta: number, horizon: number, steps: number, count: number, seed: number) {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const level = new Array<number>(count).fill(0);
  const rows: Record<string, number>[] = [{ t: 0, ...Object.fromEntries(level.map((_, i) => [`p${i}`, 0])) }];
  for (let s = 1; s <= steps; s++) {
    const row: Record<string, number> = { t: s * dt };
    for (let i = 0; i < count; i++) {
      level[i] += theta * dt + Math.sqrt(dt) * nextNormal(rng);
      row[`p${i}`] = level[i];
    }
    rows.push(row);
  }
  return rows;
}
