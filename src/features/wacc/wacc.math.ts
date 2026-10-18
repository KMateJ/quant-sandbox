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

// #region Realistic mode: the cost of debt rises with leverage

/// Credit-spread schedule of the realistic mode, s(L) = 8% · L² with L = D/V: lenders charge more as leverage grows.
export const SPREAD_COEFF = 0.08;

export const creditSpread = (debtRatio: number) => SPREAD_COEFF * debtRatio * debtRatio;

/// Cost of debt in the realistic mode: the base rate plus the leverage spread, r_D = r_f + s(L).
export function realisticCostOfDebt(baseRate: number, debtRatio: number): number {
  return baseRate + creditSpread(debtRatio);
}

/// Hamada levered cost of equity (debt beta zero): r_E = r_f + (r_U − r_f)·(1 + (1 − t)·D/E), D/E = L/(1 − L).
export function hamadaCostOfEquity(unleveredCost: number, baseRate: number, taxRate: number, debtRatio: number): number {
  const de = debtRatio / (1 - debtRatio);
  return baseRate + (unleveredCost - baseRate) * (1 + (1 - taxRate) * de);
}

/// Realistic WACC, E/V·r_E + D/V·r_D·(1 − t). Algebraically r_U·(1 − tL) + L·(1 − t)·s(L): the tax saving falls
/// linearly with leverage while the spread term grows like L³, so the curve has an interior minimum.
export function realisticWaccAt(unleveredCost: number, baseRate: number, taxRate: number, debtRatio: number): number {
  const rE = hamadaCostOfEquity(unleveredCost, baseRate, taxRate, debtRatio);
  const rD = realisticCostOfDebt(baseRate, debtRatio);
  return (1 - debtRatio) * rE + debtRatio * rD * (1 - taxRate);
}

export type RealisticPoint = { debtRatio: number; wacc: number; costOfEquity: number; afterTaxDebt: number };

/// WACC, cost of equity and after-tax cost of debt across D/V in [0, maxDebtRatio] in the realistic mode.
export function realisticCurve(unleveredCost: number, baseRate: number, taxRate: number, maxDebtRatio: number, steps: number): RealisticPoint[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const L = (i / steps) * maxDebtRatio;
    return {
      debtRatio: L,
      wacc: realisticWaccAt(unleveredCost, baseRate, taxRate, L),
      costOfEquity: hamadaCostOfEquity(unleveredCost, baseRate, taxRate, L),
      afterTaxDebt: realisticCostOfDebt(baseRate, L) * (1 - taxRate),
    };
  });
}

/// D/V with the lowest realistic WACC on [0, maxDebtRatio], by golden-section search (the curve is convex there).
export function minimumWaccRatio(unleveredCost: number, baseRate: number, taxRate: number, maxDebtRatio: number): number {
  const f = (L: number) => realisticWaccAt(unleveredCost, baseRate, taxRate, L);
  const g = (Math.sqrt(5) - 1) / 2;
  let [a, b] = [0, maxDebtRatio];
  for (let i = 0; i < 80; i++) {
    const c = b - g * (b - a);
    const d = a + g * (b - a);
    if (f(c) < f(d)) b = d;
    else a = c;
  }
  // The curve can be flat to rounding near an endpoint (no tax: r_U + L·s(L)), so prefer an endpoint that is no worse.
  const mid = (a + b) / 2;
  return [0, maxDebtRatio].reduce((best, L) => (f(L) <= f(best) + 1e-12 ? L : best), mid);
}

// #endregion
