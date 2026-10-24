import { rankAdvice } from "../../../lib/game/advice";
import type { AdviceItem } from "../../../lib/game/game.types";
import { zeroGrid } from "../engine/curve.math";
import { objectiveLimits } from "../engine/limits.math";
import { tenYearContract } from "../engine/policy.math";
import { bucketsOf, ctdSwitchBp, dv01HedgeQty, isExpired, ratesRisk } from "../engine/risk.math";
import type { CurveFactors, RatesMission, RatesState } from "../engine/rates.types";

export type RatesAdviceAction =
  | { kind: "ticket"; future: number; side: "BUY" | "SELL"; qty: number }
  | { kind: "krdHedge" }
  | { kind: "key"; code: "F2" | "F3" | "F4" | "F6" }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | { kind: "point"; anchor: string };
export type RatesAdvice = AdviceItem<RatesAdviceAction>;

/// Every advice id, for copy coverage.
export const ADVICE_IDS = ["ended", "dv01Outside", "noMissesLeft", "curveRisk", "rollDeadline", "ctdNear", "costsHigh", "pnlTarget", "inBand"] as const;

const DEFAULT_BAND = 1000;
const CURVE_RISK = 1500;
const CTD_NEAR_BP = 25;
const ROLL_WARN_DAYS = 2;

/// Next-move advice for the current state, most urgent first (at most six).
export function ratesAdvice(mission: RatesMission, state: RatesState, path: CurveFactors[]): RatesAdvice[] {
  const zeros = zeroGrid(path[state.day]);
  const risk = ratesRisk(state, mission, zeros);
  const pnl = state.hist[state.hist.length - 1].hedged;
  const out: RatesAdvice[] = [];
  const add = (a: RatesAdvice) => out.push(a);

  if (state.settled) {
    add({ id: "ended", tone: "done", vars: { pnl }, action: { kind: "screen", screen: "debrief" } });
    return out;
  }
  const band = objectiveLimits(mission).dv01Band ?? DEFAULT_BAND;
  const j = tenYearContract(mission, state.day);
  if (Math.abs(risk.net) > band) {
    const qty = j >= 0 ? dv01HedgeQty(state, mission, zeros, j) : 0;
    const action: RatesAdviceAction | undefined = qty !== 0 ? { kind: "ticket", future: j, side: qty > 0 ? "BUY" : "SELL", qty: Math.abs(qty) } : undefined;
    add({ id: "dv01Outside", tone: "urgent", vars: { net: risk.net, band, future: j, qty: Math.abs(qty) }, action });
  }
  for (const o of mission.objectives) {
    if (o.kind === "dv01Misses" && state.misses === o.allowed) add({ id: "noMissesLeft", tone: "urgent", vars: { allowed: o.allowed }, action: { kind: "point", anchor: "risk" } });
    if (o.kind === "costsBelow" && state.costs > 0.8 * o.limit) add({ id: "costsHigh", tone: "suggest", vars: { costs: state.costs, limit: o.limit } });
    if (o.kind === "pnlAbove") add({ id: "pnlTarget", tone: "info", vars: { gap: o.target - pnl, target: o.target }, action: { kind: "point", anchor: "pnl" } });
  }
  const buckets = bucketsOf(risk.kNet);
  const worst = buckets.reduce((w, v, k) => (Math.abs(v) > Math.abs(buckets[w]) ? k : w), 0);
  if (Math.abs(risk.net) <= band && Math.abs(buckets[worst]) > CURVE_RISK) {
    add({ id: "curveRisk", tone: "suggest", vars: { bucket: worst, value: buckets[worst] }, action: { kind: "krdHedge" } });
  }
  mission.futures.forEach((f, i) => {
    if (f.expiryDay === undefined || isExpired(f, state.day) || state.contracts[i] === 0) return;
    const left = f.expiryDay - state.day;
    if (left <= ROLL_WARN_DAYS) add({ id: "rollDeadline", tone: "urgent", vars: { future: i, days: left, qty: state.contracts[i] }, action: { kind: "tab", tab: "whatIf" } });
  });
  mission.futures.forEach((f, i) => {
    if (isExpired(f, state.day)) return;
    const bp = ctdSwitchBp(f, zeros);
    if (bp !== null && Math.abs(bp) <= CTD_NEAR_BP) add({ id: "ctdNear", tone: "info", vars: { future: i, bp }, action: { kind: "point", anchor: "ctd" } });
  });
  if (Math.abs(risk.net) <= band) add({ id: "inBand", tone: "info", vars: { net: risk.net }, action: { kind: "key", code: "F2" } });
  return rankAdvice(out);
}
