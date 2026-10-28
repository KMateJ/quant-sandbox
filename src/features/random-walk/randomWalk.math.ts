import { normPdf } from "../../lib/stats";
import { makeRng } from "../../lib/math/random";

/// Number of walkers simulated by the lab; only a few are drawn as paths, the rest feed the histogram counts.
export const WALKER_COUNT = 400;
/// Walkers drawn as paths in the path panel.
export const SHOWN_PATHS = 12;

/// Mean and variance of S_n = h·(2K − n) with K ~ Binomial(n, p): E = n·h·(2p − 1), Var = 4·n·p·(1 − p)·h².
export function walkLaw(n: number, p: number, h = 1) {
  return { mean: n * h * (2 * p - 1), variance: 4 * n * p * (1 - p) * h * h };
}

/// Binomial(n, p) probabilities P(K = k), k = 0…n, computed in log space so n up to a few hundred stays stable.
export function binomialPmf(n: number, p: number): number[] {
  if (p <= 0) return Array.from({ length: n + 1 }, (_, k) => (k === 0 ? 1 : 0));
  if (p >= 1) return Array.from({ length: n + 1 }, (_, k) => (k === n ? 1 : 0));
  const logFact = [0];
  for (let i = 1; i <= n; i++) logFact.push(logFact[i - 1] + Math.log(i));
  const lp = Math.log(p);
  const lq = Math.log(1 - p);
  return Array.from({ length: n + 1 }, (_, k) => Math.exp(logFact[n] - logFact[k] - logFact[n - k] + k * lp + (n - k) * lq));
}

/// Position of a walker with `k` up-steps after `s` steps of size `h`.
export const sitePosition = (k: number, s: number, h: number) => h * (2 * k - s);

/// Exact distribution of S_s on its lattice, as density per unit position (pmf / 2h, so it overlays a density histogram).
export function pmfDensity(s: number, p: number, h: number) {
  return binomialPmf(s, p).map((prob, k) => ({ x: sitePosition(k, s, h), y: prob / (2 * h) }));
}

/// Normal approximation N(mean, variance) of S_s, as a density curve over [lo, hi].
export function normalDensity(s: number, p: number, h: number, lo: number, hi: number, points = 160) {
  const { mean, variance } = walkLaw(s, p, h);
  const sd = Math.sqrt(variance);
  if (sd === 0) return [];
  return Array.from({ length: points + 1 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / points;
    return { x, y: normPdf((x - mean) / sd) / sd };
  });
}

/// Uniform draws for every walker and step (step-major), so changing p or the step size reuses the same randomness.
export function walkerUniforms(seed: number, n: number, count: number): Float64Array {
  const rng = makeRng(seed);
  return Float64Array.from({ length: n * count }, () => rng());
}

/// Up-step counts of every walker after every step, step-major: `ups[s·count + w]`. A step is up when its uniform < p.
export function simulateUps(uniforms: Float64Array, n: number, count: number, p: number): Uint16Array {
  const ups = new Uint16Array((n + 1) * count);
  for (let s = 1; s <= n; s++) {
    for (let w = 0; w < count; w++) ups[s * count + w] = ups[(s - 1) * count + w] + (uniforms[(s - 1) * count + w] < p ? 1 : 0);
  }
  return ups;
}

/// How many walkers have exactly k up-steps at step s, k = 0…s.
export function siteCounts(ups: Uint16Array, count: number, s: number): number[] {
  const counts = new Array<number>(s + 1).fill(0);
  for (let w = 0; w < count; w++) counts[ups[s * count + w]]++;
  return counts;
}

/// Positions of the first `shown` walkers, step-major (`[s·shown + w]`), for the path panel.
export function shownPositions(ups: Uint16Array, n: number, count: number, shown: number, h: number): Float64Array {
  const out = new Float64Array((n + 1) * shown);
  for (let s = 0; s <= n; s++) for (let w = 0; w < shown; w++) out[s * shown + w] = sitePosition(ups[s * count + w], s, h);
  return out;
}

/// Position range wide enough to hold ±`spread` standard deviations of S_s at every step 0…n (clipped to ±n·h).
export function walkRange(n: number, p: number, h: number, spread = 4): [number, number] {
  const { mean, variance } = walkLaw(n, p, h);
  const reach = spread * Math.sqrt(variance) + h;
  return [Math.max(-n * h, Math.min(0, mean - reach)), Math.min(n * h, Math.max(0, mean + reach))];
}

/// Sample mean and (population) variance of the walker positions at step s, from `siteCounts`.
export function countMoments(counts: number[], s: number, h: number) {
  const total = counts.reduce((a, c) => a + c, 0);
  if (total === 0) return { mean: 0, variance: 0 };
  const mean = counts.reduce((a, c, k) => a + c * sitePosition(k, s, h), 0) / total;
  const variance = counts.reduce((a, c, k) => a + c * (sitePosition(k, s, h) - mean) ** 2, 0) / total;
  return { mean, variance };
}

/// Histogram bins (width 2h, one per lattice site) over [lo, hi] for step s; empty sites outside 0…s keep the axis fixed.
export function siteBins(counts: number[], s: number, h: number, [lo, hi]: [number, number]) {
  const kLo = Math.ceil((lo / h + s) / 2);
  const kHi = Math.floor((hi / h + s) / 2);
  return Array.from({ length: Math.max(0, kHi - kLo + 1) }, (_, i) => {
    const k = kLo + i;
    const x = sitePosition(k, s, h);
    return { x0: x - h, x1: x + h, count: counts[k] ?? 0 };
  });
}
