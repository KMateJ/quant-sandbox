import { reduceRetirement, startRetirement } from "./book.math";
import { yearShocks } from "./market.math";
import type { RetirementMission, RetirementState, SpendRule } from "./retirement.types";

/// Plays every year with a fixed spending rule at one equity share (default: the mission's), through the reducer.
export function replayRetirement(mission: RetirementMission, seed: number, rule: SpendRule, equity = mission.equity0): RetirementState {
  const start = { ...startRetirement(mission, seed), equity };
  return reduceRetirement(start, { type: "auto", years: mission.years, rule }, mission, yearShocks(mission, seed));
}
