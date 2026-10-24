import type { GameEventBase, MissionBase } from "../../../lib/game/game.types";

export type AssetId = "EQ" | "EM" | "GOV" | "CRD" | "GOLD";
export type AssetClass = { id: AssetId; mu: number; sigma: number };
/// Annual drift, volatility and correlation of the five asset classes in one market regime.
export type Regime = { mu: number[]; sigma: number[]; corr: number[][] };

export type PortfolioObjective =
  | { kind: "realizedVolBand"; lo: number; hi: number }
  | { kind: "maxDrawdown"; limit: number }
  | { kind: "costsBelow"; limitBp: number }
  | { kind: "riskShareMisses"; limit: number; allowed: number }
  | { kind: "beatBenchmarkSharpe" };

export type PortfolioMission = MissionBase<PortfolioObjective> & {
  months: number;
  calm: Regime;
  stress: Regime;
  stressStart: number | "random";
  stressLength: number;
  start: number[];
  target: number;
  riskFree: number;
  costBp: number;
  lambda: number;
};

export type PortfolioEvent = GameEventBase &
  (
    | { kind: "start" }
    | { kind: "rebalance"; turnover: number; vol: number; tag: "manual" | "auto" }
    | { kind: "bigMonth"; fund: number; eq: number; gov: number }
    | { kind: "drawdown"; dd: number }
    | { kind: "shareMiss"; asset: string; share: number }
    | { kind: "end"; nav: number; bench: number }
  );

/// One month of history: NAVs, drawdown, the fund (`rp`) and benchmark (`rb`) returns of that month and the risky weights
/// held through it (`w`; at month 0 the opening weights).
export type PortfolioHistPoint = { m: number; nav: number; bench: number; dd: number; rp: number; rb: number; w: number[] };

export type PortfolioState = {
  missionId: string;
  seed: number;
  month: number;
  w: number[];
  nav: number;
  bench: number;
  peak: number;
  mdd: number;
  costs: number;
  shareMisses: number;
  hist: PortfolioHistPoint[];
  events: PortfolioEvent[];
  settled: boolean;
};

export type PortfolioAction =
  | { type: "rebalance"; targets: number[]; tag: "manual" | "auto" }
  | { type: "scaleToTarget" }
  | { type: "riskParity" }
  | { type: "step"; months: number }
  | { type: "restore"; state: PortfolioState };

/// Simulated monthly simple returns `R[month][asset]` and the first stress month (1-based).
export type PortfolioPath = { R: number[][]; stressStart: number };
