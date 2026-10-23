import { CONTRACT_MULT, STOCK_ID, TRADING_DAYS } from "./desk.config";
import type { BookState, DeskAction, Market, MissionDef, Order } from "./desk.types";
import { isStock, parseInstrument } from "./instruments.math";
import { gapEvent } from "./market.math";
import { quoteInstrument, tauAt } from "./pricing.math";
import { bookGreeks, markToMarket, netDelta } from "./risk.math";

/// Fresh book for `mission` with its opening trades filled at day 0.
export function startBook(mission: MissionDef, seed: number, market: Market): BookState {
  let state: BookState = {
    missionId: mission.id,
    seed,
    day: 0,
    positions: { [STOCK_ID]: 0 },
    cash: 0,
    costsPaid: 0,
    breaches: 0,
    fills: [],
    history: [],
    events: [],
    openDelta: 0,
    settled: false,
  };
  for (const order of mission.opening) state = applyOrder(state, market, mission, order);
  return {
    ...state,
    events: [{ day: 0, kind: "start" }, ...state.events],
    openDelta: netDelta(state.positions, market, 0),
  };
}

/// Fills `order` at ask (buy) or bid (sell), charging the ticket fee on desk trades. No-op after
/// expiry, for non-positive / fractional qty, or for options in a stock-only mission; a desk trade
/// past `maxTrades` only adds a `rejected` event.
export function applyOrder(state: BookState, market: Market, mission: MissionDef, order: Order): BookState {
  if (state.settled || state.day >= market.days) return state;
  if (!Number.isInteger(order.qty) || order.qty <= 0) return state;
  const d = state.day;
  const desk = order.tag !== "client";
  if (desk && mission.instruments === "stock" && !isStock(order.id)) return state;
  if (desk && mission.maxTrades !== undefined && tradeCount(state) >= mission.maxTrades) {
    return { ...state, events: [{ day: d, kind: "rejected", reason: "tradeLimit" }, ...state.events] };
  }
  const q = quoteInstrument(order.id, market.spot[d], tauAt(d, market.days), market.iv[d], market.rate, mission.costs);
  const sign = order.side === "buy" ? 1 : -1;
  const price = sign > 0 ? q.ask : q.bid;
  const fee = desk ? mission.costs.ticketFee : 0;
  const cost = order.qty * q.half * q.mult + fee;
  const fill = { ...order, day: d, price, cost };
  return {
    ...state,
    positions: { ...state.positions, [order.id]: (state.positions[order.id] ?? 0) + sign * order.qty },
    cash: state.cash - sign * order.qty * price * q.mult - fee,
    costsPaid: state.costsPaid + cost,
    fills: [...state.fills, fill],
    events: [{ day: d, kind: "fill", fill }, ...state.events],
  };
}

/// Stock order that brings net delta to the nearest whole share of zero, or null if already flat.
export function autoHedgeOrder(state: BookState, market: Market): Order | null {
  const q = Math.round(-netDelta(state.positions, market, state.day));
  if (q === 0) return null;
  return { id: STOCK_ID, side: q > 0 ? "buy" : "sell", qty: Math.abs(q), tag: "auto" };
}

/// Closes the current day (record, breach check), rolls cash interest and settles options at expiry.
function closeDay(state: BookState, market: Market, mission: MissionDef): BookState {
  const d = state.day;
  const closeDelta = netDelta(state.positions, market, d);
  const greeks = bookGreeks(state, market);
  const sharesHeld = state.positions[STOCK_ID] ?? 0;
  const breach = Math.abs(closeDelta) > mission.band;
  const record = {
    day: d,
    openDelta: state.openDelta,
    closeDelta,
    sharesHeld,
    sharesNeeded: sharesHeld - closeDelta,
    gamma: greeks.gamma,
    vega: greeks.vega,
    pnl: markToMarket(state, market),
    breach,
  };
  const day = d + 1;
  let positions = state.positions;
  let cash = state.cash * Math.exp(market.rate / TRADING_DAYS);
  let events = breach ? [{ day: d, kind: "breach" as const, delta: closeDelta }, ...state.events] : state.events;
  if (day === market.gapDay) {
    const gap = gapEvent(mission.market, state.seed);
    if (gap) events = [{ day, kind: "gap", move: gap.move }, ...events];
  }
  for (const e of mission.market.ivSchedule ?? []) {
    if (e.day === day) events = [{ day, kind: "ivShift", iv: e.iv }, ...events];
  }
  const settled = day === market.days;
  if (settled) {
    positions = { ...positions };
    const S = market.spot[day];
    for (const [id, qty] of Object.entries(positions)) {
      const inst = parseInstrument(id);
      if (inst.kind === "stock" || qty === 0) continue;
      positions[id] = 0;
      if (mission.settlement === "cash") {
        cash += qty * CONTRACT_MULT * (inst.type === "C" ? Math.max(S - inst.strike, 0) : Math.max(inst.strike - S, 0));
        continue;
      }
      const itm = inst.type === "C" ? S > inst.strike : S < inst.strike;
      if (!itm) continue;
      const shares = (inst.type === "C" ? 1 : -1) * qty * CONTRACT_MULT;
      positions[STOCK_ID] = (positions[STOCK_ID] ?? 0) + shares;
      cash -= shares * inst.strike;
      events = [{ day, kind: "assignment", id, shares }, ...events];
    }
    events = [{ day, kind: "expiry" }, ...events];
  }
  return {
    ...state,
    day,
    positions,
    cash,
    breaches: state.breaches + (breach ? 1 : 0),
    history: [...state.history, record],
    events,
    settled,
    openDelta: netDelta(positions, market, day),
  };
}

/// Steps `n` days forward (stops at expiry).
export function advanceDays(state: BookState, market: Market, mission: MissionDef, n: number): BookState {
  let s = state;
  for (let i = 0; i < n && !s.settled && s.day < market.days; i++) s = closeDay(s, market, mission);
  return s;
}

/// Reducer for desk actions.
export function reduceDesk(state: BookState, action: DeskAction, market: Market, mission: MissionDef): BookState {
  switch (action.type) {
    case "order":
      return applyOrder(state, market, mission, action.order);
    case "autoHedge": {
      const order = autoHedgeOrder(state, market);
      return order ? applyOrder(state, market, mission, order) : state;
    }
    case "step":
      return advanceDays(state, market, mission, action.days);
    case "restore":
      return action.state;
  }
}

/// Number of manual and auto fills (client fills excluded).
export function tradeCount(state: BookState): number {
  return state.fills.filter((f) => f.tag === "manual" || f.tag === "auto").length;
}
