import { annuityFV } from "../../lib/finance/annuity";
import { fv } from "../../lib/finance/discount";
import { bisection } from "../../lib/math/roots";
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

/// Outcome of solving for one input: the value, or why the target can't be reached.
export type TvmSolution =
  | { ok: true; value: number }
  | { ok: false; reason: "tooLow" | "tooHigh" | "never" };

/// Annual contribution that grows `principal` to `target` in `years` at `rate`.
/// A target below what the principal alone reaches would need withdrawals, so it is reported as too low.
export function solvePayment(target: number, principal: number, rate: number, years: number): TvmSolution {
  const fromPrincipal = balanceAt(principal, 0, rate, years);
  if (target < fromPrincipal) return { ok: false, reason: "tooLow" };
  return { ok: true, value: (target - fromPrincipal) / annuityFV(1, rate, years) };
}

const MAX_RATE = 1;

/// Annual rate in [0, 100%] at which the plan reaches `target`; the balance rises with the rate, so bisection applies.
export function solveRate(target: number, principal: number, payment: number, years: number): TvmSolution {
  const gap = (r: number) => balanceAt(principal, payment, r, years) - target;
  if (gap(0) > 0) return { ok: false, reason: "tooLow" };
  if (gap(MAX_RATE) < 0) return { ok: false, reason: "tooHigh" };
  return { ok: true, value: bisection(gap, 0, MAX_RATE, { tol: 1e-12, maxIter: 200 }).root };
}

/// Years (fractional) until the balance reaches `target`, from P(1+r)^n + C·((1+r)^n − 1)/r = target.
export function solveYears(target: number, principal: number, payment: number, rate: number): TvmSolution {
  if (target <= principal) return { ok: true, value: 0 };
  if (rate === 0) return payment > 0 ? { ok: true, value: (target - principal) / payment } : { ok: false, reason: "never" };
  const start = principal + payment / rate;
  if (start <= 0) return { ok: false, reason: "never" };
  return { ok: true, value: Math.log((target + payment / rate) / start) / Math.log(1 + rate) };
}

/// Exact doubling time of a lump sum under annual compounding, ln 2 / ln(1 + r); infinite at r = 0.
export function doublingTime(rate: number): number {
  return rate > 0 ? Math.LN2 / Math.log(1 + rate) : Infinity;
}

/// The rule-of-72 approximation of the doubling time, 72 / (100 r).
export function ruleOf72(rate: number): number {
  return rate > 0 ? 72 / (rate * 100) : Infinity;
}

/// Balance at `t` split into money paid in and interest earned (interest = balance − contributions).
export function balanceSplit(principal: number, payment: number, rate: number, t: number) {
  const balance = balanceAt(principal, payment, rate, t);
  const paidIn = contributionsAt(principal, payment, t);
  return { balance, paidIn, interest: balance - paidIn };
}

// #region Deposit-plan race

/// A savings plan: a level contribution at the end of every year from `start` on, or a single deposit at `start`.
export type DepositPlan = { kind: "annual" | "lump"; amount: number; start: number };

/// Balance of a plan after `t` years (fractional `t` interpolates growth smoothly for animation).
export function planBalance(plan: DepositPlan, rate: number, t: number): number {
  const held = t - plan.start;
  if (held <= 0) return plan.kind === "lump" && held === 0 ? plan.amount : 0;
  if (plan.kind === "lump") return plan.amount * Math.pow(1 + rate, held);
  // Whole contributions made so far, each compounding from its own year-end.
  const n = Math.floor(held + 1e-9);
  const atLast = annuityFV(plan.amount, rate, n);
  return atLast * Math.pow(1 + rate, held - n);
}

/// Money paid into a plan after `t` years.
export function planPaidIn(plan: DepositPlan, t: number): number {
  const held = t - plan.start;
  if (plan.kind === "lump") return held >= 0 ? plan.amount : 0;
  return held > 0 ? plan.amount * Math.floor(held + 1e-9) : 0;
}

/// Index of the plan with the highest balance after `t` years, or −1 while every balance is still zero.
export function raceLeader(plans: DepositPlan[], rate: number, t: number): number {
  let best = -1;
  let top = 0;
  plans.forEach((p, i) => {
    const b = planBalance(p, rate, t);
    if (b > top + 1e-9) {
      top = b;
      best = i;
    }
  });
  return best;
}

// #endregion

// #region Sequence-of-returns risk

/// Illustrative yearly returns (made up, with one −30% crash) for the sequence-of-returns panel.
export const SEQUENCE_RETURNS = [0.08, 0.12, -0.3, 0.15, 0.06, 0.1, -0.05, 0.18, 0.04, 0.09, 0.11, -0.02, 0.07, 0.13, 0.05];
export const SEQUENCE_START = 100_000;

export type SequencePath = { wealth: number[]; ranOutYear: number | null };

/// Wealth at each year-end when `returns[k]` is earned in year k + 1 and `withdrawal` is taken at each year-end.
/// Wealth never goes below zero; `ranOutYear` is the first year it hits zero (null if it never does).
export function sequenceWealth(returns: number[], start: number, withdrawal: number): SequencePath {
  const wealth = [start];
  let ranOutYear: number | null = null;
  let w = start;
  returns.forEach((r, k) => {
    w = ranOutYear === null ? w * (1 + r) - withdrawal : 0;
    if (w <= 0 && ranOutYear === null) ranOutYear = k + 1;
    w = Math.max(0, w);
    wealth.push(w);
  });
  return { wealth, ranOutYear };
}

export type SequencePreset = "original" | "crashFirst" | "crashLast";

/// An order of the return indices: as given, or with the worst year moved to the front or the back.
export function presetOrder(returns: number[], preset: SequencePreset): number[] {
  const order = returns.map((_, i) => i);
  if (preset === "original") return order;
  const worst = returns.indexOf(Math.min(...returns));
  const rest = order.filter((i) => i !== worst);
  return preset === "crashFirst" ? [worst, ...rest] : [...rest, worst];
}

/// Moves the entry at position `from` to position `to`, shifting the ones in between.
export function moveInOrder(order: number[], from: number, to: number): number[] {
  const next = order.slice();
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, item);
  return next;
}

/// Parses "3,0,1,…" into a permutation of 0…n−1, or null if it isn't one.
export function parseOrder(raw: string, n: number): number[] | null {
  const order = raw.split(",").map((s) => Number(s));
  const ok = order.length === n && order.every((i) => Number.isInteger(i) && i >= 0 && i < n) && new Set(order).size === n;
  return ok ? order : null;
}

// #endregion
