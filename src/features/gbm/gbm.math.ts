import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf, normPdf } from "../../lib/stats/distributions";
import type { GbmPoint, GbmResult } from "./gbm.types";

/// Simulate `numPaths` geometric Brownian paths S·exp((μ−½σ²)dt + σ√dt·Z) from S₀.
/// Each row also carries the theoretical mean E[Sₜ] = S₀·e^{μt} under key `mean`. Seeded for reproducibility.
export function simulateGbm(
  s0: number,
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): GbmResult {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sqrtDt = Math.sqrt(dt);
  const growth = (drift - 0.5 * vol * vol) * dt;
  const keys = Array.from({ length: numPaths }, (_, i) => `p${i}`);
  const level = new Array<number>(numPaths).fill(s0);

  const data: GbmPoint[] = [];
  const first: GbmPoint = { t: 0, mean: s0 };
  for (const k of keys) first[k] = s0;
  data.push(first);

  for (let s = 1; s <= steps; s++) {
    const t = s * dt;
    const row: GbmPoint = { t, mean: s0 * Math.exp(drift * t) };
    for (let p = 0; p < numPaths; p++) {
      level[p] *= Math.exp(growth + vol * sqrtDt * nextNormal(rng));
      row[keys[p]] = level[p];
    }
    data.push(row);
  }
  return { keys, data };
}

/// Many GBM paths from S₀ in one step-major array (`values[step * numPaths + path]`), stepped exactly in log space.
/// Seeded, so the same seed reproduces the same ensemble.
export function simulateGbmCloud(
  s0: number,
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): Float64Array {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const growth = (drift - 0.5 * vol * vol) * dt;
  const sd = vol * Math.sqrt(dt);
  const values = new Float64Array((steps + 1) * numPaths).fill(s0, 0, numPaths);
  for (let s = 1; s <= steps; s++) {
    const row = s * numPaths;
    for (let p = 0; p < numPaths; p++) values[row + p] = values[row - numPaths + p] * Math.exp(growth + sd * nextNormal(rng));
  }
  return values;
}

/// Exact law of S_T: log-normal, ln S_T ~ N(ln S₀ + (μ − ½σ²)T, σ²T).
export function gbmTerminalLaw(s0: number, drift: number, vol: number, horizon: number) {
  const m = Math.log(s0) + (drift - 0.5 * vol * vol) * horizon;
  const sd = vol * Math.sqrt(horizon);
  return {
    mean: s0 * Math.exp(drift * horizon),
    median: Math.exp(m),
    m,
    sd,
    pdf: (x: number) => (x > 0 ? normPdf((Math.log(x) - m) / sd) / (sd * x) : 0),
    cdf: (x: number) => (x > 0 ? normCdf((Math.log(x) - m) / sd) : 0),
  };
}

/// Mean, median and mode of the log-normal S_T. Only the mean is free of σ; the median and mode fall with σ
/// (volatility drag), and Φ(½σ√T) of the paths end below the mean.
export function gbmCentres(s0: number, drift: number, vol: number, horizon: number) {
  const mean = s0 * Math.exp(drift * horizon);
  const median = s0 * Math.exp((drift - 0.5 * vol * vol) * horizon);
  const mode = s0 * Math.exp((drift - 1.5 * vol * vol) * horizon);
  return { mean, median, mode, gap: mean - median, shareBelowMean: normCdf(0.5 * vol * Math.sqrt(horizon)) };
}

/// Sample mean, median and share below `level` of the simulated terminal values.
export function sampleCentres(terminal: ArrayLike<number>, level: number) {
  const sorted = Float64Array.from(terminal).sort();
  const n = sorted.length;
  let sum = 0;
  let below = 0;
  for (let i = 0; i < n; i++) {
    sum += sorted[i];
    if (sorted[i] < level) below++;
  }
  const median = n === 0 ? NaN : n % 2 ? sorted[(n - 1) / 2] : 0.5 * (sorted[n / 2 - 1] + sorted[n / 2]);
  return { mean: n ? sum / n : NaN, median, shareBelow: n ? below / n : NaN };
}
