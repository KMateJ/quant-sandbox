import { makeRng, nextNormal, nextPoisson } from "../../lib/math/random";

export type JumpParams = { mu: number; sigma: number; lambda: number; jumpMean: number; jumpSd: number };

/// Mean relative jump k = E[J − 1] = e^{m + δ²/2} − 1 for ln J ~ N(m, δ²); the drift is compensated by λk so E[S_t] = S₀e^{μt}.
export const mertonK = (m: number, delta: number) => Math.exp(m + 0.5 * delta * delta) - 1;

/// Mean, variance and excess kurtosis of one Merton log-return over dt (Poisson-mixed normal: κ₄ = λdt·E[J⁴]).
export function mertonReturnLaw(p: JumpParams, dt: number) {
  const { mu, sigma, lambda, jumpMean: m, jumpSd: d } = p;
  const mean = (mu - lambda * mertonK(m, d) - 0.5 * sigma * sigma) * dt + lambda * dt * m;
  const variance = sigma * sigma * dt + lambda * dt * (m * m + d * d);
  const k4 = lambda * dt * (m ** 4 + 6 * m * m * d * d + 3 * d ** 4);
  return { mean, variance, excessKurtosis: k4 / (variance * variance) };
}

/// Merton jump-diffusion paths. `levels` is step-major prices (`[step * paths + path]`), `returns` the per-step
/// log-returns (`[(step − 1) * paths + path]`) and `jumps` the jump count of each step. Seeded.
export function simulateMerton(s0: number, p: JumpParams, horizon: number, steps: number, paths: number, seed: number) {
  const rng = makeRng(seed);
  const dt = horizon / steps;
  const drift = (p.mu - p.lambda * mertonK(p.jumpMean, p.jumpSd) - 0.5 * p.sigma * p.sigma) * dt;
  const sd = p.sigma * Math.sqrt(dt);
  const levels = new Float64Array((steps + 1) * paths).fill(s0, 0, paths);
  const returns = new Float64Array(steps * paths);
  const jumps = new Uint8Array(steps * paths);
  for (let s = 0; s < steps; s++) {
    for (let q = 0; q < paths; q++) {
      const n = nextPoisson(rng, p.lambda * dt);
      const jump = n === 0 ? 0 : n * p.jumpMean + Math.sqrt(n) * p.jumpSd * nextNormal(rng);
      const r = drift + sd * nextNormal(rng) + jump;
      returns[s * paths + q] = r;
      jumps[s * paths + q] = Math.min(n, 255);
      levels[(s + 1) * paths + q] = levels[s * paths + q] * Math.exp(r);
    }
  }
  return { levels, returns, jumps };
}
