import { makeRng, nextNormal, type Rng } from "../../lib/math/random";
import { normCdf, normPdf } from "../../lib/stats/distributions";

const grid = (from: number, to: number, points: number) =>
  Array.from({ length: points }, (_, i) => from + ((to - from) * i) / (points - 1));
const variance = (xs: number[]) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
};
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

// #region σ-algebras on a die

export type InfoId = "none" | "parity" | "lowHigh" | "pairs" | "full";
export type DieVariable = "face" | "square" | "high";

/// Partition of Ω = {1,…,6} generating each σ-algebra (its atoms).
export const INFO_PARTITIONS: Record<InfoId, number[][]> = {
  none: [[1, 2, 3, 4, 5, 6]],
  parity: [[1, 3, 5], [2, 4, 6]],
  lowHigh: [[1, 2, 3], [4, 5, 6]],
  pairs: [[1, 2], [3, 4], [5, 6]],
  full: [[1], [2], [3], [4], [5], [6]],
};

const DIE_X: Record<DieVariable, (w: number) => number> = { face: (w) => w, square: (w) => w * w, high: (w) => (w >= 5 ? 1 : 0) };

/// For each outcome: its value X(ω), its block and E[X | 𝒢](ω) = the block average; plus Var X ≥ Var E[X | 𝒢].
export function conditionOnDie(info: InfoId, variable: DieVariable) {
  const blocks = INFO_PARTITIONS[info];
  const x = DIE_X[variable];
  const tiles = [1, 2, 3, 4, 5, 6].map((w) => {
    const block = blocks.findIndex((b) => b.includes(w));
    return { w, x: x(w), block, cond: mean(blocks[block].map(x)) };
  });
  const ex = mean(tiles.map((t) => t.x));
  const pop = (vals: number[]) => mean(vals.map((v) => (v - ex) ** 2));
  return { tiles, blocks: blocks.length, events: 2 ** blocks.length, ex, varX: pop(tiles.map((t) => t.x)), varCond: pop(tiles.map((t) => t.cond)) };
}
// #endregion

// #region Filtration of three coin flips

export const COIN_PATHS = ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"];
export type RandomTime = "firstH" | "lastH";

/// The random time on a path (1-based flip index), or null if it never happens.
export function randomTime(kind: RandomTime, path: string): number | null {
  const i = kind === "firstH" ? path.indexOf("H") : path.lastIndexOf("H");
  return i < 0 ? null : i + 1;
}

/// Atoms of 𝓕_k: paths grouped by their first k flips.
export const atomsAt = (k: number) =>
  Object.values(COIN_PATHS.reduce<Record<string, string[]>>((acc, p) => ((acc[p.slice(0, k)] ??= []).push(p), acc), {}));

/// Is {τ ≤ k} a union of atoms of 𝓕_k? If not, a pair of paths that agree up to k but disagree on τ ≤ k.
export function stoppingCheck(kind: RandomTime, k: number) {
  for (const atom of atomsAt(k)) {
    const flags = atom.map((p) => { const t = randomTime(kind, p); return t !== null && t <= k; });
    const i = flags.findIndex((f) => f !== flags[0]);
    if (i > 0) return { measurable: false, pair: [atom[0], atom[i]] as [string, string] };
  }
  return { measurable: true, pair: null };
}
// #endregion

// #region Brownian paths and invariances

/// A Brownian path on [0, horizon] with step dt (values at k·dt).
export function brownianPath(rng: Rng, horizon: number, dt: number): number[] {
  const n = Math.ceil(horizon / dt);
  const w = new Array<number>(n + 1);
  w[0] = 0;
  const sd = Math.sqrt(dt);
  for (let k = 1; k <= n; k++) w[k] = w[k - 1] + sd * nextNormal(rng);
  return w;
}

const at = (w: number[], dt: number, t: number) => {
  const x = t / dt;
  const i = Math.min(Math.floor(x), w.length - 2);
  return w[i] + (w[i + 1] - w[i]) * (x - i);
};

export type Transformation = "scaling" | "inversion" | "symmetry" | "shift";

/// X_t for the chosen transformation of W, as a function of the underlying path.
function transform(kind: Transformation, param: number, w: number[], dt: number, t: number): number {
  switch (kind) {
    case "scaling": return at(w, dt, param * t) / Math.sqrt(param);
    case "inversion": return t === 0 ? 0 : t * at(w, dt, 1 / t);
    case "symmetry": return -at(w, dt, t);
    case "shift": return at(w, dt, param + t) - at(w, dt, param);
  }
}

