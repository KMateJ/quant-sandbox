import { useMemo } from "react";
import { allPassed } from "../../lib/game/objectives";
import { avgSpend } from "./engine/objectives.math";
import { replayRetirement } from "./engine/policy.math";
import type { RetirementMission, RetirementState, SpendRule } from "./engine/retirement.types";
import type { RetirementDeskModel } from "./useRetirementDesk";

/// Reference spending rules replayed on the same returns.
export const DEBRIEF_RULES: readonly SpendRule[] = ["fixed", "fixedLow", "pctWealth", "guardrails"];

export type RunSummary = { lasts: boolean; outYear: number; avg: number; cuts: number; left: number; total: number };

/// Headline numbers of one run; `outYear` is the year the money ran out (0 if it lasted).
export function runSummary(mission: RetirementMission, s: RetirementState): RunSummary {
  return {
    lasts: !s.broke,
    outYear: s.broke ? s.rows.length : 0,
    avg: avgSpend(mission, s),
    cuts: s.cuts,
    left: s.wealth,
    total: s.rows.reduce((a, r) => a + r.take, 0),
  };
}

/// Debrief numbers: rule replays, your run's summary and the wealth bridge. Progress is recorded by the session hook.
export function useRetirementDebrief(desk: RetirementDeskModel) {
  const { mission, seed, state, objectives } = desk;
  const rules = useMemo(() => DEBRIEF_RULES.map((rule) => ({ rule, ...runSummary(mission, replayRetirement(mission, seed, rule)) })), [mission, seed]);
  const you = runSummary(mission, state);
  const bridge = { start: mission.start, withdrawn: -you.total, growth: state.wealth - mission.start + you.total, end: state.wealth };
  return { rules, you, bridge, passed: allPassed(objectives) };
}
