import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf, normPdf } from "../../lib/stats/distributions";

export type AbmGbmPair = {
  /// Step-major arrays `values[step * paths + path]`, both driven by the same normal draws.
  abm: Float64Array;
  gbm: Float64Array;
};

/// Arithmetic and geometric Brownian paths from S₀ driven by identical shocks Z, so only the model differs.
/// ABM adds a fixed amount per step: dS = μS₀ dt + σS₀ dW. GBM scales with the current level: dS = μS dt + σS dW,
/// stepped exactly in log space.
export function simulateAbmGbmPair(s0: number, mu: number, sigma: number, horizon: number, steps: number, paths: number, seed: number): AbmGbmPair {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const sq = Math.sqrt(dt);
  const abm = new Float64Array((steps + 1) * paths);
  const gbm = new Float64Array((steps + 1) * paths);
  abm.fill(s0, 0, paths);
  gbm.fill(s0, 0, paths);
  for (let s = 1; s <= steps; s++) {
    for (let p = 0; p < paths; p++) {
      const z = nextNormal(rng);
      const i = s * paths + p;
      abm[i] = abm[i - paths] + mu * s0 * dt + sigma * s0 * sq * z;
      gbm[i] = gbm[i - paths] * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * sq * z);
    }
  }
  return { abm, gbm };
}

/// Exact law of the ABM level at t: normal with mean S₀(1 + μt) and sd σS₀√t.
export function abmLaw(s0: number, mu: number, sigma: number, t: number) {
  const mean = s0 * (1 + mu * t);
  const sd = sigma * s0 * Math.sqrt(t);
  return { mean, sd, pdf: (x: number) => normPdf((x - mean) / sd) / sd, cdf: (x: number) => normCdf((x - mean) / sd) };
}

/// Exact law of the GBM level at t: log-normal, ln S_t ~ N(ln S₀ + (μ − ½σ²)t, σ²t); mean S₀e^{μt}.
export function gbmLaw(s0: number, mu: number, sigma: number, t: number) {
  const m = Math.log(s0) + (mu - 0.5 * sigma * sigma) * t;
  const s = sigma * Math.sqrt(t);
  const mean = s0 * Math.exp(mu * t);
  const sd = mean * Math.sqrt(Math.exp(sigma * sigma * t) - 1);
  return {
    mean,
    sd,
    pdf: (x: number) => (x > 0 ? normPdf((Math.log(x) - m) / s) / (x * s) : 0),
    cdf: (x: number) => (x > 0 ? normCdf((Math.log(x) - m) / s) : 0),
  };
}

/// (level before the step, change over the step) pairs from up to `limit` paths: the step size against the price level.
export function stepsByLevel(values: ArrayLike<number>, paths: number, steps: number, limit: number) {
  const out: { x: number; y: number }[] = [];
  const used = Math.min(paths, limit);
  for (let s = 1; s <= steps; s++) {
    for (let p = 0; p < used; p++) out.push({ x: values[(s - 1) * paths + p], y: values[s * paths + p] - values[(s - 1) * paths + p] });
  }
  return out;
}

/// Index of the path whose final value is the median one: a typical path to highlight instead of an extreme one.
export function medianPath(values: ArrayLike<number>, paths: number, steps: number): number {
  const order = Array.from({ length: paths }, (_, p) => p).sort((a, b) => values[steps * paths + a] - values[steps * paths + b]);
  return order[Math.floor(paths / 2)];
}
