import { makeRng, nextNormal } from "../../lib/math/random";

/// Geometric Brownian motion dS = μS dt + σS dW, simulated on one fine Brownian path and compared with its
/// Euler–Maruyama approximations on coarser grids built from the same path.
export const EULER_SETUP = {
  S0: 100,
  mu: 0.08,
  sigma: 0.4,
  T: 1,
  /// Finest grid; every coarser grid's increments are sums of these.
  fine: 256,
  steps: [4, 16, 64, 256] as const,
  /// Paths averaged for the strong-error panel.
  errorPaths: 500,
  errorSeed: 20_250,
};

export type EulerSteps = (typeof EULER_SETUP.steps)[number];

/// Brownian increments on the fine grid, from a seed.
export function fineIncrements(seed: number, fine = EULER_SETUP.fine, T = EULER_SETUP.T): number[] {
  const rng = makeRng(seed);
  const sd = Math.sqrt(T / fine);
  return Array.from({ length: fine }, () => sd * nextNormal(rng));
}

/// The exact solution S_t = S₀ exp((μ − σ²/2)t + σW_t) at every fine grid time.
export function exactPath(dW: number[], s = EULER_SETUP): number[] {
  const dt = s.T / dW.length;
  const out = [s.S0];
  let w = 0;
  dW.forEach((d, k) => {
    w += d;
    out.push(s.S0 * Math.exp((s.mu - 0.5 * s.sigma ** 2) * (k + 1) * dt + s.sigma * w));
  });
  return out;
}

/// Euler–Maruyama on `n` steps, S_{k+1} = S_k (1 + μΔt + σΔW_k), with each ΔW_k the sum of the fine increments
/// it spans, so every grid follows the same Brownian path.
export function eulerPath(dW: number[], n: number, s = EULER_SETUP): number[] {
  const block = dW.length / n;
  const dt = s.T / n;
  const out = [s.S0];
  for (let k = 0; k < n; k++) {
    let d = 0;
    for (let j = k * block; j < (k + 1) * block; j++) d += dW[j];
    out.push(out[k] * (1 + s.mu * dt + s.sigma * d));
  }
  return out;
}

/// Mean absolute error at T (the strong error) for every grid size, over `paths` seeded Brownian paths.
export function strongErrors(paths = EULER_SETUP.errorPaths, seed = EULER_SETUP.errorSeed, s = EULER_SETUP) {
  const sums = s.steps.map(() => 0);
  for (let p = 0; p < paths; p++) {
    const dW = fineIncrements(seed + p, s.fine, s.T);
    const exact = exactPath(dW, s)[s.fine];
    s.steps.forEach((n, i) => {
      sums[i] += Math.abs(exact - eulerPath(dW, n, s)[n]);
    });
  }
  return s.steps.map((n, i) => ({ n, dt: s.T / n, error: sums[i] / paths }));
}

/// Slope of log(error) against log(Δt) between the coarsest and finest grid: about ½ for Euler's strong error.
export function observedOrder(errors: { dt: number; error: number }[]): number {
  const a = errors[0];
  const b = errors[errors.length - 1];
  return Math.log(a.error / b.error) / Math.log(a.dt / b.dt);
}

/// One Euler step against the exact solution over Δt for a given standard normal draw Z.
export function oneStep(dt: number, z: number, s = EULER_SETUP) {
  const dW = Math.sqrt(dt) * z;
  const euler = s.S0 * (1 + s.mu * dt + s.sigma * dW);
  const exact = s.S0 * Math.exp((s.mu - 0.5 * s.sigma ** 2) * dt + s.sigma * dW);
  return { dW, euler, exact, error: exact - euler };
}
