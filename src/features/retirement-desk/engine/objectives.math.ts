import type { ObjectiveResult, ObjectiveStatus } from "../../../lib/game/game.types";
import { countStatus, floorStatus } from "../../../lib/game/objectives";
import type { RetirementMission, RetirementObjective, RetirementState } from "./retirement.types";

/// Odds below this put "money lasts" at risk.
export const ODDS_WARN = 0.7;

/// Average amount taken so far (the target before the first year).
export const avgSpend = (mission: RetirementMission, state: RetirementState) =>
  state.rows.length ? state.rows.reduce((a, r) => a + r.take, 0) / state.rows.length : mission.target;

function evaluate(def: RetirementObjective, mission: RetirementMission, state: RetirementState, oddsNow: number): ObjectiveResult<RetirementObjective> {
  const done = state.settled;
  const res = (status: ObjectiveStatus, value: number) => ({ def, status, value });
  switch (def.kind) {
    case "moneyLasts":
      return res(state.broke ? "fail" : done ? "pass" : oddsNow < ODDS_WARN ? "atRisk" : "onTrack", oddsNow);
    case "avgSpendAtLeast": {
      const avg = avgSpend(mission, state);
      return res(state.broke ? "fail" : floorStatus(avg, def.amount, def.amount, done), avg);
    }
    case "cutsAtMost":
      return res(countStatus(state.cuts, def.allowed, done), state.cuts);
    case "legacyAtLeast":
      return res(state.broke ? "fail" : floorStatus(state.wealth, def.amount, def.amount * 1.2, done), state.wealth);
    case "oddsNeverBelow":
      return res(state.minOdds < def.floor ? "fail" : floorStatus(state.minOdds, def.floor, def.floor + 0.05, done), state.minOdds);
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Status and value of each mission objective; `oddsNow` is the success odds of the pending decision.
export function evaluateRetirement(mission: RetirementMission, state: RetirementState, oddsNow: number): ObjectiveResult<RetirementObjective>[] {
  return mission.objectives.map((def) => evaluate(def, mission, state, oddsNow));
}
