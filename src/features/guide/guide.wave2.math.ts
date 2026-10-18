import {
  blackScholesCall,
  blackScholesDelta,
  blackScholesGamma,
  blackScholesPut,
  blackScholesTheta,
  blackScholesVega,
} from "../black-scholes/blackScholes.math";
import { blDensity, callPrice } from "../payoff-lab/replication/replication.math";
import type { MarketParams } from "../payoff-lab/replication/replication.types";
import { bisection } from "../../lib/math/roots";
import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf, normInv, normPdf } from "../../lib/stats/distributions";

// #region Static replication (Breeden–Litzenberger)

const market = (spot: number, r: number, sigma: number, T: number, skew: number): MarketParams =>
  ({ spot, rate: r, sigma, maturity: T, skew, strikeStep: 0 });

/// Risk-neutral density read off call prices across strikes (and the flat-vol lognormal when skewed).
/// A difference step of 1% of spot keeps rounding in the call prices from showing up as wiggles.
export function blDensityRows(spot: number, r: number, sigma: number, T: number, skew: number, kMax = 2 * spot, points = 120) {
  const m = market(spot, r, sigma, T, skew);
  const flat = { ...m, skew: 0 };
  const h = spot / 100;
  return Array.from({ length: points }, (_, i) => {
    const K = (kMax * (i + 1)) / points;
    return { K, density: Math.max(0, blDensity(m, K, h)), ...(skew !== 0 ? { flat: blDensity(flat, K, h) } : {}) };
  });
}

/// Price of a butterfly K−h, K, K+h per unit width², which tends to e^{−rT} q(K) as h → 0.
export function butterflyPrice(spot: number, r: number, sigma: number, T: number, skew: number, K: number, h: number) {
  const m = market(spot, r, sigma, T, skew);
  return (callPrice(m, K - h) - 2 * callPrice(m, K) + callPrice(m, K + h)) / (h * h);
}

/// Butterfly approximation, the exact discounted density it targets, and the total probability mass.
export function blReadout(spot: number, r: number, sigma: number, T: number, skew: number, K: number, h: number) {
  const m = market(spot, r, sigma, T, skew);
  const step = spot / 400;
  let mass = 0;
  for (let k = step; k < spot * 8; k += step) mass += blDensity(m, k, step) * step;
  return {
    butterfly: butterflyPrice(spot, r, sigma, T, skew, K, h),
    exact: Math.exp(-r * T) * blDensity(m, K, 1e-3 * spot),
    mass,
  };
}

// #endregion

// #region Greeks

/// Call value and its Greeks across spot prices (theta per year, vega per unit of σ).
export function greeksRows(K: number, T: number, r: number, sigma: number, sMin = 40, sMax = 160, points = 121) {
  return Array.from({ length: points }, (_, i) => {
    const S = sMin + ((sMax - sMin) * i) / (points - 1);
    return {
      S,
      value: blackScholesCall(S, K, T, r, sigma),
      delta: blackScholesDelta(S, K, T, r, sigma),
      gamma: blackScholesGamma(S, K, T, r, sigma),
      vega: blackScholesVega(S, K, T, r, sigma),
      theta: blackScholesTheta(S, K, T, r, sigma),
    };
  });
}

/// Greeks at one spot and the Black–Scholes PDE residual Θ + ½σ²S²Γ + rSΔ − rV (zero for a correct price).
export function greeksAt(S: number, K: number, T: number, r: number, sigma: number) {
  const value = blackScholesCall(S, K, T, r, sigma);
  const delta = blackScholesDelta(S, K, T, r, sigma);
  const gamma = blackScholesGamma(S, K, T, r, sigma);
  const vega = blackScholesVega(S, K, T, r, sigma);
  const theta = blackScholesTheta(S, K, T, r, sigma);
  const pde = theta + 0.5 * sigma * sigma * S * S * gamma + r * S * delta - r * value;
  return { value, delta, gamma, vega, theta, pde };
}

// #endregion

// #region Implied volatility

/// Black–Scholes price of a call or put.
export const bsPrice = (kind: "call" | "put", S: number, K: number, T: number, r: number, sigma: number) =>
  kind === "call" ? blackScholesCall(S, K, T, r, sigma) : blackScholesPut(S, K, T, r, sigma);

/// No-arbitrage bounds a quoted option price must respect for an implied volatility to exist.
export function priceBounds(kind: "call" | "put", S: number, K: number, T: number, r: number) {
  const pvK = K * Math.exp(-r * T);
  return kind === "call" ? { lower: Math.max(S - pvK, 0), upper: S } : { lower: Math.max(pvK - S, 0), upper: pvK };
}

/// Volatility that makes the Black–Scholes price equal `price`, or NaN outside the no-arbitrage bounds.
export function impliedVol(kind: "call" | "put", price: number, S: number, K: number, T: number, r: number): number {
  const { lower, upper } = priceBounds(kind, S, K, T, r);
  if (!(price > lower && price < upper)) return NaN;
  const f = (sigma: number) => bsPrice(kind, S, K, T, r, sigma) - price;
  return bisection(f, 1e-4, 5, { tol: 1e-10, maxIter: 200 }).root;
}

/// Model price as a function of σ, for reading the implied volatility off a quoted price.
export function priceVsVolRows(kind: "call" | "put", S: number, K: number, T: number, r: number, sMax = 1, points = 101) {
  return Array.from({ length: points }, (_, i) => {
    const sigma = 0.01 + ((sMax - 0.01) * i) / (points - 1);
    return { sigma, price: bsPrice(kind, S, K, T, r, sigma) };
  });
}

// #endregion

