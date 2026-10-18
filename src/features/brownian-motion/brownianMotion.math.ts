import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf, normPdf } from "../../lib/stats/distributions";
import type { BrownianPoint, BrownianResult } from "./brownianMotion.types";

/// Simulate `numPaths` arithmetic Brownian paths dX = drift·dt + vol·√dt·Z from X₀ = 0.
/// Uses a seeded PRNG so the same seed reproduces the same paths.
export function simulateBrownian(
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): BrownianResult {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sqrtDt = Math.sqrt(dt);
  const keys = Array.from({ length: numPaths }, (_, i) => `p${i}`);
  const level = new Array<number>(numPaths).fill(0);

  const data: BrownianPoint[] = [];
  const first: BrownianPoint = { t: 0 };
  for (const k of keys) first[k] = 0;
  data.push(first);

  for (let s = 1; s <= steps; s++) {
    const row: BrownianPoint = { t: s * dt };
    for (let p = 0; p < numPaths; p++) {
      level[p] += drift * dt + vol * sqrtDt * nextNormal(rng);
      row[keys[p]] = level[p];
    }
    data.push(row);
  }
  return { keys, data };
}

/// Many arithmetic Brownian paths from X₀ = 0 in one step-major array (`values[step * numPaths + path]`),
/// for a path cloud. Seeded, so the same seed reproduces the same ensemble.
export function simulateBrownianCloud(
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): Float64Array {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sd = vol * Math.sqrt(dt);
  const values = new Float64Array((steps + 1) * numPaths);
  for (let s = 1; s <= steps; s++) {
    const row = s * numPaths;
    for (let p = 0; p < numPaths; p++) values[row + p] = values[row - numPaths + p] + drift * dt + sd * nextNormal(rng);
  }
  return values;
}

/// Exact law of X_T = μT + σW_T: normal with mean μT and standard deviation σ√T.
export function brownianTerminalLaw(drift: number, vol: number, horizon: number) {
  const mean = drift * horizon;
  const sd = vol * Math.sqrt(horizon);
  return {
    mean,
    sd,
    pdf: (x: number) => normPdf((x - mean) / sd) / sd,
    cdf: (x: number) => normCdf((x - mean) / sd),
  };
}

/// First time each path touches the barrier `b` (up-crossing for b > 0, down-crossing for b < 0), on the grid
/// `dt`; NaN for paths that never touch it by the end. Values are step-major (`values[step * pathCount + path]`),
/// starting at 0, so the barrier must be non-zero.
export function firstPassageTimes(values: ArrayLike<number>, pathCount: number, stepCount: number, dt: number, b: number): Float64Array {
  const out = new Float64Array(pathCount).fill(NaN);
  if (b === 0) return out.fill(0);
  for (let p = 0; p < pathCount; p++) {
    for (let s = 1; s < stepCount; s++) {
      const v = values[s * pathCount + p];
      if (b > 0 ? v >= b : v <= b) { out[p] = s * dt; break; }
    }
  }
  return out;
}

/// Probability that driftless Brownian motion σW started at 0 touches the level b by time T (reflection principle):
/// P(τ_b ≤ T) = 2·P(σW_T ≥ |b|) = 2(1 − Φ(|b| / (σ√T))).
export function hitProbability(b: number, vol: number, horizon: number): number {
  if (b === 0) return 1;
  return 2 * (1 - normCdf(Math.abs(b) / (vol * Math.sqrt(horizon))));
}

/// Law of the first-passage time τ_b of driftless σW to the level b (Lévy distribution):
/// density |b|/(σ√(2π t³))·exp(−b²/(2σ²t)) and cdf 2(1 − Φ(|b|/(σ√t))), for t > 0.
export function firstPassageLaw(b: number, vol: number) {
  const a = Math.abs(b) / vol;
  return {
    pdf: (t: number) => (t > 0 ? (a / Math.sqrt(2 * Math.PI * t ** 3)) * Math.exp(-(a * a) / (2 * t)) : 0),
    cdf: (t: number) => (t > 0 ? 2 * (1 - normCdf(a / Math.sqrt(t))) : 0),
  };
}

/// Share of finite entries (paths that hit) and the median of those entries.
export function hitSummary(times: ArrayLike<number>) {
  const hit = Array.from(times).filter(Number.isFinite).sort((x, y) => x - y);
  const share = times.length ? hit.length / times.length : NaN;
  const median = hit.length ? (hit.length % 2 ? hit[(hit.length - 1) / 2] : (hit[hit.length / 2 - 1] + hit[hit.length / 2]) / 2) : NaN;
  return { share, median, hit };
}
