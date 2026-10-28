import { bestAsk, bestBid, previewMarket } from "./book";
import type { Book, Level, Side } from "./market.types";

export type LadderEntry = {
  price: number;
  bidSize: number;
  askSize: number;
  mine: { bid: number; ask: number };
  take: number;
  isBestBid: boolean;
  isBestAsk: boolean;
};

const sizeAt = (levels: Level[], price: number, owner?: "you") =>
  levels.find((l) => l.price === price)?.orders.reduce((s, o) => s + (!owner || o.owner === owner ? o.size : 0), 0) ?? 0;

/// Rows from centre + depth down to centre − depth (price-descending); `take` = shares a previewed market order consumes there.
export function ladderRows(book: Book, depth: number, centre: number, preview?: { side: Side; size: number }): LadderEntry[] {
  const top = Math.round(centre) + depth;
  const bid = bestBid(book);
  const ask = bestAsk(book);
  const takes = new Map((preview ? previewMarket(book, preview.side, preview.size).rows : []).map((r) => [r.price, r.take]));
  return Array.from({ length: 2 * depth + 1 }, (_, i) => {
    const price = top - i;
    return {
      price,
      bidSize: sizeAt(book.bids, price),
      askSize: sizeAt(book.asks, price),
      mine: { bid: sizeAt(book.bids, price, "you"), ask: sizeAt(book.asks, price, "you") },
      take: takes.get(price) ?? 0,
      isBestBid: price === bid,
      isBestAsk: price === ask,
    };
  });
}

/// Ladder centre with hysteresis: keeps `prev` until |mid − prev| > band ticks.
export function windowCentre(prev: number | null, mid: number, band = 3): number {
  return prev === null || Math.abs(mid - prev) > band ? Math.round(mid) : prev;
}
