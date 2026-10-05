import { annuityFV } from "../../lib/finance/annuity";
import { fv } from "../../lib/finance/discount";
import type { TvmPoint } from "./tvm.types";

/// Account balance after `t` years: compounded principal plus accumulated annual contributions.
export function balanceAt(
  principal: number,
  payment: number,
  rate: number,
  t: number
): number {
  return fv(principal, rate, t, "discrete") + annuityFV(payment, rate, t);
}

/// Cumulative money paid in after `t` years: the initial principal plus `t` contributions.
export function contributionsAt(principal: number, payment: number, t: number): number {
  return principal + payment * t;
}

/// Year-by-year schedule of balance and cumulative contributions from year 0 to `years`.
export function balanceSchedule(
  principal: number,
  payment: number,
  rate: number,
  years: number
): TvmPoint[] {
  const points: TvmPoint[] = [];
  for (let t = 0; t <= years; t++) {
    points.push({
      year: t,
      balance: balanceAt(principal, payment, rate, t),
      contributions: contributionsAt(principal, payment, t),
    });
  }
  return points;
}
