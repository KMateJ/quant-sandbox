import { capmExpectedReturn } from "./capm";

/// Cost of equity via CAPM: rf + β·(E[rm] − rf). Thin wrapper for valuation readability.
export function costOfEquity(
  riskFree: number,
  beta: number,
  marketReturn: number
): number {
  return capmExpectedReturn(riskFree, beta, marketReturn);
}

/// After-tax cost of debt: kd·(1 − taxRate).
export function afterTaxCostOfDebt(costOfDebt: number, taxRate: number): number {
  return costOfDebt * (1 - taxRate);
}

/// Inputs for a weighted-average cost of capital calculation.
export interface WaccInputs {
  /// Market value of equity.
  equity: number;
  /// Market value of debt.
  debt: number;
  /// Cost of equity (e.g. from CAPM).
  costOfEquity: number;
  /// Pre-tax cost of debt.
  costOfDebt: number;
  /// Marginal corporate tax rate in [0, 1].
  taxRate: number;
}

/// Weighted-average cost of capital: (E/V)·ke + (D/V)·kd·(1 − tax).
export function wacc(inputs: WaccInputs): number {
  const { equity, debt, costOfEquity, costOfDebt, taxRate } = inputs;
  const v = equity + debt;
  if (v <= 0) throw new Error("wacc: total capital must be positive");
  const we = equity / v;
  const wd = debt / v;
  return we * costOfEquity + wd * afterTaxCostOfDebt(costOfDebt, taxRate);
}

/// Gordon-growth terminal value from the last explicit cashflow: cf·(1 + g) / (r − g).
/// Requires discount rate `r` strictly greater than growth `g`.
export function terminalValue(
  finalCashflow: number,
  growth: number,
  discountRate: number
): number {
  if (discountRate <= growth) {
    throw new Error("terminalValue: discount rate must exceed growth rate");
  }
  return (finalCashflow * (1 + growth)) / (discountRate - growth);
}

/// Discounted-cash-flow present value. `cashflows[i]` occurs at time `i + 1`.
/// When `terminalGrowth` is given, a Gordon terminal value is added at the final period.
export function dcfValue(
  cashflows: number[],
  discountRate: number,
  terminalGrowth?: number
): number {
  const n = cashflows.length;
  let pv = 0;
  for (let i = 0; i < n; i++) {
    pv += cashflows[i] / Math.pow(1 + discountRate, i + 1);
  }
  if (terminalGrowth !== undefined && n > 0) {
    const tv = terminalValue(cashflows[n - 1], terminalGrowth, discountRate);
    pv += tv / Math.pow(1 + discountRate, n);
  }
  return pv;
}
