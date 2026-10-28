import { addLimit, cancel, midTicks, ordersOf } from "../../lib/market/book";
import { applyTick, DEFAULT_FLOW, fairPath, FAIR0, flowSchedule, seedBook } from "../../lib/market/flow";
import { applyFill, decompose, emptyLedger, type Ledger } from "../../lib/market/maker";
import type { Book, Side } from "../../lib/market/market.types";

/// Shares per quote, the rebate per share in USD, and the tick in USD used by the figure.
export const PNL_QUOTE_SIZE = 100;
export const PNL_REBATE = 0.002;
export const PNL_TICK = DEFAULT_FLOW.tick;
export const PNL_SECONDS = 300;
export const PNL_SEED = 1;

export type PnlSession = { ledger: Ledger; mids: number[]; seconds: number };

function requote(book: Book, mid: number, offset: number, t: number): Book {
  let b = book;
  const want: Record<Side, number> = { buy: Math.floor(mid - offset), sell: Math.ceil(mid + offset) };
  for (const side of ["buy", "sell"] as Side[]) {
    const mine = ordersOf(b, "you").find((o) => o.side === side);
    if (mine?.price === want[side]) continue;
    if (mine) b = cancel(b, mine.id);
    b = addLimit(b, { side, price: want[side], size: PNL_QUOTE_SIZE, owner: "you", t }).book;
  }
  return b;
}

/// A seeded session: a maker quotes `offset` ticks either side of the book mid and is filled by the crowd flow.
/// `mids[t]` is the book mid in USD before tick `t` (the mid each fill at `t` is measured against).
export function runSession({ informed, offset, seconds = PNL_SECONDS, seed }: { informed: number; offset: number; seconds?: number; seed: number }): PnlSession {
  const spec = { ...DEFAULT_FLOW, informedShare: informed };
  const fair = fairPath(spec, seconds, seed);
  const draws = flowSchedule(spec, seconds, seed);
  let book = seedBook(spec, FAIR0, seed);
  let ledger = emptyLedger();
  const mids: number[] = [];
  for (let t = 0; t < seconds; t++) {
    const mid = midTicks(book) ?? FAIR0;
    mids.push(mid * PNL_TICK);
    const r = applyTick(requote(book, mid, offset, t), draws[t], fair, t, spec);
    book = r.book;
    for (const f of r.fills) {
      if (f.makerOwner !== "you") continue;
      const side: Side = f.side === "buy" ? "sell" : "buy";
      ledger = applyFill(ledger, { t, side, price: f.price * PNL_TICK, size: f.size, mid: mids[t], fee: PNL_REBATE * f.size });
    }
  }
  mids.push((midTicks(book) ?? FAIR0) * PNL_TICK);
  return { ledger, mids, seconds };
}

/// The four-part split of a session at markout horizon `h` seconds.
export const sessionParts = (s: PnlSession, h: number) => decompose(s.ledger, (t) => s.mids[Math.min(t, s.seconds)], s.seconds, h);

/// Size-weighted average markout per share (USD, maker's side) of `ledger` for each horizon.
export function markoutCurve(ledger: Ledger, midAt: (t: number) => number, horizons: number[]): { h: number; markout: number }[] {
  const shares = ledger.fills.reduce((a, f) => a + f.size, 0);
  return horizons.map((h) => ({
    h,
    markout: shares === 0 ? 0 : ledger.fills.reduce((a, f) => a + (f.side === "buy" ? 1 : -1) * (midAt(f.t + h) - f.mid) * f.size, 0) / shares,
  }));
}

/// Markout curve of a session for horizons 1…`max` seconds, in cents per share.
export function sessionMarkouts(s: PnlSession, max = 30): { h: number; markout: number }[] {
  const hs = Array.from({ length: max }, (_, i) => i + 1);
  return markoutCurve(s.ledger, (t) => s.mids[Math.min(t, s.seconds)], hs).map((r) => ({ h: r.h, markout: r.markout * 100 }));
}
