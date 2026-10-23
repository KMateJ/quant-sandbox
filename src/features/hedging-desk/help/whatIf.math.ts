import { normCdf } from "../../../lib/stats/distributions";
import { applyOrder, autoHedgeOrder, tradeCount } from "../engine/book.math";
import { STOCK_ID, TRADING_DAYS } from "../engine/desk.config";
import type { BookState, InstrumentId, Market, MissionDef, OptionType, Order, Side } from "../engine/desk.types";
import { isStock, optionId } from "../engine/instruments.math";
import { evaluateObjectives } from "../engine/objectives.math";
import { quoteInstrument, tauAt } from "../engine/pricing.math";
import { bookGreeks, positionValue } from "../engine/risk.math";
import { nearestStrike } from "../sidePanels.math";
import type { ShockRow, WhatIfBlock, WhatIfId, WhatIfResult, WhatIfTicket, WhatIfVerdict } from "./whatIf.types";

const SIGMAS = [-2, -1, 0, 1, 2];
const VOL_BUMP = 0.02;

/// Chance that |delta| ends above `band` after one normal move: delta shifts by `gamma` per dollar and the
/// move is N(0, (S·sigmaDay)²).
export function breachChance(delta: number, gamma: number, S: number, sigmaDay: number, band: number): number {
  if (Math.abs(gamma) < 1e-9) return Math.abs(delta) > band ? 1 : 0;
  const s = S * sigmaDay;
  const a = (-band - delta) / gamma;
  const b = (band - delta) / gamma;
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return 1 - (normCdf(hi / s) - normCdf(lo / s));
}

const noOptions = (s: BookState) => Object.entries(s.positions).every(([id, q]) => isStock(id) || q === 0);

/// Applies orders to a copy of the book and measures it with today's market only. The shock rows are one
/// day of theta plus the move: the unchanged positions repriced at tomorrow's time to expiry.
export function simulateOrders(
  mission: MissionDef, state: BookState, market: Market, id: WhatIfId, orders: Order[],
): WhatIfResult {
  let block: WhatIfBlock | undefined;
  if (state.settled || state.day >= market.days) block = "expired";
  else if (mission.instruments === "stock" && orders.some((o) => !isStock(o.id))) block = "stockOnly";
  else if (mission.maxTrades !== undefined && tradeCount(state) + orders.length > mission.maxTrades) block = "tradeLimit";

  const next = block ? state : orders.reduce((s, o) => applyOrder(s, market, mission, o), state);
  const d = state.day;
  const S = market.spot[d];
  const iv = market.iv[d];
  const rate = market.rate;
  const tau = tauAt(d, market.days);
  const tau1 = Math.max(0, tauAt(d + 1, market.days));
  const sigmaDay = iv / Math.sqrt(TRADING_DAYS);

  const premium = next.fills.slice(state.fills.length).reduce((sum, f) => {
    if (isStock(f.id)) return sum;
    return sum + (f.side === "buy" ? 1 : -1) * f.qty * f.price * quoteInstrument(f.id, S, tau, iv, rate, mission.costs).mult;
  }, 0);
  const before = bookGreeks(state, market);
  const after = bookGreeks(next, market);
  const base = positionValue(next.positions, S, tau, iv, rate);
  const shocks: ShockRow[] = SIGMAS.map((k) => ({
    sigmas: k,
    move: S * k * sigmaDay,
    pnl: positionValue(next.positions, S * (1 + k * sigmaDay), tau1, iv, rate) - base,
  }));
  const cost = next.costsPaid - state.costsPaid;
  const inBand = Math.abs(after.delta) <= mission.band;
  const v: WhatIfVerdict[] = [];
  if (!block) {
    if (Math.abs(before.delta) > mission.band && inBand) v.push("fixesDelta");
    if (!inBand) v.push("missesBand");
    if (Math.abs(after.delta) > Math.abs(before.delta) + 20) v.push("wrongWay");
    if (after.gamma < before.gamma - 1 && after.gamma < 0) v.push("addsShortGamma");
    if (Math.abs(after.gamma) < Math.abs(before.gamma) - 1) v.push("cutsGamma");
    if (before.gamma < 0 && after.gamma > 5) v.push("flipsGamma");
    if (Math.abs(after.vega) > Math.abs(before.vega) + 20) v.push("addsVega");
    if (Math.abs(after.vega) < Math.abs(before.vega) - 20) v.push("cutsVega");
    if (after.theta < before.theta - 5) v.push("losesTheta");
    if (orders.length > 0 && !noOptions(state) && noOptions(next) && Math.abs(after.delta) < 1) v.push("closesBook");
    const limit = mission.objectives.find((o) => o.kind === "costsBelow");
    if (limit && cost > 0.5 * limit.limit) v.push("costly");
  }
  return {
    id, orders, block, cost, premium, before, after, inBand,
    breachChance: breachChance(after.delta, after.gamma, S, sigmaDay, mission.band),
    shocks,
    volUp: positionValue(next.positions, S, tau, iv + VOL_BUMP, rate) - base,
    objectives: evaluateObjectives(mission, next, market),
    verdicts: v,
  };
}

