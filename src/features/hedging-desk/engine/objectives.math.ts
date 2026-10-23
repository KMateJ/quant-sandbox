import { tradeCount } from "./book.math";
import { STOCK_ID } from "./desk.config";
import type { BookState, Market, MissionDef, ObjectiveDef, ObjectiveResult, ObjectiveStatus } from "./desk.types";
import { replayPolicy } from "./policy.math";
import { markToMarket } from "./risk.math";

/// "Stay at or below a limit" rule: fail above, pass once settled, at risk from `warnFrom`.
function capStatus(value: number, limit: number, warnFrom: number, settled: boolean): ObjectiveStatus {
  if (value > limit) return "fail";
  if (settled) return "pass";
  return value >= warnFrom ? "atRisk" : "onTrack";
}

/// Status and value of one objective for the current state.
function evaluate(def: ObjectiveDef, mission: MissionDef, state: BookState, market: Market): ObjectiveResult {
  const done = state.settled;
  const res = (status: ObjectiveStatus, value: number): ObjectiveResult => ({ def, status, value });
  switch (def.kind) {
    case "maxBreaches":
      return res(capStatus(state.breaches, def.limit, def.limit, done), state.breaches);
    case "pnlWithin": {
      const v = markToMarket(state, market);
      const ok = Math.abs(v) <= def.limit;
      return res(done ? (ok ? "pass" : "fail") : ok ? "onTrack" : "atRisk", v);
    }
    case "costsBelow": {
      const v = state.costsPaid;
      return res(v > def.limit ? "fail" : done ? "pass" : v > 0.8 * def.limit ? "atRisk" : "onTrack", v);
    }
    case "maxTrades": {
      const v = tradeCount(state);
      return res(capStatus(v, def.limit, def.limit - 2, done), v);
    }
    case "pnlAbove": {
      const v = markToMarket(state, market);
      const ok = v >= def.limit;
      return res(done ? (ok ? "pass" : "fail") : ok ? "onTrack" : "atRisk", v);
    }
    case "gammaLimitFrom": {
      const v = Math.max(0, ...state.history.filter((r) => r.day >= def.fromDay).map((r) => Math.abs(r.gamma)));
      return res(v > def.limit ? "fail" : done ? "pass" : "onTrack", v);
    }
    case "gapLoss": {
      const g = market.gapDay;
      const at = g === null ? undefined : state.history.find((r) => r.day === g);
      const before = g === null ? undefined : state.history.find((r) => r.day === g - 1);
      const v = at && before ? at.pnl - before.pnl : 0;
      return res(v < -def.limit ? "fail" : done ? "pass" : "onTrack", v);
    }
    case "vegaLimitBy": {
      const rec = state.history.find((r) => r.day === def.byDay - 1);
      if (!rec) return res("onTrack", 0);
      const v = Math.abs(rec.vega);
      return res(v <= def.limit ? "pass" : "fail", v);
    }
    case "beatPolicy": {
      const v = markToMarket(state, market);
      if (!done) return res("onTrack", v);
      const diff = v - replayPolicy(mission, market, state.seed, def.every).pnl;
      return res(diff >= 0 ? "pass" : "fail", diff);
    }
    case "flatStock": {
      const v = state.positions[STOCK_ID] ?? 0;
      return res(done ? (v === 0 ? "pass" : "fail") : "onTrack", v);
    }
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Evaluates every objective of `mission` against the current book.
export function evaluateObjectives(mission: MissionDef, state: BookState, market: Market): ObjectiveResult[] {
  return mission.objectives.map((def) => evaluate(def, mission, state, market));
}
