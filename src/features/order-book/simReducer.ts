import { addLimit, cancel, cancelOwner, marketOrder, midTicks } from "../../lib/market/book";
import { applyTick } from "../../lib/market/flow";
import { windowCentre } from "../../lib/market/ladder";
import type { Book, Fill, FlowSpec, Side, TickDraws } from "../../lib/market/market.types";
import { EXEC_DEADLINE, EXEC_TARGET, filledOf, forceComplete } from "./execution.math";
import { SIM_SECONDS, slippageBp } from "./orderBook.math";
import type { MyFill, SimState } from "./orderBook.types";

const EVENTS_KEPT = 12;

export type World = { spec: FlowSpec; fair: number[]; draws: TickDraws[]; book0: Book };
export type SimAction =
  | { type: "tick"; world: World }
  | { type: "send"; side: Side; size: number }
  | { type: "placeLimit"; side: Side; price: number; size: number }
  | { type: "cancelMine"; id: number }
  | { type: "cancelAllMine" }
  | { type: "reset"; world: World }
  | { type: "startChallenge"; world: World };

const midOf = (book: Book, fallback: number) => midTicks(book) ?? fallback;

/// A fresh sim at t = 0 on the seed book.
export function initialSim(w: World): SimState {
  const mid = midOf(w.book0, w.fair[0]);
  return { t: 0, book: w.book0, centre: windowCentre(null, mid), events: [], sent: [], myFills: [], mids: [mid], challenge: null };
}

/// Your fills among `fills`, from your side, priced against `mid`.
function mine(fills: Fill[], mid: number): MyFill[] {
  return fills
    .filter((f) => f.taker === "you" || f.makerOwner === "you")
    .map((f) => {
      const passive = f.taker !== "you";
      const side: Side = passive ? (f.side === "buy" ? "sell" : "buy") : f.side;
      return { t: f.t, side, price: f.price, size: f.size, mid, passive };
    });
}

/// Close the challenge once the target is bought or the deadline passed (buying any rest at market).
function settle(s: SimState): SimState {
  const c = s.challenge;
  if (!c || c.done) return s;
  const bought = filledOf(s.myFills.filter((f) => f.side === "buy"));
  if (bought < c.target && s.t < c.deadline) return s;
  const asFills = s.myFills.filter((f) => f.side === "buy").map((f) => ({ ...f, makerId: 0, makerOwner: "crowd" as const, taker: "you" as const }));
  const r = forceComplete(s.book, asFills, c.target, s.t);
  const extra = r.fills.slice(asFills.length).map((f) => ({ t: s.t, side: "buy" as const, price: f.price, size: f.size, mid: midOf(s.book, s.centre), passive: false }));
  return { ...s, book: r.book, myFills: [...s.myFills, ...extra], challenge: { ...c, done: true } };
}

/// The order book sim: crowd ticks, your market and limit orders, and the execution challenge.
export function simReducer(s: SimState, a: SimAction): SimState {
  if (a.type === "reset") return initialSim(a.world);
  if (a.type === "startChallenge") {
    const s0 = initialSim(a.world);
    return { ...s0, challenge: { target: EXEC_TARGET, deadline: EXEC_DEADLINE, arrival: s0.mids[0], done: false } };
  }
  if (s.challenge?.done && a.type !== "tick") return s;
  const mid = midOf(s.book, s.centre);
  if (a.type === "tick") {
    if (s.t >= SIM_SECONDS) return s;
    const r = applyTick(s.book, a.world.draws[s.t], a.world.fair, s.t, a.world.spec);
    const next = midOf(r.book, mid);
    const events = [...r.events.reverse(), ...s.events].slice(0, EVENTS_KEPT);
    const t = s.t + 1;
    return settle({ ...s, t, book: r.book, centre: windowCentre(s.centre, next), events, myFills: [...s.myFills, ...mine(r.fills, mid)], mids: [...s.mids, next] });
  }
  if (a.type === "cancelMine") return { ...s, book: cancel(s.book, a.id) };
  if (a.type === "cancelAllMine") return { ...s, book: cancelOwner(s.book, "you") };
  if (a.type === "placeLimit") {
    const r = addLimit(s.book, { side: a.side, price: a.price, size: a.size, owner: "you", t: s.t });
    return settle({ ...s, book: r.book, myFills: [...s.myFills, ...mine(r.fills, mid)] });
  }
  const r = marketOrder(s.book, a.side, a.size, s.t, "you");
  const slipBp = r.avgPrice === null ? NaN : slippageBp(a.side, r.avgPrice, mid);
  const sent = { side: a.side, size: a.size, t: s.t, before: s.book, fills: r.fills, avgPrice: r.avgPrice, unfilled: r.unfilled, slipBp };
  const event = { t: s.t, kind: "market" as const, side: a.side, size: a.size, taker: "you" as const };
  return settle({ ...s, book: r.book, sent: [...s.sent, sent], myFills: [...s.myFills, ...mine(r.fills, mid)], events: [event, ...s.events].slice(0, EVENTS_KEPT) });
}
