import type { RetirementMission, SpendRule } from "./retirement.types";

/// Guardrails: cut 10% above this withdrawal rate, raise 10% below the lower one.
export const RAIL_HIGH = 0.048;
export const RAIL_LOW = 0.032;

/// Withdrawal rate of `amount` against `wealth` (1 when nothing is left).
export const withdrawalRate = (amount: number, wealth: number) => (wealth <= 0 ? 1 : amount / wealth);

/// This year's amount under a spending rule, given last year's amount and wealth now.
export function nextWithdrawal(rule: SpendRule, mission: RetirementMission, last: number | null, wealth: number): number {
  switch (rule) {
    case "fixed":
      return mission.target;
    case "fixedLow":
      return 0.875 * mission.target;
    case "pctWealth":
      return 0.04 * Math.max(0, wealth);
    case "guardrails": {
      if (last === null) return mission.target;
      const rate = withdrawalRate(last, wealth);
      return rate > RAIL_HIGH ? last * 0.9 : rate < RAIL_LOW ? last * 1.1 : last;
    }
    default: {
      const never: never = rule;
      return never;
    }
  }
}
