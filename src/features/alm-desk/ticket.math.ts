import { TENORS, assetsValue, exposure, rebalance, weightsOf } from "../immunization/immunization.math";
import { almConfig, gapsOf } from "./engine/book.math";
import type { AlmMission, AlmState } from "./engine/alm.types";

const CASH = TENORS.length;

/// Bond target percentages (one decimal) for the ticket inputs; cash is the rest.
export const targetsFromWeights = (w: number[]): string[] => TENORS.map((_, i) => (Math.round(w[i] * 1000) / 10).toString());

export type ParsedTargets = { weights: number[] | null; over: boolean };

/// Ticket inputs to slot weights (bonds then cash = the rest); null when a field is not a number in 0–100
/// or the bonds add up to more than 100%.
export function parseTargets(targets: string[]): ParsedTargets {
  const bonds = targets.slice(0, CASH).map((s) => (s.trim() === "" ? 0 : Number(s)));
  if (bonds.some((x) => !Number.isFinite(x) || x < 0 || x > 100)) return { weights: null, over: false };
  const sum = bonds.reduce((a, b) => a + b, 0);
  if (sum > 100 + 1e-9) return { weights: null, over: true };
  return { weights: [...bonds.map((x) => x / 100), Math.max(0, 1 - sum / 100)], over: false };
}

export type TradePreview = { durAfter: number; gapAfter: number; convAfter: number; traded: number; cost: number };

/// What a rebalance to `weights` would do now, without changing the book.
export function previewTrade(state: AlmState, mission: AlmMission, weights: number[]): TradePreview {
  const cfg = almConfig(mission);
  const g = state.game;
  const after = rebalance(g, weights, cfg);
  const now = weightsOf(g);
  const { gap, convGap } = gapsOf(after, cfg);
  return {
    durAfter: exposure(after).dMod,
    gapAfter: gap,
    convAfter: convGap,
    traded: (assetsValue(g) * weights.reduce((s, w, i) => s + Math.abs(w - now[i]), 0)) / 2,
    cost: after.pendingCost - g.pendingCost,
  };
}

/// Trades still allowed, or null when the mission has no limit.
export const tradesLeft = (state: AlmState, mission: AlmMission) =>
  mission.maxTrades === undefined ? null : Math.max(0, mission.maxTrades - state.trades);
