import { drawRound, lambdaStar, planGhosts, runAuctions, totalProfit } from "../kyle/kyle.math";
import { DEFAULT_KYLE_PARAMS, type AuctionRow, type KyleDraw } from "../kyle/kyle.types";

export type KyleOneShot = { beta: number; lambda: number; expectedProfit: number };

/// One-auction Kyle equilibrium: β = σᵤ/σᵥ, λ = σᵥ/(2σᵤ), expected insider profit σᵤσᵥ/2.
export const kyleOneShot = ({ sigmaV, sigmaU }: { sigmaV: number; sigmaU: number }): KyleOneShot => ({
  beta: sigmaU / sigmaV,
  lambda: sigmaV / (2 * sigmaU),
  expectedProfit: (sigmaU * sigmaV) / 2,
});

/// Figure defaults: σᵥ = 4, noise 1,000 shares per auction, 10 auctions, V − p₀ = +4, fixed noise seed.
export const KYLE_FIG = { params: DEFAULT_KYLE_PARAMS, gap: 4, seed: 2, lot: 50, range: 3000 } as const;

/// Default plan: the whole position in the first auction (≈ gap/(2λ)), nothing afterwards.
export const KYLE_FIG_ORDERS: readonly number[] = [1900, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/// The figure's fixed draw: V = p₀ + gap with the seeded noise orders.
export const kyleFigDraw = (): KyleDraw => {
  const { params, gap, seed } = KYLE_FIG;
  return { v: params.p0 + gap, u: drawRound(params, seed).u };
};

export type KyleScheduleResult = {
  lambda: number;
  rows: AuctionRow[];
  ghosts: number[];
  yours: number;
  optimal: number;
  /// Share of V − p₀ that the last price has closed.
  gapClosed: number;
  path: { n: number; p: number; opt: number }[];
};

/// Plays a planned schedule and the optimal insider on the same noise, with ghosts from `planGhosts`.
export function kyleSchedule(orders: readonly number[], draw: KyleDraw = kyleFigDraw()): KyleScheduleResult {
  const p = KYLE_FIG.params;
  const lambda = lambdaStar(p);
  const rows = runAuctions(orders, draw, p, lambda);
  const best = runAuctions("optimal", draw, p, lambda);
  const path = [{ n: 0, p: p.p0, opt: p.p0 }, ...rows.map((r, i) => ({ n: r.n, p: r.pAfter, opt: best[i].pAfter }))];
  return {
    lambda,
    rows,
    ghosts: planGhosts(orders, draw.v, p, lambda),
    yours: totalProfit(rows),
    optimal: totalProfit(best),
    gapClosed: (rows[rows.length - 1].pAfter - p.p0) / (draw.v - p.p0),
    path,
  };
}
