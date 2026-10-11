import { makeRng, nextNormal, type Rng } from "../../lib/math/random";
import { cashflowArray } from "./npvIrr.math";
import { npv } from "../../lib/finance/annuity";
import type {
  DistributionKind,
  MonteCarloConfig,
  MonteCarloResult,
  ProjectModel,
} from "./npvIrr.types";

/// Draw a zero-centred shock with unit spread from the chosen distribution.
/// Normal → N(0,1); uniform → U(−√3,√3); triangular → symmetric peak at 0.
function shock(kind: DistributionKind, rng: Rng): number {
  if (kind === "normal") return nextNormal(rng);
  if (kind === "uniform") return (rng() * 2 - 1) * Math.sqrt(3);
  const u = rng();
  const tri = u < 0.5 ? Math.sqrt(2 * u) - 1 : 1 - Math.sqrt(2 * (1 - u));
  return tri * Math.sqrt(6);
}

/// Percentile of a pre-sorted ascending array via linear interpolation.
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/// Run a Monte Carlo NPV simulation: each draw perturbs cashflows, growth and the
/// discount rate, then reprices the whole project. Returns distribution statistics.
export function runMonteCarlo(model: ProjectModel, config: MonteCarloConfig): MonteCarloResult {
  const rng = makeRng(config.seed >>> 0);
  const n = Math.max(1, Math.floor(config.iterations));
  const samples = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const cfMult = Math.max(0, 1 + shock(config.distribution, rng) * config.cashflowVol);
    const growth = model.growth + shock(config.distribution, rng) * config.growthUncertainty;
    const rate = Math.max(0, model.rate + shock(config.distribution, rng) * config.rateUncertainty);
    const draw: ProjectModel = {
      ...model,
      annual: model.annual * cfMult,
      terminalValue: model.terminalValue * cfMult,
      growth,
      customFlows: model.customFlows.map((v) => v * cfMult),
    };
    samples[i] = npv(rate, cashflowArray(draw));
  }

  const sorted = Array.from(samples).sort((a, b) => a - b);
  let sum = 0;
  let positive = 0;
  for (let i = 0; i < n; i++) {
    sum += samples[i];
    if (samples[i] > 0) positive += 1;
  }
  const mean = sum / n;
  let variance = 0;
  for (let i = 0; i < n; i++) variance += (samples[i] - mean) ** 2;
  variance /= n;

  return {
    mean,
    median: percentile(sorted, 0.5),
    std: Math.sqrt(variance),
    probPositive: positive / n,
    p5: percentile(sorted, 0.05),
    p95: percentile(sorted, 0.95),
    min: sorted[0],
    max: sorted[n - 1],
    iterations: n,
    bins: histogram(sorted, 40),
  };
}

/// Equal-width histogram bins spanning the sample range.
function histogram(sorted: number[], binCount: number): MonteCarloResult["bins"] {
  const lo = sorted[0];
  const hi = sorted[sorted.length - 1];
  const width = (hi - lo) / binCount || 1;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    x0: lo + i * width,
    x1: lo + (i + 1) * width,
    count: 0,
  }));
  for (const v of sorted) {
    const idx = Math.min(binCount - 1, Math.max(0, Math.floor((v - lo) / width)));
    bins[idx].count += 1;
  }
  return bins;
}
