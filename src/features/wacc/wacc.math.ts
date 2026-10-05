import { afterTaxCostOfDebt, wacc } from "../../lib/finance/valuation";
import type { WaccPoint } from "./wacc.types";

/// After-tax cost of debt: kd·(1 − tax). Re-exported for the view's summary.
export { afterTaxCostOfDebt };

/// WACC at a given debt ratio d = D/V, holding ke and kd fixed.
export function waccAt(
  costOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  debtRatio: number
): number {
  return wacc({
    equity: 1 - debtRatio,
    debt: debtRatio,
    costOfEquity,
    costOfDebt,
    taxRate,
  });
}

/// WACC across debt ratios in [0, maxDebtRatio], showing the tax-shield effect of leverage.
export function waccCurve(
  costOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  maxDebtRatio: number,
  steps: number
): WaccPoint[] {
  const points: WaccPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const debtRatio = (i / steps) * maxDebtRatio;
    points.push({ debtRatio, wacc: waccAt(costOfEquity, costOfDebt, taxRate, debtRatio) });
  }
  return points;
}
