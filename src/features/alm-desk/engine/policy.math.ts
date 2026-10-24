import { surplusOf } from "../../immunization/immunization.math";
import type { AlmAction, AlmMission, AlmPolicy } from "./alm.types";
import { almConfig, reduceAlm, startAlm } from "./book.math";

export type PolicyRun = { surplus: number[]; costs: number; trades: number; final: number };

/// Plays the whole mission with a fixed rule, through the desk reducer:
/// `matchYearly` matches duration every year, `matchOnce` matches at the start then holds,
/// `buyHold` trades back to the start weights every year, `none` never trades.
export function replayAlm(mission: AlmMission, seed: number, policy: AlmPolicy): PolicyRun {
  const cfg = almConfig(mission);
  let s = startAlm(mission, seed);
  const surplus = [surplusOf(s.game, cfg)];
  const act = (a: AlmAction) => (s = reduceAlm(s, a, mission));
  while (!s.settled) {
    if (policy === "matchYearly" || (policy === "matchOnce" && s.game.round === 0)) act({ type: "match" });
    if (policy === "buyHold" && s.game.round > 0) act({ type: "rebalance", weights: mission.startWeights, tag: "auto" });
    act({ type: "step" });
    surplus.push(surplusOf(s.game, cfg));
  }
  return { surplus, costs: s.costs, trades: s.trades, final: surplus[surplus.length - 1] };
}
