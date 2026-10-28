import { makeRng, nextNormal } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import type { AuctionRow, KyleDraw, KyleOrders, KyleParams } from "./kyle.types";

/// Value coefficient with j auctions left: optimal insider profit is c_j·gap²/λ (plus noise terms).
export const cCoef = (j: number): number => j / (2 * (j + 1));

const sumC = (upTo: number): number => {
  let sum = 0;
  for (let j = 1; j <= upTo; j++) sum += cCoef(j);
  return sum;
};

/// Constant λ at which the maker breaks even against the optimal insider ($ per share).
export const lambdaStar = (p: KyleParams): number =>
  (p.sigmaV / p.s) * Math.sqrt(cCoef(p.n) / (p.n - sumC(p.n - 1)));

/// Optimal insider order with `left` auctions remaining (this one included): closes 1/(left + 1) of the gap.
export const optimalOrder = (v: number, price: number, lambda: number, left: number): number =>
  (v - price) / (lambda * (left + 1));

// mulberry32's first output is correlated across nearby seeds; discard it.
const warmRng = (seed: number) => {
  const rng = makeRng(seed);
  rng();
  return rng;
};

/// Seeded value and noise orders; V is resampled until |V − p₀| ≥ `minGap`. Noise is independent of V's stream.
export function drawRound(p: KyleParams, seed: number, minGap = 0): KyleDraw {
  const vRng = warmRng(subSeed(seed, 1));
  let v = p.p0 + p.sigmaV * nextNormal(vRng);
  for (let k = 0; k < 1000 && Math.abs(v - p.p0) < minGap; k++) v = p.p0 + p.sigmaV * nextNormal(vRng);
  const uRng = warmRng(subSeed(seed, 2));
  return { v, u: Array.from({ length: p.n }, () => p.s * nextNormal(uRng)) };
}

/// Plays N auctions; profit per auction is (V − pₙ)·xₙ.
export function runAuctions(orders: KyleOrders, draw: KyleDraw, p: KyleParams, lambda: number): AuctionRow[] {
  const rows: AuctionRow[] = [];
  let price = p.p0;
  for (let i = 0; i < p.n; i++) {
    const planned = orders === "optimal" ? null : (orders[i] ?? null);
    const x = planned ?? optimalOrder(draw.v, price, lambda, p.n - i);
    const u = draw.u[i];
    const flow = x + u;
    const pAfter = price + lambda * flow;
    rows.push({ n: i + 1, x, u, flow, pBefore: price, pAfter, profit: (draw.v - pAfter) * x });
    price = pAfter;
  }
  return rows;
}

/// Total of a row field.
export const totalProfit = (rows: readonly AuctionRow[]): number => rows.reduce((a, r) => a + r.profit, 0);

/// Noise traders' total profit (negative on average: −λs² per auction).
export const noiseProfit = (rows: readonly AuctionRow[], v: number): number =>
  rows.reduce((a, r) => a + (v - r.pAfter) * r.u, 0);

/// Expected optimal insider profit from gap g = V − p₀: c_N·g²/λ + λ·s²·Σ_{j<N} c_j.
export const expectedOptimalProfit = (gap: number, p: KyleParams, lambda: number): number =>
  (cCoef(p.n) * gap * gap) / lambda + lambda * p.s * p.s * sumC(p.n - 1);

/// Price noise in the λ sample, as a share of λ·s: public news moves quotes too, so Δp is not exactly λ·flow.
export const SAMPLE_PRICE_NOISE = 0.4;

/// (flow, Δp) pairs from an optimal insider over `auctions / n` rounds (new V each), with news noise on Δp.
export function lambdaSample(p: KyleParams, seed: number, auctions = 200): { flow: number; dp: number }[] {
  const lambda = lambdaStar(p);
  const news = warmRng(subSeed(seed, 99));
  const out: { flow: number; dp: number }[] = [];
  for (let r = 0; out.length < auctions; r++) {
    for (const row of runAuctions("optimal", drawRound(p, subSeed(seed, 100 + r)), p, lambda)) {
      const eps = SAMPLE_PRICE_NOISE * lambda * p.s * nextNormal(news);
      if (out.length < auctions) out.push({ flow: row.flow, dp: row.pAfter - row.pBefore + eps });
    }
  }
  return out;
}

/// Optimal order per auction for a planned sequence, assuming zero noise so far (ghost bars before the run).
export function planGhosts(orders: readonly number[], v: number, p: KyleParams, lambda: number): number[] {
  const rows = runAuctions(orders, { v, u: Array.from({ length: p.n }, () => 0) }, p, lambda);
  return rows.map((r, i) => optimalOrder(v, r.pBefore, lambda, p.n - i));
}

/// Challenge rule: your profit is at least `share` of the optimal insider's on the same draws.
export const INSIDER_SHARE = 0.85;
export const insiderHit = (yours: number, optimal: number): boolean => optimal > 0 && yours >= INSIDER_SHARE * optimal;

/// Share of the remaining gap your order closes in expectation (λx / (V − p)); the optimum is 1/(left + 1).
export const gapShare = (row: AuctionRow, v: number, lambda: number): number =>
  v === row.pBefore ? 0 : (lambda * row.x) / (v - row.pBefore);

/// The auction where your gap share was furthest from the optimal share, or null before the first auction.
export function biggestMistake(rows: readonly AuctionRow[], v: number, lambda: number, n: number) {
  let worst: { n: number; you: number; opt: number } | null = null;
  rows.forEach((r, i) => {
    const c = { n: r.n, you: gapShare(r, v, lambda), opt: 1 / (n - i + 1) };
    if (!worst || Math.abs(c.you - c.opt) > Math.abs(worst.you - worst.opt)) worst = c;
  });
  return worst as { n: number; you: number; opt: number } | null;
}
