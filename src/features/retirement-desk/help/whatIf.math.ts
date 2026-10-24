import { successOdds } from "../engine/odds.math";
import { nextWithdrawal, withdrawalRate } from "../engine/rules.math";
import type { RetirementMission, RetirementState } from "../engine/retirement.types";
import { decisionPreview } from "../ticket.math";
import type { DecisionTicket } from "./advice.math";

export type WhatIfId = "thisDecision" | "spendTarget" | "guardrail" | "spendLess10" | "equity40" | "equity80";
export type WhatIfVerdict = "comfortable" | "stretched" | "likelyOut" | "countsAsCut";
export type WhatIfResult = { id: WhatIfId; amount: number; equity: number; rate: number; odds: number; verdicts: WhatIfVerdict[] };

/// Every what-if id, for copy coverage.
export const WHAT_IF_IDS: readonly WhatIfId[] = ["thisDecision", "spendTarget", "guardrail", "spendLess10", "equity40", "equity80"];

const COMFORTABLE = 0.85;
const STRETCHED = 0.7;

/// This year's decision against five alternatives: amount, equity, withdrawal rate and success odds of each.
export function retirementWhatIf(mission: RetirementMission, state: RetirementState, ticket: DecisionTicket): WhatIfResult[] {
  const y = state.year + 1;
  const guard = Math.round(nextWithdrawal("guardrails", mission, state.last, state.wealth));
  const options: { id: WhatIfId; amount: number; equity: number }[] = [
    { id: "thisDecision", amount: ticket.amount, equity: ticket.equity },
    { id: "spendTarget", amount: mission.target, equity: ticket.equity },
    { id: "guardrail", amount: guard, equity: ticket.equity },
    { id: "spendLess10", amount: Math.round(0.9 * ticket.amount), equity: ticket.equity },
  ];
  if (!mission.equityLocked) options.push({ id: "equity40", amount: ticket.amount, equity: 0.4 }, { id: "equity80", amount: ticket.amount, equity: 0.8 });
  return options.map((o) => {
    const odds = successOdds(mission, state.seed, y, state.wealth, o.amount, o.equity);
    const word: WhatIfVerdict = odds >= COMFORTABLE ? "comfortable" : odds >= STRETCHED ? "stretched" : "likelyOut";
    const verdicts: WhatIfVerdict[] = decisionPreview(o.amount, state).isCut ? [word, "countsAsCut"] : [word];
    return { ...o, rate: withdrawalRate(o.amount, state.wealth), odds, verdicts };
  });
}
