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

/// Default securities for the cross-sectional "Assets" view, each carrying a persistent alpha
/// so its return shifts with E[rm] while keeping a fixed distance from the SML.
export const PRESET_ASSETS: CapmAsset[] = [
  { name: "Defensive", beta: 0.45, alpha: 0.001 },
  { name: "Utility", beta: 0.75, alpha: -0.003 },
  { name: "Broad index", beta: 1.0, alpha: 0 },
  { name: "Cyclical", beta: 1.35, alpha: 0.007 },
  { name: "Growth", beta: 1.7, alpha: 0.018 },
];

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
/// `dispersion` scales the idiosyncratic noise (higher ⇒ lower R²).
export function betaObservations(
  beta: number,
  marketReturn: number,
  riskFree: number,
  dispersion: number,
  count = 40
): BetaObservation[] {
  const rand = mulberry32(0x9e3779b9);
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
