import { blackScholesCall, blackScholesDelta, blackScholesGamma, blackScholesRho, blackScholesTheta, blackScholesVega } from "../black-scholes/blackScholes.math";
import type { HestonGreekProfilePoint, HestonGreeks, HestonParams, HestonPathPoint } from "./heston.types";

function clampPositive(x: number) {
  return Math.max(x, 0);
}

function randn(): number {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function simulateHestonPaths(params: HestonParams): {
  stockData: HestonPathPoint[];
  varianceData: HestonPathPoint[];
} {
  const {
    S0,
    r,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T,
    steps,
    paths,
  } = params;

  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(1, Math.round(paths));
  const dt = T / safeSteps;
  const sqrtDt = Math.sqrt(dt);

  const S = Array.from({ length: safePaths }, () =>
    Array(safeSteps + 1).fill(0)
  );
  const v = Array.from({ length: safePaths }, () =>
    Array(safeSteps + 1).fill(0)
  );

  for (let p = 0; p < safePaths; p++) {
    S[p][0] = S0;
    v[p][0] = clampPositive(v0);

    for (let i = 0; i < safeSteps; i++) {
      const z1 = randn();
      const z2 = randn();

      const w1 = z1;
      const w2 = rho * z1 + Math.sqrt(Math.max(1 - rho * rho, 0)) * z2;

      const vt = clampPositive(v[p][i]);
      const sqrtV = Math.sqrt(vt);

      const vNext =
        vt +
        kappa * (theta - vt) * dt +
        xi * sqrtV * sqrtDt * w2;

      const vSafe = clampPositive(vNext);

      const sNext =
        S[p][i] * Math.exp((r - 0.5 * vt) * dt + sqrtV * sqrtDt * w1);

      v[p][i + 1] = vSafe;
      S[p][i + 1] = sNext;
    }
  }

  const stockData: HestonPathPoint[] = [];
  const varianceData: HestonPathPoint[] = [];

  for (let i = 0; i <= safeSteps; i++) {
    const t = Number((i * dt).toFixed(4));
    const stockRow: HestonPathPoint = { t };
    const varianceRow: HestonPathPoint = { t };

    for (let p = 0; p < safePaths; p++) {
      stockRow[`path-${p + 1}`] = Number(S[p][i].toFixed(6));
      varianceRow[`path-${p + 1}`] = Number(v[p][i].toFixed(6));
    }

    stockData.push(stockRow);
    varianceData.push(varianceRow);
  }

  return { stockData, varianceData };
}

export function simulateHestonTerminalStock(params: HestonParams): number[] {
  const {
    S0,
    r,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T,
    steps,
    paths,
  } = params;

  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(1, Math.round(paths));
  const dt = T / safeSteps;
  const sqrtDt = Math.sqrt(dt);

  const terminal: number[] = [];

  for (let p = 0; p < safePaths; p++) {
    let S = S0;
    let v = clampPositive(v0);

    for (let i = 0; i < safeSteps; i++) {
      const z1 = randn();
      const z2 = randn();

      const w1 = z1;
      const w2 = rho * z1 + Math.sqrt(Math.max(1 - rho * rho, 0)) * z2;

      const vt = clampPositive(v);
      const sqrtV = Math.sqrt(vt);

      v = vt + kappa * (theta - vt) * dt + xi * sqrtV * sqrtDt * w2;
      v = clampPositive(v);

      S = S * Math.exp((r - 0.5 * vt) * dt + sqrtV * sqrtDt * w1);
    }

    terminal.push(S);
  }

  return terminal;
}

export function discountedCallPriceFromTerminalStock(
  terminalStock: number[],
  K: number,
  r: number,
  T: number
): number {
  if (terminalStock.length === 0) return 0;

  let sum = 0;
  for (const ST of terminalStock) {
    sum += Math.max(ST - K, 0);
  }

  return Math.exp(-r * T) * (sum / terminalStock.length);
}

export function hestonCallPriceMC(params: HestonParams): number {
  const { K, r, T } = params;
  const terminalStock = simulateHestonTerminalStock(params);
  return discountedCallPriceFromTerminalStock(terminalStock, K, r, T);
}

export function impliedVolFromCallPrice(
  targetPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  tol = 1e-5,
  maxIter = 100
): number {
  let low = 0.0001;
  let high = 3.0;

  for (let i = 0; i < maxIter; i++) {
    const mid = 0.5 * (low + high);
    const price = blackScholesCall(S, K, T, r, mid);

    if (Math.abs(price - targetPrice) < tol) return mid;

    if (price < targetPrice) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return 0.5 * (low + high);
}

export function fellerMargin(kappa: number, theta: number, xi: number): number {
  return 2 * kappa * theta - xi * xi;
}

// Deterministic PRNG so Greeks are stable/reproducible as parameters change.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randnFrom(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Pre-generate the independent standard-normal shocks once so every bumped
// revaluation reuses the same draws (common random numbers). Odd paths are the
// antithetic mirror of the preceding path to reduce Monte Carlo variance.
function generateNormals(
  paths: number,
  steps: number,
  rng: () => number
): { z1: Float64Array[]; z2: Float64Array[] } {
  const z1: Float64Array[] = [];
  const z2: Float64Array[] = [];

  for (let p = 0; p < paths; p++) {
    const r1 = new Float64Array(steps);
    const r2 = new Float64Array(steps);

    if (p % 2 === 1) {
      const prev1 = z1[p - 1];
      const prev2 = z2[p - 1];
      for (let i = 0; i < steps; i++) {
        r1[i] = -prev1[i];
        r2[i] = -prev2[i];
      }
    } else {
      for (let i = 0; i < steps; i++) {
        r1[i] = randnFrom(rng);
        r2[i] = randnFrom(rng);
      }
    }

    z1.push(r1);
    z2.push(r2);
  }

  return { z1, z2 };
}

function hestonPriceCRN(
  z1: Float64Array[],
  z2: Float64Array[],
  S0: number,
  K: number,
  r: number,
  v0: number,
  theta: number,
  kappa: number,
  xi: number,
  rho: number,
  T: number
): { price: number; terminal: Float64Array } {
  const paths = z1.length;
  const steps = z1[0]?.length ?? 0;
  const dt = T / steps;
  const sqrtDt = Math.sqrt(dt);
  const rhoComp = Math.sqrt(Math.max(1 - rho * rho, 0));

  const terminal = new Float64Array(paths);
  let sum = 0;

  for (let p = 0; p < paths; p++) {
    let S = S0;
    let v = clampPositive(v0);
    const zr1 = z1[p];
    const zr2 = z2[p];

    for (let i = 0; i < steps; i++) {
      const w1 = zr1[i];
      const w2 = rho * zr1[i] + rhoComp * zr2[i];

      const vt = clampPositive(v);
      const sqrtV = Math.sqrt(vt);

      v = clampPositive(vt + kappa * (theta - vt) * dt + xi * sqrtV * sqrtDt * w2);
      S = S * Math.exp((r - 0.5 * vt) * dt + sqrtV * sqrtDt * w1);
    }

    terminal[p] = S;
    sum += Math.max(S - K, 0);
  }

  return { price: Math.exp(-r * T) * (sum / paths), terminal };
}

// Monte Carlo Greeks via central finite differences with common random numbers.
// Spot Greeks exploit the fact that terminal stock scales linearly with S0, so
// Delta/Gamma reuse the base terminal draws exactly; the rest re-simulate with
// the same shocks under bumped parameters.
export function hestonGreeks(
  params: HestonParams,
  seed = 0x9e3779b9
): HestonGreeks {
  const { S0, K, r, v0, theta, kappa, xi, rho, T, steps, paths } = params;

  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(2, Math.round(paths));
  const rng = mulberry32(seed);
  const { z1, z2 } = generateNormals(safePaths, safeSteps, rng);

  const base = hestonPriceCRN(
    z1,
    z2,
    S0,
    K,
    r,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T
  );

  const disc = Math.exp(-r * T);
  const priceForSpot = (S: number) => {
    let acc = 0;
    for (let p = 0; p < base.terminal.length; p++) {
      acc += Math.max((S / S0) * base.terminal[p] - K, 0);
    }
    return disc * (acc / base.terminal.length);
  };

  const hS = S0 * 0.01;
  const cS0 = priceForSpot(S0);
  const cSup = priceForSpot(S0 + hS);
  const cSdown = priceForSpot(S0 - hS);
  const delta = (cSup - cSdown) / (2 * hS);
  const gamma = (cSup - 2 * cS0 + cSdown) / (hS * hS);

  const sigma0 = Math.sqrt(v0);
  const hSig = 0.01;
  const vUp = (sigma0 + hSig) ** 2;
  const vDown = Math.max((sigma0 - hSig) ** 2, 1e-8);
  const cVup = hestonPriceCRN(z1, z2, S0, K, r, vUp, theta, kappa, xi, rho, T).price;
  const cVdown = hestonPriceCRN(z1, z2, S0, K, r, vDown, theta, kappa, xi, rho, T).price;
  const vega = (cVup - cVdown) / (2 * hSig);

  const hT = Math.min(0.02, T * 0.05);
  const cTup = hestonPriceCRN(z1, z2, S0, K, r, v0, theta, kappa, xi, rho, T + hT).price;
  const cTdown = hestonPriceCRN(z1, z2, S0, K, r, v0, theta, kappa, xi, rho, T - hT).price;
  const thetaGreek = -(cTup - cTdown) / (2 * hT);

  const hR = 0.005;
  const cRup = hestonPriceCRN(z1, z2, S0, K, r + hR, v0, theta, kappa, xi, rho, T).price;
  const cRdown = hestonPriceCRN(z1, z2, S0, K, r - hR, v0, theta, kappa, xi, rho, T).price;
  const rhoGreek = (cRup - cRdown) / (2 * hR);

  return {
    price: base.price,
    delta,
    gamma,
    vega,
    theta: thetaGreek,
    rho: rhoGreek,
  };
}

// Full Greek curves across a grid of spot prices for both Heston (MC, common
// random numbers) and Black–Scholes. Terminal stock scales linearly with the
// initial spot, so a single set of simulations (base plus one bump per Greek)
// is repriced analytically at every spot on the grid.
export function hestonGreeksProfile(
  params: HestonParams,
  spots: number[],
  seed = 0x9e3779b9
): HestonGreekProfilePoint[] {
  const { S0, K, r, v0, theta, kappa, xi, rho, T, steps, paths } = params;

  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(2, Math.round(paths));
  const rng = mulberry32(seed);
  const { z1, z2 } = generateNormals(safePaths, safeSteps, rng);

  const sigma = Math.sqrt(v0);
  const hSig = 0.01;
  const hT = Math.min(0.02, T * 0.05);
  const hR = 0.005;
  const vUp = (sigma + hSig) ** 2;
  const vDown = Math.max((sigma - hSig) ** 2, 1e-8);

  const sim = (
    rr: number,
    vv: number,
    tt: number
  ): { terminal: Float64Array; disc: number } => {
    const res = hestonPriceCRN(z1, z2, S0, K, rr, vv, theta, kappa, xi, rho, tt);
    return { terminal: res.terminal, disc: Math.exp(-rr * tt) };
  };

  const base = sim(r, v0, T);
  const vUpSim = sim(r, vUp, T);
  const vDownSim = sim(r, vDown, T);
  const tUpSim = sim(r, v0, T + hT);
  const tDownSim = sim(r, v0, T - hT);
  const rUpSim = sim(r + hR, v0, T);
  const rDownSim = sim(r - hR, v0, T);

  const n = base.terminal.length;
  const priceAt = (
    set: { terminal: Float64Array; disc: number },
    S: number
  ): number => {
    const scale = S / S0;
    let acc = 0;
    for (let p = 0; p < n; p++) {
      acc += Math.max(scale * set.terminal[p] - K, 0);
    }
    return set.disc * (acc / n);
  };

  return spots.map((S) => {
    const hS = S * 0.01;
    const cUp = priceAt(base, S + hS);
    const cMid = priceAt(base, S);
    const cDown = priceAt(base, S - hS);

    const hDelta = (cUp - cDown) / (2 * hS);
    const hGamma = (cUp - 2 * cMid + cDown) / (hS * hS);
    const hVega = (priceAt(vUpSim, S) - priceAt(vDownSim, S)) / (2 * hSig);
    const hTheta = -(priceAt(tUpSim, S) - priceAt(tDownSim, S)) / (2 * hT);
    const hRho = (priceAt(rUpSim, S) - priceAt(rDownSim, S)) / (2 * hR);

    return {
      S: Number(S.toFixed(2)),
      delta_bs: Number(blackScholesDelta(S, K, T, r, sigma).toFixed(6)),
      delta_heston: Number(hDelta.toFixed(6)),
      gamma_bs: Number(blackScholesGamma(S, K, T, r, sigma).toFixed(6)),
      gamma_heston: Number(hGamma.toFixed(6)),
      vega_bs: Number(blackScholesVega(S, K, T, r, sigma).toFixed(6)),
      vega_heston: Number(hVega.toFixed(6)),
      theta_bs: Number(blackScholesTheta(S, K, T, r, sigma).toFixed(6)),
      theta_heston: Number(hTheta.toFixed(6)),
      rho_bs: Number(blackScholesRho(S, K, T, r, sigma).toFixed(6)),
      rho_heston: Number(hRho.toFixed(6)),
    };
  });
}