import { STOCK_ID } from "../engine/desk.config";
import type { BookState, Market, MissionDef, ObjectiveDef, Side } from "../engine/desk.types";
import { tradeCount } from "../engine/book.math";
import { optionId } from "../engine/instruments.math";
import { evaluateObjectives } from "../engine/objectives.math";
import { quoteInstrument, tauAt } from "../engine/pricing.math";
import { bookGreeks, markToMarket, netDelta } from "../engine/risk.math";
import { breakevenMove, nearestStrike } from "../sidePanels.math";
import type { Advice, AdviceTone } from "./advice.types";

const MAX_ITEMS = 6;
const TONE_ORDER: Record<AdviceTone, number> = { urgent: 0, suggest: 1, info: 2, done: 3 };

const round1 = (x: number) => Math.round(x * 10) / 10;

const findObjective = <K extends ObjectiveDef["kind"]>(m: MissionDef, kind: K) =>
  m.objectives.find((o): o is Extract<ObjectiveDef, { kind: K }> => o.kind === kind);

/// Contracts to bring `exposure` to 80% of `limit` when one contract moves it by `perContract`; 0 if none.
const contractsFor = (exposure: number, limit: number, perContract: number) => {
  const n = Math.ceil((Math.abs(exposure) - 0.8 * limit) / perContract);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/// Ordered advice for the current book (urgent first, at most 6 items). Reads only today's market
/// (`spot[day]`, `iv[day]`) and the mission spec, never the hidden future path.
export function deskAdvice(mission: MissionDef, state: BookState, market: Market): Advice[] {
  const d = state.day;
  const S = market.spot[d];
  const g = bookGreeks(state, market);
  const delta = g.delta;
  const band = mission.band;
  const daysLeft = market.days - d;
  const sigmaDay = market.iv[d] / Math.sqrt(252);
  const costObjectives = evaluateObjectives({ ...mission, objectives: mission.objectives.filter((o) => o.kind === "costsBelow") }, state, market);
  const atm = nearestStrike(market.strikes, S);
  const atmId = optionId("C", atm);
  const qc = quoteInstrument(atmId, S, tauAt(d, market.days), market.iv[d], market.rate, mission.costs);
  const maxTrades = mission.maxTrades;
  const trades = tradeCount(state);
  const exhausted = maxTrades !== undefined && trades >= maxTrades;
  const swing = Math.round(Math.abs(g.gamma) * S * sigmaDay);
  const hedgeQty = Math.round(Math.abs(delta));
  const outside = Math.abs(delta) > band;
  const live = !state.settled;
  const pnl = markToMarket(state, market);
  const breachObj = findObjective(mission, "maxBreaches");
  const hedgeAction: Advice["action"] =
    !exhausted && hedgeQty > 0
      ? { kind: "ticket", id: STOCK_ID, side: delta < 0 ? "buy" : "sell", qty: hedgeQty }
      : undefined;
  const optionAction = (side: Side, qty: number): Advice["action"] =>
    mission.instruments === "all" && qty > 0 && !exhausted ? { kind: "ticket", id: atmId, side, qty } : undefined;

  const out: Advice[] = [];
  const add = (a: Advice) => out.push(a);

  if (state.settled) return [{ id: "expired", tone: "done", vars: { pnl: Math.round(pnl) }, action: { kind: "screen", screen: "debrief" } }];
  if (live && exhausted) add({ id: "noTradesLeft", tone: "urgent", vars: { max: maxTrades }, action: { kind: "point", anchor: "mission" } });
  if (live && outside) add({ id: "outsideBand", tone: "urgent", vars: { delta: Math.round(delta), band, qty: hedgeQty }, action: hedgeAction });

  const last = state.events[0];
  if (live && last?.kind === "fill" && last.fill.tag === "manual" && last.day === d) {
    const f = last.fill;
    const sign = f.side === "buy" ? 1 : -1;
    const before = netDelta({ ...state.positions, [f.id]: (state.positions[f.id] ?? 0) - sign * f.qty }, market, d);
    if (Math.abs(delta) > Math.abs(before) + 20) {
      add({ id: "wrongWay", tone: "urgent", vars: { before: Math.round(before), after: Math.round(delta), qty: f.qty }, action: { kind: "point", anchor: "blotter" } });
    }
  }
  if (live && breachObj && state.breaches === breachObj.limit) {
    add({ id: "lastBreach", tone: "urgent", vars: { limit: breachObj.limit }, action: { kind: "point", anchor: "risk" } });
  }

  const gammaObj = findObjective(mission, "gammaLimitFrom");
  if (live && gammaObj && d < gammaObj.fromDay && Math.abs(g.gamma) > gammaObj.limit) {
    const left = gammaObj.fromDay - d;
    const contracts = contractsFor(g.gamma, gammaObj.limit, qc.gamma * qc.mult);
    add({
      id: "gammaDeadline", tone: left <= 5 ? "urgent" : "suggest",
      vars: { gamma: Math.round(g.gamma), limit: gammaObj.limit, fromDay: gammaObj.fromDay, daysLeftTo: left, contracts },
      action: optionAction("buy", contracts),
    });
  }
  const vegaObj = findObjective(mission, "vegaLimitBy");
  if (live && vegaObj && d < vegaObj.byDay && Math.abs(g.vega) > vegaObj.limit) {
    const left = vegaObj.byDay - d;
    const contracts = contractsFor(g.vega, vegaObj.limit, qc.vega * qc.mult);
    add({
      id: "vegaDeadline", tone: left <= 5 ? "urgent" : "suggest",
      vars: { vega: Math.round(g.vega), limit: vegaObj.limit, byDay: vegaObj.byDay, daysLeftTo: left, contracts },
      action: optionAction(g.vega > 0 ? "sell" : "buy", contracts),
    });
  }

  if (live && mission.settlement === "physical" && daysLeft <= 3) {
    let shortCalls = 0;
    let shares = 0;
    for (const [id, qty] of Object.entries(state.positions)) {
      const m = /^C(\d+(?:\.\d+)?)$/.exec(id);
      if (!m || qty >= 0) continue;
      shortCalls += -qty;
      if (S > Number(m[1])) shares += -qty * 100;
    }
    const held = state.positions[STOCK_ID] ?? 0;
    if (shortCalls > 0) add({ id: "pinRisk", tone: "urgent", vars: { daysLeft, shares, held, net: held - shares }, action: { kind: "point", anchor: "positions" } });
  }

  if (live && !outside && Math.abs(delta) > 0.7 * band) {
    add({ id: "nearBand", tone: "suggest", vars: { delta: Math.round(delta), band, qty: hedgeQty }, action: hedgeAction });
  }
  if (live && breachObj && state.breaches === breachObj.limit - 1) {
    add({ id: "oneBreachLeft", tone: "suggest", vars: { limit: breachObj.limit }, action: { kind: "point", anchor: "risk" } });
  }
  const costsRes = costObjectives.find((o) => o.def.kind === "costsBelow" && o.status === "atRisk");
  if (live && costsRes && costsRes.def.kind === "costsBelow") {
    add({ id: "costsHigh", tone: "suggest", vars: { costs: Math.round(costsRes.value), limit: costsRes.def.limit }, action: { kind: "tab", tab: "guide" } });
  }
  if (live && maxTrades !== undefined && maxTrades - trades >= 1 && maxTrades - trades <= 2) {
    add({ id: "tradesLow", tone: "suggest", vars: { left: maxTrades - trades } });
  }
  const pnlObj = findObjective(mission, "pnlWithin");
  if (live && pnlObj && Math.abs(pnl) > 0.75 * pnlObj.limit) {
    add({ id: "pnlDrift", tone: "suggest", vars: { pnl: Math.round(pnl), limit: pnlObj.limit }, action: { kind: "tab", tab: "whatIf" } });
  }
  if (live && daysLeft <= 5 && g.gamma < 0) {
    add({ id: "expirySoon", tone: "suggest", vars: { daysLeft, swing }, action: { kind: "key", code: "F2" } });
  }

  const gap = mission.market.gap;
  if (live && gap && d >= gap.from - 3 && d <= gap.to) {
    const move = gap.size * S;
    const loss = Math.round(Math.abs(0.5 * g.gamma * move ** 2 + delta * move));
    add({ id: "gapWindow", tone: "info", vars: { from: gap.from, to: gap.to, sizePct: Math.round(gap.size * 100), loss }, action: { kind: "tab", tab: "whatIf" } });
  }
  const shift = mission.market.ivSchedule?.find((e) => e.day > d);
  if (live && shift) {
    add({
      id: "ivShiftAhead", tone: "info",
      vars: { day: shift.day, iv: Math.round(shift.iv * 100), vega: Math.round(g.vega), vegaPnl: Math.round(g.vega * (shift.iv - market.iv[d]) * 100) },
      action: { kind: "tab", tab: "whatIf" },
    });
  }
  if (d === 0 && !state.fills.some((f) => f.tag === "manual" || f.tag === "auto")) {
    add({ id: "firstHedge", tone: "info", vars: { delta: Math.round(delta), perDollar: Math.round(Math.abs(delta)) }, action: { kind: "point", anchor: "delta" } });
  }
  if (live && Math.abs(delta) <= 0.7 * band) add({ id: "inBand", tone: "info", vars: { swing, band }, action: { kind: "key", code: "F2" } });
  const breakeven = breakevenMove(g.gamma, g.theta);
  if (breakeven !== null) {
    add({ id: "thetaVsGamma", tone: "info", vars: { breakeven: round1(breakeven), implied: round1(S * sigmaDay) }, action: { kind: "point", anchor: "profile" } });
  }
  if (mission.instruments === "stock") add({ id: "optionsLocked", tone: "info", vars: {} });
  if (mission.costs.ticketFee > 0) add({ id: "ticketFee", tone: "info", vars: { fee: mission.costs.ticketFee } });

  return out
    .map((a, i) => ({ a, i }))
    .sort((x, y) => TONE_ORDER[x.a.tone] - TONE_ORDER[y.a.tone] || x.i - y.i)
    .slice(0, MAX_ITEMS)
    .map((x) => x.a);
}
