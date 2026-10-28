import { makeRng } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { mean, stdDev } from "../../lib/stats/moments";
import { FUND_SPECS, MODEL_FACTORS, slice, syntheticFund } from "./famaFrench.math";
import type { FactorId, FfData, FundSpec, ModelId, Window } from "./famaFrench.types";
import type { FundChoice } from "./fund.types";

const MONTHS_PER_YEAR = 12;

/// How close each loading must be for the loadings challenge.
export const LOADINGS_TOL = 0.15;
/// Share of the OLS R² the reader's replica must reach.
export const R2_SHARE = 0.9;

const INDUSTRY_CODES = ["NoDur", "HiTec", "Utils"] as const;
export const SYNTHETIC_FUND_IDS = FUND_SPECS.map((s) => s.id);
export const INDUSTRY_FUND_IDS = INDUSTRY_CODES.map((c) => `ind-${c}`);
export const EXPLORE_FUND_IDS = [...SYNTHETIC_FUND_IDS, ...INDUSTRY_FUND_IDS];
export const FUND_IDS = [...EXPLORE_FUND_IDS, "challenge"];

/// Resolves a fund id to what it is; unknown ids fall back to the first synthetic fund.
export function fundChoice(id: string, data: FfData): FundChoice {
  if (id === "challenge") return { id, kind: "challenge" };
  const spec = FUND_SPECS.find((s) => s.id === id);
  if (spec) return { id, kind: "synthetic", spec };
  const index = data.industries.labels.indexOf(id.replace(/^ind-/, ""));
  if (index >= 0) return { id, kind: "industry", index };
  return { id: FUND_SPECS[0].id, kind: "synthetic", spec: FUND_SPECS[0] };
}

/// Model of the loadings challenge for a seed: FF3 on even seeds, FF5 on odd ones.
export const challengeModel = (seed: number): ModelId => (seed % 2 === 0 ? "ff3" : "ff5");

/// Hidden fund of the loadings challenge: zero alpha, loadings on the model's factors in steps of 0.05.
export function challengeSpec(seed: number): FundSpec {
  const rng = makeRng(subSeed(seed, 77));
  const step = (lo: number, hi: number) => Math.round((lo + (hi - lo) * rng()) / 0.05) * 0.05;
  const loadings: Partial<Record<FactorId, number>> = {};
  MODEL_FACTORS[challengeModel(seed)].forEach((id) => {
    loadings[id] = id === "mkt" ? step(0.7, 1.3) : step(-0.7, 0.7);
  });
  return { id: "challenge", salt: 7, loadings, alpha: 0, idioVol: 0.03 };
}

/// Excess-return series of a fund over the full sample (industries minus the risk-free rate).
export function fundSeries(choice: FundChoice, data: FfData, seed: number): number[] {
  if (choice.kind === "industry") return data.industries.returns[choice.index].map((r, t) => r - data.factors.rf[t]);
  const spec = choice.kind === "synthetic" ? choice.spec : challengeSpec(seed);
  return syntheticFund(spec, data, seed);
}

/// The answer key (hidden loadings on the model's factors) of a synthetic fund, `null` for industries.
export function truthLoadings(choice: FundChoice, model: ModelId, seed: number): number[] | null {
  if (choice.kind === "industry") return null;
  const spec = choice.kind === "synthetic" ? choice.spec : challengeSpec(seed);
  return MODEL_FACTORS[model].map((id) => spec.loadings[id] ?? 0);
}

/// Monthly returns `Σ βᵢ·fᵢ` of a replica over the window; `loadings` follows `factors`.
export function replicaReturns(loadings: number[], factors: FactorId[], data: FfData, w: Window): number[] {
  const cols = factors.map((id) => slice(data.factors[id], w));
  return cols[0].map((_, t) => cols.reduce((s, col, i) => s + loadings[i] * col[t], 0));
}

/// Annualised standard deviation of the monthly difference between a fund and its replica.
export function trackingError(fund: number[], replica: number[]): number {
  return stdDev(fund.map((r, t) => r - replica[t])) * Math.sqrt(MONTHS_PER_YEAR);
}

/// `1 − SS_res/SS_tot` of the replica against the fund.
export function replicaR2(fund: number[], replica: number[]): number {
  const m = mean(fund);
  const tot = fund.reduce((s, r) => s + (r - m) ** 2, 0);
  const res = fund.reduce((s, r, t) => s + (r - replica[t]) ** 2, 0);
  return tot > 0 ? 1 - res / tot : 0;
}

/// Annualised mean of the monthly residual (fund minus replica).
export const meanResidualPerYear = (fund: number[], replica: number[]): number =>
  mean(fund.map((r, t) => r - replica[t])) * MONTHS_PER_YEAR;

/// True when every loading is within `tol` of the truth.
export const loadingsHit = (yours: number[], truth: number[], tol = LOADINGS_TOL): boolean =>
  yours.every((v, i) => Math.abs(v - truth[i]) <= tol + 1e-9);

/// Starting loadings of the replica: 1 on the market, 0 elsewhere.
export const startLoadings = (factors: FactorId[]): number[] => factors.map((id) => (id === "mkt" ? 1 : 0));
