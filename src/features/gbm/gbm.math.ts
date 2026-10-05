import { makeRng, nextNormal } from "../../lib/math/random";
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
