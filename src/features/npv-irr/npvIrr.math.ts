import { irr, npv } from "../../lib/finance/annuity";
import type { NpvPoint, NpvScheduleRow } from "./npvIrr.types";

/// Cashflow stream: an initial outflow at t=0 followed by `years` level annual inflows.
export function buildCashflows(outlay: number, annual: number, years: number): number[] {
  const cashflows = [-outlay];
  for (let i = 0; i < years; i++) cashflows.push(annual);
  return cashflows;
}

/// Net present value of the project at a given discount `rate`.
export function netPresentValue(
  rate: number,
  outlay: number,
  annual: number,
  years: number
): number {
  return npv(rate, buildCashflows(outlay, annual, years));
}

/// Internal rate of return: the discount rate at which NPV equals zero.
export function internalRateOfReturn(
  outlay: number,
  annual: number,
  years: number
): number {
  return irr(buildCashflows(outlay, annual, years));
}

/// Profitability index: present value of inflows divided by the initial outlay.
export function profitabilityIndex(
  rate: number,
  outlay: number,
  annual: number,
  years: number
): number {
  if (outlay === 0) return NaN;
  const inflows = [0, ...Array.from({ length: years }, () => annual)];
  return npv(rate, inflows) / outlay;
}

/// NPV profile: NPV across discount rates in [rMin, rMax].
export function npvProfile(
  outlay: number,
  annual: number,
  years: number,
  rMin: number,
  rMax: number,
  steps: number
): NpvPoint[] {
  const cashflows = buildCashflows(outlay, annual, years);
  const points: NpvPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const rate = rMin + (i / steps) * (rMax - rMin);
    points.push({ rate, npv: npv(rate, cashflows) });
  }
  return points;
}

/// Per-year discounted cashflow schedule with a running cumulative present value.
export function cashflowSchedule(
  outlay: number,
  annual: number,
  years: number,
  rate: number
): NpvScheduleRow[] {
  const cashflows = buildCashflows(outlay, annual, years);
  const rows: NpvScheduleRow[] = [];
  let cumulativePv = 0;
  for (let t = 0; t < cashflows.length; t++) {
    const discount = 1 / Math.pow(1 + rate, t);
    const pv = cashflows[t] * discount;
    cumulativePv += pv;
    rows.push({ year: t, cashflow: cashflows[t], discount, pv, cumulativePv });
  }
  return rows;
}

/// Discounted payback: interpolated year where cumulative present value turns non-negative.
export function discountedPayback(rows: NpvScheduleRow[]): number | null {
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1].cumulativePv;
    const curr = rows[i].cumulativePv;
    if (prev < 0 && curr >= 0) {
      return rows[i - 1].year + -prev / (curr - prev);
    }
  }
  return null;
}
