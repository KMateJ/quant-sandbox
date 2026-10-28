import { EULER_SETUP, eulerPath, exactPath, fineIncrements } from "../guide/guide.interactive.eulerConvergence.math";

/// Grid sizes (steps over [0, T]) offered by the Euler–Maruyama page; each divides the fine grid.
export const EULER_GRIDS = [4, 8, 16, 32, 64, 128, 256] as const;
const ERROR_PATHS = 600;
const ERROR_SEED = 4_100;

const setup = (mu: number, sigma: number) => ({ ...EULER_SETUP, mu, sigma });

/// Exact GBM and its n-step Euler path driven by the same Brownian increments (seeded), both on the fine time grid
/// (the Euler path is joined linearly between its knots).
export function eulerComparison(seed: number, n: number, mu: number, sigma: number) {
  const s = setup(mu, sigma);
  const dW = fineIncrements(seed, s.fine, s.T);
  const exact = exactPath(dW, s);
  const knots = eulerPath(dW, n, s);
  const block = s.fine / n;
  const rows = exact.map((ex, i) => {
    const k = Math.min(Math.floor(i / block), n - 1);
    const f = (i - k * block) / block;
    return { t: (i * s.T) / s.fine, exact: ex, euler: knots[k] + f * (knots[k + 1] - knots[k]) };
  });
  return { rows, terminalError: Math.abs(exact[s.fine] - knots[n]) };
}

/// Strong error E|S_T − S_T^Euler| (Monte Carlo over shared Brownian paths) and weak error |E S_T − E S_T^Euler| of the
/// mean (exact: E S_T^Euler = S₀(1 + μΔt)^n) for every grid in `EULER_GRIDS`.
export function errorCurves(mu: number, sigma: number, paths = ERROR_PATHS, seed = ERROR_SEED) {
  const s = setup(mu, sigma);
  const sums = EULER_GRIDS.map(() => 0);
  for (let p = 0; p < paths; p++) {
    const dW = fineIncrements(seed + p, s.fine, s.T);
    const exact = exactPath(dW, s)[s.fine];
    EULER_GRIDS.forEach((n, i) => {
      sums[i] += Math.abs(exact - eulerPath(dW, n, s)[n]);
    });
  }
  return EULER_GRIDS.map((n, i) => {
    const dt = s.T / n;
    return { n, dt, strong: sums[i] / paths, weak: Math.abs(s.S0 * Math.exp(mu * s.T) - s.S0 * (1 + mu * dt) ** n) };
  });
}

/// Least-squares slope of log(value) against log(Δt): about ½ for the strong error, about 1 for the weak error.
export function loglogSlope(points: { dt: number; value: number }[]): number {
  const xs = points.map((p) => Math.log(p.dt));
  const ys = points.map((p) => Math.log(p.value));
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - mx) * (ys[i] - my);
    den += (x - mx) ** 2;
  });
  return num / den;
}
