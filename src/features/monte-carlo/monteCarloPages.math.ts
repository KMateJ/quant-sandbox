import { makeRng, nextNormal } from "../../lib/math/random";
import { blackScholesCall } from "../black-scholes/blackScholes.math";
import { controlVariate } from "./monteCarloLab.math";
import type { FkCurvePoint, FkParams, FkResult, McLabParams, McVrMethod, McVrRacePoint, McVrResult } from "./monteCarlo.types";

const Z95 = 1.96;
export const VR_METHODS: McVrMethod[] = ["plain", "antithetic", "control", "both"];

function meanSe(sum: number, sumSq: number, n: number) {
  const mean = sum / n;
  return { mean, se: Math.sqrt(Math.max(sumSq / n - mean * mean, 0) / n) };
}

/// Plain, antithetic, control-variate and combined estimates of a European call, all from the same `sims` normal draws.
/// "Both" averages each Z/−Z pair of payoffs and of the control X = e^{−rT}S_T, then applies the control variate to the pairs.
export function varianceReductionRun(p: McLabParams, samplePoints = 150): McVrResult {
  const { s0, strike, maturity, rate, vol, sims, seed } = p;
  const rng = makeRng(seed);
  const disc = Math.exp(-rate * maturity);
  const drift = (rate - 0.5 * vol * vol) * maturity;
  const sd = vol * Math.sqrt(maturity);
  const analytic = blackScholesCall(s0, strike, maturity, rate, vol);
  const stride = Math.max(1, Math.floor(sims / samplePoints));
  const terminal = (z: number) => s0 * Math.exp(drift + sd * z);
  const pay = (z: number) => Math.max(terminal(z) - strike, 0) * disc;

  let sP = 0, sPP = 0, sX = 0, sXX = 0, sPX = 0;
  let aP = 0, aPP = 0, bP = 0, bPP = 0, bX = 0, bXX = 0, bPX = 0;
  const race: McVrRacePoint[] = [];
  let zPrev = 0;
  for (let i = 1; i <= sims; i++) {
    const z = nextNormal(rng);
    const p1 = pay(z);
    const x1 = terminal(z) * disc;
    sP += p1; sPP += p1 * p1; sX += x1; sXX += x1 * x1; sPX += p1 * x1;
    if (i % 2 === 0) {
      // Pair (Z, −Z) built from the previous draw, so after i draws the paired runs have used i normals too.
      const pair = 0.5 * (pay(zPrev) + pay(-zPrev));
      const xPair = 0.5 * disc * (terminal(zPrev) + terminal(-zPrev));
      aP += pair; aPP += pair * pair;
      bP += pair; bPP += pair * pair; bX += xPair; bXX += xPair * xPair; bPX += pair * xPair;
    }
    zPrev = z;
    if (i % stride === 0 || i === sims) {
      const plain = meanSe(sP, sPP, i);
      const pairs = Math.floor(i / 2);
      const anti = pairs ? meanSe(aP, aPP, pairs) : plain;
      const cv = controlVariate(i, sP, sPP, sX, sXX, sPX, s0);
      const both = pairs ? controlVariate(pairs, bP, bPP, bX, bXX, bPX, s0) : cv;
      const band = (k: McVrMethod, est: number, se: number) => ({ [k]: est, [`${k}Lo`]: est - Z95 * se, [`${k}Hi`]: est + Z95 * se });
      race.push({
        n: i, analytic,
        ...band("plain", plain.mean, plain.se), ...band("antithetic", anti.mean, anti.se),
        ...band("control", cv.estimate, cv.se), ...band("both", both.estimate, both.se),
      } as McVrRacePoint);
    }
  }
  const last = race[race.length - 1];
  const summary = Object.fromEntries(
    VR_METHODS.map((k) => [k, { estimate: last[k], standardError: (last[`${k}Hi`] - last[`${k}Lo`]) / (2 * Z95) }]),
  ) as McVrResult["summary"];
  return { analytic, race, summary };
}

/// How many plain draws give the same standard error as `se` does with `sims` draws: sims·(SE_plain/SE)².
export function equivalentPlainDraws(sims: number, plainSe: number, se: number): number {
  return se > 0 ? sims * (plainSe / se) ** 2 : Infinity;
}

/// Spots shown on the Feynman–Kac curve.
export const FK_GRID: number[] = Array.from({ length: 29 }, (_, i) => 20 + 10 * i);

const callPayoff = (s: number, k: number) => Math.max(s - k, 0);

/// Feynman–Kac for the Black–Scholes PDE u_t + ½σ²x²u_xx + r·x·u_x − r·u = 0, u(T, x) = (x − K)⁺:
/// u(t, x) = e^{−rτ}·E[(X_T − K)⁺ | X_t = x], τ = T − t. Returns the PDE solution (closed form), the Monte Carlo average
/// started at x, every discounted payoff, and the curve over `FK_GRID` using the same draws at each spot.
export function feynmanKacRun(p: FkParams): FkResult {
  const { x, t, strike, maturity, rate, vol, sims, seed } = p;
  const tau = Math.max(maturity - t, 0);
  const disc = Math.exp(-rate * tau);
  const drift = (rate - 0.5 * vol * vol) * tau;
  const sd = vol * Math.sqrt(tau);
  const closedAt = (s: number) => (tau > 0 ? blackScholesCall(s, strike, tau, rate, vol) : callPayoff(s, strike));
  const rng = makeRng(seed);
  const z = new Float64Array(sims);
  for (let i = 0; i < sims; i++) z[i] = nextNormal(rng);

  const payoffs = new Float64Array(sims);
  let sum = 0, sumSq = 0, paying = 0;
  for (let i = 0; i < sims; i++) {
    payoffs[i] = disc * callPayoff(x * Math.exp(drift + sd * z[i]), strike);
    sum += payoffs[i]; sumSq += payoffs[i] * payoffs[i];
    if (payoffs[i] > 0) paying++;
  }
  const { mean, se } = meanSe(sum, sumSq, sims);

  const curve = FK_GRID.map((s): FkCurvePoint => {
    let acc = 0;
    for (let i = 0; i < sims; i++) acc += callPayoff(s * Math.exp(drift + sd * z[i]), strike);
    return { x: s, closed: closedAt(s), mc: (disc * acc) / sims, payoff: callPayoff(s, strike) };
  });
  return { closed: closedAt(x), estimate: mean, standardError: se, payoffs, payingShare: paying / sims, curve };
}
