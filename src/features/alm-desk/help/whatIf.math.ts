import { macaulay } from "../../../lib/finance/immunization";
import { TENORS, immunisedWeights, liabilityConvexity, liabilityDuration, weightsOf, yieldAt } from "../../immunization/immunization.math";
import { almConfig, bandOf, gapsOf, reduceAlm } from "../engine/book.math";
import { surplusGrid } from "../engine/risk.math";
import type { AlmMission, AlmState } from "../engine/alm.types";
import { DEFAULT_GAP_BAND } from "./advice.math";

export const WHAT_IF_IDS = ["doNothing", "barbell", "bullet", "cashLong", "allCash"] as const;
export type AlmWhatIfId = (typeof WHAT_IF_IDS)[number];
export type AlmWhatIfVerdict = "matched" | "gapStays" | "moreConvex" | "lessConvex" | "costly";

export type AlmWhatIfCard = {
  id: AlmWhatIfId;
  weights: number[];
  cost: number;
  gapAfter: number;
  convAfter: number;
  convLiab: number;
  /// Worst instant surplus change over parallel ±100 bp × twist ±50 bp.
  worstShock: number;
  verdicts: AlmWhatIfVerdict[];
  block?: "ended" | "tradeLimit";
};

const COSTLY = 500;
const SHOCKS_P = [-100, 0, 100];
const SHOCKS_T = [-50, 0, 50];
const CASH = TENORS.length;

/// Modified duration of a new-issue par bond of each tenor on today's curve.
function newIssueDurations(state: AlmState): number[] {
  return TENORS.map((m) => {
    const y = yieldAt(state.game.curve, m);
    return macaulay(y, m, y) / (1 + y);
  });
}

/// Target weights of each candidate on today's book.
export function candidateWeights(id: AlmWhatIfId, mission: AlmMission, state: AlmState): number[] {
  const cfg = almConfig(mission);
  const g = state.game;
  const zero = [...TENORS.map(() => 0), 0];
  const durL = liabilityDuration(g, cfg);
  switch (id) {
    case "doNothing":
      return weightsOf(g);
    case "barbell":
      return immunisedWeights(g, cfg);
    case "bullet": {
      const left = cfg.years - g.round;
      const slot = TENORS.reduce((best, m, i) => (Math.abs(m - left) < Math.abs(TENORS[best] - left) ? i : best), 0);
      return zero.map((_, i) => (i === slot ? 1 : 0));
    }
    case "cashLong": {
      const long = TENORS.length - 1;
      const w = Math.min(1, durL / newIssueDurations(state)[long]);
      return zero.map((_, i) => (i === long ? w : i === CASH ? 1 - w : 0));
    }
    case "allCash":
      return zero.map((_, i) => (i === CASH ? 1 : 0));
    default: {
      const never: never = id;
      return never;
    }
  }
}

/// The five what-if cards: each candidate applied to a copy of the book through the reducer.
export function almWhatIf(mission: AlmMission, state: AlmState): AlmWhatIfCard[] {
  const cfg = almConfig(mission);
  const band = bandOf(mission, "gapMisses") ?? DEFAULT_GAP_BAND;
  const noTrades = mission.maxTrades !== undefined && state.trades >= mission.maxTrades;
  return WHAT_IF_IDS.map((id): AlmWhatIfCard => {
    const weights = candidateWeights(id, mission, state);
    const after = id === "doNothing" ? state : reduceAlm(state, { type: "rebalance", weights, tag: "manual" }, mission);
    const { gap, convGap } = gapsOf(after.game, cfg);
    const convLiab = liabilityConvexity(after.game, cfg);
    const worstShock = Math.min(...surplusGrid(after, mission, SHOCKS_P, SHOCKS_T).flat());
    const cost = after.costs - state.costs;
    const verdicts: AlmWhatIfVerdict[] = [Math.abs(gap) <= band ? "matched" : "gapStays"];
    if (Math.abs(convGap) > 1) verdicts.push(convGap > 0 ? "moreConvex" : "lessConvex");
    if (cost > COSTLY) verdicts.push("costly");
    const block = state.settled ? "ended" : noTrades && id !== "doNothing" ? "tradeLimit" : undefined;
    return { id, weights, cost, gapAfter: gap, convAfter: convGap + convLiab, convLiab, worstShock, verdicts, block };
  });
}
