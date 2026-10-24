import { CUT_RATIO } from "./engine/book.math";
import { nextWithdrawal, withdrawalRate } from "./engine/rules.math";
import type { RetirementMission, RetirementState } from "./engine/retirement.types";

export type PresetId = "initial" | "now" | "guard" | "low";
export const PRESETS: readonly PresetId[] = ["initial", "now", "guard", "low"];

/// Typed withdrawal as a non-negative amount, or null when it is empty, negative or not a number.
export function parseAmount(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw.replace(/[,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/// Amount each preset fills: 4% of the start pot, 4% of wealth now, the guardrail amount, 3.5% of the start pot.
export function presetAmount(id: PresetId, mission: RetirementMission, state: RetirementState): number {
  switch (id) {
    case "initial":
      return nextWithdrawal("fixed", mission, null, state.wealth);
    case "now":
      return nextWithdrawal("pctWealth", mission, null, state.wealth);
    case "guard":
      return nextWithdrawal("guardrails", mission, state.last, state.wealth);
    case "low":
      return nextWithdrawal("fixedLow", mission, null, state.wealth);
    default: {
      const never: never = id;
      return never;
    }
  }
}

export type DecisionPreview = { rate: number; change: number | null; isCut: boolean; cover: number };

/// What this year's decision means: withdrawal rate, change vs last year, whether it counts as a cut, years of cover.
export function decisionPreview(amountIn: number, state: RetirementState): DecisionPreview {
  const change = state.last ? amountIn / state.last - 1 : null;
  return {
    rate: withdrawalRate(amountIn, state.wealth),
    change,
    isCut: state.last !== null && state.last > 0 && amountIn < CUT_RATIO * state.last,
    cover: amountIn > 0 ? state.wealth / amountIn : Infinity,
  };
}

/// Compound yearly return over the first ten years played, or null before the first year.
export function firstDecadeReturn(state: RetirementState): number | null {
  const rows = state.rows.slice(0, 10);
  if (!rows.length) return null;
  return rows.reduce((g, r) => g * (1 + r.r), 1) ** (1 / rows.length) - 1;
}

/// Wealth path of the fixed-target rule on the returns played so far (year 0 first).
export function fixedRulePath(mission: RetirementMission, state: RetirementState): number[] {
  const out = [mission.start];
  let w = mission.start;
  for (const row of state.rows) {
    w = w > mission.target ? (w - mission.target) * (1 + row.r) : 0;
    out.push(w);
  }
  return out;
}
