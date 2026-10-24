import type { GameEventBase, MissionBase } from "../../../lib/game/game.types";

export type RetirementObjective =
  /// Wealth stays above zero through the last year.
  | { kind: "moneyLasts" }
  | { kind: "avgSpendAtLeast"; amount: number }
  /// Cuts of 10% or more against last year's amount.
  | { kind: "cutsAtMost"; allowed: number }
  /// Wealth left at the end.
  | { kind: "legacyAtLeast"; amount: number }
  /// Success odds at every decision.
  | { kind: "oddsNeverBelow"; floor: number };

export type SpendRule = "fixed" | "fixedLow" | "pctWealth" | "guardrails";

export type RetirementMission = MissionBase<RetirementObjective> & {
  years: number;
  start: number;
  target: number;
  /// Equity share at the start, 0..1.
  equity0: number;
  muE: number;
  sigmaE: number;
  muB: number;
  sigmaB: number;
  rho: number;
  /// Scripted equity real returns for given years (1-based); the main path only.
  forced: { year: number; equity: number }[];
  /// Monte Carlo paths for the success odds.
  paths: number;
  equityLocked: boolean;
};

export type RetirementEvent = GameEventBase &
  (
    | { kind: "start" }
    | { kind: "take"; amount: number; equity: number; tag: "manual" | "auto" }
    | { kind: "cut"; amount: number; pct: number }
    | { kind: "bigYear"; r: number }
    | { kind: "broke" }
    | { kind: "end"; wealth: number }
  );

/// One year played: wealth at the start, amount taken, equity share, portfolio return, wealth at the end, odds at the decision.
export type YearRow = { y: number; start: number; take: number; equity: number; r: number; end: number; odds: number };

export type RetirementState = {
  missionId: string;
  seed: number;
  /// Years played so far; the next decision is for year `year + 1`.
  year: number;
  wealth: number;
  equity: number;
  /// Amount taken last year; null before the first year.
  last: number | null;
  cuts: number;
  broke: boolean;
  minOdds: number;
  rows: YearRow[];
  events: RetirementEvent[];
  settled: boolean;
};

export type RetirementAction =
  | { type: "take"; amount: number; equity: number; tag: "manual" | "auto" }
  | { type: "auto"; years: number; rule: SpendRule }
  | { type: "restore"; state: RetirementState };
