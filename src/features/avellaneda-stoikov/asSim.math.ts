import { subSeed } from "../../lib/game/seed";
import { asQuotes, asTotalSpread } from "../../lib/market/quotes";
import { linearInterp } from "../../lib/math/interpolate";
import { makeRng, nextNormal } from "../../lib/math/random";
import { mean, stdDev } from "../../lib/stats/moments";
import type { AsParams, DayPoint, DayResult, FrontierPoint, Policy, PolicyStats, TournamentResult } from "./avellanedaStoikov.types";

/// Share of the horizon left at time t (1 at the open, 0 at the close).
const leftShare = (t: number, p: AsParams) => Math.max(0, p.T - t) / p.T;

/// Bid and ask of a policy at mid s, inventory q, time t.
export function quotesFor(policy: Policy, s: number, q: number, t: number, p: AsParams): { bid: number; ask: number } {
  const tLeft = Math.max(0, p.T - t);
  if (policy.kind === "as") {
    const { bid, ask } = asQuotes({ s, q, gamma: policy.gamma, sigma: p.sigma, k: p.k, tLeft });
    return { bid, ask };
  }
  if (policy.kind === "symmetric") {
    const half = asTotalSpread(policy.gamma, p.sigma, p.k, tLeft) / 2;
    return { bid: s - half, ask: s + half };
  }
  const centre = s + linearInterp(policy.qs, policy.offsets, q) * leftShare(t, p);
  return { bid: centre - policy.halfSpread, ask: centre + policy.halfSpread };
}

/// AS reservation offset r − s at inventory q and time t: −qγσ²(T − t).
export const asOffset = (q: number, t: number, gamma: number, p: AsParams) => -q * gamma * p.sigma * p.sigma * Math.max(0, p.T - t);

/// One seeded day. Per step the normal shock and both fill uniforms are drawn in a fixed order, so every
/// policy meets the same prices and the same luck. Fill probability A·e^{−kδ}·dt is capped at 1.
export function simulateDay(policy: Policy, p: AsParams, seed: number, withPath = false): DayResult {
  const rng = makeRng(seed);
  const steps = Math.round(p.T / p.dt);
  const sd = p.sigma * Math.sqrt(p.dt);
  let s = p.s0;
  let q = 0;
  let cash = 0;
  const path: DayPoint[] | undefined = withPath ? [] : undefined;
  for (let i = 0; i < steps; i++) {
    const t = i * p.dt;
    const z = nextNormal(rng);
    const ub = rng();
    const ua = rng();
    const { bid, ask } = quotesFor(policy, s, q, t, p);
    path?.push({ t, s, bid, ask, q });
    if (q + 1 <= p.qMax && ub < Math.min(1, p.A * Math.exp(-p.k * (s - bid)) * p.dt)) {
      q += 1;
      cash -= bid;
    }
    if (q - 1 >= -p.qMax && ua < Math.min(1, p.A * Math.exp(-p.k * (ask - s)) * p.dt)) {
      q -= 1;
      cash += ask;
    }
    s += sd * z;
  }
  return { pnl: cash + q * s, finalQ: q, path };
}

/// −(1/γ)·ln E[e^{−γX}], shifted by the mean so the exponentials cannot overflow.
export function certaintyEquivalent(pnls: number[], gamma: number): number {
  const m = mean(pnls);
  const avg = pnls.reduce((sum, x) => sum + Math.exp(-gamma * (x - m)), 0) / pnls.length;
  return m - Math.log(avg) / gamma;
}

/// Seed of day `d` in a tournament.
export const daySeed = (seed: number, d: number) => subSeed(seed, d + 1);

/// Every policy on the same `days` seeded days; CE at the AS γ of the params.
export function runTournament(policies: Policy[], p: AsParams, seed: number, days = 500): PolicyStats[] {
  return policies.map((policy) => {
    const pnl: number[] = [];
    const finalQ: number[] = [];
    for (let d = 0; d < days; d++) {
      const r = simulateDay(policy, p, daySeed(seed, d));
      pnl.push(r.pnl);
      finalQ.push(r.finalQ);
    }
    return { pnl, finalQ, mean: mean(pnl), sd: stdDev(pnl), ce: certaintyEquivalent(pnl, p.gamma), qSd: stdDev(finalQ) };
  });
}

/// Mean and sd of AS P&L across risk aversions: the frontier the other policies are judged against.
export function frontier(p: AsParams, seed: number, gammas = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1], days = 200): FrontierPoint[] {
  const stats = runTournament(gammas.map((gamma) => ({ kind: "as", gamma }) as Policy), p, seed, days);
  return stats.map((s, i) => ({ gamma: gammas[i], mean: s.mean, sd: s.sd }));
}

/// Full tournament for the worker: policies plus the AS frontier.
export function tournament(policies: Policy[], p: AsParams, seed: number, days: number): TournamentResult {
  return { days, seed, stats: runTournament(policies, p, seed, days), frontier: frontier(p, seed, undefined, Math.min(days, 200)) };
}
