import { bestDelta, breakEvenDelta, incomeRate, informedLoss, type InformedFlow } from "../../lib/market/informed";

/// Arrivals per second, fill decay per cent and informed look-ahead (s) held fixed in the figure and the worked example.
export const TOXIC_BASE = { lambda: 4, k: 0.5, horizon: 3 } as const;
export const TOXIC_DELTA_MAX = 8;
const PER_MINUTE = 60;

/// The figure's flow for a given informed share and volatility (cents per √s).
export const toxicFlow = (informed: number, sigma: number): InformedFlow => ({ ...TOXIC_BASE, informed, sigma });

export type IncomePoint = { delta: number; income: number; noInformed: number };

/// Income per minute against half-spread δ for the current flow, next to the same flow with no informed customers.
export function incomeCurve(flow: InformedFlow, points = 161): IncomePoint[] {
  const clean = { ...flow, informed: 0 };
  return Array.from({ length: points }, (_, i) => {
    const delta = (i / (points - 1)) * TOXIC_DELTA_MAX;
    return { delta, income: incomeRate(delta, flow) * PER_MINUTE, noInformed: incomeRate(delta, clean) * PER_MINUTE };
  });
}

export type IncomeSplit = { noise: number; informed: number; net: number };

/// Per-minute noise income, informed loss and their net at half-spread δ (the net equals `incomeRate · 60`).
export function incomeSplit(delta: number, flow: InformedFlow): IncomeSplit {
  const noise = flow.lambda * (1 - flow.informed) * delta * Math.exp(-flow.k * delta) * PER_MINUTE;
  const informed = flow.lambda * 2 * flow.informed * informedLoss(delta, flow.sigma * Math.sqrt(flow.horizon)) * PER_MINUTE;
  return { noise, informed, net: noise - informed };
}

export type ToxicSummary = { best: number; bestIncome: number; breakEven: number };

/// The income-maximising half-spread, its income per minute, and the smallest half-spread that breaks even.
export function toxicSummary(flow: InformedFlow): ToxicSummary {
  const best = bestDelta(flow);
  return { best, bestIncome: incomeRate(best, flow) * PER_MINUTE, breakEven: breakEvenDelta(flow) };
}
