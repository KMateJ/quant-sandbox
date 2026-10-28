import { normCdf } from "../../lib/stats/distributions";
import type { Book, FlowSpec, Side } from "../../lib/market/market.types";

/// One resting order in a level's queue, front → back.
export type QueueBlock = { id: number; size: number; mine: boolean };

/// The FIFO queue at `price` on the resting `side` (buy = bids), front first.
export function queueBlocks(book: Book, price: number, side: Side): QueueBlock[] {
  const level = (side === "buy" ? book.bids : book.asks).find((l) => l.price === price);
  return level ? level.orders.map((o) => ({ id: o.id, size: o.size, mine: o.owner === "you" })) : [];
}

/// Rate of market orders that hit a resting `side` order (sells hit bids).
const hitRate = (spec: FlowSpec, side: Side) => spec.marketRate * (side === "buy" ? 1 - spec.buyShare : spec.buyShare);

/// Estimated chance a resting order with `ahead` shares in front fills within `horizon` seconds:
/// opposite market volume is compound Poisson (exponential sizes, mean m), cancels thin the queue ahead
/// by e^(−cancelRate·horizon); normal approximation.
export function fillOdds(ahead: number, spec: FlowSpec, horizon: number, side: Side = "buy"): number {
  const rate = hitRate(spec, side);
  const m = spec.meanMarketSize;
  const left = ahead * Math.exp(-spec.cancelRate * horizon);
  const mu = horizon * rate * m;
  const sd = Math.sqrt(horizon * rate * 2 * m * m);
  if (sd === 0) return mu >= left + 1 ? 1 : 0;
  return Math.min(1, Math.max(0, 1 - normCdf((left + 1 - mu) / sd)));
}

/// Expected seconds until the queue ahead is cleared: ahead / (hit volume rate + cancel rate × ahead).
export function expectedWait(ahead: number, spec: FlowSpec, side: Side = "buy"): number {
  return ahead / (hitRate(spec, side) * spec.meanMarketSize + spec.cancelRate * ahead);
}

/// Side-signed markout of a fill in cents after `after` seconds: positive = the price moved your way.
export function markout(fill: { side: Side; price: number; t: number }, midAt: (t: number) => number, after = 10): number {
  const d = midAt(fill.t + after) - fill.price;
  return fill.side === "buy" ? d : -d;
}

/// Shares that must trade before a resting order fills: better-priced levels plus the queue ahead at its own price.
export function sharesInFront(book: Book, order: { side: Side; price: number }, queueAhead: number): number {
  const levels = order.side === "buy" ? book.bids : book.asks;
  const better = levels.filter((l) => (order.side === "buy" ? l.price > order.price : l.price < order.price));
  return queueAhead + better.reduce((s, l) => s + l.orders.reduce((a, o) => a + o.size, 0), 0);
}
