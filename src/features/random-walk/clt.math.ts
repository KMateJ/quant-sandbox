import { makeRng } from "../../lib/math/random";
import { normCdf } from "../../lib/stats/distributions";
import type { KsPoint, SampleMoments, StepDistribution, StepMoments } from "../../lib/stochastic/clt.types";

const STREAM_STRIDE = 1_000_003;
const SQRT3 = Math.sqrt(3);

/// Best known Berry–Esseen constant for i.i.d. sums (Shevtsova, 2011).
export const BERRY_ESSEEN_C = 0.4748;

/// Expected KS distance of a sample of size m drawn from the target law itself
/// (mean of the Kolmogorov distribution ≈ 0.8687 / √m) — below this, noise dominates.
export function ksNoiseFloor(sampleCount: number): number {
  return 0.8687 / Math.sqrt(sampleCount);
}

/// Exact skewness and third absolute moment of each standardised step law.
export const STEP_MOMENTS: Record<StepDistribution, StepMoments> = {
  coin: { skewness: 0, thirdAbsolute: 1 },
  // X ~ U[−√3, √3]: E|X|³ = 3√3 / 4.
  uniform: { skewness: 0, thirdAbsolute: (3 * SQRT3) / 4 },
  // X = E − 1, E ~ Exp(1): skewness 2, E|X|³ = 12/e − 2.
  exponential: { skewness: 2, thirdAbsolute: 12 / Math.E - 2 },
};

/// Map a uniform u ∈ [0, 1) to one standardised step (mean 0, variance 1).
export function drawStep(distribution: StepDistribution, u: number): number {
  switch (distribution) {
    case "coin":
      return u < 0.5 ? 1 : -1;
    case "uniform":
      return (2 * u - 1) * SQRT3;
    case "exponential":
      return -Math.log(1 - u) - 1;
  }
}

/// Zₙ = Sₙ / √n for every n in `levels` (ascending) and `sampleCount` independent
/// sums. Each sample has its own seeded stream, so Z₁₀ and Z₁₀₀ share their first
/// ten steps — changing n refines the same experiment instead of redrawing it.
export function cltLevelSamples(
  seed: number,
  distribution: StepDistribution,
  levels: readonly number[],
  sampleCount: number
): Float64Array[] {
  const out = levels.map(() => new Float64Array(sampleCount));
  const maxN = levels[levels.length - 1];
  for (let sample = 0; sample < sampleCount; sample++) {
    const rng = makeRng((seed * STREAM_STRIDE + sample) >>> 0);
    let sum = 0;
    let level = 0;
    for (let k = 1; k <= maxN; k++) {
      sum += drawStep(distribution, rng());
      if (k === levels[level]) {
        out[level][sample] = sum / Math.sqrt(k);
        level++;
      }
    }
  }
  return out;
}

/// Sample mean, unbiased variance and (moment) skewness.
export function sampleMoments(values: ArrayLike<number>): SampleMoments {
  const m = values.length;
  let mean = 0;
  for (let i = 0; i < m; i++) mean += values[i];
  mean /= m;
  let m2 = 0;
  let m3 = 0;
  for (let i = 0; i < m; i++) {
    const d = values[i] - mean;
    m2 += d * d;
    m3 += d * d * d;
  }
  const popVar = m2 / m;
  return {
    mean,
    variance: m > 1 ? m2 / (m - 1) : 0,
    skewness: popVar > 0 ? m3 / m / popVar ** 1.5 : 0,
  };
}

/// Kolmogorov–Smirnov distance sup |F̂(x) − Φ(x)| between the sample's empirical CDF
/// and the standard normal CDF. Checking both sides of every jump handles ties
/// (lattice sums like the ±1 walk).
export function ksDistance(values: ArrayLike<number>): number {
  const sorted = Float64Array.from(values).sort();
  const m = sorted.length;
  let worst = 0;
  for (let i = 0; i < m; i++) {
    const phi = normCdf(sorted[i]);
    worst = Math.max(worst, (i + 1) / m - phi, phi - i / m);
  }
  return worst;
}

/// Measured KS distance per n next to the Berry–Esseen bound C·ρ/√n.
export function ksCurve(
  samples: Float64Array[],
  levels: readonly number[],
  distribution: StepDistribution
): KsPoint[] {
  const rho = STEP_MOMENTS[distribution].thirdAbsolute;
  return levels.map((n, i) => ({
    n,
    ks: ksDistance(samples[i]),
    bound: (BERRY_ESSEEN_C * rho) / Math.sqrt(n),
  }));
}

/// Skewness of Zₙ: γ / √n — the leading-order reason a skewed sum still looks lopsided.
export function sumSkewness(distribution: StepDistribution, n: number): number {
  return STEP_MOMENTS[distribution].skewness / Math.sqrt(n);
}
