import { blackScholesCall, blackScholesDelta, blackScholesGamma, blackScholesRho, blackScholesTheta, blackScholesVega } from "../black-scholes/blackScholes.math";
import type { GreekKey, HestonGreekProfilePoint, HestonGreeks, HestonGreeksSurfaceData, HestonGreekSurface, HestonParams, HestonPathPoint, HestonPricingCore, HestonVolSurfaceData } from "./heston.types";
import { smooth } from "./heston.utils";

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

export function simulateHestonPaths(
  params: HestonParams,
  seed = 0x9e3779b9
): {
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
  const rhoComp = Math.sqrt(Math.max(1 - rho * rho, 0));

  // Reuse a single set of pre-generated shocks so the drawn paths stay stable
  // and morph smoothly as parameters change instead of re-rolling every time.
  const { z1, z2 } = getNormals(safePaths, safeSteps, seed, false);

  const S = Array.from({ length: safePaths }, () =>
    Array(safeSteps + 1).fill(0)
  );
  const v = Array.from({ length: safePaths }, () =>
    Array(safeSteps + 1).fill(0)
  );

  for (let p = 0; p < safePaths; p++) {
    S[p][0] = S0;
    v[p][0] = clampPositive(v0);

    const zr1 = z1[p];
    const zr2 = z2[p];

    for (let i = 0; i < safeSteps; i++) {
      const w1 = zr1[i];
      const w2 = rho * zr1[i] + rhoComp * zr2[i];

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
  terminalStock: ArrayLike<number>,
  K: number,
  r: number,
  T: number
): number {
  if (terminalStock.length === 0) return 0;

  let sum = 0;
  for (let i = 0; i < terminalStock.length; i++) {
    sum += Math.max(terminalStock[i] - K, 0);
  }

  return Math.exp(-r * T) * (sum / terminalStock.length);
}

export function hestonCallPriceMC(params: HestonParams): number {
  const { K, r, T } = params;
  const terminalStock = simulateHestonTerminalStock(params);
  return discountedCallPriceFromTerminalStock(terminalStock, K, r, T);
}

// Reprice a call at many spot prices from a single set of terminal draws.
// Terminal stock scales linearly with the initial spot, so one simulation can
// be repriced across the whole grid instead of one simulation per point.
export function scaledCallCurveFromTerminalStock(
  terminalStock: ArrayLike<number>,
  S0: number,
  spots: number[],
  K: number,
  disc: number
): number[] {
  const n = terminalStock.length;
  return spots.map((S) => {
    if (n === 0) return 0;
    const scale = S / S0;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += Math.max(scale * terminalStock[i] - K, 0);
    }
    return disc * (sum / n);
  });
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
  rng: () => number,
  antithetic: boolean
): { z1: Float64Array[]; z2: Float64Array[] } {
  const z1: Float64Array[] = [];
  const z2: Float64Array[] = [];

  for (let p = 0; p < paths; p++) {
    const r1 = new Float64Array(steps);
    const r2 = new Float64Array(steps);

    if (antithetic && p % 2 === 1) {
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

// Cache of pre-generated standard-normal shocks. Regenerated only when the grid
// size (or seed) changes, so repeated revaluations reuse the exact same noise.
let normalsCache: {
  paths: number;
  steps: number;
  seed: number;
  antithetic: boolean;
  z1: Float64Array[];
  z2: Float64Array[];
} | null = null;

function getNormals(
  paths: number,
  steps: number,
  seed: number,
  antithetic: boolean
) {
  if (
    normalsCache &&
    normalsCache.paths === paths &&
    normalsCache.steps === steps &&
    normalsCache.seed === seed &&
    normalsCache.antithetic === antithetic
  ) {
    return normalsCache;
  }

  const rng = mulberry32(seed);
  const { z1, z2 } = generateNormals(paths, steps, rng, antithetic);
  normalsCache = { paths, steps, seed, antithetic, z1, z2 };
  return normalsCache;
}

// Simulate the terminal value of exp(∑ log-returns) with S0 = 1 and r = 0.
// Multiplying by S0·e^{rT} recovers the true terminal stock, so a single unit
// simulation can be repriced at any spot or rate without re-simulating.
function simulateUnitTerminal(
  z1: Float64Array[],
  z2: Float64Array[],
  v0: number,
  theta: number,
  kappa: number,
  xi: number,
  rho: number,
  T: number
): Float64Array {
  const paths = z1.length;
  const steps = z1[0]?.length ?? 0;
  const dt = T / steps;
  const sqrtDt = Math.sqrt(dt);
  const rhoComp = Math.sqrt(Math.max(1 - rho * rho, 0));

  const unit = new Float64Array(paths);

  for (let p = 0; p < paths; p++) {
    let logReturn = 0;
    let v = clampPositive(v0);
    const zr1 = z1[p];
    const zr2 = z2[p];

    for (let i = 0; i < steps; i++) {
      const w1 = zr1[i];
      const w2 = rho * zr1[i] + rhoComp * zr2[i];

      const vt = clampPositive(v);
      const sqrtV = Math.sqrt(vt);

      v = clampPositive(vt + kappa * (theta - vt) * dt + xi * sqrtV * sqrtDt * w2);
      logReturn += -0.5 * vt * dt + sqrtV * sqrtDt * w1;
    }

    unit[p] = Math.exp(logReturn);
  }

  return unit;
}

type ShapeCore = {
  base: Float64Array;
  vUp: Float64Array;
  vDown: Float64Array;
  tUp: Float64Array;
  tDown: Float64Array;
};

// Cache the simulated scenarios keyed by every parameter that changes the
// simulated paths. When only S0, K or r change the cache hits and no Monte
// Carlo simulation runs at all — the cached draws are simply repriced.
let shapeCache: { key: string; core: ShapeCore } | null = null;

function getShapeCore(
  paths: number,
  steps: number,
  seed: number,
  v0: number,
  theta: number,
  kappa: number,
  xi: number,
  rho: number,
  T: number,
  hT: number,
  vUp: number,
  vDown: number
): ShapeCore {
  const key = `${paths}|${steps}|${seed}|${v0}|${theta}|${kappa}|${xi}|${rho}|${T}`;
  if (shapeCache && shapeCache.key === key) {
    return shapeCache.core;
  }

  const { z1, z2 } = getNormals(paths, steps, seed, true);
  const core: ShapeCore = {
    base: simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T),
    vUp: simulateUnitTerminal(z1, z2, vUp, theta, kappa, xi, rho, T),
    vDown: simulateUnitTerminal(z1, z2, vDown, theta, kappa, xi, rho, T),
    tUp: simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T + hT),
    tDown: simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T - hT),
  };

  shapeCache = { key, core };
  return core;
}

// Single set of common-random-number simulations that powers the price-
// comparison curve, the volatility smile, the point Greeks and the full Greek
// profile. Terminal stock scales linearly with the initial spot, so one base
// simulation (plus one bump per parameter Greek) is repriced analytically at
// every spot instead of re-simulating for each point.
export function hestonGreeksAndProfile(
  params: HestonParams,
  spots: number[],
  seed = 0x9e3779b9
): HestonPricingCore {
  const { S0, K, r, v0, theta, kappa, xi, rho, T, steps, paths } = params;

  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(2, Math.round(paths));

  const sigma = Math.sqrt(v0);
  const hSig = 0.01;
  const hT = Math.min(0.02, T * 0.05);
  const hR = 0.005;
  const vUp = (sigma + hSig) ** 2;
  const vDown = Math.max((sigma - hSig) ** 2, 1e-8);

  // Pre-generated noise + cached scenario simulations. Only re-simulates when a
  // path-shaping parameter changes; S0, K and r reuse the cached draws.
  const core = getShapeCore(
    safePaths,
    safeSteps,
    seed,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T,
    hT,
    vUp,
    vDown
  );

  const n = core.base.length;

  // Discounted call price for a start-spot S under the given unit terminals and
  // effective maturity. Reprices the pre-generated draws instead of simulating.
  // A rate bump (rho Greek) is just a different `rate` on the base draws.
  const priceAt = (
    unit: Float64Array,
    maturity: number,
    rate: number,
    S: number
  ): number => {
    const growth = Math.exp(rate * maturity);
    const disc = Math.exp(-rate * maturity);
    let acc = 0;
    for (let p = 0; p < n; p++) {
      acc += Math.max(S * growth * unit[p] - K, 0);
    }
    return disc * (acc / n);
  };

  const profile = spots.map((S) => {
    const hS = S * 0.01;
    const cUp = priceAt(core.base, T, r, S + hS);
    const cMid = priceAt(core.base, T, r, S);
    const cDown = priceAt(core.base, T, r, S - hS);

    const hDelta = (cUp - cDown) / (2 * hS);
    const hGamma = (cUp - 2 * cMid + cDown) / (hS * hS);
    const hVega = (priceAt(core.vUp, T, r, S) - priceAt(core.vDown, T, r, S)) / (2 * hSig);
    const hTheta = -(priceAt(core.tUp, T + hT, r, S) - priceAt(core.tDown, T - hT, r, S)) / (2 * hT);
    const hRho = (priceAt(core.base, T, r + hR, S) - priceAt(core.base, T, r - hR, S)) / (2 * hR);

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

  // Point Greeks at the current spot, derived from the same simulations.
  const hS0 = S0 * 0.01;
  const cUp0 = priceAt(core.base, T, r, S0 + hS0);
  const cMid0 = priceAt(core.base, T, r, S0);
  const cDown0 = priceAt(core.base, T, r, S0 - hS0);

  const greeks: HestonGreeks = {
    price: cMid0,
    delta: (cUp0 - cDown0) / (2 * hS0),
    gamma: (cUp0 - 2 * cMid0 + cDown0) / (hS0 * hS0),
    vega: (priceAt(core.vUp, T, r, S0) - priceAt(core.vDown, T, r, S0)) / (2 * hSig),
    theta: -(priceAt(core.tUp, T + hT, r, S0) - priceAt(core.tDown, T - hT, r, S0)) / (2 * hT),
    rho: (priceAt(core.base, T, r + hR, S0) - priceAt(core.base, T, r - hR, S0)) / (2 * hR),
  };

  // Actual terminal stock at the current spot/rate, reused by the worker to
  // build the price-comparison curve and volatility smile.
  const growth = Math.exp(r * T);
  const baseDisc = Math.exp(-r * T);
  const baseTerminal = new Float64Array(n);
  for (let p = 0; p < n; p++) {
    baseTerminal[p] = S0 * growth * core.base[p];
  }

  return { greeks, profile, baseTerminal, baseDisc };
}

// Backwards-compatible thin wrappers over hestonGreeksAndProfile.
export function hestonGreeks(
  params: HestonParams,
  seed = 0x9e3779b9
): HestonGreeks {
  return hestonGreeksAndProfile(params, [params.S0], seed).greeks;
}

export function hestonGreeksProfile(
  params: HestonParams,
  spots: number[],
  seed = 0x9e3779b9
): HestonGreekProfilePoint[] {
  return hestonGreeksAndProfile(params, spots, seed).profile;
}

const GREEK_KEYS: GreekKey[] = ["delta", "gamma", "vega", "theta", "rho"];

/// Builds a Heston surface for every greek over a (spot × maturity) grid.
/// Common random draws are reused across maturities; for each maturity we run a
/// handful of unit simulations (base + bumps) and reprice them at every spot,
/// so cost scales with the maturity count, not spots × maturities.
export function buildHestonGreekSurfaces(
  params: HestonParams,
  spots: number[],
  maturities: number[],
  seed = 0x9e3779b9
): HestonGreeksSurfaceData {
  const { K, r, v0, theta, kappa, xi, rho, steps, paths } = params;
  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(2, Math.round(paths));

  const sigma = Math.sqrt(v0);
  const hSig = 0.01;
  const hR = 0.005;
  const vUp = (sigma + hSig) ** 2;
  const vDown = Math.max((sigma - hSig) ** 2, 1e-8);

  const { z1, z2 } = getNormals(safePaths, safeSteps, seed, true);

  const byGreek = Object.fromEntries(
    GREEK_KEYS.map((key) => [
      key,
      { values: [] as number[][], min: Infinity, max: -Infinity } as HestonGreekSurface,
    ])
  ) as Record<GreekKey, HestonGreekSurface>;

  const priceAt = (unit: Float64Array, maturity: number, rate: number, S: number): number => {
    const growth = Math.exp(rate * maturity);
    const disc = Math.exp(-rate * maturity);
    const n = unit.length;
    let acc = 0;
    for (let p = 0; p < n; p++) acc += Math.max(S * growth * unit[p] - K, 0);
    return disc * (acc / n);
  };

  for (const T of maturities) {
    const hT = Math.min(0.02, T * 0.05);
    const base = simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T);
    const vUpU = simulateUnitTerminal(z1, z2, vUp, theta, kappa, xi, rho, T);
    const vDownU = simulateUnitTerminal(z1, z2, vDown, theta, kappa, xi, rho, T);
    const tUpU = simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T + hT);
    const tDownU = simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T - hT);

    const rows: Record<GreekKey, number[]> = {
      delta: [], gamma: [], vega: [], theta: [], rho: [],
    };

    for (const S of spots) {
      const hS = S * 0.01;
      const cUp = priceAt(base, T, r, S + hS);
      const cMid = priceAt(base, T, r, S);
      const cDown = priceAt(base, T, r, S - hS);

      const values: Record<GreekKey, number> = {
        delta: (cUp - cDown) / (2 * hS),
        gamma: (cUp - 2 * cMid + cDown) / (hS * hS),
        vega: (priceAt(vUpU, T, r, S) - priceAt(vDownU, T, r, S)) / (2 * hSig),
        theta: -(priceAt(tUpU, T + hT, r, S) - priceAt(tDownU, T - hT, r, S)) / (2 * hT),
        rho: (priceAt(base, T, r + hR, S) - priceAt(base, T, r - hR, S)) / (2 * hR),
      };

      for (const key of GREEK_KEYS) {
        const v = values[key];
        rows[key].push(v);
        const g = byGreek[key];
        if (v < g.min) g.min = v;
        if (v > g.max) g.max = v;
      }
    }

    for (const key of GREEK_KEYS) byGreek[key].values.push(rows[key]);
  }

  for (const key of GREEK_KEYS) {
    const g = byGreek[key];
    if (!Number.isFinite(g.min) || !Number.isFinite(g.max)) {
      g.min = 0;
      g.max = 0;
    }
  }

  return {
    spots: spots.map((s) => Number(s.toFixed(2))),
    maturities: maturities.map((m) => Number(m.toFixed(3))),
    byGreek,
  };
}

