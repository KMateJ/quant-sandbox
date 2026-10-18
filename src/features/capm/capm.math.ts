import { capmExpectedReturn, jensenAlpha } from "../../lib/finance/capm";
import { linearRegression, type Regression } from "../../lib/stats/regression";
import { correlation } from "../../lib/stats/moments";
import type { BetaObservation, CapmAsset } from "./capm.types";

/// CAPM required expected return: rf + β·(E[rm] − rf).
export function expectedReturn(riskFree: number, beta: number, marketReturn: number): number {
  return capmExpectedReturn(riskFree, beta, marketReturn);
}

/// Market risk premium: E[rm] − rf.
export function marketRiskPremium(riskFree: number, marketReturn: number): number {
  return marketReturn - riskFree;
}

/// Jensen's alpha: realised return minus the CAPM-required return (positive ⇒ undervalued).
export function alpha(
  actualReturn: number,
  riskFree: number,
  beta: number,
  marketReturn: number
): number {
  return jensenAlpha(actualReturn, riskFree, beta, marketReturn);
}

/// The two endpoints of the SML as (beta, return) pairs — enough to draw a straight line.
export function smlEndpoints(
  riskFree: number,
  marketReturn: number,
  maxBeta: number
): { x: number; y: number }[] {
  return [
    { x: 0, y: riskFree },
    { x: maxBeta, y: expectedReturn(riskFree, maxBeta, marketReturn) },
  ];
}

/// Default securities for the cross-sectional "Assets" view. Each has a fixed actual return, so tilting
/// the SML (moving E[rm] or rf) changes — and can flip the sign of — every asset's alpha.
export const PRESET_ASSETS: CapmAsset[] = [
  { name: "Defensive", beta: 0.45, expectedReturn: 0.058 },
  { name: "Utility", beta: 0.75, expectedReturn: 0.072 },
  { name: "Broad index", beta: 1.0, expectedReturn: 0.09 },
  { name: "Cyclical", beta: 1.35, expectedReturn: 0.118 },
  { name: "Growth", beta: 1.7, expectedReturn: 0.15 },
];

/// Range an actual or market return can be dragged / typed to.
export const RETURN_RANGE: [number, number] = [0, 0.25];

/// Clamp `v` into the closed interval [lo, hi].
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/// Copy of `assets` with asset `index` moved to a new (clamped) fixed actual return.
export function withAssetReturn(assets: CapmAsset[], index: number, actualReturn: number): CapmAsset[] {
  const value = clamp(actualReturn, ...RETURN_RANGE);
  return assets.map((a, i) => (i === index ? { name: a.name, beta: a.beta, expectedReturn: value } : a));
}

/// A security priced against the SML: its CAPM-required return and the resulting alpha.
export type AssetRow = CapmAsset & { expectedReturn: number; capmReturn: number; alpha: number };

/// Evaluate each security against the current SML (CAPM-required return and alpha).
export function assetRows(
  assets: CapmAsset[],
  riskFree: number,
  marketReturn: number
): AssetRow[] {
  return assets.map((a) => {
    const capmReturn = expectedReturn(riskFree, a.beta, marketReturn);
    // Reference assets hold a persistent alpha and track E[rm]; others use a fixed actual return.
    const actualReturn = a.alpha !== undefined ? capmReturn + a.alpha : a.expectedReturn ?? capmReturn;
    return { ...a, expectedReturn: actualReturn, capmReturn, alpha: actualReturn - capmReturn };
  });
}

/// Deterministic pseudo-random generator (mulberry32) so the scatter is stable across renders.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/// One standard-normal draw via the Box–Muller transform.
function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/// Synthetic market/asset return observations whose OLS slope equals `beta`.
/// `dispersion` scales the idiosyncratic noise (higher ⇒ lower R²); `seed` picks the sample.
export function betaObservations(
  beta: number,
  marketReturn: number,
  riskFree: number,
  dispersion: number,
  seed = 1,
  count = 40
): BetaObservation[] {
  const rand = mulberry32(0x9e3779b9 + (seed - 1) * 7919);
  const obs: BetaObservation[] = [];
  for (let i = 0; i < count; i++) {
    const market = marketReturn + gaussian(rand) * 0.09;
    const noise = gaussian(rand) * dispersion;
    const asset = riskFree + beta * (market - riskFree) + noise;
    obs.push({ market, asset });
  }
  return obs;
}

/// OLS fit of asset returns on market returns: slope is β, intercept the regression α.
export function regressBeta(observations: BetaObservation[]): Regression {
  return linearRegression(
    observations.map((o) => o.market),
    observations.map((o) => o.asset)
  );
}

/// Pearson correlation between the market and asset return observations.
export function observationCorrelation(observations: BetaObservation[]): number {
  return correlation(
    observations.map((o) => o.market),
    observations.map((o) => o.asset)
  );
}

/// Two endpoints of a fitted line `intercept + slope·x` spanning [xMin, xMax].
export function fittedLine(fit: { slope: number; intercept: number }, xMin: number, xMax: number): { x: number; y: number }[] {
  return [xMin, xMax].map((x) => ({ x, y: fit.intercept + fit.slope * x }));
}

/// A β guess within this distance of the OLS slope counts as a hit.
export const BETA_TOLERANCE = 0.15;
