import { dot, matVec } from "../../lib/math/matrix";
import type { Bounds, OptConstraints, OptPoint } from "./portfolioOptimization.types";

/// Per-asset weight bounds [lo, hi] implied by the constraints.
/// Long-only clamps the lower bound to ≥ 0; shorting lets it go negative.
export function boundsFromConstraints(c: OptConstraints, n: number): Bounds {
  const lower = c.allowShort ? c.minWeight : Math.max(0, c.minWeight);
  const upper = c.maxWeight;
  return { lo: new Array(n).fill(lower), hi: new Array(n).fill(upper) };
}

/// Risk/return/Sharpe/weights summary of a weight vector.
export function summarize(weights: number[], mus: number[], cov: number[][], riskFree: number): OptPoint {
  const ret = dot(weights, mus);
  const vol = Math.sqrt(Math.max(dot(weights, matVec(cov, weights)), 0));
  return { weights, ret, vol, sharpe: vol > 0 ? (ret - riskFree) / vol : 0 };
}

/// Euclidean projection onto { w : Σwᵢ = budget, loᵢ ≤ wᵢ ≤ hiᵢ }.
/// Finds the shift τ with Σ clip(vᵢ − τ) = budget by bisection (g is monotone in τ).
export function projectBudgetBox(v: number[], lo: number[], hi: number[], budget: number): number[] {
  const n = v.length;
  const sumLo = lo.reduce((a, b) => a + b, 0);
  const sumHi = hi.reduce((a, b) => a + b, 0);
  const b = Math.min(Math.max(budget, sumLo), sumHi);
  let a = Infinity;
  let c = -Infinity;
  for (let i = 0; i < n; i++) {
    a = Math.min(a, v[i] - hi[i]);
    c = Math.max(c, v[i] - lo[i]);
  }
  for (let it = 0; it < 80; it++) {
    const t = (a + c) / 2;
    let s = 0;
    for (let i = 0; i < n; i++) s += Math.min(hi[i], Math.max(lo[i], v[i] - t));
    if (s > b) a = t;
    else c = t;
  }
  const t = (a + c) / 2;
  return v.map((x, i) => Math.min(hi[i], Math.max(lo[i], x - t)));
}

/// Minimise λ·wᵀΣw − μᵀw over the budget-box feasible set via projected gradient.
/// Large λ → minimum variance; small λ → maximum return. Warm-starts chain smoothly.
export function solveMeanVariance(
  mus: number[],
  cov: number[][],
  lambda: number,
  bounds: Bounds,
  warmStart?: number[]
): number[] {
  const { lo, hi } = bounds;
  const n = mus.length;
  let w = warmStart
    ? projectBudgetBox(warmStart, lo, hi, 1)
    : projectBudgetBox(new Array(n).fill(1 / n), lo, hi, 1);
  let rowMax = 0;
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += Math.abs(cov[i][j]);
    rowMax = Math.max(rowMax, s);
  }
  const step = 1 / (2 * lambda * rowMax + 1e-9);
  for (let it = 0; it < 600; it++) {
    const Sw = matVec(cov, w);
    const next = projectBudgetBox(
      w.map((wi, i) => wi - step * (2 * lambda * Sw[i] - mus[i])),
      lo,
      hi,
      1
    );
    let delta = 0;
    for (let i = 0; i < n; i++) delta += Math.abs(next[i] - w[i]);
    w = next;
    if (delta < 1e-10) break;
  }
  return w;
}

/// Constrained efficient frontier: sweep the risk-aversion λ and collect the
/// efficient portfolios, returned sorted by return ascending (deduplicated).
export function constrainedFrontier(
  mus: number[],
  cov: number[][],
  bounds: Bounds,
  riskFree: number,
  steps = 60
): OptPoint[] {
  const lamMin = 0.4;
  const lamMax = 600;
  const pts: OptPoint[] = [];
  let warm: number[] | undefined;
  for (let i = steps; i >= 0; i--) {
    const lambda = lamMin * Math.pow(lamMax / lamMin, i / steps);
    const w = solveMeanVariance(mus, cov, lambda, bounds, warm);
    warm = w;
    pts.push(summarize(w, mus, cov, riskFree));
  }
  pts.sort((p, q) => p.ret - q.ret);
  const out: OptPoint[] = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || p.ret - last.ret > 1e-5 || p.vol - last.vol > 1e-5) out.push(p);
  }
  return out;
}

/// Global minimum-variance portfolio under the constraints (lowest-volatility point).
export function gmvConstrained(frontier: OptPoint[]): OptPoint {
  return frontier.reduce((best, p) => (p.vol < best.vol ? p : best), frontier[0]);
}

/// Maximum-Sharpe (tangency) portfolio under the constraints.
export function maxSharpeConstrained(frontier: OptPoint[]): OptPoint {
  return frontier.reduce((best, p) => (p.sharpe > best.sharpe ? p : best), frontier[0]);
}

/// Efficient (upper) branch: from the GMV point upward in return.
export function efficientBranch(frontier: OptPoint[]): OptPoint[] {
  const gmv = gmvConstrained(frontier);
  return frontier.filter((p) => p.ret >= gmv.ret - 1e-9);
}

/// Frontier point closest to a target return (searched on the efficient branch).
export function pointAtReturn(frontier: OptPoint[], targetReturn: number): OptPoint {
  const branch = efficientBranch(frontier);
  return branch.reduce(
    (best, p) => (Math.abs(p.ret - targetReturn) < Math.abs(best.ret - targetReturn) ? p : best),
    branch[0]
  );
}

/// Frontier point closest to a target volatility (searched on the efficient branch).
export function pointAtVol(frontier: OptPoint[], targetVol: number): OptPoint {
  const branch = efficientBranch(frontier);
  return branch.reduce(
    (best, p) => (Math.abs(p.vol - targetVol) < Math.abs(best.vol - targetVol) ? p : best),
    branch[0]
  );
}

// Deterministic PRNG so the feasible cloud is stable across renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/// Cloud of random constraint-respecting portfolios for feasible-region context.
export function feasibleCloud(
  mus: number[],
  cov: number[][],
  bounds: Bounds,
  count: number,
  seed = 7
): { vol: number; ret: number }[] {
  const rng = mulberry32(seed);
  const n = mus.length;
  const out: { vol: number; ret: number }[] = [];
  for (let k = 0; k < count; k++) {
    const raw = new Array(n).fill(0).map((_, i) => bounds.lo[i] + rng() * (bounds.hi[i] - bounds.lo[i]));
    const w = projectBudgetBox(raw, bounds.lo, bounds.hi, 1);
    const ret = dot(w, mus);
    const vol = Math.sqrt(Math.max(dot(w, matVec(cov, w)), 0));
    out.push({ vol, ret });
  }
  return out;
}
