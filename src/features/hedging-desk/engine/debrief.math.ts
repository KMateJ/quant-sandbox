import { CALENDAR_DAYS, CONTRACT_MULT, STOCK_ID, TRADING_DAYS } from "./desk.config";
import type { BookState, DayRecord, Fill, InstrumentId, Market, MissionDef } from "./desk.types";
import { isStock } from "./instruments.math";
import { quoteInstrument, tauAt } from "./pricing.math";
import { markToMarket, positionValue } from "./risk.math";

/// Where the run's P&L came from; the parts sum to `net` (= markToMarket).
export type Attribution = {
  premium: number; optionSettlement: number; stockPnl: number; financing: number; costs: number; net: number;
};

/// Mid of an instrument on a given day (spread-free).
function midAt(id: InstrumentId, market: Market, mission: MissionDef, day: number): number {
  return quoteInstrument(id, market.spot[day], tauAt(day, market.days), market.iv[day], market.rate, mission.costs).mid;
}

/// Cash flow of a fill valued at mid (spread and fees go to costs).
function midFlow(fill: Fill, market: Market, mission: MissionDef): number {
  const mult = isStock(fill.id) ? 1 : CONTRACT_MULT;
  return (fill.side === "buy" ? -1 : 1) * fill.qty * mult * midAt(fill.id, market, mission, fill.day);
}

/// Cash flow of a fill as actually paid (fill price, spread and fees included).
function paidFlow(fill: Fill, mission: MissionDef): number {
  const mult = isStock(fill.id) ? 1 : CONTRACT_MULT;
  const fee = fill.tag === "client" ? 0 : mission.costs.ticketFee;
  return (fill.side === "buy" ? -1 : 1) * fill.qty * mult * fill.price - fee;
}

/// Splits the run's P&L into premium, option settlement, stock P&L, financing and costs.
export function attribution(mission: MissionDef, market: Market, state: BookState): Attribution {
  const growth = Math.exp(market.rate / TRADING_DAYS);
  let cash = 0, flows = 0;
  for (let d = 0; d <= Math.min(state.day, market.days - 1); d++) {
    for (const f of state.fills) if (f.day === d) cash += paidFlow(f, mission);
    if (d < state.day) cash *= growth;
  }
  for (const f of state.fills) flows += paidFlow(f, mission);
  const financing = cash - flows;
  const settlement = state.cash - cash;

  const S = market.spot[state.day];
  const tau = tauAt(state.day, market.days);
  const optionsLeft = { ...state.positions, [STOCK_ID]: 0 };
  let premium = 0, optionTrades = 0, stockTrades = 0;
  for (const f of state.fills) {
    const flow = midFlow(f, market, mission);
    if (isStock(f.id)) stockTrades += flow;
    else if (f.tag === "client") premium += flow;
    else optionTrades += flow;
  }
  const stockPnl = stockTrades + (state.positions[STOCK_ID] ?? 0) * S;
  const optionSettlement = settlement + optionTrades + positionValue(optionsLeft, S, tau, market.iv[state.day], market.rate);
  const costs = -state.costsPaid;
  return { premium, optionSettlement, stockPnl, financing, costs, net: markToMarket(state, market) };
}

/// Theta earned and gamma paid on each closed day, from the book carried overnight.
export function thetaGamma(mission: MissionDef, market: Market, state: BookState): { thetaCollected: number; gammaPaid: number } {
  let thetaCollected = 0, gammaPaid = 0;
  const positions: Record<InstrumentId, number> = {};
  for (const r of state.history) {
    for (const f of state.fills) {
      if (f.day === r.day) positions[f.id] = (positions[f.id] ?? 0) + (f.side === "buy" ? f.qty : -f.qty);
    }
    const d = r.day;
    const dS = market.spot[d + 1] - market.spot[d];
    for (const [id, qty] of Object.entries(positions)) {
      if (qty === 0 || isStock(id)) continue;
      const q = quoteInstrument(id, market.spot[d], tauAt(d, market.days), market.iv[d], market.rate, mission.costs);
      thetaCollected += qty * q.mult * q.theta * (CALENDAR_DAYS / TRADING_DAYS);
      gammaPaid -= qty * q.mult * 0.5 * q.gamma * dS * dS;
    }
  }
  return { thetaCollected, gammaPaid };
}

/// Day-by-day P&L changes from 0 through each close to `finalPnl`; they sum to `finalPnl`.
export function dailyPnl(history: DayRecord[], finalPnl: number): number[] {
  const series = [...history.map((r) => r.pnl), finalPnl];
  return series.map((p, i) => p - (i ? series[i - 1] : 0));
}
