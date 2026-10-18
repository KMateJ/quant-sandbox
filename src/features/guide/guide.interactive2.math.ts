import { blackScholesCall, blackScholesDelta } from "../black-scholes/blackScholes.math";
import { makeRng, nextNormal, type Rng } from "../../lib/math/random";
import { normPdf } from "../../lib/stats/distributions";

// #region Duration as a balance point

/// Cash flows of a bond (face 100, annual coupons) with their present values and PV weights.
/// The Macaulay duration is the PV-weighted mean time: the point where the PV bars balance.
export function bondCashflowBalance(coupon: number, years: number, y: number) {
  const flows = Array.from({ length: years }, (_, i) => {
    const t = i + 1;
    const cf = 100 * coupon + (t === years ? 100 : 0);
    return { t, cf, pv: cf / (1 + y) ** t };
  });
  const price = flows.reduce((sum, f) => sum + f.pv, 0);
  const duration = flows.reduce((sum, f) => sum + f.t * f.pv, 0) / price;
  return { flows: flows.map((f) => ({ ...f, weight: f.pv / price })), price, duration };
}
// #endregion

// #region Galton walk

/// Endpoint of one symmetric ±1 walk of n steps.
export function walkEndpoint(rng: Rng, n: number): number {
  let x = 0;
  for (let i = 0; i < n; i++) x += rng() < 0.5 ? 1 : -1;
  return x;
}

/// Counts of endpoints −n, −n+2, …, n, with the normal approximation N(0, n) scaled to the same total.
export function endpointHistogram(endpoints: number[], n: number) {
  const counts = new Map<number, number>();
  endpoints.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
  const total = endpoints.length;
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = -n + 2 * i;
    // Endpoints sit 2 apart, so a bin holds probability ≈ 2·φ(x/√n)/√n.
    return { x, count: counts.get(x) ?? 0, normal: (total * 2 * normPdf(x / Math.sqrt(n))) / Math.sqrt(n) };
  });
}
// #endregion

// #region Discrete delta hedging

export type HedgeSetup = { S0: number; K: number; r: number; sigma: number; T: number; days: number };

export const HEDGE_SETUP: HedgeSetup = { S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 0.25, days: 63 };

/// One path of a short call hedged with Δ shares, rebalanced every `every` days; the premium and the
/// share trades are financed at r. Returns daily P&L of the hedged book and of the naked short call.
export function hedgePath(setup: HedgeSetup, every: number, rng: Rng) {
  const { S0, K, r, sigma, T, days } = setup;
  const dt = T / days;
  let S = S0;
  let delta = blackScholesDelta(S, K, T, r, sigma);
  const premium = blackScholesCall(S, K, T, r, sigma);
  let cash = premium - delta * S;
  const rows = [{ day: 0, S, hedged: 0, naked: 0 }];
  for (let d = 1; d <= days; d++) {
    S *= Math.exp((r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * nextNormal(rng));
    cash *= Math.exp(r * dt);
    const tau = T - d * dt;
    const option = blackScholesCall(S, K, tau, r, sigma);
    if (d % every === 0 && d < days) {
      const next = blackScholesDelta(S, K, tau, r, sigma);
      cash -= (next - delta) * S;
      delta = next;
    }
    rows.push({ day: d, S, hedged: cash + delta * S - option, naked: premium * Math.exp(r * d * dt) - option });
  }
  return rows;
}

/// Standard deviation of the final P&L over `paths` seeded paths, hedged every `every` days and unhedged.
export function hedgeErrorSpread(setup: HedgeSetup, every: number, paths: number, seed: number) {
  const rng = makeRng(seed);
  const finals = Array.from({ length: paths }, () => hedgePath(setup, every, rng).at(-1)!);
  const sd = (xs: number[]) => {
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  };
  return { hedged: sd(finals.map((f) => f.hedged)), naked: sd(finals.map((f) => f.naked)) };
}
// #endregion
