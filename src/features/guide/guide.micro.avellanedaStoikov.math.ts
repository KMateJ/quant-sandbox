import { asTotalSpread } from "../../lib/market/quotes";

/// Parameters held fixed in the figure and the worked example.
export const AS_BASE = { s: 100, sigma: 2, k: 1.5, T: 1 } as const;
/// Risk aversions compared in the spread-against-time chart.
export const AS_GAMMAS = [0.05, 0.2, 0.8] as const;

/// Indifference prices of buying (`bid`) and selling (`ask`) one more share with inventory q:
/// s − (1 + 2q)γσ²τ/2 and s + (1 − 2q)γσ²τ/2.
export function indifferencePrices(s: number, q: number, gamma: number, sigma: number, tau: number) {
  const v = (gamma * sigma * sigma * tau) / 2;
  return { bid: s - (1 + 2 * q) * v, ask: s + (1 - 2 * q) * v };
}

export type SpreadRow = { tau: number; g0: number; g1: number; g2: number };

/// Total spread against the time left τ (from T down to 0) for three risk aversions; row i has keys g0, g1, g2.
export function spreadVsTime(gammas: readonly [number, number, number], sigma: number, k: number, T: number, steps: number): SpreadRow[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const tau = T - (i / steps) * T;
    const [g0, g1, g2] = gammas.map((g) => asTotalSpread(g, sigma, k, tau));
    return { tau, g0, g1, g2 };
  });
}

/// Risk aversion from the log-scale slider position x in [−2, 0]: γ = 10^x.
export const gammaFromLog = (x: number) => 10 ** x;