// #region Value at Risk and expected shortfall

/// Quantile z_α of the standard normal and the ES multiplier φ(z_α)/(1−α).
export function normalTail(alpha: number) {
  const z = normInv(alpha);
  return { z, esFactor: normPdf(z) / (1 - alpha) };
}

/// Normal VaR and ES of a position worth `value`, as positive losses over the horizon.
export function normalVarEs(value: number, mu: number, sigma: number, alpha: number) {
  const { z, esFactor } = normalTail(alpha);
  return { var: value * (sigma * z - mu), es: value * (sigma * esFactor - mu) };
}

/// Student-t density with ν degrees of freedom, rescaled to unit variance (ν > 2).
export function scaledTPdf(x: number, nu: number): number {
  const s = Math.sqrt((nu - 2) / nu);
  const t = x / s;
  const c = Math.exp(lgamma((nu + 1) / 2) - lgamma(nu / 2)) / Math.sqrt(nu * Math.PI);
  return (c * Math.pow(1 + (t * t) / nu, -(nu + 1) / 2)) / s;
}

/// VaR and ES (in units of σ) of the unit-variance t, by numerical integration of the right tail.
export function tTail(alpha: number, nu: number, xMax = 40, n = 8000) {
  const h = xMax / n;
  let cdfRight = 0;
  let firstMoment = 0;
  let quantile = xMax;
  // Integrate the right tail inward until it holds 1 − α of the mass.
  for (let i = n; i > 0; i -= 1) {
    const x = (i - 0.5) * h;
    const mass = scaledTPdf(x, nu) * h;
    if (cdfRight + mass >= 1 - alpha) {
      const frac = (1 - alpha - cdfRight) / mass;
      quantile = i * h - frac * h;
      firstMoment += x * (1 - alpha - cdfRight);
      break;
    }
    cdfRight += mass;
    firstMoment += x * mass;
  }
  return { z: quantile, esFactor: firstMoment / (1 - alpha) };
}

/// VaR and ES per `value` invested, normal vs unit-variance t with ν degrees of freedom, over `days` days.
export function varEsComparison(value: number, dailySigma: number, days: number, alpha: number, nu: number) {
  const sigma = dailySigma * Math.sqrt(days);
  const normal = normalVarEs(value, 0, sigma, alpha);
  const t = tTail(alpha, nu);
  return { sigma, normal, fat: { var: value * sigma * t.z, es: value * sigma * t.esFactor } };
}

/// Loss densities (normal vs fat-tailed t, both with the same σ) for the VaR/ES figure.
export function lossDensityRows(sigma: number, nu: number, xMax = 5, points = 161) {
  return Array.from({ length: points }, (_, i) => {
    const x = -xMax + (2 * xMax * i) / (points - 1);
    return { loss: x * sigma, normal: normPdf(x) / sigma, fat: scaledTPdf(x, nu) / sigma };
  });
}

/// Probability that the normal loss exceeds `threshold` standard deviations.
export const normalExceedance = (threshold: number) => 1 - normCdf(threshold);

function lgamma(x: number): number {
  // Lanczos approximation, accurate to ~1e-13 for x > 0.
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  const xm = x - 1;
  let a = c[0];
  const t = xm + g + 0.5;
  for (let i = 1; i < g + 2; i += 1) a += c[i] / (xm + i);
  return 0.5 * Math.log(2 * Math.PI) + (xm + 0.5) * Math.log(t) - t + Math.log(a);
}

// #endregion

// #region Mean reversion (Ornstein–Uhlenbeck)

/// Mean and standard deviation of X_t for dX = κ(θ − X)dt + σ dW started at x0.
export function ouMoments(x0: number, kappa: number, theta: number, sigma: number, t: number) {
  const decay = Math.exp(-kappa * t);
  const variance = kappa > 0 ? (sigma * sigma * (1 - decay * decay)) / (2 * kappa) : sigma * sigma * t;
  return { mean: theta + (x0 - theta) * decay, sd: Math.sqrt(variance) };
}

/// Half-life ln 2 / κ: time for the expected gap to the long-run mean to halve.
export const ouHalfLife = (kappa: number) => Math.log(2) / kappa;

/// Seeded OU paths simulated with the exact Gaussian transition, plus mean and ±2 sd bands.
export function ouRows(x0: number, kappa: number, theta: number, sigma: number, T: number, paths: number, steps: number, seed: number) {
  const rng = makeRng(seed);
  const dt = T / steps;
  const { sd: stepSd } = ouMoments(0, kappa, 0, sigma, dt);
  const decay = Math.exp(-kappa * dt);
  const state = Array.from({ length: paths }, () => x0);
  return Array.from({ length: steps + 1 }, (_, i) => {
    if (i > 0) for (let p = 0; p < paths; p += 1) state[p] = theta + (state[p] - theta) * decay + stepSd * nextNormal(rng);
    const t = i * dt;
    const { mean, sd } = ouMoments(x0, kappa, theta, sigma, t);
    const row: Record<string, number> = { t, mean, upper: mean + 2 * sd, lower: mean - 2 * sd };
    state.forEach((x, p) => { row[`p${p}`] = x; });
    return row;
  });
}

/// Vasicek zero-coupon bond price P(0,T) when the short rate r follows an OU process.
export function vasicekBondPrice(r0: number, kappa: number, theta: number, sigma: number, T: number): number {
  const B = (1 - Math.exp(-kappa * T)) / kappa;
  const lnA = (theta - (sigma * sigma) / (2 * kappa * kappa)) * (B - T) - (sigma * sigma * B * B) / (4 * kappa);
  return Math.exp(lnA - B * r0);
}

// #endregion
