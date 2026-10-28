import { bestDelta, breakEvenDelta, incomeRate } from "../../lib/market/informed";
import type { MmParams } from "./marketMaking.types";

/// Expected P&L per minute in $ of symmetric quotes at half-spread δ ¢ (ignores inventory).
export const theoryPnlPerMin = (delta: number, p: MmParams) => (incomeRate(delta, p) * 60 * p.lot) / 100;

/// Income-maximising half-spread in ¢.
export const theoryBest = (p: MmParams) => bestDelta(p);

/// Smallest half-spread that breaks even in ¢ (0 without informed flow).
export const theoryBreakEven = (p: MmParams) => breakEvenDelta(p);

/// Theory curve on [0, xMax] for the rounds chart.
export function theoryCurve(p: MmParams, xMax: number, n = 80): { x: number; y: number }[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = (xMax * i) / n;
    return { x, y: theoryPnlPerMin(x, p) };
  });
}

/// Challenge target: a share of the best theoretical P&L for one 60 s round, in $.
export const challengeTarget = (p: MmParams, share: number) => share * theoryPnlPerMin(bestDelta(p), p);