const HORIZON: Record<Transformation, (p: number) => number> = { scaling: (c) => c, inversion: () => 60, symmetry: () => 1, shift: (s) => s + 1 };

/// Transformed sample paths on t ∈ [0, 1] (`p0…`) with ±√t, ±2√t envelopes, and Var X_1, Cov(X_{0.5}, X_1) over many paths.
export function transformedRows(kind: Transformation, param: number, paths: number, seed: number, statPaths = 2000) {
  const rng = makeRng(seed);
  const dt = kind === "inversion" ? 0.01 : 0.002;
  const ws = Array.from({ length: paths }, () => brownianPath(rng, HORIZON[kind](param), dt));
  const ts = kind === "inversion" ? [0, ...grid(1 / 60, 1, 120)] : grid(0, 1, 121);
  const rows = ts.map((t) => {
    const row: Record<string, number> = { t, env1: Math.sqrt(t), env1n: -Math.sqrt(t), env2: 2 * Math.sqrt(t), env2n: -2 * Math.sqrt(t) };
    ws.forEach((w, p) => (row[`p${p}`] = transform(kind, param, w, dt, t)));
    return row;
  });
  // Statistics: sample the underlying W at exactly the times X_{0.5} and X_1 need (exact Gaussian increments).
  const statRng = makeRng(seed + 101);
  const xs: [number, number][] = [];
  for (let i = 0; i < statPaths; i++) {
    const times = kind === "scaling" ? [param / 2, param] : kind === "inversion" ? [1, 2] : kind === "shift" ? [param, param + 0.5, param + 1] : [0.5, 1];
    const values: number[] = [];
    let last = 0, w = 0;
    for (const t of times) { w += Math.sqrt(t - last) * nextNormal(statRng); values.push(w); last = t; }
    const pair: [number, number] =
      kind === "scaling" ? [values[0] / Math.sqrt(param), values[1] / Math.sqrt(param)]
      : kind === "inversion" ? [0.5 * values[1], values[0]] // X_{0.5} = 0.5·W_2, X_1 = W_1
      : kind === "shift" ? [values[1] - values[0], values[2] - values[0]]
      : [-values[0], -values[1]];
    xs.push(pair);
  }
  const x5 = xs.map((p) => p[0]), x1 = xs.map((p) => p[1]);
  const m5 = mean(x5), m1 = mean(x1);
  const cov = xs.reduce((s, [a, b]) => s + (a - m5) * (b - m1), 0) / (xs.length - 1);
  return { rows, var1: variance(x1), cov };
}
// #endregion

// #region Reflection principle

/// Maxima and endpoints of many Brownian paths on [0, 1] (simulated once per seed; any level a is then just a count).
export function maxSample(paths: number, steps: number, seed: number) {
  const rng = makeRng(seed);
  const sd = Math.sqrt(1 / steps);
  const max = new Float64Array(paths), end = new Float64Array(paths);
  for (let p = 0; p < paths; p++) {
    let w = 0, m = 0;
    for (let k = 0; k < steps; k++) { w += sd * nextNormal(rng); if (w > m) m = w; }
    max[p] = m; end[p] = w;
  }
  return { max, end };
}

export function reflectionStats(sample: { max: Float64Array; end: Float64Array }, a: number) {
  let hit = 0, above = 0;
  for (let i = 0; i < sample.max.length; i++) { if (sample.max[i] >= a) hit++; if (sample.end[i] >= a) above++; }
  const n = sample.max.length;
  return { hit: hit / n, above: above / n, theory: 2 * (1 - normCdf(a)) };
}

/// One path on [0, 1] that reaches a (resampled until it does), with its reflection 2a − W after the first passage.
export function reflectedPath(a: number, seed: number, steps = 500) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const w = brownianPath(makeRng(seed * 7919 + attempt), 1, 1 / steps);
    const tau = w.findIndex((v) => v >= a);
    if (tau < 0) continue;
    return w.map((v, k) => ({ t: k / steps, path: v, reflected: k >= tau ? 2 * a - v : v, level: a }));
  }
  return null;
}
// #endregion

// #region Brownian bridge

