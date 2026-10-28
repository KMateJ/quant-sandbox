import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf } from "../../lib/stats/distributions";

/// Stationary standard deviation σ/√(2κ) of dX = κ(θ − X)dt + σ dW.
export const ouStationarySd = (kappa: number, sigma: number) => sigma / Math.sqrt(2 * kappa);

/// Half-life ln 2 / κ: the time for the expected gap to θ to halve.
export const ouHalfLife = (kappa: number) => Math.LN2 / kappa;

/// E[X_t] = θ + (x₀ − θ)e^{−κt}.
export const ouMeanAt = (x0: number, theta: number, kappa: number, t: number) => theta + (x0 - theta) * Math.exp(-kappa * t);

/// Standard deviation of X_t, σ√((1 − e^{−2κt})/(2κ)).
export const ouSdAt = (kappa: number, sigma: number, t: number) => sigma * Math.sqrt((1 - Math.exp(-2 * kappa * t)) / (2 * kappa));

/// Exact-transition OU paths (no discretisation bias) in one step-major array (`values[step * paths + path]`). Seeded.
export function simulateOu(x0: number, theta: number, kappa: number, sigma: number, horizon: number, steps: number, paths: number, seed: number) {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const decay = Math.exp(-kappa * dt);
  const sd = ouSdAt(kappa, sigma, dt);
  const values = new Float64Array((steps + 1) * paths).fill(x0, 0, paths);
  for (let s = 1; s <= steps; s++) {
    const row = s * paths;
    for (let p = 0; p < paths; p++) values[row + p] = theta + (values[row - paths + p] - theta) * decay + sd * nextNormal(rng);
  }
  return values;
}

/// Share of paths that ever dip below zero, share below zero at the end, and the exact normal probability P(X_T < 0).
export function negativeShares(values: ArrayLike<number>, paths: number, stepCount: number, x0: number, theta: number, kappa: number, sigma: number, horizon: number) {
  let ever = 0;
  let end = 0;
  for (let p = 0; p < paths; p++) {
    let neg = false;
    for (let s = 0; s < stepCount; s++) {
      if (values[s * paths + p] < 0) {
        neg = true;
        break;
      }
    }
    if (neg) ever++;
    if (values[(stepCount - 1) * paths + p] < 0) end++;
  }
  const exact = normCdf((0 - ouMeanAt(x0, theta, kappa, horizon)) / ouSdAt(kappa, sigma, horizon));
  return { ever: ever / paths, end: end / paths, exact };
}
