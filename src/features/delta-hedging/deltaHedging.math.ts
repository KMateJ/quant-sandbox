import { makeRng, normals } from "../../lib/math/random";
import { mean, stdDev } from "../../lib/stats/moments";
import { blackScholesCall, blackScholesDelta } from "../black-scholes/blackScholes.math";
import type { FrequencyStudyRow, HedgeParams, HedgeResult, HedgeRow } from "./deltaHedging.types";

/// Trading days per year: the stock path is simulated on this grid whatever the rebalancing frequency.
export const GRID_PER_YEAR = 252;

/// Rebalancing frequencies offered by the lab (per year).
export const HEDGE_FREQUENCIES = [4, 12, 52, 252] as const;

/// Daily grid length for a maturity, and how many grid steps pass between rebalances at `freq`.
export function hedgeGrid(maturity: number, freq: number): { grid: number; every: number } {
  const grid = Math.max(4, Math.round(GRID_PER_YEAR * maturity));
  const every = Math.max(1, Math.round(GRID_PER_YEAR / freq));
  return { grid, every };
}

/// Hedge one path given its standard-normal shocks (one per grid step). The hedger sells the call
/// for its Black–Scholes premium, holds Δ shares financed by a cash account at `rate`, and only trades
/// every `every` grid steps. The last row is expiry, where the option is worth its payoff.
export function simulateDeltaHedge(p: HedgeParams, shocks: ArrayLike<number>): HedgeResult {
  const { grid, every } = hedgeGrid(p.maturity, p.freq);
  const dt = p.maturity / grid;
  const sqrtDt = Math.sqrt(dt);
  const growth = (p.rate - 0.5 * p.vol * p.vol) * dt;
  const accrual = Math.exp(p.rate * dt);

  let S = p.s0;
  const premium = blackScholesCall(S, p.strike, p.maturity, p.rate, p.vol);
  let delta = blackScholesDelta(S, p.strike, p.maturity, p.rate, p.vol);
  let cash = premium - delta * S;
  let rebalances = 0;
  let maxAbsError = 0;

  const rows: HedgeRow[] = [
    { t: 0, S, deltaTrue: delta, deltaHeld: delta, option: premium, replicating: premium, error: 0, rebalanced: true },
  ];

  for (let i = 1; i <= grid; i++) {
    const tau = p.maturity - i * dt;
    const alive = i < grid;
    S *= Math.exp(growth + p.vol * sqrtDt * shocks[i - 1]);
    cash *= accrual;
    const option = alive ? blackScholesCall(S, p.strike, tau, p.rate, p.vol) : Math.max(S - p.strike, 0);
    const deltaTrue = alive ? blackScholesDelta(S, p.strike, tau, p.rate, p.vol) : S > p.strike ? 1 : 0;
    const rebalanced = alive && i % every === 0;
    if (rebalanced) {
      cash -= (deltaTrue - delta) * S;
      delta = deltaTrue;
      rebalances++;
    }
    const replicating = delta * S + cash;
    const error = replicating - option;
    if (Math.abs(error) > maxAbsError) maxAbsError = Math.abs(error);
    rows.push({ t: i * dt, S, deltaTrue, deltaHeld: delta, option, replicating, error, rebalanced });
  }

  const payoff = Math.max(S - p.strike, 0);
  const terminalValue = rows[rows.length - 1].replicating;
  return { rows, premium, payoff, terminalValue, hedgeError: terminalValue - payoff, maxAbsError, rebalances, gridSteps: grid };
}

/// Hedge one seeded path (the lab's "this path" view).
export function simulateDeltaHedgeSeeded(p: HedgeParams, seed: number): HedgeResult {
  const { grid } = hedgeGrid(p.maturity, p.freq);
  return simulateDeltaHedge(p, normals(grid, makeRng(seed)));
}

/// Terminal hedge errors over `paths` seeded paths for each frequency. Every frequency reuses the
/// same shocks (common random numbers), so the rows differ only by how often the hedge is adjusted.
export function hedgeFrequencyStudy(p: HedgeParams, freqs: readonly number[], paths: number, seed: number): FrequencyStudyRow[] {
  const rng = makeRng(seed);
  const { grid } = hedgeGrid(p.maturity, freqs[0] ?? p.freq);
  const errors = freqs.map(() => [] as number[]);
  let rebalances = freqs.map(() => 0);
  for (let path = 0; path < paths; path++) {
    const shocks = normals(grid, rng);
    rebalances = freqs.map((freq, f) => {
      const result = simulateDeltaHedge({ ...p, freq }, shocks);
      errors[f].push(result.hedgeError);
      return result.rebalances;
    });
  }
  return freqs.map((freq, f) => ({
    freq,
    rebalances: rebalances[f],
    errors: errors[f],
    sd: errors[f].length > 1 ? stdDev(errors[f]) : 0,
    meanAbs: errors[f].length ? mean(errors[f].map(Math.abs)) : 0,
  }));
}

/// Chart rows for the held delta drawn as steps: before each rebalance the previous holding is
/// repeated at the same time stamp so the line jumps vertically instead of sloping.
export function heldDeltaStepRows(rows: HedgeRow[]): { t: number; deltaHeld: number }[] {
  const out: { t: number; deltaHeld: number }[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (i > 0 && rows[i].rebalanced) out.push({ t: rows[i].t, deltaHeld: rows[i - 1].deltaHeld });
    out.push({ t: rows[i].t, deltaHeld: rows[i].deltaHeld });
  }
  return out;
}

/// Symmetric histogram domain around zero that contains every error (never degenerate).
export function errorDomain(errors: number[]): [number, number] {
  let m = 0;
  for (const e of errors) if (Math.abs(e) > m) m = Math.abs(e);
  const edge = Math.max(m * 1.05, 0.01);
  return [-edge, edge];
}
