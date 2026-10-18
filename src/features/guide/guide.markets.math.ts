import { npv, irr } from "../../lib/finance/annuity";
import { bondPrice, convexity, macaulayDuration, modifiedDuration } from "../../lib/finance/bond";
import { capmExpectedReturn } from "../../lib/finance/capm";

const grid = (from: number, to: number, points: number) =>
  Array.from({ length: points }, (_, i) => from + ((to - from) * i) / (points - 1));

// #region Two-asset portfolios

export type Asset = { mu: number; sigma: number };

/// The two assets used by the portfolio figures.
export const ASSET_A: Asset = { mu: 0.06, sigma: 0.15 };
export const ASSET_B: Asset = { mu: 0.12, sigma: 0.3 };

/// Expected return and volatility of weight `w` in B and 1 − w in A, at correlation ρ.
export function twoAssetPoint(w: number, rho: number, a = ASSET_A, b = ASSET_B) {
  const variance = (1 - w) ** 2 * a.sigma ** 2 + w ** 2 * b.sigma ** 2 + 2 * w * (1 - w) * rho * a.sigma * b.sigma;
  return { w, mu: (1 - w) * a.mu + w * b.mu, sigma: Math.sqrt(Math.max(variance, 0)) };
}

/// Combinations of A and B for weights in B from `wMin` to `wMax`, as σ–μ points.
export function twoAssetCurve(rho: number, wMin = 0, wMax = 1, points = 101) {
  return grid(wMin, wMax, points).map((w) => twoAssetPoint(w, rho));
}

/// Weight in B of the minimum-variance portfolio of A and B.
export function minVarianceWeight(rho: number, a = ASSET_A, b = ASSET_B): number {
  const cov = rho * a.sigma * b.sigma;
  const denom = a.sigma ** 2 + b.sigma ** 2 - 2 * cov;
  return denom === 0 ? 0.5 : (a.sigma ** 2 - cov) / denom;
}

/// Weight in B of the tangency (maximum Sharpe ratio) portfolio for risk-free rate rf.
export function tangencyWeight(rho: number, rf: number, a = ASSET_A, b = ASSET_B): number {
  const ea = a.mu - rf;
  const eb = b.mu - rf;
  const cov = rho * a.sigma * b.sigma;
  const num = eb * a.sigma ** 2 - ea * cov;
  const den = eb * a.sigma ** 2 + ea * b.sigma ** 2 - (ea + eb) * cov;
  return den === 0 ? 0.5 : num / den;
}

/// Sharpe ratio (μ − rf) / σ.
export const sharpe = (mu: number, sigma: number, rf: number) => (sigma > 0 ? (mu - rf) / sigma : NaN);

/// Security market line rf + β(E[Rm] − rf) on β ∈ [0, 2].
export function smlRows(rf: number, marketReturn: number) {
  return grid(0, 2, 21).map((beta) => ({ beta, sml: capmExpectedReturn(rf, beta, marketReturn) }));
}
// #endregion

// #region Bonds (face 100, annual coupons)

const FACE = 100;
export const price = (c: number, y: number, T: number) => bondPrice(FACE, c, y, T, 1);

/// Price against yield on [0, yMax].
export function priceYieldRows(c: number, T: number, yMax = 0.15) {
  return grid(0, yMax, 61).map((y) => ({ y, price: price(c, y, T) }));
}

/// Price, duration and convexity at y₀, with the first- and second-order approximations around it.
export function durationConvexity(c: number, T: number, y0: number, span = 0.04) {
  const p0 = price(c, y0, T);
  const mac = macaulayDuration(FACE, c, y0, T, 1);
  const mod = modifiedDuration(FACE, c, y0, T, 1);
  const conv = convexity(FACE, c, y0, T, 1);
  const durationApprox = (dy: number) => p0 * (1 - mod * dy);
  const convexApprox = (dy: number) => p0 * (1 - mod * dy + 0.5 * conv * dy * dy);
  const rows = grid(Math.max(0, y0 - span), y0 + span, 61).map((y) => ({
    y,
    price: price(c, y, T),
    duration: durationApprox(y - y0),
    convexity: convexApprox(y - y0),
  }));
  const shock = (dy: number) => ({ actual: price(c, y0 + dy, T) - p0, duration: durationApprox(dy) - p0, convexity: convexApprox(dy) - p0 });
  return { p0, mac, mod, conv, rows, up: shock(0.01), down: shock(-0.01) };
}

export type DeliverableBond = { id: string; coupon: number; years: number };

/// Bonds in the futures delivery basket of the CTD figure.
export const DELIVERY_BASKET: DeliverableBond[] = [
  { id: "A", coupon: 0.03, years: 10 },
  { id: "B", coupon: 0.05, years: 15 },
  { id: "C", coupon: 0.07, years: 25 },
];
const NOTIONAL_YIELD = 0.06;

