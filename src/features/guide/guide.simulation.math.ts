import { makeRng, nextNormal } from "../../lib/math/random";
import { optionPayoff } from "../../lib/finance/options";

/// Running Σ(ΔW)² of `paths` Brownian paths on [0, 1] with n normal steps, plus the line t.
export function quadraticVariationRows(n: number, paths: number, seed: number) {
  const rng = makeRng(seed);
  const sd = Math.sqrt(1 / n);
  const qv = new Array<number>(paths).fill(0);
  const every = Math.max(1, Math.round(n / 200));
  const rows: Record<string, number>[] = [{ t: 0, line: 0, ...Object.fromEntries(qv.map((v, p) => [`p${p}`, v])) }];
  for (let i = 1; i <= n; i++) {
    for (let p = 0; p < paths; p++) qv[p] += (sd * nextNormal(rng)) ** 2;
    if (i % every !== 0 && i !== n) continue;
    const row: Record<string, number> = { t: i / n, line: i / n };
    qv.forEach((v, p) => (row[`p${p}`] = v));
    rows.push(row);
  }
  return rows;
}

/// Over `count` paths at t = 1: mean and sd of Σ(ΔW)², and mean of Σ|ΔW| (total variation).
export function variationStats(n: number, count: number, seed: number) {
  const rng = makeRng(seed);
  const sd = Math.sqrt(1 / n);
  let sumQ = 0;
  let sumQ2 = 0;
  let sumAbs = 0;
  for (let c = 0; c < count; c++) {
    let q = 0;
    let a = 0;
    for (let i = 0; i < n; i++) {
      const dw = sd * nextNormal(rng);
      q += dw * dw;
      a += Math.abs(dw);
    }
    sumQ += q;
    sumQ2 += q * q;
    sumAbs += a;
  }
  const mean = sumQ / count;
  return { mean, sd: Math.sqrt(Math.max(sumQ2 / count - mean * mean, 0)), totalVariation: sumAbs / count };
}

/// Running Monte Carlo price of a European call (exact GBM terminal draws under Q)
/// with its ±1.96·SE band, sampled at ~`points` checkpoints up to `sims`.
export function monteCarloRows(S0: number, K: number, r: number, sigma: number, T: number, sims: number, seed: number, points = 200) {
  const rng = makeRng(seed);
  const drift = (r - 0.5 * sigma * sigma) * T;
  const vol = sigma * Math.sqrt(T);
  const disc = Math.exp(-r * T);
  const every = Math.max(1, Math.round(sims / points));
  let sum = 0;
  let sumSq = 0;
  const rows: { n: number; estimate: number; upper: number; lower: number }[] = [];
  for (let n = 1; n <= sims; n++) {
    const x = disc * optionPayoff(S0 * Math.exp(drift + vol * nextNormal(rng)), K, "call");
    sum += x;
    sumSq += x * x;
    if (n < 2 || (n % every !== 0 && n !== sims)) continue;
    const mean = sum / n;
    const se = Math.sqrt(Math.max((sumSq / n - mean * mean) / (n - 1), 0));
    rows.push({ n, estimate: mean, upper: mean + 1.96 * se, lower: mean - 1.96 * se });
  }
  const last = rows[rows.length - 1];
  return { rows, estimate: last.estimate, se: (last.upper - last.estimate) / 1.96 };
}

const normalDensity = (x: number, mean: number, sd: number) => Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

/// Girsanov for T = 1: densities of x = ln(S_T/S₀) under ℙ and ℚ, and a histogram of ℙ-samples
/// reweighted by dℚ/dℙ = exp(−θW − ½θ²), with θ = (μ − r)/σ.
export function girsanovRows(mu: number, r: number, sigma: number, samples = 200000, seed = 7, bins = 40) {
  const theta = (mu - r) / sigma;
  const meanP = mu - 0.5 * sigma * sigma;
  const meanQ = r - 0.5 * sigma * sigma;
  const lo = Math.min(meanP, meanQ) - 4 * sigma;
  const hi = Math.max(meanP, meanQ) + 4 * sigma;
  const width = (hi - lo) / bins;
  const mass = new Array<number>(bins).fill(0);
  const rng = makeRng(seed);
  let weightSum = 0;
  let weightedX = 0;
  // Antithetic pairs (w, −w) keep the sample symmetric, so the reweighted mean does not hinge on the seed.
  for (let i = 0; i < samples / 2; i++) {
    const z = nextNormal(rng);
    for (const w of [z, -z]) {
      const x = meanP + sigma * w;
      const weight = Math.exp(-theta * w - 0.5 * theta * theta);
      weightSum += weight;
      weightedX += weight * x;
      const b = Math.floor((x - lo) / width);
      if (b >= 0 && b < bins) mass[b] += weight;
    }
  }
  const rows = mass.map((m, b) => {
    const x = lo + (b + 0.5) * width;
    return { x, p: normalDensity(x, meanP, sigma), q: normalDensity(x, meanQ, sigma), reweighted: m / (samples * width) };
  });
  return { rows, theta, meanP, meanQ, reweightedMean: weightedX / weightSum };
}
