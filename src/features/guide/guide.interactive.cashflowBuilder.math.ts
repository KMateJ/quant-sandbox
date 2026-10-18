import { irr, npv } from "../../lib/finance/annuity";

/// Default project: −100 now, 25 a year for five years, nothing in year 6.
export const CASHFLOW_DEFAULTS = [-100, 25, 25, 25, 25, 25, 0];
/// Allowed range of a single cash flow while dragging.
export const CASHFLOW_MIN = -150;
export const CASHFLOW_MAX = 80;

/// Clamps a dragged value to the allowed range and snaps it to an integer.
export function snapCashflow(value: number): number {
  return Math.round(Math.min(CASHFLOW_MAX, Math.max(CASHFLOW_MIN, value)));
}

/// Present value of each cash flow, CF_t / (1 + r)^t.
export function presentValues(flows: number[], r: number): number[] {
  return flows.map((cf, t) => cf / Math.pow(1 + r, t));
}

/// Number of sign changes in the cash-flow sequence, ignoring zeros.
export function signChanges(flows: number[]): number {
  const signs = flows.filter((cf) => cf !== 0).map(Math.sign);
  let changes = 0;
  for (let i = 1; i < signs.length; i++) if (signs[i] !== signs[i - 1]) changes++;
  return changes;
}

/// Rates in [lo, hi] where the NPV crosses zero, found by scanning a grid and bisecting each bracket.
export function irrRoots(flows: number[], lo = -0.5, hi = 1, steps = 600): number[] {
  const f = (r: number) => npv(r, flows);
  const roots: number[] = [];
  let a = lo;
  let fa = f(a);
  for (let i = 1; i <= steps; i++) {
    const b = lo + ((hi - lo) * i) / steps;
    const fb = f(b);
    if (fa === 0) roots.push(a);
    else if (fa * fb < 0) {
      let x = a;
      let y = b;
      for (let k = 0; k < 60; k++) {
        const m = (x + y) / 2;
        if (f(x) * f(m) <= 0) y = m;
        else x = m;
      }
      roots.push((x + y) / 2);
    }
    a = b;
    fa = fb;
  }
  return roots;
}

export type CashflowSummary = {
  npv: number;
  /// The IRR when it is unique, otherwise NaN.
  irr: number;
  /// True when the flows change sign more than once or the NPV has several roots.
  severalIrrs: boolean;
  roots: number[];
  sum: number;
};

/// NPV at `r`, the IRR (only when unambiguous) and the undiscounted sum of the flows.
export function summarizeCashflows(flows: number[], r: number): CashflowSummary {
  const roots = irrRoots(flows);
  const severalIrrs = signChanges(flows) > 1 || roots.length > 1;
  const unique = roots.length === 1 ? roots[0] : signChanges(flows) === 1 ? irr(flows) : NaN;
  return {
    npv: npv(r, flows),
    irr: severalIrrs ? NaN : unique,
    severalIrrs,
    roots,
    sum: flows.reduce((s, cf) => s + cf, 0),
  };
}
