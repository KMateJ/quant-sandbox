import { dcfValue, terminalValue } from "../../lib/finance/valuation";
import type { DcfPoint } from "./valuation.types";

/// Free cashflows growing at rate `g` for `years` periods, starting from `fcf1` in year 1.
export function projectCashflows(fcf1: number, g: number, years: number): number[] {
  const cashflows: number[] = [];
  for (let t = 0; t < years; t++) cashflows.push(fcf1 * Math.pow(1 + g, t));
  return cashflows;
}

/// Enterprise value: PV of the explicit free cashflows plus the discounted terminal value.
export function enterpriseValue(
  fcf1: number,
  g: number,
  years: number,
  wacc: number,
  terminalGrowth: number
): number {
  return dcfValue(projectCashflows(fcf1, g, years), wacc, terminalGrowth);
}

/// Gordon-growth terminal value at the end of the explicit horizon.
export function horizonTerminalValue(
  fcf1: number,
  g: number,
  years: number,
  wacc: number,
  terminalGrowth: number
): number {
  const cashflows = projectCashflows(fcf1, g, years);
  return terminalValue(cashflows[cashflows.length - 1], terminalGrowth, wacc);
}

/// Per-year schedule of nominal and discounted (present-value) free cashflows.
export function dcfSchedule(
  fcf1: number,
  g: number,
  years: number,
  wacc: number
): DcfPoint[] {
  let cumulativePv = 0;
  return projectCashflows(fcf1, g, years).map((fcf, i) => {
    const discount = 1 / Math.pow(1 + wacc, i + 1);
    const pv = fcf * discount;
    cumulativePv += pv;
    return { year: i + 1, fcf, pv, discount, cumulativePv };
  });
}
