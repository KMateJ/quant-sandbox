import { rankAdvice } from "../../../lib/game/advice";
import type { AdviceItem } from "../../../lib/game/game.types";
import { ODDS_WARN } from "../engine/objectives.math";
import { successOdds } from "../engine/odds.math";
import { nextWithdrawal, withdrawalRate } from "../engine/rules.math";
import type { RetirementMission, RetirementState } from "../engine/retirement.types";
import { firstDecadeReturn } from "../ticket.math";

export type RetirementAdviceAction =
  | { kind: "fill"; amount: number }
  | { kind: "equity"; equity: number }
  | { kind: "key"; code: "F2" | "F3" | "F4" }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | { kind: "point"; anchor: string };
export type RetirementAdvice = AdviceItem<RetirementAdviceAction>;
export type DecisionTicket = { amount: number; equity: number };

/// Every advice id, for copy coverage.
export const ADVICE_IDS = ["ended", "oddsLow", "noCutsLeft", "rateHot", "weakStart", "canSpendMore", "legacyGap", "onTrack"] as const;

const RATE_HOT = 0.05;
const ODDS_HIGH = 0.95;
const RAISE = 1.1;
const TRIM = 0.9;
const LEGACY_YEAR = 20;
const LEGACY_MARGIN = 1.5;

/// Next-move advice for the pending decision, most urgent first (at most six).
export function retirementAdvice(mission: RetirementMission, state: RetirementState, ticket: DecisionTicket, oddsNow: number): RetirementAdvice[] {
  if (state.settled) return [{ id: "ended", tone: "done", vars: { wealth: state.wealth }, action: { kind: "screen", screen: "debrief" } }];
  const y = state.year + 1;
  const odds = (amount: number) => successOdds(mission, state.seed, y, state.wealth, amount, ticket.equity);
  const guard = Math.round(nextWithdrawal("guardrails", mission, state.last, state.wealth));
  const rate = withdrawalRate(ticket.amount, state.wealth);
  const out: RetirementAdvice[] = [];

  if (oddsNow < ODDS_WARN) out.push({ id: "oddsLow", tone: "urgent", vars: { odds: oddsNow, guardOdds: odds(guard), guard }, action: { kind: "fill", amount: guard } });
  for (const o of mission.objectives) {
    if (o.kind === "cutsAtMost" && state.cuts >= o.allowed) out.push({ id: "noCutsLeft", tone: "urgent", vars: { allowed: o.allowed }, action: { kind: "point", anchor: "ticket" } });
    if (o.kind === "legacyAtLeast" && state.year > LEGACY_YEAR && state.wealth < LEGACY_MARGIN * o.amount) {
      const less = Math.round(TRIM * ticket.amount);
      out.push({ id: "legacyGap", tone: "suggest", vars: { wealth: state.wealth, legacy: o.amount, amount: less }, action: { kind: "fill", amount: less } });
    }
  }
  if (rate > RATE_HOT) out.push({ id: "rateHot", tone: "suggest", vars: { rate, guard }, action: { kind: "fill", amount: guard } });
  const decade = firstDecadeReturn(state);
  if (state.year < 10 && decade !== null && decade < 0) out.push({ id: "weakStart", tone: "info", vars: { r: decade }, action: { kind: "point", anchor: "returns" } });
  if (oddsNow > ODDS_HIGH && state.year >= 3) {
    const more = Math.round(RAISE * ticket.amount);
    out.push({ id: "canSpendMore", tone: "info", vars: { odds: odds(more), amount: more }, action: { kind: "fill", amount: more } });
  }
  if (oddsNow >= ODDS_WARN) out.push({ id: "onTrack", tone: "info", vars: { odds: oddsNow }, action: { kind: "key", code: "F2" } });
  return rankAdvice(out);
}
