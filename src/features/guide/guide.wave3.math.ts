import { blackScholesCall } from "../black-scholes/blackScholes.math";
import { makeRng, nextNormal } from "../../lib/math/random";
import { normCdf, normPdf } from "../../lib/stats/distributions";

// #region Real options

/// Option to invest I in a project worth V₀ at any of `steps` dates up to T (American call on project value, CRR tree).
/// `delta` is the yield of cash flows the project pays and that a waiting firm forgoes; with δ = 0 waiting is never worse.
export function realOption(V0: number, I: number, sigma: number, r: number, delta: number, T: number, steps: number) {
  const dt = T / steps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const q = (Math.exp((r - delta) * dt) - d) / (u - d);
  const disc = Math.exp(-r * dt);
  let values = Array.from({ length: steps + 1 }, (_, j) => Math.max(V0 * u ** (steps - j) * d ** j - I, 0));
  for (let n = steps - 1; n >= 0; n -= 1) {
    values = Array.from({ length: n + 1 }, (_, j) => {
      const wait = disc * (q * values[j] + (1 - q) * values[j + 1]);
      return Math.max(wait, V0 * u ** (n - j) * d ** j - I);
    });
  }
  const staticNpv = V0 - I;
  const expanded = values[0];
  return { staticNpv, expanded, waitingValue: expanded - Math.max(staticNpv, 0), investNow: staticNpv > 0 && expanded <= staticNpv + 1e-9, q, u, d };
}

/// Expanded NPV against the investment cost, next to the static NPV, for the real-option figure.
export function realOptionRows(V0: number, sigma: number, r: number, delta: number, T: number, steps: number, iMin = 60, iMax = 140, points = 81) {
  return Array.from({ length: points }, (_, i) => {
    const I = iMin + ((iMax - iMin) * i) / (points - 1);
    const o = realOption(V0, I, sigma, r, delta, T, steps);
    return { I, staticNpv: o.staticNpv, expanded: o.expanded };
  });
}

// #endregion

// #region Exotic options

