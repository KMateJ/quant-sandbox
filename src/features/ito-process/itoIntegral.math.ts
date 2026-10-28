import { fineIncrements } from "./itoProcess.math";

/// Riemann sums of ∫₀ᵀ W dW on a grid of n steps: left-point (Itô), midpoint, right-point,
/// next to the two closed forms (W_T² − T)/2 (Itô) and W_T²/2 (Stratonovich).
export type RiemannRow = { n: number; x: number; left: number; mid: number; right: number; ito: number; strat: number };

/// Grid sizes of the sweep; each divides the fine grid and leaves at least two fine steps per interval.
/// Fine grid of the integral page; twice the largest n.
export const RIEMANN_FINE = 4096;
export const RIEMANN_NS = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

/// The three sums for each n in `ns`, all built from one seeded path of `fine` increments on [0, T].
export function riemannSums(horizon: number, seed: number, ns: number[] = RIEMANN_NS, fine = RIEMANN_FINE): RiemannRow[] {
  const dw = fineIncrements(horizon, fine, seed);
  const w = new Float64Array(fine + 1);
  for (let k = 0; k < fine; k++) w[k + 1] = w[k] + dw[k];
  const wT = w[fine];
  const ito = (wT * wT - horizon) / 2;
  const strat = (wT * wT) / 2;
  return ns.map((n) => {
    const per = fine / n;
    let left = 0;
    let mid = 0;
    let right = 0;
    for (let k = 0; k < n; k++) {
      const a = w[k * per];
      const b = w[(k + 1) * per];
      const step = b - a;
      left += a * step;
      mid += w[k * per + per / 2] * step;
      right += b * step;
    }
    return { n, x: Math.log2(n), left, mid, right, ito, strat };
  });
}

/// Average over `paths` seeded paths of (midpoint − left) and (right − left) at the finest n; they approach T/2 and T.
export function gapAverages(horizon: number, seed: number, paths: number, n = RIEMANN_NS[RIEMANN_NS.length - 1]) {
  let mid = 0;
  let right = 0;
  for (let p = 0; p < paths; p++) {
    const r = riemannSums(horizon, seed * 7919 + p + 1, [n])[0];
    mid += r.mid - r.left;
    right += r.right - r.left;
  }
  return { midGap: mid / paths, rightGap: right / paths };
}
