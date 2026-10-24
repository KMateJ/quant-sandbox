import { capStatus, countStatus, floorStatus } from "../../../lib/game/objectives";
import type { ObjectiveResult, ObjectiveStatus } from "../../../lib/game/game.types";
import { hedgedPnl } from "./book.math";
import type { RatesMission, RatesObjective, RatesState } from "./rates.types";

function evaluate(def: RatesObjective, state: RatesState): ObjectiveResult<RatesObjective> {
  const done = state.settled;
  const res = (status: ObjectiveStatus, value: number) => ({ def, status, value });
  switch (def.kind) {
    case "dv01Misses":
      return res(countStatus(state.misses, def.allowed, done), state.misses);
    case "krdMisses":
      return res(countStatus(state.krdMisses, def.allowed, done), state.krdMisses);
    case "pnlWithin": {
      const v = hedgedPnl(state);
      const ok = Math.abs(v) <= def.limit;
      return res(done ? (ok ? "pass" : "fail") : ok ? "onTrack" : "atRisk", v);
    }
    case "pnlAbove": {
      const v = hedgedPnl(state);
      return res(floorStatus(v, def.target, def.target, done), v);
    }
    case "costsBelow":
      return res(capStatus(state.costs, def.limit, 0.8 * def.limit, done), state.costs);
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Live (or final, once settled) status of every mission objective.
export function evaluateRates(mission: RatesMission, state: RatesState): ObjectiveResult<RatesObjective>[] {
  return mission.objectives.map((o) => evaluate(o, state));
}