/// Builds an implied-volatility surface over a (moneyness × maturity) grid by
/// repricing one unit simulation per maturity across strikes and inverting
/// Black–Scholes. Each maturity row is lightly smoothed like the 2D smile.
export function buildHestonVolSurface(
  params: HestonParams,
  moneyness: number[],
  maturities: number[],
  seed = 0x9e3779b9
): HestonVolSurfaceData {
  const { S0, r, v0, theta, kappa, xi, rho, steps, paths } = params;
  const safeSteps = Math.max(2, Math.round(steps));
  const safePaths = Math.max(2, Math.round(paths));

  const { z1, z2 } = getNormals(safePaths, safeSteps, seed, true);

  let min = Infinity;
  let max = -Infinity;

  const values = maturities.map((T) => {
    const unit = simulateUnitTerminal(z1, z2, v0, theta, kappa, xi, rho, T);
    const growth = Math.exp(r * T);
    const disc = Math.exp(-r * T);
    const n = unit.length;

    const rawRow = moneyness.map((m) => {
      const K = S0 * m;
      let sum = 0;
      for (let p = 0; p < n; p++) sum += Math.max(S0 * growth * unit[p] - K, 0);
      const price = disc * (sum / n);
      return impliedVolFromCallPrice(price, S0, K, T, r);
    });

    const row = smooth(rawRow, 1);
    for (const v of row) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return row.map((v) => Number(v.toFixed(6)));
  });

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0;
    max = 0;
  }

  return {
    moneyness: moneyness.map((m) => Number(m.toFixed(3))),
    maturities: maturities.map((m) => Number(m.toFixed(3))),
    values,
    min,
    max,
  };
}