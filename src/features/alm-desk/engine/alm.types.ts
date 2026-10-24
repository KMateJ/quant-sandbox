import type { GameEventBase, MissionBase } from "../../../lib/game/game.types";
import type { GameConfig, GameState } from "../../immunization/immunization.types";

export type AlmObjective =
  | { kind: "surplusAtEnd"; floor: number }
  /// |dMod_A − dMod_L| checked at each year end.
  | { kind: "gapMisses"; band: number; allowed: number }
  /// |conv_A − conv_L| checked at each year end.
  | { kind: "convexityMisses"; band: number; allowed: number }
  | { kind: "costsBelow"; limit: number }
  | { kind: "maxTrades"; limit: number }
  /// Surplus never below `floor` at a year end.
  | { kind: "surplusFloor"; floor: number };

export type AlmMission = MissionBase<AlmObjective> & {
  config: Partial<GameConfig>;
  /// Weights over [2y, 5y, 12y, cash] the book starts in.
  startWeights: number[];
  maxTrades?: number;
  /// The sponsor pays a new liability's PV in cash when it is announced.
  contributionOnAdd?: boolean;
};

export type AlmEvent = GameEventBase &
  (
    | { kind: "start" }
    | { kind: "shock"; parallelBp: number; twistBp: number }
    | { kind: "rebalance"; cost: number; duration: number; tag: "manual" | "auto" }
    | { kind: "matured"; tenor: number; amount: number }
    | { kind: "gapMiss"; gap: number }
    | { kind: "convMiss"; gap: number }
    | { kind: "liabilityAdded"; amount: number; year: number; contribution: number }
    | { kind: "liabilityPaid"; amount: number }
    | { kind: "rejected"; reason: "tradeLimit" }
    | { kind: "end"; surplus: number }
  );

export type AlmState = {
  missionId: string;
  seed: number;
  game: GameState;
  misses: number;
  convMisses: number;
  trades: number;
  costs: number;
  minSurplus: number;
  events: AlmEvent[];
  settled: boolean;
};

export type AlmAction =
  | { type: "rebalance"; weights: number[]; tag: "manual" | "auto" }
  | { type: "match" }
  | { type: "step" }
  | { type: "restore"; state: AlmState };

export type AlmPolicy = "matchYearly" | "buyHold" | "matchOnce" | "none";
