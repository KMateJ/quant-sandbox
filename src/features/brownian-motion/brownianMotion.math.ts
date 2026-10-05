import { makeRng, nextNormal } from "../../lib/math/random";
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
