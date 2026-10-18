import { fv } from "../../lib/finance/discount";
import { makeRng, nextNormal } from "../../lib/math/random";

const grid = (end: number, points: number) => Array.from({ length: points }, (_, i) => (end * i) / (points - 1));

/// Growth of 1 over [0, years] under simple, annual and continuous compounding at rate r.
export function compoundingSeries(r: number, years: number, points = 61) {
  return grid(years, points).map((t) => ({
    t,
    simple: 1 + r * t,
    annual: fv(1, r, t, "discrete"),
    continuous: fv(1, r, t, "continuous"),
  }));
}

/// Expected cumulative log return μT and its ±1σ√T, ±2σ√T bands over [0, years].
export function volatilityBands(mu: number, sigma: number, years: number, points = 61) {
  return grid(years, points).map((t) => {
    const mean = mu * t;
    const sd = sigma * Math.sqrt(t);
    return { t, mean, up1: mean + sd, lo1: mean - sd, up2: mean + 2 * sd, lo2: mean - 2 * sd };
  });
}

/// Symmetric ±√(1/n) walk on [0, 1] with n steps: `paths` sample paths plus the ±√t, ±2√t envelopes.
export function randomWalkRows(n: number, paths: number, seed: number) {
  const rng = makeRng(seed);
  const dx = Math.sqrt(1 / n);
  const level = new Array<number>(paths).fill(0);
  const rows: Record<string, number>[] = [];
  // Thin long walks so the chart stays light; the endpoint is always included.
  const every = Math.max(1, Math.round(n / 200));
  for (let i = 0; i <= n; i++) {
    if (i > 0) for (let p = 0; p < paths; p++) level[p] += rng() < 0.5 ? dx : -dx;
    if (i % every !== 0 && i !== n) continue;
    const t = i / n;
    const row: Record<string, number> = { t, env1: Math.sqrt(t), env1n: -Math.sqrt(t), env2: 2 * Math.sqrt(t), env2n: -2 * Math.sqrt(t) };
    level.forEach((v, p) => (row[`p${p}`] = v));
    rows.push(row);
  }
  return rows;
}

/// Sample variance of the endpoint W₁ of `count` independent n-step walks (≈ 1 for any n).
export function walkEndpointVariance(n: number, count: number, seed: number): number {
  const rng = makeRng(seed);
  const dx = Math.sqrt(1 / n);
  let sum = 0;
  let sumSq = 0;
  for (let c = 0; c < count; c++) {
    let w = 0;
    for (let i = 0; i < n; i++) w += rng() < 0.5 ? dx : -dx;
    sum += w;
    sumSq += w * w;
  }
  const mean = sum / count;
  return (sumSq - count * mean * mean) / (count - 1);
}

/// GBM sample paths on [0, years] with S₀, plus the mean S₀e^{μt} and median S₀e^{(μ−σ²/2)t}.
export function gbmRows(S0: number, mu: number, sigma: number, paths: number, steps: number, seed: number, years = 1) {
  const rng = makeRng(seed);
  const dt = years / steps;
  const drift = (mu - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  const level = new Array<number>(paths).fill(S0);
  const rows: Record<string, number>[] = [];
  for (let i = 0; i <= steps; i++) {
    if (i > 0) for (let p = 0; p < paths; p++) level[p] *= Math.exp(drift + vol * nextNormal(rng));
    const t = i * dt;
    const row: Record<string, number> = { t, mean: S0 * Math.exp(mu * t), median: S0 * Math.exp((mu - 0.5 * sigma * sigma) * t) };
    level.forEach((v, p) => (row[`p${p}`] = v));
    rows.push(row);
  }
  return rows;
}