/// Delivery economics at a flat yield y: conversion factors, the futures price F = min P/CF
/// and each bond's net delivery cost P − F·CF (zero for the cheapest-to-deliver).
export function deliveryAt(y: number, basket = DELIVERY_BASKET) {
  const bonds = basket.map((b) => ({ ...b, price: price(b.coupon, y, b.years), cf: price(b.coupon, NOTIONAL_YIELD, b.years) / FACE }));
  const futures = Math.min(...bonds.map((b) => b.price / b.cf));
  const costs = bonds.map((b) => ({ ...b, net: b.price - futures * b.cf }));
  const ctd = costs.reduce((best, b) => (b.net < best.net ? b : best));
  return { futures, costs, ctd };
}

/// Net delivery cost of each bond (keyed by bond id) against the yield on [2%, 10%].
export const deliveryRows = () =>
  grid(0.02, 0.1, 41).map((y) => ({ y, ...Object.fromEntries(deliveryAt(y).costs.map((b) => [b.id, b.net])) }));
// #endregion

// #region Yield curve (continuous compounding)

const TAU = 2;

/// Nelson–Siegel spot rate r(t) and instantaneous forward f(t) for level, slope and hump.
export function nelsonSiegel(level: number, slope: number, hump: number, t: number) {
  if (t <= 0) return { spot: level + slope, forward: level + slope };
  const x = t / TAU;
  const g1 = (1 - Math.exp(-x)) / x;
  const g2 = g1 - Math.exp(-x);
  return {
    spot: level + slope * g1 + hump * g2,
    forward: level + slope * Math.exp(-x) + hump * x * Math.exp(-x),
  };
}

export function yieldCurveRows(level: number, slope: number, hump: number, maxT = 30) {
  return grid(0, maxT, 61).map((t) => ({ t, ...nelsonSiegel(level, slope, hump, t) }));
}
// #endregion

// #region Swaps (annually compounded zero curve, annual fixed payments)

/// Zero rate r(t) = level + slope·(1 − e^{−t/3}), compounded annually like the swap, and discount factor (1 + r(t))^{−t}.
export function swapZero(level: number, slope: number, t: number) {
  const zero = level + slope * (1 - Math.exp(-t / 3));
  return { zero, df: (1 + zero) ** -t };
}

/// Par swap rate and annuity factor for an n-year swap with annual fixed payments.
export function parSwap(level: number, slope: number, n: number) {
  let annuity = 0;
  for (let i = 1; i <= n; i++) annuity += swapZero(level, slope, i).df;
  return { rate: (1 - swapZero(level, slope, n).df) / annuity, annuity };
}

export const swapRows = (level: number, slope: number) =>
  Array.from({ length: 10 }, (_, i) => ({ t: i + 1, zero: swapZero(level, slope, i + 1).zero, swap: parSwap(level, slope, i + 1).rate }));
// #endregion

// #region Corporate finance

/// −100 today and C at the end of each of N years.
export const projectCashflows = (C: number, N: number) => [-100, ...Array.from({ length: N }, () => C)];

/// NPV of the project against the discount rate on [0, rMax], with its IRR.
export function npvProfile(C: number, N: number, rMax = 0.4) {
  const flows = projectCashflows(C, N);
  return {
    flows,
    irr: irr(flows),
    rows: grid(0, rMax, 81).map((r) => ({ r, npv: npv(r, flows) })),
  };
}

/// Modigliani–Miller with corporate tax and perpetual debt: costs of capital at debt ratio D/V.
export function leveredCosts(rU: number, rD: number, tax: number, dv: number) {
  const de = dv / (1 - dv);
  return { dv, rE: rU + (rU - rD) * (1 - tax) * de, rDAfterTax: rD * (1 - tax), wacc: rU * (1 - tax * dv) };
}

export const waccLeverageRows = (rU: number, rD: number, tax: number) =>
  grid(0, 0.8, 41).map((dv) => leveredCosts(rU, rD, tax, dv));

const FCF1 = 10;
const EXPLICIT_YEARS = 5;

/// DCF of FCF₁ = 10 growing at g: PV of years 1–5 and of the Gordon terminal value at year 5.
export function dcfSplit(wacc: number, g: number) {
  let explicit = 0;
  for (let t = 1; t <= EXPLICIT_YEARS; t++) explicit += (FCF1 * (1 + g) ** (t - 1)) / (1 + wacc) ** t;
  const terminalValue = (FCF1 * (1 + g) ** EXPLICIT_YEARS) / (wacc - g);
  const terminal = terminalValue / (1 + wacc) ** EXPLICIT_YEARS;
  return { g, explicit, terminal, total: explicit + terminal };
}

export function dcfRows(wacc: number) {
  const gMax = Math.min(0.05, wacc - 0.01);
  return grid(0, gMax, 41).map((g) => dcfSplit(wacc, g));
}
// #endregion
