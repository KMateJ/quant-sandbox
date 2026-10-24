import type { ObjectiveResult, ObjectiveStatus } from "../../../lib/game/game.types";
import { capStatus, countStatus, floorStatus } from "../../../lib/game/objectives";
import { surplusOf } from "../../immunization/immunization.math";
import type { AlmMission, AlmObjective, AlmState } from "./alm.types";
import { almConfig } from "./book.math";

function evaluate(def: AlmObjective, state: AlmState, surplus: number): ObjectiveResult<AlmObjective> {
  const done = state.settled;
  const res = (status: ObjectiveStatus, value: number) => ({ def, status, value });
  switch (def.kind) {
    case "surplusAtEnd":
      return res(floorStatus(surplus, def.floor, def.floor, done), surplus);
    case "gapMisses":
      return res(countStatus(state.misses, def.allowed, done), state.misses);
    case "convexityMisses":
      return res(countStatus(state.convMisses, def.allowed, done), state.convMisses);
    case "costsBelow":
      return res(capStatus(state.costs, def.limit, 0.8 * def.limit, done), state.costs);
    case "maxTrades":
      return res(capStatus(state.trades, def.limit, def.limit, done), state.trades);
    case "surplusFloor":
      return res(state.minSurplus < def.floor ? "fail" : floorStatus(surplus, def.floor, def.floor / 2, done), state.minSurplus);
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Status and value of each of the mission's objectives for the current book.
export function evaluateAlm(mission: AlmMission, state: AlmState): ObjectiveResult<AlmObjective>[] {
  const surplus = surplusOf(state.game, almConfig(mission));
  return mission.objectives.map((def) => evaluate(def, state, surplus));
}
