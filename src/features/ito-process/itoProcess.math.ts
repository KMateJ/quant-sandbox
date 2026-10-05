import { makeRng, nextNormal } from "../../lib/math/random";
import type { ItoPoint, ItoResult } from "./itoProcess.types";

/// Simulate ln(S) for a GBM asset, illustrating Itô's lemma: d ln S = (μ − ½σ²)dt + σ dW.
/// Each row carries the corrected-drift line ln S₀+(μ−½σ²)t, the naive line ln S₀+μt, and the paths.
export function simulateLogGbm(
  s0: number,
  drift: number,
  vol: number,
  horizon: number,
  steps: number,
  numPaths: number,
  seed: number
): ItoResult {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sqrtDt = Math.sqrt(dt);
  const logS0 = Math.log(s0);
  const correctedDrift = drift - 0.5 * vol * vol;
  const keys = Array.from({ length: numPaths }, (_, i) => `p${i}`);
  const level = new Array<number>(numPaths).fill(logS0);

  const data: ItoPoint[] = [];
  const first: ItoPoint = { t: 0, correct: logS0, naive: logS0 };
  for (const k of keys) first[k] = logS0;
  data.push(first);

  for (let s = 1; s <= steps; s++) {
    const t = s * dt;
    const row: ItoPoint = {
      t,
      correct: logS0 + correctedDrift * t,
      naive: logS0 + drift * t,
    };
    for (let p = 0; p < numPaths; p++) {
      level[p] += correctedDrift * dt + vol * sqrtDt * nextNormal(rng);
      row[keys[p]] = level[p];
    }
    data.push(row);
  }
  return { keys, data };
}
