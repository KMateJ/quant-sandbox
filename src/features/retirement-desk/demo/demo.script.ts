import type { DemoStepBase } from "../../../lib/game/game.types";
import type { RetirementAction } from "../engine/retirement.types";
import type { RetirementScreen } from "../retirementDesk.url";

export type RetirementDemoStep = DemoStepBase<RetirementScreen, RetirementAction>;

/// Mission and seed of the playthrough; seed 4 gives T1 a mixed first years (+5%, −9%, −1%, +9%, −9%).
export const RETIREMENT_DEMO_MISSION = "T1";
export const RETIREMENT_DEMO_SEED = 4;
const HOLD_MS = 6000;
const HOLD_LONG_MS = 9000;

/// Six-step playthrough of T1: take 40,000 at 60% equity, five guardrail years, then the odds and what-if views.
export function buildRetirementDemo(): RetirementDemoStep[] {
  const step = (id: string, screen: RetirementScreen, anchor: string, actions: RetirementAction[] = [], holdMs = HOLD_MS): RetirementDemoStep =>
    ({ id, screen, anchor, actions, holdMs });
  return [
    step("welcome", "desk", "quotes"),
    step("firstYear", "desk", "ticket", [{ type: "take", amount: 40_000, equity: 0.6, tag: "manual" }]),
    step("guardFive", "desk", "wealth", [{ type: "auto", years: 5, rule: "guardrails" }], HOLD_LONG_MS),
    step("oddsChart", "desk", "odds", [], HOLD_LONG_MS),
    step("whatIf", "desk", "ticket"),
    step("yourTurn", "desk", "tabs"),
  ];
}
