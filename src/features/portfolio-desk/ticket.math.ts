import type { Matrix } from "../../lib/math/matrix";
import { turnoverOf } from "./engine/book.math";
import { exAnteSharpe, exAnteVol } from "./engine/risk.math";
import type { PortfolioMission } from "./engine/portfolio.types";

export type TicketPreview = { valid: boolean; total: number; cash: number; vol: number; sharpe: number; turnover: number; cost: number };

/// Parses percent strings into weights; blanks count as 0, anything else non-numeric or negative gives NaN.
export function parseTargets(targets: readonly string[]): number[] {
  return targets.map((s) => {
    const v = s.trim() === "" ? 0 : Number(s);
    return Number.isFinite(v) && v >= 0 ? v / 100 : NaN;
  });
}

/// Weights as one-decimal percent strings for the ticket.
export const toTargets = (w: readonly number[]) => w.map((x) => (Math.round(x * 1000) / 10).toString());

/// What submitting `targets` would do: validity (each ≥ 0, total ≤ 100%), cash left, ex-ante vol and Sharpe, turnover, cost.
export function ticketPreview(w: number[], targets: number[], S: Matrix, mission: PortfolioMission, nav: number): TicketPreview {
  const total = targets.reduce((a, b) => a + b, 0);
  const valid = targets.every(Number.isFinite) && total <= 1 + 1e-9;
  if (!valid) return { valid, total, cash: NaN, vol: NaN, sharpe: NaN, turnover: NaN, cost: NaN };
  const turnover = turnoverOf(w, targets);
  return {
    valid,
    total,
    cash: 1 - total,
    vol: exAnteVol(targets, S),
    sharpe: exAnteSharpe(targets, S, mission),
    turnover,
    cost: (mission.costBp / 1e4) * nav * turnover,
  };
}
