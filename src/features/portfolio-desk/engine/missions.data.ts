import type { AssetClass, PortfolioMission, PortfolioObjective, Regime } from "./portfolio.types";

const CALM: Regime = {
  mu: [0.07, 0.09, 0.035, 0.045, 0.04],
  sigma: [0.16, 0.22, 0.06, 0.08, 0.15],
  corr: [
    [1, 0.75, -0.2, 0.55, 0.05],
    [0.75, 1, -0.1, 0.55, 0.15],
    [-0.2, -0.1, 1, 0.3, 0.2],
    [0.55, 0.55, 0.3, 1, 0.1],
    [0.05, 0.15, 0.2, 0.1, 1],
  ],
};

const STRESS: Regime = {
  mu: [-0.25, -0.35, 0.06, -0.1, 0.08],
  sigma: [0.28, 0.38, 0.08, 0.14, 0.18],
  corr: [
    [1, 0.9, -0.4, 0.8, 0],
    [0.9, 1, -0.3, 0.8, 0.1],
    [-0.4, -0.3, 1, 0.1, 0.3],
    [0.8, 0.8, 0.1, 1, 0],
    [0, 0.1, 0.3, 0, 1],
  ],
};

/// The desk's five asset classes with their calm drift and volatility.
export const PORTFOLIO_ASSETS: readonly AssetClass[] = (["EQ", "EM", "GOV", "CRD", "GOLD"] as const).map((id, i) => ({
  id,
  mu: CALM.mu[i],
  sigma: CALM.sigma[i],
}));

const BASE: Omit<PortfolioMission, "id" | "objectives"> = {
  months: 36,
  calm: CALM,
  stress: STRESS,
  stressStart: "random",
  stressLength: 6,
  start: [0.55, 0.2, 0.1, 0.1, 0.05],
  target: 0.1,
  riskFree: 0.02,
  costBp: 10,
  lambda: 0.85,
};

const VOL_BAND: PortfolioObjective = { kind: "realizedVolBand", lo: 0.085, hi: 0.115 };

/// Missions P1–P5 of the portfolio manager desk.
export const PORTFOLIO_MISSIONS: readonly PortfolioMission[] = [
  { ...BASE, id: "P1", objectives: [VOL_BAND, { kind: "maxDrawdown", limit: 0.18 }, { kind: "costsBelow", limitBp: 40 }] },
  { ...BASE, id: "P2", objectives: [{ kind: "riskShareMisses", limit: 0.3, allowed: 2 }, { kind: "realizedVolBand", lo: 0.06, hi: 0.11 }] },
  {
    ...BASE,
    id: "P3",
    stressStart: 12,
    objectives: [{ kind: "maxDrawdown", limit: 0.12 }, { kind: "realizedVolBand", lo: 0.06, hi: 0.115 }],
  },
  { ...BASE, id: "P4", objectives: [{ kind: "costsBelow", limitBp: 15 }, VOL_BAND] },
  { ...BASE, id: "P5", objectives: [{ kind: "beatBenchmarkSharpe" }, { kind: "maxDrawdown", limit: 0.2 }] },
];

/// Mission by id; falls back to P1.
export function portfolioMissionById(id: string): PortfolioMission {
  return PORTFOLIO_MISSIONS.find((m) => m.id === id) ?? PORTFOLIO_MISSIONS[0];
}