/// Seeded ℚ-paths summarised per path (maximum, arithmetic average, terminal price), monitored at `steps` dates.
export function simulatePathStats(S0: number, r: number, sigma: number, T: number, paths: number, steps: number, seed: number) {
  const rng = makeRng(seed);
  const dt = T / steps;
  const drift = (r - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  const max = new Float64Array(paths);
  const avg = new Float64Array(paths);
  const end = new Float64Array(paths);
  for (let p = 0; p < paths; p += 1) {
    let s = S0;
    let m = S0;
    let sum = 0;
    for (let k = 0; k < steps; k += 1) {
      s *= Math.exp(drift + vol * nextNormal(rng));
      if (s > m) m = s;
      sum += s;
    }
    max[p] = m;
    avg[p] = sum / steps;
    end[p] = s;
  }
  return { max, avg, end };
}

type PathStats = ReturnType<typeof simulatePathStats>;

/// Monte Carlo prices of a vanilla, Asian, up-and-out (barrier B) and cash-or-nothing (pays 1) call.
export function exoticPrices(stats: PathStats, K: number, B: number, r: number, T: number) {
  const disc = Math.exp(-r * T);
  const n = stats.end.length;
  let vanilla = 0, asian = 0, upOut = 0, digital = 0;
  for (let p = 0; p < n; p += 1) {
    const payoff = Math.max(stats.end[p] - K, 0);
    vanilla += payoff;
    asian += Math.max(stats.avg[p] - K, 0);
    if (stats.max[p] < B) upOut += payoff;
    if (stats.end[p] > K) digital += 1;
  }
  return { vanilla: (disc * vanilla) / n, asian: (disc * asian) / n, upOut: (disc * upOut) / n, digital: (disc * digital) / n };
}

/// Up-and-out call price against the barrier level, with the vanilla Black–Scholes price as reference.
export function barrierRows(stats: PathStats, S0: number, K: number, r: number, sigma: number, T: number, bMin = 105, bMax = 250, points = 59) {
  const vanilla = blackScholesCall(S0, K, T, r, sigma);
  return Array.from({ length: points }, (_, i) => {
    const B = bMin + ((bMax - bMin) * i) / (points - 1);
    return { B, upOut: exoticPrices(stats, K, B, r, T).upOut, vanilla };
  });
}

// #endregion

// #region Jump diffusion (Merton)

const poissonWeights = (lambdaT: number, nMax: number) => {
  const w: number[] = [];
  let term = Math.exp(-lambdaT);
  for (let n = 0; n <= nMax; n += 1) {
    w.push(term);
    term *= lambdaT / (n + 1);
  }
  return w;
};

/// Cumulants of the 1-year Merton log return: diffusion variance σ² plus compound-Poisson jumps N(μ_J, σ_J²) at rate λ.
export function mertonMoments(sigma: number, lambda: number, muJ: number, sigmaJ: number) {
  const k2 = sigma * sigma + lambda * (muJ * muJ + sigmaJ * sigmaJ);
  const k3 = lambda * (muJ ** 3 + 3 * muJ * sigmaJ * sigmaJ);
  const k4 = lambda * (muJ ** 4 + 6 * muJ * muJ * sigmaJ * sigmaJ + 3 * sigmaJ ** 4);
  return {
    variance: k2,
    jumpShare: k2 > 0 ? (k2 - sigma * sigma) / k2 : 0,
    skewness: k3 / k2 ** 1.5,
    excessKurtosis: k4 / (k2 * k2),
  };
}

/// Density of the 1-year Merton log return (a Poisson mixture of normals) and the normal with the same mean and variance.
export function mertonDensityRows(sigma: number, lambda: number, muJ: number, sigmaJ: number, xMax = 1, points = 161) {
  const w = poissonWeights(lambda, 40);
  const mean0 = -0.5 * sigma * sigma;
  const { variance } = mertonMoments(sigma, lambda, muJ, sigmaJ);
  const mean = mean0 + lambda * muJ;
  const sd = Math.sqrt(variance);
  return Array.from({ length: points }, (_, i) => {
    const x = -xMax + (2 * xMax * i) / (points - 1);
    const jump = w.reduce((acc, wn, n) => {
      const s = Math.sqrt(sigma * sigma + n * sigmaJ * sigmaJ);
      return acc + (wn * normPdf((x - mean0 - n * muJ) / s)) / s;
    }, 0);
    return { x, jump, normal: normPdf((x - mean) / sd) / sd };
  });
}

/// Probability of a 1-year log return below `threshold` under Merton and under the variance-matched normal.
export function mertonTail(sigma: number, lambda: number, muJ: number, sigmaJ: number, threshold: number) {
  const w = poissonWeights(lambda, 40);
  const mean0 = -0.5 * sigma * sigma;
  const jump = w.reduce((acc, wn, n) => acc + wn * normCdf((threshold - mean0 - n * muJ) / Math.sqrt(sigma * sigma + n * sigmaJ * sigmaJ)), 0);
  const { variance } = mertonMoments(sigma, lambda, muJ, sigmaJ);
  return { jump, normal: normCdf((threshold - mean0 - lambda * muJ) / Math.sqrt(variance)) };
}

// #endregion

// #region Credit risk

/// Defaultable zero paying 1 at T, recovering R of face at T on default; constant hazard λ, continuous rates.
export function riskyZero(r: number, lambda: number, R: number, T: number) {
  const survival = Math.exp(-lambda * T);
  const price = Math.exp(-r * T) * (survival + (1 - survival) * R);
  const yieldRisky = -Math.log(price) / T;
  return { survival, price, yield: yieldRisky, spread: yieldRisky - r };
}

/// Risk-free and risky zero yields against maturity for the credit figure.
export function creditRows(r: number, lambda: number, R: number, tMax = 10, points = 40) {
  return Array.from({ length: points }, (_, i) => {
    const T = (tMax * (i + 1)) / points;
    return { T, riskFree: r, risky: riskyZero(r, lambda, R, T).yield };
  });
}

/// Approximate CDS premium (per year): hazard rate times loss given default.
export const cdsSpread = (lambda: number, R: number) => lambda * (1 - R);

// #endregion

// #region Factor models

/// Equal-weighted portfolio of N stocks under a single-index model: systematic and specific variance.
export function singleIndexVol(N: number, beta: number, sigmaM: number, specificVol: number) {
  const systematic = beta * beta * sigmaM * sigmaM;
  const specific = (specificVol * specificVol) / N;
  return { vol: Math.sqrt(systematic + specific), floor: beta * sigmaM, systematicShare: systematic / (systematic + specific) };
}

/// Portfolio volatility against the number of stocks, converging to the systematic floor βσ_M.
export function factorRows(beta: number, sigmaM: number, specificVol: number, nMax = 100) {
  return Array.from({ length: nMax }, (_, i) => {
    const N = i + 1;
    const { vol, floor } = singleIndexVol(N, beta, sigmaM, specificVol);
    return { N, vol, floor };
  });
}

/// Number of parameters for N stocks: full covariance matrix vs single-index model.
export const parameterCount = (N: number) => ({ full: (N * (N + 1)) / 2, singleIndex: 2 * N + 1 });

// #endregion
