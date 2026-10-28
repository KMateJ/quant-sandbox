import { addLimit, emptyBook, previewMarket } from "../../lib/market/book";
import { DEFAULT_FLOW, FAIR0, seedBook } from "../../lib/market/flow";
import type { Book, Side } from "../../lib/market/market.types";

export const BOOK_SEED = 7;
export const BOOK_LEVELS = 10;
export const TICK_USD = DEFAULT_FLOW.tick;
/// Mid in ticks of the figure's book (100.00): best bid 99.99, best ask 100.01.
export const MID_TICKS = FAIR0;
/// Sizes of the first four ask levels, matching the lesson's worked example (1,600 shares in total).
export const WORKED_ASK_SIZES = [318, 311, 518, 453];

/// Replace the orders of a level by the same number of orders summing to `total`.
function resize(sizes: number[], total: number): number[] {
  const sum = sizes.reduce((a, s) => a + s, 0);
  const out = sizes.map((s) => Math.max(1, Math.round((s * total) / sum)));
  out[out.length - 1] += total - out.reduce((a, s) => a + s, 0);
  return out;
}

/// Seeded 10-level book with a two-tick spread around 100.00; the first four ask levels carry the worked example's sizes.
export function bookForFigure(seed = BOOK_SEED): Book {
  const seeded = seedBook({ ...DEFAULT_FLOW, levels: BOOK_LEVELS + 1 }, FAIR0, seed);
  const dropTop = { ...seeded, bids: seeded.bids.slice(1) };
  const asks = dropTop.asks.map((level, i) => {
    const total = WORKED_ASK_SIZES[i];
    if (total === undefined) return level;
    const sizes = resize(level.orders.map((o) => o.size), total);
    return { ...level, orders: level.orders.map((o, j) => ({ ...o, size: sizes[j] })) };
  });
  return { ...dropTop, asks: asks.slice(0, BOOK_LEVELS), bids: dropTop.bids.slice(0, BOOK_LEVELS) };
}

/// Shares resting at each of the first `n` levels on the side a market order of `side` would hit, nearest first.
export function ladder(book: Book, side: Side, n = BOOK_LEVELS) {
  const levels = side === "buy" ? book.asks : book.bids;
  return levels.slice(0, n).map((l) => ({ price: l.price, size: l.orders.reduce((s, o) => s + o.size, 0) }));
}

export type Walk = {
  rows: { price: number; take: number; cum: number }[];
  filled: number;
  unfilled: number;
  avgPrice: number | null;
  /// Slippage against the mid in basis points; positive means worse than the mid.
  slippageBp: number | null;
  /// Cost against the mid in USD: `filled · |avg − mid| · tick`.
  costUsd: number | null;
};

/// Signed cost of an average price against the mid in basis points: buys pay above the mid, sells receive below it.
export function slippageBp(avg: number, mid: number, side: Side): number {
  const sign = side === "buy" ? 1 : -1;
  return (1e4 * sign * (avg - mid)) / mid;
}

/// What a market order of `size` would do to `book`: rows taken, average price, slippage and cost against the mid.
export function walkBook(book: Book, side: Side, size: number, mid = MID_TICKS): Walk {
  const r = previewMarket(book, side, size);
  const slip = r.avgPrice === null ? null : slippageBp(r.avgPrice, mid, side);
  const cost = r.avgPrice === null ? null : r.filled * Math.abs(r.avgPrice - mid) * TICK_USD;
  return { rows: r.rows, filled: r.filled, unfilled: r.unfilled, avgPrice: r.avgPrice, slippageBp: slip, costUsd: cost };
}

/// Slippage in bp for each size in `sizes` (only sizes the book can fill); the curve under the figure.
export function slippageCurve(book: Book, side: Side, sizes: number[], mid = MID_TICKS) {
  const out: { size: number; bp: number }[] = [];
  for (const size of sizes) {
    const w = walkBook(book, side, size, mid);
    if (w.slippageBp !== null && w.unfilled === 0) out.push({ size, bp: w.slippageBp });
  }
  return out;
}

/// Price in dollars from ticks.
export const usd = (ticks: number) => ticks * TICK_USD;

/// Book of one-order levels from `[price in ticks, size]` pairs, for worked examples and tests.
export function flatBook(asks: [number, number][], bids: [number, number][]): Book {
  let b = emptyBook();
  for (const [price, size] of asks) b = addLimit(b, { side: "sell", price, size, owner: "crowd", t: 0 }).book;
  for (const [price, size] of bids) b = addLimit(b, { side: "buy", price, size, owner: "crowd", t: 0 }).book;
  return b;
}
