import { makeRng, nextNormal } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { mean, stdDev } from "../../lib/stats/moments";
import { ols } from "../../lib/stats/ols";
import type { WaterfallStep } from "../../components/charts/waterfall.logic";
import type { FactorFit, FactorId, FactorPremium, FfData, FfRaw, FundSpec, ModelId, Window } from "./famaFrench.types";

export const FACTOR_IDS: readonly FactorId[] = ["mkt", "smb", "hml", "rmw", "cma", "mom"];

/// Language-neutral factor symbols as printed in the Ken French files.
export const FACTOR_LABEL: Record<FactorId, string> = {
  mkt: "Mkt-RF",
  smb: "SMB",
  hml: "HML",
  rmw: "RMW",
  cma: "CMA",
  mom: "MOM",
};

/// Regressors of each pricing model, in regression order.
export const MODEL_FACTORS: Record<ModelId, FactorId[]> = {
  capm: ["mkt"],
  ff3: ["mkt", "smb", "hml"],
  carhart: ["mkt", "smb", "hml", "mom"],
  ff5: ["mkt", "smb", "hml", "rmw", "cma"],
};

const MONTHS_PER_YEAR = 12;
const ANNUAL = Math.sqrt(MONTHS_PER_YEAR);
const pctToDecimal = (series: number[]) => series.map((v) => v / 100);

/// Month labels `YYYY-MM` for `count` consecutive months from `start`.
function monthLabels(start: string, count: number): string[] {
  let year = Number(start.slice(0, 4));
  let month = Number(start.slice(5, 7));
  return Array.from({ length: count }, () => {
    const label = `${year}-${String(month).padStart(2, "0")}`;
    if (++month > 12) {
      month = 1;
      year++;
    }
    return label;
  });
}

/// Converts the on-disk snapshot (percent) to decimals and labels the months; throws if series lengths disagree.
export function toFfData(raw: FfRaw): FfData {
  const count = raw.factors.mkt.length;
  const all = [...Object.values(raw.factors), ...raw.p25.returns, ...raw.industries.returns];
  if (all.some((s) => s.length !== count)) throw new Error("fama-french: series lengths differ");
  const convert = (rows: number[][]) => rows.map(pctToDecimal);
  return {
    months: monthLabels(raw.start, count),
    factors: Object.fromEntries(Object.entries(raw.factors).map(([id, s]) => [id, pctToDecimal(s)])) as FfData["factors"],
    p25: { labels: raw.p25.labels, returns: convert(raw.p25.returns) },
    industries: { labels: raw.industries.labels, returns: convert(raw.industries.returns) },
    source: raw.source,
    url: raw.url,
    retrieved: raw.retrieved,
  };
}

/// The inclusive window `[from, to]` of a full-sample series.
export const slice = (series: number[], w: Window): number[] => series.slice(w.from, w.to + 1);

/// Growth of 1 after each month (compounded), same length as `series`.
export function cumulative(series: number[]): number[] {
  let level = 1;
  return series.map((r) => (level *= 1 + r));
}

/// Regresses excess returns on a model's factors over the window; alpha is the intercept.
export function factorFit(excess: number[], data: FfData, model: ModelId, w: Window): FactorFit {
  const ids = MODEL_FACTORS[model];
  const fit = ols(slice(excess, w), ids.map((id) => slice(data.factors[id], w)));
  return {
    alpha: fit.coef[0],
    alphaT: fit.t[0],
    alphaAnnual: fit.coef[0] * MONTHS_PER_YEAR,
    betas: ids.map((id, i) => ({ id, b: fit.coef[i + 1], se: fit.se[i + 1], t: fit.t[i + 1] })),
    r2: fit.r2,
  };
}

/// Annualised mean, volatility, Sharpe ratio and t-statistic of each factor over the window.
export function premia(data: FfData, w: Window): Record<FactorId, FactorPremium> {
  return Object.fromEntries(
    FACTOR_IDS.map((id) => {
      const s = slice(data.factors[id], w);
      const m = mean(s);
      const sd = stdDev(s);
      const t = sd > 0 ? m / (sd / Math.sqrt(s.length)) : 0;
      return [id, { mean: m * MONTHS_PER_YEAR, vol: sd * ANNUAL, sharpe: sd > 0 ? (m / sd) * ANNUAL : 0, t }];
    })
  ) as Record<FactorId, FactorPremium>;
}

/// Waterfall of the annualised mean excess return: alpha, then beta times factor mean per factor, then the total ("Σ").
export function returnAttribution(fit: FactorFit, data: FfData, w: Window): WaterfallStep[] {
  const steps: WaterfallStep[] = [{ key: "alpha", label: "α", value: fit.alphaAnnual, kind: "delta" }];
  let total = fit.alphaAnnual;
  for (const { id, b } of fit.betas) {
    const value = b * mean(slice(data.factors[id], w)) * MONTHS_PER_YEAR;
    steps.push({ key: id, label: FACTOR_LABEL[id], value, kind: "delta" });
    total += value;
  }
  steps.push({ key: "total", label: "Σ", value: total, kind: "total" });
  return steps;
}

/// Excess returns `α/12 + Σ βᵢ·fᵢ,t + σ/√12·z` of a fund over the full sample; seeded, so the hidden truth is exact.
export function syntheticFund(spec: FundSpec, data: FfData, seed: number): number[] {
  const rng = makeRng(subSeed(seed, spec.salt));
  const loadings = Object.entries(spec.loadings) as [FactorId, number][];
  return data.months.map((_, t) => {
    const systematic = loadings.reduce((s, [id, b]) => s + b * data.factors[id][t], 0);
    return spec.alpha / MONTHS_PER_YEAR + systematic + (spec.idioVol / ANNUAL) * nextNormal(rng);
  });
}

const IDIO = 0.04;

/// The mystery funds: stable ids, hidden loadings, annual alpha and idiosyncratic volatility.
export const FUND_SPECS: FundSpec[] = [
  { id: "small-value", salt: 1, loadings: { mkt: 1.05, smb: 0.7, hml: 0.6 }, alpha: 0, idioVol: IDIO },
  { id: "quality-growth", salt: 2, loadings: { mkt: 0.95, smb: -0.2, hml: -0.4, rmw: 0.5, cma: -0.2 }, alpha: 0, idioVol: IDIO },
  { id: "momentum", salt: 3, loadings: { mkt: 1.1, smb: 0.2, mom: 0.5 }, alpha: 0, idioVol: IDIO },
  { id: "closet-indexer", salt: 4, loadings: { mkt: 0.98 }, alpha: -0.008, idioVol: 0.015 },
  { id: "true-alpha", salt: 5, loadings: { mkt: 0.9, smb: 0.3, hml: 0.2 }, alpha: 0.02, idioVol: IDIO },
];

/// Month label `YYYY-MM` as e.g. "Jul 1963" in the given locale.
export function formatMonth(label: string, locale: string): string {
  const date = new Date(Date.UTC(Number(label.slice(0, 4)), Number(label.slice(5, 7)) - 1, 1));
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}
