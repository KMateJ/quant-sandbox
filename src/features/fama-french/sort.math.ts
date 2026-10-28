import { makeRng, nextNormal } from "../../lib/math/random";
import { subSeed } from "../../lib/game/seed";
import { correlation, mean, stdDev } from "../../lib/stats/moments";
import { slice } from "./famaFrench.math";
import type { FfData, Window } from "./famaFrench.types";
import type { Cuts, CutValues, OwnFactors, PortfolioId, SeriesStats, SortResult, Stock, SweepPoint, Weighting } from "./sort.types";
import { PORTFOLIO_IDS } from "./sort.types";

const MONTHS = 12;
const SIZE_SD = 1.5;
const BM_MEAN = -0.3;
const BM_SD = 0.6;
const IDIO_ANNUAL = 0.3;

/// Default breakpoints: size median and the 30 / 70 book-to-market cuts.
export const DEFAULT_CUTS: Cuts = { sizeCut: 0.5, bmLo: 0.3, bmHi: 0.7 };
/// Value cuts compared by the breakpoint sweep (bottom share; the top share mirrors it).
export const SWEEP_CUTS = [0.1, 0.2, 0.3, 0.4];

/// Seeded universe of `n` stocks; loadings follow from size and book-to-market, so small and value stocks load on SMB and HML.
export function makeUniverse(seed: number, n = 300): Stock[] {
  const rng = makeRng(subSeed(seed, 11));
  return Array.from({ length: n }, (_, id) => {
    const logSize = SIZE_SD * nextNormal(rng);
    const logBm = BM_MEAN + BM_SD * nextNormal(rng);
    const zSize = logSize / SIZE_SD;
    const zBm = (logBm - BM_MEAN) / BM_SD;
    return { id, logSize, logBm, beta: 1 + 0.15 * nextNormal(rng), s: 0.9 - 0.45 * zSize, h: 0.5 * zBm, idio: IDIO_ANNUAL };
  });
}

/// Monthly excess returns of every stock over the window: `β·mkt + s·smb + h·hml + idiosyncratic noise`, on the real factors.
export function stockReturns(universe: Stock[], data: FfData, w: Window, seed: number): number[][] {
  const [mkt, smb, hml] = (["mkt", "smb", "hml"] as const).map((id) => slice(data.factors[id], w));
  return universe.map((stock) => {
    const rng = makeRng(subSeed(seed, 1000 + stock.id));
    const vol = stock.idio / Math.sqrt(MONTHS);
    return mkt.map((m, t) => stock.beta * m + stock.s * smb[t] + stock.h * hml[t] + vol * nextNormal(rng));
  });
}

const sortedBy = (universe: Stock[], key: "logSize" | "logBm") => universe.map((s) => s[key]).sort((a, b) => a - b);
const quantile = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];

/// Characteristic values at the percentile cuts.
export function cutValues(universe: Stock[], cuts: Cuts): CutValues {
  const size = sortedBy(universe, "logSize");
  const bm = sortedBy(universe, "logBm");
  return { size: quantile(size, cuts.sizeCut), lo: quantile(bm, cuts.bmLo), hi: quantile(bm, cuts.bmHi) };
}

/// Universe percentile (0..1) of a characteristic value; the inverse of `cutValues` up to ties.
export function percentileOf(universe: Stock[], key: "logSize" | "logBm", value: number): number {
  return universe.filter((s) => s[key] <= value).length / universe.length;
}

/// Which of the six size and book-to-market portfolios a stock belongs to.
export function regionOf(stock: Stock, v: CutValues): PortfolioId {
  const size = stock.logSize <= v.size ? "S" : "B";
  const value = stock.logBm <= v.lo ? "L" : stock.logBm > v.hi ? "H" : "M";
  return `${size}${value}` as PortfolioId;
}

/// The six portfolios' monthly excess returns (equal- or size-weighted, weights fixed) and stock counts.
export function sortPortfolios(universe: Stock[], returns: number[][], cuts: Cuts, weighting: Weighting): SortResult {
  const values = cutValues(universe, cuts);
  const months = returns[0]?.length ?? 0;
  const members = Object.fromEntries(PORTFOLIO_IDS.map((id) => [id, [] as number[]])) as Record<PortfolioId, number[]>;
  universe.forEach((stock, i) => members[regionOf(stock, values)].push(i));
  const series = {} as Record<PortfolioId, number[]>;
  const counts = {} as Record<PortfolioId, number>;
  for (const id of PORTFOLIO_IDS) {
    const idx = members[id];
    const weights = idx.map((i) => (weighting === "value" ? Math.exp(universe[i].logSize) : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    counts[id] = idx.length;
    series[id] = Array.from({ length: months }, (_, t) => (total > 0 ? idx.reduce((s, i, k) => s + weights[k] * returns[i][t], 0) / total : 0));
  }
  return { series, counts };
}

/// Your SMB (small minus big) and HML (high minus low) from the six portfolios.
export function yourFactors(six: Record<PortfolioId, number[]>): OwnFactors {
  const at = (t: number, ids: PortfolioId[]) => ids.reduce((s, id) => s + six[id][t], 0) / ids.length;
  const range = Array.from({ length: six.SL.length }, (_, t) => t);
  return {
    smb: range.map((t) => at(t, ["SL", "SM", "SH"]) - at(t, ["BL", "BM", "BH"])),
    hml: range.map((t) => at(t, ["SH", "BH"]) - at(t, ["SL", "BL"])),
  };
}

/// Annualised mean, volatility and the t-statistic of the mean for a monthly series.
export function factorStats(series: number[]): SeriesStats {
  const m = mean(series);
  const sd = stdDev(series);
  return { mean: m * MONTHS, vol: sd * Math.sqrt(MONTHS), t: sd > 0 ? m / (sd / Math.sqrt(series.length)) : 0 };
}

/// Correlation of your factor with the official one over the same window.
export const matchWithOfficial = (own: number[], data: FfData, id: "smb" | "hml", w: Window) =>
  correlation(own, slice(data.factors[id], w));

/// t-statistic of your HML for each symmetric value cut (bottom share c, top share c); size cut and weighting kept.
export function breakpointSweep(universe: Stock[], returns: number[][], base: Cuts, weighting: Weighting, cutsList = SWEEP_CUTS): SweepPoint[] {
  return cutsList.map((c) => {
    const six = sortPortfolios(universe, returns, { ...base, bmLo: c, bmHi: 1 - c }, weighting).series;
    return { cut: c, t: factorStats(yourFactors(six).hml).t };
  });
}

/// Value distance of half a 10% percentile span around `p`; a handle step this large always crosses to the next 5% snap.
export function percentileStep(universe: Stock[], key: "logSize" | "logBm", p: number): number {
  const sorted = sortedBy(universe, key);
  return (quantile(sorted, Math.min(1, p + 0.05)) - quantile(sorted, Math.max(0, p - 0.05))) / 2;
}
