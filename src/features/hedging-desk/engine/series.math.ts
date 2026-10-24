import { advanceDays, startBook } from "./book.math";
import type { DayRecord, Market, MissionDef } from "./desk.types";
import { markToMarket } from "./risk.math";


/// Realized spot path from day 0 to `day` inclusive.
export function priceSeries(market: Market, day: number): { day: number; S: number }[] {
  return market.spot.slice(0, day + 1).map((S, d) => ({ day: d, S }));
}

/// Net delta as open → close steps per recorded day, then today's open and live value.
export function deltaSteps(history: DayRecord[], openDelta: number, liveDelta: number, day: number): { day: number; delta: number }[] {
  const out: { day: number; delta: number }[] = [];
  for (const r of history) out.push({ day: r.day, delta: r.openDelta }, { day: r.day, delta: r.closeDelta });
  out.push({ day, delta: openDelta }, { day, delta: liveDelta });
  return out;
}

/// Shares held and shares needed as step rows (previous value repeated at the same x before a change).
export function sharesSteps(history: DayRecord[], liveHeld: number, liveNeeded: number, day: number): { day: number; held: number; needed: number }[] {
  const points = [...history.map((r) => ({ day: r.day, held: r.sharesHeld, needed: r.sharesNeeded })), { day, held: liveHeld, needed: liveNeeded }];
  const out: { day: number; held: number; needed: number }[] = [];
  points.forEach((p, i) => {
    if (i > 0) out.push({ ...points[i - 1], day: p.day });
    out.push(p);
  });
  return out;
}

/// P&L of the opening trades alone (no hedging) marked on each day 0..`day` of the same path.
export function unhedgedPnl(mission: MissionDef, market: Market, day: number): { day: number; pnl: number }[] {
  let state = startBook(mission, 0, market);
  const out = [{ day: 0, pnl: markToMarket(state, market) }];
  for (let d = 1; d <= Math.min(day, market.days); d++) {
    state = advanceDays(state, market, mission, 1);
    out.push({ day: d, pnl: markToMarket(state, market) });
  }
  return out;
}
