import { makeRng, nextNormal } from "../../lib/math/random";
import { ols } from "../../lib/stats/ols";

export type FfFactor = "mkt" | "smb" | "hml" | "rmw" | "cma";
export type FfModel = "capm" | "ff3" | "ff5";

/// Factor order used by every array in this file.
export const FF_FACTORS: readonly FfFactor[] = ["mkt", "smb", "hml", "rmw", "cma"];
/// Factors each model regresses on.
export const FF_MODEL_FACTORS: Record<FfModel, FfFactor[]> = {
  capm: ["mkt"],
  ff3: ["mkt", "smb", "hml"],
  ff5: ["mkt", "smb", "hml", "rmw", "cma"],
};

/// Monthly mean premia of the simulated factors (decimals).
export const FF_PREMIA: Record<FfFactor, number> = { mkt: 0.006, smb: 0.002, hml: 0.003, rmw: 0.0025, cma: 0.0025 };
const VOLS: Record<FfFactor, number> = { mkt: 0.045, smb: 0.03, hml: 0.03, rmw: 0.022, cma: 0.02 };
/// Correlation of CMA with HML (conservative investors are often value firms).
const CMA_HML_CORR = 0.6;
const SEED = 20260;
const IDIO_VOL = 0.015;

export interface FfFundInput {
  /// Loading on SMB (size tilt).
  size: number;
  /// Loading on HML (value tilt).
  value: number;
  /// Sample length in months.
  months: number;
}

/// The fund's fixed true loadings apart from the two sliders, and its true alpha (zero).
export const FF_TRUE_FIXED = { mkt: 1, rmw: 0.3, cma: 0, alpha: 0 };

export interface FfFit {
  /// Estimated loadings by factor; `null` when the model leaves the factor out.
  loadings: Record<FfFactor, number | null>;
  truth: Record<FfFactor, number>;
  /// Monthly intercept and its t-statistic.
  alphaMonthly: number;
  alphaT: number;
  /// Intercept × 12.
  alphaAnnual: number;
  r2: number;
}

/// Seeded factor returns with sample means and volatilities rescaled to exactly the targets,
/// so the figure's story does not depend on sampling luck in the premia.
export function ffFactorSample(months: number): Record<FfFactor, number[]> {
  const rng = makeRng(SEED);
  const raw: Record<FfFactor, number[]> = { mkt: [], smb: [], hml: [], rmw: [], cma: [] };
  for (let t = 0; t < months; t++) {
    const z = FF_FACTORS.map(() => nextNormal(rng));
    raw.mkt.push(z[0]);
    raw.smb.push(z[1]);
    raw.hml.push(z[2]);
    raw.rmw.push(z[3]);
    raw.cma.push(CMA_HML_CORR * z[2] + Math.sqrt(1 - CMA_HML_CORR ** 2) * z[4]);
  }
  const out = {} as Record<FfFactor, number[]>;
  for (const f of FF_FACTORS) {
    const xs = raw[f];
    const m = xs.reduce((s, v) => s + v, 0) / months;
    const sd = Math.sqrt(xs.reduce((s, v) => s + (v - m) ** 2, 0) / (months - 1));
    out[f] = xs.map((v) => FF_PREMIA[f] + (VOLS[f] * (v - m)) / sd);
  }
  return out;
}

/// True loadings of the fund for the slider settings.
export const ffTruth = (input: FfFundInput): Record<FfFactor, number> => ({
  mkt: FF_TRUE_FIXED.mkt,
  smb: input.size,
  hml: input.value,
  rmw: FF_TRUE_FIXED.rmw,
  cma: FF_TRUE_FIXED.cma,
});

/// Monthly excess returns of the simulated fund: true loadings × factors + seeded idiosyncratic noise (demeaned, so true alpha is zero in-sample).
export function ffFundReturns(input: FfFundInput, factors: Record<FfFactor, number[]>): number[] {
  const truth = ffTruth(input);
  const rng = makeRng(SEED + 1);
  const eps = Array.from({ length: input.months }, () => IDIO_VOL * nextNormal(rng));
  const em = eps.reduce((s, v) => s + v, 0) / input.months;
  return eps.map((e, t) => FF_TRUE_FIXED.alpha + FF_FACTORS.reduce((s, f) => s + truth[f] * factors[f][t], 0) + e - em);
}

/// Time-series regression of the fund's excess returns on one model's factors.
export function ffFit(input: FfFundInput, model: FfModel): FfFit {
  const factors = ffFactorSample(input.months);
  const y = ffFundReturns(input, factors);
  const used = FF_MODEL_FACTORS[model];
  const res = ols(y, used.map((f) => factors[f]));
  const loadings = { mkt: null, smb: null, hml: null, rmw: null, cma: null } as Record<FfFactor, number | null>;
  used.forEach((f, i) => (loadings[f] = res.coef[i + 1]));
  return { loadings, truth: ffTruth(input), alphaMonthly: res.coef[0], alphaT: res.t[0], alphaAnnual: res.coef[0] * 12, r2: res.r2 };
}

/// Expected monthly excess return implied by loadings and premia: `Σ bᵢ·E[fᵢ]` (missing loadings count as zero).
export const ffExpectedExcess = (loadings: Partial<Record<FfFactor, number | null>>, premia = FF_PREMIA): number =>
  FF_FACTORS.reduce((s, f) => s + (loadings[f] ?? 0) * premia[f], 0);
