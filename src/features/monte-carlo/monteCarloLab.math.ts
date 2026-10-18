import { makeRng, nextNormal } from "../../lib/math/random";
import { blackScholesCall } from "../black-scholes/blackScholes.math";
import type { McEstimator, McLabParams, McLabResult, McRacePoint } from "./monteCarlo.types";

const Z95 = 1.96;
export const MC_ESTIMATORS: McEstimator[] = ["plain", "antithetic", "control"];

/// Running mean and population variance from sums (the same convention as `monteCarloCall`).
function meanSe(sum: number, sumSq: number, n: number) {
  const mean = sum / n;
  return { mean, se: Math.sqrt(Math.max(sumSq / n - mean * mean, 0) / n) };
}

/// Control-variate estimate with X = e^{−rT}·S_T, whose ℚ-mean is S₀, and the optimal coefficient
/// c = Cov(P, X)/Var(X) estimated from the same draws; its error variance is Var(P)(1 − ρ²)/n.
export function controlVariate(n: number, sP: number, sPP: number, sX: number, sXX: number, sPX: number, mean: number) {
  const mP = sP / n;
  const mX = sX / n;
  const varP = Math.max(sPP / n - mP * mP, 0);
  const varX = Math.max(sXX / n - mX * mX, 0);
  const cov = sPX / n - mP * mX;
  const c = varX > 0 ? cov / varX : 0;
  const resid = Math.max(varP - (varX > 0 ? (cov * cov) / varX : 0), 0);
  return { estimate: mP - c * (mX - mean), se: Math.sqrt(resid / n), c };
}

/// Brownian bridge from W₀ = 0 to W_T = `wT` on `steps` equal steps, drawing the interior from `rng`.
export function brownianBridge(wT: number, maturity: number, steps: number, rng: () => number): number[] {
  const dt = maturity / steps;
  const w = [0];
  for (let k = 1; k < steps; k++) {
    const left = maturity - (k - 1) * dt;
    const prev = w[k - 1];
    const mean = prev + ((wT - prev) * dt) / left;
    const sd = Math.sqrt((dt * (left - dt)) / left);
    w.push(mean + sd * nextNormal(rng));
  }
  w.push(wT);
  return w;
}

/// One lab run. The plain estimator uses exactly the draws of `monteCarloCall` (same seed, same numbers);
/// antithetic pairs Z with −Z over the first n/2 draws, so all three use n normal draws at every point.
export function monteCarloLab(p: McLabParams, samplePoints = 150, pathCount = 200, pathSteps = 60): McLabResult {
  const { s0, strike, maturity, rate, vol, sims, seed } = p;
  const rng = makeRng(seed);
  const disc = Math.exp(-rate * maturity);
  const drift = (rate - 0.5 * vol * vol) * maturity;
  const sqrtT = Math.sqrt(maturity);
  const analytic = blackScholesCall(s0, strike, maturity, rate, vol);
  const stride = Math.max(1, Math.floor(sims / samplePoints));
  const z = new Float64Array(sims);
  const terminal = new Float64Array(sims);
  const payoff = new Float64Array(sims);
  const call = (zi: number) => Math.max(s0 * Math.exp(drift + vol * sqrtT * zi) - strike, 0) * disc;

  let sP = 0, sPP = 0, sX = 0, sXX = 0, sPX = 0, sA = 0, sAA = 0;
  const race: McRacePoint[] = [];
  for (let i = 1; i <= sims; i++) {
    z[i - 1] = nextNormal(rng);
    terminal[i - 1] = s0 * Math.exp(drift + vol * sqrtT * z[i - 1]);
    const pay = Math.max(terminal[i - 1] - strike, 0) * disc;
    const x = terminal[i - 1] * disc;
    payoff[i - 1] = pay;
    sP += pay; sPP += pay * pay; sX += x; sXX += x * x; sPX += pay * x;
    if (i % 2 === 0) {
      // Pair k = i/2 uses Z_k and −Z_k, so at i draws the antithetic run has used i normals too.
      const zk = z[i / 2 - 1];
      const pair = 0.5 * (call(zk) + call(-zk));
      sA += pair; sAA += pair * pair;
    }
    if (i % stride === 0 || i === sims) {
      const plain = meanSe(sP, sPP, i);
      const anti = i >= 2 ? meanSe(sA, sAA, Math.floor(i / 2)) : plain;
      const cv = controlVariate(i, sP, sPP, sX, sXX, sPX, s0);
      race.push({
        n: i, analytic,
        plain: plain.mean, plainLo: plain.mean - Z95 * plain.se, plainHi: plain.mean + Z95 * plain.se,
        antithetic: anti.mean, antitheticLo: anti.mean - Z95 * anti.se, antitheticHi: anti.mean + Z95 * anti.se,
        control: cv.estimate, controlLo: cv.estimate - Z95 * cv.se, controlHi: cv.estimate + Z95 * cv.se,
      });
    }
  }

  const last = race[race.length - 1];
  const se = (k: McEstimator) => (last[`${k}Hi`] - last[`${k}Lo`]) / (2 * Z95);
  const summary = Object.fromEntries(MC_ESTIMATORS.map((k) => [k, { estimate: last[k], standardError: se(k) }])) as McLabResult["summary"];

  // Sample paths: Brownian bridges that end exactly at the first draws, so a path shows where its histogram value came from.
  const count = Math.min(pathCount, sims);
  const paths = new Float64Array((pathSteps + 1) * count);
  const bridgeRng = makeRng(seed + 7919);
  for (let j = 0; j < count; j++) {
    const w = brownianBridge(sqrtT * z[j], maturity, pathSteps, bridgeRng);
    for (let k = 0; k <= pathSteps; k++) {
      const t = (k / pathSteps) * maturity;
      paths[k * count + j] = s0 * Math.exp((rate - 0.5 * vol * vol) * t + vol * w[k]);
    }
  }
  return { analytic, race, summary, terminal, payoff, paths, pathCount: count, pathSteps };
}

/// Histogram domain for S_T: ±4 standard deviations of log S_T around its ℚ-mean, at least covering the strike.
export function terminalDomain(p: Pick<McLabParams, "s0" | "strike" | "maturity" | "rate" | "vol">): [number, number] {
  const m = Math.log(p.s0) + (p.rate - 0.5 * p.vol * p.vol) * p.maturity;
  const s = p.vol * Math.sqrt(p.maturity);
  return [Math.min(Math.exp(m - 4 * s), p.strike * 0.9), Math.max(Math.exp(m + 4 * s), p.strike * 1.1)];
}

/// Share of all draws and of the total discounted payoff that lies in [lo, hi].
export function brushShare(terminal: ArrayLike<number>, payoff: ArrayLike<number>, lo: number, hi: number) {
  let n = 0, pay = 0, total = 0;
  for (let i = 0; i < terminal.length; i++) {
    total += payoff[i];
    if (terminal[i] >= lo && terminal[i] <= hi) { n++; pay += payoff[i]; }
  }
  return { draws: terminal.length ? n / terminal.length : 0, payoff: total > 0 ? pay / total : 0 };
}
