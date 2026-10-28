import { ols } from "../../lib/stats/ols";
import { makeRng } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { FACTOR_IDS, FUND_SPECS, MODEL_FACTORS, slice } from "./famaFrench.math";
import type { FactorId, FfData, ModelId, Window } from "./famaFrench.types";
import type { AlphaFit, AlphaRung } from "./fund.types";

const MONTHS_PER_YEAR = 12;
/// |t| at or above this counts as significant.
export const T_CRIT = 2;

export const LADDER_MODELS: ModelId[] = ["capm", "ff3", "carhart", "ff5"];

/// Regressors of a custom model: the market is always in, the rest in the canonical order.
export const customModel = (factors: FactorId[]): FactorId[] =>
  FACTOR_IDS.filter((id) => id === "mkt" || factors.includes(id));

/// The preset whose factors equal `factors`, or `null` for a custom mix.
export function matchingModel(factors: FactorId[]): ModelId | null {
  const key = customModel(factors).join();
  return LADDER_MODELS.find((m) => MODEL_FACTORS[m].join() === key) ?? null;
}

export const isSignificant = (t: number): boolean => Math.abs(t) >= T_CRIT;

/// Regression of excess returns on any factor set over the window, with the alpha annualised (×12) and its ±2 se band.
export function alphaFit(excess: number[], data: FfData, factors: FactorId[], w: Window): AlphaFit {
  const ids = customModel(factors);
  const fit = ols(slice(excess, w), ids.map((id) => slice(data.factors[id], w)));
  const alphaAnnual = fit.coef[0] * MONTHS_PER_YEAR;
  const band = T_CRIT * fit.se[0] * MONTHS_PER_YEAR;
  return {
    alpha: fit.coef[0],
    alphaT: fit.t[0],
    alphaAnnual,
    alphaSe: fit.se[0],
    lo: alphaAnnual - band,
    hi: alphaAnnual + band,
    betas: ids.map((id, i) => ({ id, b: fit.coef[i + 1], se: fit.se[i + 1], t: fit.t[i + 1] })),
    r2: fit.r2,
  };
}

/// Alpha, ±2 se band and t-statistic under CAPM, FF3, Carhart and FF5.
export function alphaLadder(excess: number[], data: FfData, w: Window): AlphaRung[] {
  return LADDER_MODELS.map((model) => ({ model, factors: MODEL_FACTORS[model], fit: alphaFit(excess, data, MODEL_FACTORS[model], w) }));
}

/// The first model of the ladder whose alpha has |t| < 2, or `"none"`.
export function firstInsignificant(ladder: AlphaRung[]): ModelId | "none" {
  const rung = ladder.find((r) => !isSignificant(r.fit.alphaT));
  return rung ? (rung.model as ModelId) : "none";
}

/// Value range covering every rung's band and zero, with a little margin.
export function ladderDomain(rungs: AlphaRung[]): [number, number] {
  const vals = [0, ...rungs.flatMap((r) => [r.fit.lo, r.fit.hi])];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo || 0.01) * 0.08;
  return [lo - pad, hi + pad];
}

/// Random 20-year window of a challenge round, as month indices inside `months`.
export function challengeWindow(seed: number, months: number): Window {
  const len = 240;
  const from = Math.floor(makeRng(subSeed(seed, 91))() * (months - len));
  return { from, to: from + len - 1 };
}

/// Index of the synthetic fund drawn for a challenge round.
export const challengeFundIndex = (seed: number): number => Math.floor(makeRng(subSeed(seed, 53))() * FUND_SPECS.length);
