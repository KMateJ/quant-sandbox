import { addLimit, bestBid, cancelOwner, marketOrder, midTicks, ordersOf } from "../../lib/market/book";
import { applyTick, fairPath, flowSchedule, seedBook } from "../../lib/market/flow";
import type { Book, Fill, FlowSpec } from "../../lib/market/market.types";

/// Strategies the challenge compares you with; "passive" (a bid at the touch, refreshed every 10 s) is for calibration.
export type ExecPolicy = "oneShot" | "twap10" | "passive";

export const EXEC_TARGET = 5000;
export const EXEC_DEADLINE = 120;
/// Hit: your shortfall at most this share of the one-market-order shortfall.
export const EXEC_HIT_FACTOR = 0.6;

/// Your executions in the challenge: your market orders and fills of your resting orders.
export const myFills = (fills: Fill[]) => fills.filter((f) => f.taker === "you" || f.makerOwner === "you");

/// Implementation shortfall of buy fills vs the arrival mid, in basis points (paying above mid = positive cost).
export function shortfallBp(fills: { price: number; size: number }[], arrivalMid: number): number {
  const size = fills.reduce((s, f) => s + f.size, 0);
  if (!size) return 0;
  return (fills.reduce((s, f) => s + (f.price - arrivalMid) * f.size, 0) / (size * arrivalMid)) * 1e4;
}

/// Shares bought so far.
export const filledOf = (fills: { size: number }[]) => fills.reduce((s, f) => s + f.size, 0);

/// Buy whatever is left with one market order and drop your resting orders.
export function forceComplete(book: Book, fills: Fill[], target: number, t: number): { book: Book; fills: Fill[] } {
  const b = cancelOwner(book, "you");
  const left = target - filledOf(fills);
  if (left <= 0) return { book: b, fills };
  const r = marketOrder(b, "buy", left, t, "you");
  return { book: r.book, fills: [...fills, ...r.fills] };
}

function act(policy: ExecPolicy, book: Book, t: number, left: number): { book: Book; fills: Fill[] } {
  if (policy === "oneShot" && t === 0) return marketOrder(book, "buy", left, t, "you");
  if (policy === "twap10" && t % 12 === 0) return marketOrder(book, "buy", Math.min(500, left), t, "you");
  if (policy === "passive" && t % 10 === 0) {
    const b = cancelOwner(book, "you");
    const bid = bestBid(b);
    return bid === null ? { book: b, fills: [] } : addLimit(b, { side: "buy", price: bid, size: Math.min(1000, left), owner: "you", t });
  }
  return { book, fills: [] };
}

/// Replay one seed from a fresh book with a policy buying `target` shares within `deadline` seconds.
export function runExecutionPolicy(seed: number, spec: FlowSpec, policy: ExecPolicy, target = EXEC_TARGET, deadline = EXEC_DEADLINE) {
  const fair = fairPath(spec, deadline, seed);
  const draws = flowSchedule(spec, deadline, seed);
  let book = seedBook(spec, fair[0], seed);
  const arrival = midTicks(book) ?? fair[0];
  let fills: Fill[] = [];
  for (let t = 0; t < deadline && filledOf(fills) < target; t++) {
    const a = act(policy, book, t, target - filledOf(fills));
    const r = applyTick(a.book, draws[t], fair, t, spec);
    book = r.book;
    fills = [...fills, ...a.fills, ...myFills(r.fills)];
    if (filledOf(fills) >= target && ordersOf(book, "you").length) book = cancelOwner(book, "you");
  }
  const done = forceComplete(book, fills, target, deadline);
  return { shortfallBp: shortfallBp(done.fills, arrival), fills: done.fills, arrival };
}
