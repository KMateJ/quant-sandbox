import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf } from "../../lib/stats/distributions";
import { blackScholesCall } from "../black-scholes/blackScholes.math";
import type { McLabParams } from "./monteCarlo.types";

export const EXOTIC_PAYOFFS = ["european", "asian", "barrier", "lookback"] as const;
export type ExoticPayoff = (typeof EXOTIC_PAYOFFS)[number];

/// Monitoring dates per path (the average, maximum and minimum are taken on this grid).
export const EXOTIC_STEPS = 50;
const Z95 = 1.96;

/// Per-draw results of one path-dependent run. Every payoff is computed on the SAME simulated paths, so their
/// differences come from the payoffs, not from sampling noise. Arrays hold discounted payoffs per path.
export type ExoticRun = {
  european: Float64Array;
  asian: Float64Array;
  lookback: Float64Array;
  /// Running maximum of each path over the monitoring dates (S₀ included); knocked out iff max ≥ B.
  maxS: Float64Array;
  /// A few full paths for display: step-major `paths[k * pathCount + j]`, k = 0…steps.
  paths: Float64Array;
  pathCount: number;
  steps: number;
};

/// Simulates `sims` exact GBM paths under ℚ on `steps` equal dates and evaluates every payoff on them.
/// Asian = arithmetic average of S_1…S_N; lookback = floating strike, S_T − min_{0≤k≤N} S_k.
export function exoticRun(p: McLabParams, steps = EXOTIC_STEPS, pathCount = 200): ExoticRun {
  const { s0, strike, maturity, rate, vol, sims, seed } = p;
  const rng = makeRng(seed * 7919 + 13);
  const dt = maturity / steps;
  const drift = (rate - 0.5 * vol * vol) * dt;
  const diff = vol * Math.sqrt(dt);
  const disc = Math.exp(-rate * maturity);
  const shown = Math.min(pathCount, sims);
  const run: ExoticRun = {
    european: new Float64Array(sims), asian: new Float64Array(sims), lookback: new Float64Array(sims),
    maxS: new Float64Array(sims), paths: new Float64Array((steps + 1) * shown), pathCount: shown, steps,
  };
  for (let i = 0; i < sims; i++) {
    let s = s0, sum = 0, max = s0, min = s0;
    if (i < shown) run.paths[i] = s0;
    for (let k = 1; k <= steps; k++) {
      s *= Math.exp(drift + diff * nextNormal(rng));
      sum += s;
      if (s > max) max = s;
      if (s < min) min = s;
      if (i < shown) run.paths[k * shown + i] = s;
    }
    run.european[i] = disc * Math.max(s - strike, 0);
    run.asian[i] = disc * Math.max(sum / steps - strike, 0);
    run.lookback[i] = disc * (s - min);
    run.maxS[i] = max;
  }
  return run;
}

/// Mean and standard error (population variance, as elsewhere in the lab) with the 95% half-width.
export function estimate(values: ArrayLike<number>) {
  let s = 0, ss = 0;
  for (let i = 0; i < values.length; i++) { s += values[i]; ss += values[i] * values[i]; }
  const n = values.length || 1;
  const mean = s / n;
  const se = Math.sqrt(Math.max(ss / n - mean * mean, 0) / n);
  return { mean, se, half: Z95 * se };
}

/// Up-and-out call on the run: the European payoff where the path never reached B, else 0. Also the knocked-out share.
export function upAndOut(run: ExoticRun, barrier: number) {
  const pay = new Float64Array(run.european.length);
  let out = 0;
  for (let i = 0; i < pay.length; i++) {
    if (run.maxS[i] >= barrier) out++;
    else pay[i] = run.european[i];
  }
  return { ...estimate(pay), knockedOut: out / (pay.length || 1) };
}

/// Up-and-out price on a grid of barrier levels from one run (one sort of the maxima, so it costs O(n log n)).
export function barrierCurve(run: ExoticRun, levels: number[]): { barrier: number; price: number }[] {
  const order = Array.from(run.maxS.keys()).sort((a, b) => run.maxS[a] - run.maxS[b]);
  const n = order.length || 1;
  const sorted = [...levels].sort((a, b) => a - b);
  const out: { barrier: number; price: number }[] = [];
  let i = 0, sum = 0;
  for (const b of sorted) {
    while (i < order.length && run.maxS[order[i]] < b) sum += run.european[order[i++]];
    out.push({ barrier: b, price: sum / n });
  }
  return out;
}

/// Barrier levels for the price-vs-barrier curve: from just above the larger of S₀ and K up to a far barrier.
export function barrierGrid(s0: number, strike: number, count = 40): number[] {
  const lo = Math.max(s0, strike) * 1.01;
  const hi = Math.max(s0, strike) * 2.2;
  return Array.from({ length: count }, (_, i) => lo + ((hi - lo) * i) / (count - 1));
}

/// Continuously monitored up-and-out call (Reiner–Rubinstein, no dividends, K < B): C_BS − C_up-and-in. 0 if S₀ ≥ B.
export function upAndOutClosedForm(s0: number, strike: number, barrier: number, maturity: number, rate: number, vol: number): number {
  if (s0 >= barrier || strike >= barrier) return 0;
  const sT = vol * Math.sqrt(maturity);
  const lambda = (rate + 0.5 * vol * vol) / (vol * vol);
  const df = Math.exp(-rate * maturity);
  const x1 = Math.log(s0 / barrier) / sT + lambda * sT;
  const y = Math.log((barrier * barrier) / (s0 * strike)) / sT + lambda * sT;
  const y1 = Math.log(barrier / s0) / sT + lambda * sT;
  const h = barrier / s0;
  const upIn = s0 * normCdf(x1) - strike * df * normCdf(x1 - sT)
    - s0 * h ** (2 * lambda) * (normCdf(-y) - normCdf(-y1))
    + strike * df * h ** (2 * lambda - 2) * (normCdf(-y + sT) - normCdf(-y1 + sT));
  return Math.max(blackScholesCall(s0, strike, maturity, rate, vol) - upIn, 0);
}

/// Running arithmetic average of path j on the display grid (k = 1…steps; k = 0 starts at S₀).
export function runningAverage(run: ExoticRun, j: number, dx: number) {
  const pts = [{ x: 0, y: run.paths[j] }];
  let sum = 0;
  for (let k = 1; k <= run.steps; k++) {
    sum += run.paths[k * run.pathCount + j];
    pts.push({ x: k * dx, y: sum / k });
  }
  return pts;
}

/// First monitoring index at which path j reaches B, or −1 if it never does.
export function crossingIndex(run: ExoticRun, j: number, barrier: number): number {
  for (let k = 0; k <= run.steps; k++) if (run.paths[k * run.pathCount + j] >= barrier) return k;
  return -1;
}

/// Index of the minimum of path j over the monitoring dates.
export function minIndex(run: ExoticRun, j: number): number {
  let best = 0;
  for (let k = 1; k <= run.steps; k++) if (run.paths[k * run.pathCount + j] < run.paths[best * run.pathCount + j]) best = k;
  return best;
}