const manual = (id: InstrumentId, side: Side, qty: number): Order => ({ id, side, qty, tag: "manual" });

/// The standard scenarios for this book, then the ticket if it is valid. Fixed order: ticket, do nothing,
/// stock hedge, ATM options, OTM options, gamma-neutral, vega-neutral (missions with vega), selling
/// options, close out. The ticket card is always present; without a valid ticket it is `emptyTicket`.
export function whatIfScenarios(
  mission: MissionDef, state: BookState, market: Market, ticket?: WhatIfTicket,
): WhatIfResult[] {
  const d = Math.min(state.day, market.days);
  const S = market.spot[d];
  const tau = tauAt(d, market.days);
  const iv = market.iv[d];
  const g = bookGreeks(state, market);
  const q = (id: InstrumentId) => quoteInstrument(id, S, tau, iv, market.rate, mission.costs);
  const atm = nearestStrike(market.strikes, S);
  const idx = market.strikes.indexOf(atm);
  const strikeBeside = (up: boolean) =>
    market.strikes[Math.min(market.strikes.length - 1, Math.max(0, idx + (up ? 1 : -1)))];

  const run = (id: WhatIfId, orders: Order[], whenEmpty?: WhatIfBlock) => {
    const r = simulateOrders(mission, state, market, id, orders);
    return orders.length === 0 && !r.block && whenEmpty ? { ...r, block: whenEmpty } : r;
  };
  const withStockFlatten = (legs: Order[]) => {
    const copy = legs.reduce((s, o) => applyOrder(s, market, mission, o), state);
    const o = autoHedgeOrder(copy, market);
    return o ? [...legs, { ...o, tag: "manual" as const }] : legs;
  };
  const deltaLeg = (type: OptionType, strike: number, side: Side): Order[] => {
    const id = optionId(type, strike);
    const n = Math.round(Math.abs(g.delta) / (Math.abs(q(id).delta) * 100));
    return n > 0 ? [manual(id, side, n)] : [];
  };
  const atmCall = optionId("C", atm);
  const greekLeg = (exposure: number, perShare: number): Order[] => {
    const n = perShare > 1e-9 ? Math.round(Math.abs(exposure) / (perShare * 100)) : 0;
    return n > 0 ? [manual(atmCall, exposure < 0 ? "buy" : "sell", n)] : [];
  };

  const longDelta = g.delta >= 0;
  const hedgeType: OptionType = longDelta ? "P" : "C";
  const closeOrders: Order[] = Object.entries(state.positions)
    .filter(([id, qty]) => !isStock(id) && qty !== 0)
    .map(([id, qty]) => manual(id, qty > 0 ? "sell" : "buy", Math.abs(qty)));
  const held = state.positions[STOCK_ID] ?? 0;
  if (held !== 0) closeOrders.push(manual(STOCK_ID, held > 0 ? "sell" : "buy", Math.abs(held)));

  const hedge = autoHedgeOrder(state, market);
  const valid = ticket !== undefined && Number.isInteger(ticket.qty) && ticket.qty > 0;
  const out: WhatIfResult[] = [
    run("ticket", valid ? [manual(ticket.id, ticket.side, ticket.qty)] : [], "emptyTicket"),
    run("doNothing", []),
    run("stockHedge", hedge ? [{ ...hedge, tag: "manual" }] : [], "nothingToDo"),
    run("optionDelta", deltaLeg(hedgeType, atm, "buy"), "nothingToDo"),
    run("otmOptionDelta", deltaLeg(hedgeType, strikeBeside(!longDelta), "buy"), "nothingToDo"),
    run("gammaNeutral", withStockFlatten(greekLeg(g.gamma, q(atmCall).gamma)), "nothingToDo"),
  ];
  if (mission.greeks.includes("vega")) {
    out.push(run("vegaNeutral", withStockFlatten(greekLeg(g.vega, q(atmCall).vega)), "nothingToDo"));
  }
  out.push(
    run("shortOptionDelta", deltaLeg(longDelta ? "C" : "P", atm, "sell"), "nothingToDo"),
    run("closeOut", closeOrders, "nothingToDo"),
  );
  return out;
}
