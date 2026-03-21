import { blackScholesCall } from "../black-scholes/blackScholes.math";
import type { HestonParams, HestonPathPoint } from "./heston.types";

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