import { makeRng, nextNormal } from "../../lib/math/random";
import { correlation, covariance, varianceSample } from "../../lib/stats/moments";
import { subSeed } from "../../lib/game/seed";
import type { ConvergencePoint, HuangStoll, Print, RollResult, SpeParams } from "./spreadEstimation.types";

/// Efficient price at the start of every tape, in cents (100.00).
export const M0 = 10000;
export const DEFAULT_SPE: SpeParams = { S: 10, sigma: 2.5, alpha: 0.35, n: 120 };

/// Simulate a tape: pₜ = mₜ₋₁ + (S/2)·Qₜ, then mₜ = mₜ₋₁ + α·(S/2)·Qₜ + εₜ with εₜ ~ N(0, σ²).
export function simulateTape(params: SpeParams, seed: number): Print[] {
  const rng = makeRng(seed);
  const half = params.S / 2;
  const out: Print[] = [];
  let m = M0;
  for (let t = 0; t < params.n; t++) {
    const q: 1 | -1 = rng() < 0.5 ? 1 : -1;
    out.push({ t, p: m + half * q, q, m });
    m += params.alpha * half * q + params.sigma * nextNormal(rng);
  }
  return out;
}

/// Price changes Δpₜ = pₜ − pₜ₋₁ (length n − 1).
export const diffs = (prints: Print[]): number[] => prints.slice(1).map((x, i) => x.p - prints[i].p);

/// Roll's estimator 2√(−cov(Δpₜ, Δpₜ₋₁)); undefined (`s` NaN) when the covariance is not negative.
export function rollEstimate(prints: Print[]): RollResult {
  const d = diffs(prints);
  if (d.length < 3) return { s: NaN, cov: NaN, defined: false };
  const cov = covariance(d.slice(1), d.slice(0, -1));
  return cov < 0 ? { s: 2 * Math.sqrt(-cov), cov, defined: true } : { s: NaN, cov, defined: false };
}

/// Roll's spread from a slope of Δpₜ on Δpₜ₋₁: cov = slope·var(Δp), s = 2√(−cov); NaN for slope ≥ 0.
export const rollFromSlope = (slope: number, varDp: number) => (slope < 0 ? 2 * Math.sqrt(-slope * varDp) : NaN);

/// Sample variance of the price changes (the x-scale for `rollFromSlope`).
export const diffVariance = (prints: Print[]) => varianceSample(diffs(prints));

/// Mean effective spread 2·|pₜ − mₜ₋₁|.
export const effectiveSpread = (prints: Print[]) =>
  prints.reduce((s, x) => s + 2 * Math.abs(x.p - x.m), 0) / Math.max(1, prints.length);

/// Tick test: uptick → buy, downtick → sell, zero tick → previous sign; the first print is a buy.
export function tickTest(prints: Print[]): (1 | -1)[] {
  const out: (1 | -1)[] = [];
  prints.forEach((x, i) => {
    if (i === 0) out.push(1);
    else if (x.p > prints[i - 1].p) out.push(1);
    else if (x.p < prints[i - 1].p) out.push(-1);
    else out.push(out[i - 1]);
  });
  return out;
}

/// Share of `guesses` matching the true sides of the first `guesses.length` prints.
export function classifyAccuracy(guesses: (1 | -1)[], prints: Print[]): number {
  if (!guesses.length) return 0;
  return guesses.reduce((s, g, i) => s + (g === prints[i].q ? 1 : 0), 0) / guesses.length;
}

/// Two-way Huang–Stoll: OLS without intercept of Δpₜ on ΔQₜ and Qₜ₋₁ gives β₁ = S/2 and β₂ = α·S/2.
export function huangStoll(prints: Print[]): HuangStoll {
  let s11 = 0, s12 = 0, s22 = 0, s1y = 0, s2y = 0;
  for (let t = 1; t < prints.length; t++) {
    const x1 = prints[t].q - prints[t - 1].q;
    const x2 = prints[t - 1].q;
    const y = prints[t].p - prints[t - 1].p;
    s11 += x1 * x1;
    s12 += x1 * x2;
    s22 += x2 * x2;
    s1y += x1 * y;
    s2y += x2 * y;
  }
  const det = s11 * s22 - s12 * s12;
  if (det === 0) return { halfSpread: NaN, adverseShare: NaN };
  const b1 = (s22 * s1y - s12 * s2y) / det;
  const b2 = (s11 * s2y - s12 * s1y) / det;
  return { halfSpread: b1, adverseShare: b2 / b1 };
}

/// Roll and effective spread on growing prefixes of one tape (estimate vs sample size).
export function convergence(params: SpeParams, seed: number, sizes = [20, 40, 80, 160, 320, 640]): ConvergencePoint[] {
  const tape = simulateTape({ ...params, n: Math.max(...sizes) }, seed);
  return sizes.map((n) => {
    const part = tape.slice(0, n);
    return { n, roll: rollEstimate(part).s, effective: effectiveSpread(part) };
  });
}

/// Lag-1 autocorrelation of the price changes (negative under bid–ask bounce).
export function autocorrelation(prints: Print[]): number {
  const d = diffs(prints);
  return d.length < 3 ? NaN : correlation(d.slice(1), d.slice(0, -1));
}

/// Scatter points (Δpₜ₋₁, Δpₜ) for the slope view.
export function lagPairs(prints: Print[]): { x: number; y: number }[] {
  const d = diffs(prints);
  return d.slice(1).map((y, i) => ({ x: d[i], y }));
}

/// Prints per classify game.
export const GAME_LENGTH = 30;
/// Classify challenge hit: at least this share correct.
export const CLASSIFY_TARGET = 0.8;
/// Predict tolerance on the spread, in cents.
export const ROLL_TOLERANCE = 1;

/// Hidden-spread round for Predict: S drawn from 4–16¢, other settings at their defaults.
export function predictParams(seed: number): SpeParams {
  const rng = makeRng(subSeed(seed, 9));
  rng();
  return { ...DEFAULT_SPE, S: 4 + Math.floor(rng() * 13) };
}

/// The fixed classify challenge market: σ/S = 0.25 over one game.
export const challengeParams = (): SpeParams => ({ ...DEFAULT_SPE, S: 10, sigma: 2.5, n: GAME_LENGTH });

/// Format cents with one decimal.
export const fmtCents = (v: number) => (Number.isFinite(v) ? `${v.toFixed(1)}¢` : "–");
/// Format a price in cents as dollars.
export const fmtPrice = (v: number) => (v / 100).toFixed(2);
