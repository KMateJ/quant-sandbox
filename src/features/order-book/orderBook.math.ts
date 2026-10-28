import { makeRng } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { bestAsk, bestBid, depth, midTicks, previewMarket } from "../../lib/market/book";
import { DEFAULT_FLOW } from "../../lib/market/flow";
import type { Book, FlowSpec, Side } from "../../lib/market/market.types";
import type { Liquidity } from "./orderBook.types";

/// Simulated seconds precomputed per seed.
export const SIM_SECONDS = 3600;
/// Ladder rows on each side of the centre.
export const LADDER_DEPTH = 10;
/// Predict tolerance on the average price, in ticks.
export const AVG_TOLERANCE = 0.4;

/// Crowd settings for a liquidity preset (thin: 150 per level, 3 limits/s; deep: 1,200, 10).
export function presetSpec(l: Liquidity): FlowSpec {
  if (l === "thin") return { ...DEFAULT_FLOW, depthPerLevel: 150, limitRate: 3 };
  if (l === "deep") return { ...DEFAULT_FLOW, depthPerLevel: 1200, limitRate: 10 };
  return { ...DEFAULT_FLOW };
}

/// Side-signed slippage of an average fill against the mid, in basis points (positive = cost).
export const slippageBp = (side: Side, avg: number, mid: number) => ((side === "buy" ? avg - mid : mid - avg) / mid) * 1e4;

/// Side a market order takes when pointing at `price`: at or above the best ask buys, otherwise sells.
export function sideAt(book: Book, price: number): Side {
  const ask = bestAsk(book);
  return ask !== null && price >= ask ? "buy" : "sell";
}

/// Cumulative size from the touch out to `price` on the side a `side` market order takes from.
export function sizeToRow(book: Book, side: Side, price: number): number {
  const levels = side === "buy" ? book.asks : book.bids;
  return levels
    .filter((l) => (side === "buy" ? l.price <= price : l.price >= price))
    .reduce((s, l) => s + l.orders.reduce((a, o) => a + o.size, 0), 0);
}

/// Slippage (bp) of market orders of each size against the current book; NaN where the book is too thin.
export function slippageCurve(book: Book, side: Side, sizes: number[]): { size: number; bp: number }[] {
  const mid = midTicks(book) ?? 0;
  return sizes.map((size) => {
    const p = previewMarket(book, side, size);
    return { size, bp: p.unfilled > 0 || p.avgPrice === null ? NaN : slippageBp(side, p.avgPrice, mid) };
  });
}

/// Order sizes for the slippage chart: 100 up to the visible depth of one side, in about 20 steps.
export function curveSizes(book: Book, side: Side, levels = LADDER_DEPTH): number[] {
  const max = depth(book, side === "buy" ? "sell" : "buy", levels).at(-1)?.cum ?? 0;
  const step = Math.max(100, Math.ceil(max / 20 / 100) * 100);
  const out: number[] = [];
  for (let s = 100; s <= max; s += step) out.push(s);
  return out;
}

/// Cumulative depth by price for the depth chart (bids below the mid, asks above).
export function depthCurve(book: Book, levels = LADDER_DEPTH): { price: number; bid?: number; ask?: number }[] {
  const bids = depth(book, "buy", levels).map((d) => ({ price: d.price, bid: d.cum }));
  const asks = depth(book, "sell", levels).map((d) => ({ price: d.price, ask: d.cum }));
  return [...bids.reverse(), ...asks];
}

/// A predict question: a market order whose size (a multiple of 100) walks 3–6 levels of `book`.
export function predictRound(seed: number, book: Book): { side: Side; size: number } {
  const rng = makeRng(subSeed(seed, 31));
  rng();
  const side: Side = rng() < 0.5 ? "buy" : "sell";
  const cum = depth(book, side === "buy" ? "sell" : "buy", 8).map((d) => d.cum);
  const first = 3 + Math.floor(rng() * 4);
  for (let k = first; k <= 6; k++) {
    const lo = Math.floor(cum[k - 2] / 100) + 1;
    const hi = Math.floor(cum[k - 1] / 100);
    if (hi >= lo) return { side, size: 100 * (lo + Math.floor(rng() * (hi - lo + 1))) };
  }
  return { side, size: 100 * (Math.floor(cum[2] / 100) + 1) };
}

/// Levels a market order of `size` walks.
export const levelsWalked = (book: Book, side: Side, size: number) => previewMarket(book, side, size).rows.length;

/// Price in ticks as dollars with `dp` decimals (tick = 1¢).
export const fmtTicks = (ticks: number, dp = 2) => (ticks / 100).toFixed(dp);

/// Touch prices, or nulls, for readouts.
export const touch = (book: Book) => ({ bid: bestBid(book), ask: bestAsk(book), mid: midTicks(book) });

/// Share counts for axis ticks: 2,000 → 2k.
export const fmtShares = (v: number) => (Math.abs(v) >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v.toFixed(0));
