import { normCdf } from "../../lib/stats/distributions";
import type { CallCurvesArt, CallCurvesParams } from "./home.types";

/// Alternate hero figure: Black–Scholes call value against spot for shrinking maturities.
export const HERO_CALLS: CallCurvesParams = {
  k: 100, r: 0.03, sigma: 0.3, taus: [2, 1, 0.5, 0.2, 0.05], sLo: 40, sHi: 180, vHi: 90,
  x0: 40, x1: 680, yTop: 40, yBottom: 380, steps: 120,
};

/// Black–Scholes European call price.
export function bsCall(s: number, k: number, r: number, sigma: number, tau: number): number {
  if (tau <= 0) return Math.max(s - k, 0);
  const sq = sigma * Math.sqrt(tau);
  const d1 = (Math.log(s / k) + (r + (sigma * sigma) / 2) * tau) / sq;
  return s * normCdf(d1) - k * Math.exp(-r * tau) * normCdf(d1 - sq);
}

const fmt = (n: number) => n.toFixed(1);

/// Lay out one call-value curve per maturity plus the expiry payoff as SVG path strings.
export function buildCallCurves(p: CallCurvesParams, sigma = p.sigma): CallCurvesArt {
  const xOf = (s: number) => p.x0 + ((s - p.sLo) / (p.sHi - p.sLo)) * (p.x1 - p.x0);
  const yOf = (v: number) => p.yBottom - (Math.min(v, p.vHi) / p.vHi) * (p.yBottom - p.yTop);
  const curve = (tau: number) =>
    Array.from({ length: p.steps + 1 }, (_, i) => {
      const s = p.sLo + (i / p.steps) * (p.sHi - p.sLo);
      return `${i === 0 ? "M" : "L"}${fmt(xOf(s))} ${fmt(yOf(bsCall(s, p.k, p.r, sigma, tau)))}`;
    }).join(" ");
  return {
    curves: p.taus.map(curve),
    payoff: `M${fmt(xOf(p.sLo))} ${fmt(yOf(0))} L${fmt(xOf(p.k))} ${fmt(yOf(0))} L${fmt(xOf(p.sHi))} ${fmt(yOf(p.sHi - p.k))}`,
    xK: xOf(p.k),
  };
}