/// Bridge paths B_t = W_t − t·W_1 + t·b on [0, 1], mean b·t, bands ±√(t(1−t)), ±2√(t(1−t)); stats at t = 0.5.
export function bridgeRows(b: number, paths: number, seed: number, steps = 200, statPaths = 2000) {
  const rng = makeRng(seed);
  const ws = Array.from({ length: paths }, () => brownianPath(rng, 1, 1 / steps));
  const rows = ws[0].map((_, k) => {
    const t = k / steps;
    const sd = Math.sqrt(t * (1 - t));
    const row: Record<string, number> = { t, mean: b * t, up1: b * t + sd, lo1: b * t - sd, up2: b * t + 2 * sd, lo2: b * t - 2 * sd };
    ws.forEach((w, p) => (row[`p${p}`] = w[k] - t * w[steps] + t * b));
    return row;
  });
  const statRng = makeRng(seed + 7);
  const mids = Array.from({ length: statPaths }, () => {
    const w5 = Math.sqrt(0.5) * nextNormal(statRng);
    const w1 = w5 + Math.sqrt(0.5) * nextNormal(statRng);
    return w5 - 0.5 * w1 + 0.5 * b;
  });
  return { rows, midMean: mean(mids), midVar: variance(mids) };
}
// #endregion

// #region Itô vs Stratonovich sums

/// One path on a 2n grid; running left-point and midpoint sums of W dW against (W² − t)/2 and W²/2 (≈ 400 rows).
export function itoSums(n: number, seed: number) {
  const fine = brownianPath(makeRng(seed), 1, 1 / (2 * n));
  const rows: Record<string, number>[] = [{ t: 0, left: 0, mid: 0, ito: 0, strat: 0 }];
  let left = 0, mid = 0;
  const every = Math.max(1, Math.round(n / 400));
  for (let i = 0; i < n; i++) {
    const w0 = fine[2 * i], wm = fine[2 * i + 1], w1 = fine[2 * i + 2];
    left += w0 * (w1 - w0);
    mid += wm * (w1 - w0);
    if ((i + 1) % every === 0 || i === n - 1) {
      const t = (i + 1) / n;
      rows.push({ t, left, mid, ito: (w1 * w1 - t) / 2, strat: (w1 * w1) / 2 });
    }
  }
  const w1 = fine[2 * n];
  return { rows, left, mid, ito: (w1 * w1 - 1) / 2, strat: (w1 * w1) / 2 };
}
// #endregion

// #region Feynman–Kac (heat equation)

export type HeatPayoff = "call" | "digital" | "square";
const PAYOFF: Record<HeatPayoff, (x: number) => number> = {
  call: (x) => Math.max(x - 1, 0),
  digital: (x) => (x > 1 ? 1 : 0),
  square: (x) => x * x,
};

/// u(τ, x) = E[g(x + σ W_τ)] by quadrature over the normal density (the PDE solution of u_τ = ½σ² u_xx, u(0, ·) = g).
export function heatSolution(g: HeatPayoff, x: number, sigma: number, tau: number): number {
  const s = sigma * Math.sqrt(tau);
  const zs = grid(-8, 8, 801);
  const dz = zs[1] - zs[0];
  return zs.reduce((acc, z) => acc + PAYOFF[g](x + s * z) * normPdf(z) * dz, 0);
}

/// Exact curve on x ∈ [−2, 4], Monte Carlo dots at 13 points (n draws each), and both at x = 1.
export function feynmanKacRows(g: HeatPayoff, sigma: number, tau: number, draws: number, seed: number) {
  const exact = grid(-2, 4, 121).map((x) => ({ x, payoff: PAYOFF[g](x), u: heatSolution(g, x, sigma, tau) }));
  const rng = makeRng(seed);
  const mc = grid(-2, 4, 13).map((x) => {
    const vals = Array.from({ length: draws }, () => PAYOFF[g](x + sigma * Math.sqrt(tau) * nextNormal(rng)));
    return { x, mean: mean(vals), se: Math.sqrt(variance(vals) / draws) };
  });
  const atOne = mc.find((p) => Math.abs(p.x - 1) < 1e-9)!;
  return { exact, mc, exactAtOne: heatSolution(g, 1, sigma, tau), mcAtOne: atOne.mean, seAtOne: atOne.se };
}
// #endregion
