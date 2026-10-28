import { makeRng } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { dot, inverse, matVec } from "../../lib/math/matrix";
import { covarianceMatrix, mean } from "../../lib/stats/moments";
import { ols } from "../../lib/stats/ols";
import { MODEL_FACTORS, factorFit, slice } from "./famaFrench.math";
import type { FfData, ModelId, Window } from "./famaFrench.types";
import type { CrossRow } from "./cross.types";

const MONTHS = 12;

const excessOf = (data: FfData, i: number) => data.p25.returns[i].map((r, t) => r - data.factors.rf[t]);

/// Realised vs predicted annual average excess return of each of the 25 portfolios: time-series betas
/// times the factor premia (window means). With an intercept, `alpha = realised - predicted` exactly.
export function crossSection(data: FfData, w: Window, model: ModelId): CrossRow[] {
  const lambda = MODEL_FACTORS[model].map((id) => mean(slice(data.factors[id], w)) * MONTHS);
  return data.p25.labels.map((label, i) => {
    const excess = excessOf(data, i);
    const fit = factorFit(excess, data, model, w);
    const [, size, value] = /^S(\d)B(\d)$/.exec(label) ?? [];
    return {
      label,
      size: Number(size),
      value: Number(value),
      realised: mean(slice(excess, w)) * MONTHS,
      predicted: fit.betas.reduce((s, b, k) => s + b.b * lambda[k], 0),
      alpha: fit.alphaAnnual,
      alphaT: fit.alphaT,
    };
  });
}

/// Mean absolute annual alpha across the portfolios.
export const meanAbsAlpha = (rows: CrossRow[]): number => rows.reduce((s, r) => s + Math.abs(r.alpha), 0) / rows.length;

/// R-squared of predicted against realised average returns: 1 - sum(alpha^2) / sum((realised - mean)^2).
export function crossR2(rows: CrossRow[]): number {
  const m = mean(rows.map((r) => r.realised));
  const total = rows.reduce((s, r) => s + (r.realised - m) ** 2, 0);
  return total > 0 ? 1 - rows.reduce((s, r) => s + r.alpha ** 2, 0) / total : 0;
}

/// Gibbons-Ross-Shanken statistic (T-N-L)/N * a'S^-1 a / (1 + m'O^-1 m) for N excess-return series on L factors
/// (S: residual covariance divided by T; O: factor covariance divided by T). Null when T is too short.
export function grsStat(excess: number[][], factors: number[][]): number | null {
  const n = excess.length;
  const l = factors.length;
  const t = excess[0].length;
  if (t - n - l <= 0) return null;
  const fits = excess.map((y) => ols(y, factors));
  const alpha = fits.map((f) => f.coef[0]);
  const scale = (m: number[][]) => m.map((row) => row.map((v) => (v * (t - 1)) / t));
  const sigma = scale(covarianceMatrix(fits.map((f) => f.residuals)));
  const mu = factors.map(mean);
  const omega = scale(covarianceMatrix(factors));
  const alphaTerm = dot(alpha, matVec(inverse(sigma), alpha));
  const factorTerm = dot(mu, matVec(inverse(omega), mu));
  return ((t - n - l) / n) * (alphaTerm / (1 + factorTerm));
}

/// GRS statistic of the 25 portfolios under a model over the window; null when the window is too short.
export function grs(data: FfData, w: Window, model: ModelId): number | null {
  const excess = data.p25.labels.map((_, i) => slice(excessOf(data, i), w));
  return grsStat(excess, MODEL_FACTORS[model].map((id) => slice(data.factors[id], w)));
}

/// Evenly spaced axis ticks (decimals) covering [lo, hi] with a 1-2-5 step.
export function axisTicks(lo: number, hi: number, target = 6): number[] {
  const raw = (hi - lo) / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const first = Math.ceil(lo / step - 1e-9) * step;
  return Array.from({ length: Math.floor((hi - first) / step + 1e-9) + 1 }, (_, i) => Number((first + i * step).toFixed(10)));
}

/// Months in a challenge window (20 years).
export const CHALLENGE_MONTHS = 240;

/// Seeded challenge round: CAPM or FF3 over a 20-year window inside the snapshot.
export function challengeRound(seed: number, months: number): { model: "capm" | "ff3"; window: Window } {
  const rng = makeRng(subSeed(seed, 31));
  const model = rng() < 0.5 ? "capm" : "ff3";
  const from = Math.floor(rng() * (months - CHALLENGE_MONTHS + 1));
  return { model, window: { from, to: from + CHALLENGE_MONTHS - 1 } };
}

/// Label of the portfolio with the largest (most positive) alpha.
export const topAlphaLabel = (rows: CrossRow[]): string => rows.reduce((a, b) => (b.alpha > a.alpha ? b : a)).label;
