import { riskParityWeights, scaleToVol } from "../../../lib/finance/portfolio";
import { ewmaCov } from "../engine/market.math";
import type { PortfolioMission, PortfolioState } from "../engine/portfolio.types";
import { BENCH_WEIGHTS, riskShares } from "../engine/risk.math";
import { ticketPreview } from "../ticket.math";
import { volBandOf } from "./advice.math";

export type WhatIfId = "doNothing" | "scale10" | "parity10" | "back6040" | "halfRisk";
export type WhatIfVerdict = "onTarget" | "offTarget" | "concentrated" | "spread" | "costly";

export type PortfolioWhatIf = {
  id: WhatIfId;
  targets: number[];
  cost: number;
  vol: number;
  sharpe: number;
  topAsset: number;
  topShare: number;
  /// 1-in-20 monthly loss as a share of the opening NAV: 1.645 · vol/√12 · NAV.
  loss95: number;
  verdicts: WhatIfVerdict[];
};

export const WHAT_IF_IDS: readonly WhatIfId[] = ["doNothing", "scale10", "parity10", "back6040", "halfRisk"];
const Z95 = 1.645;
const CONCENTRATED = 0.5;
const SPREAD = 0.3;
const COSTLY_BP = 5;

/// The five rebalances side by side under today's risk model; nothing in `state` changes.
export function portfolioWhatIf(mission: PortfolioMission, state: PortfolioState, R: number[][]): PortfolioWhatIf[] {
  const S = ewmaCov(mission, R, state.month);
  const [lo, hi] = volBandOf(mission);
  const budget = mission.objectives.find((o) => o.kind === "costsBelow");
  const room = budget?.kind === "costsBelow" ? Math.max(0, budget.limitBp - state.costs * 1e4) : COSTLY_BP;
  const targets: Record<WhatIfId, number[]> = {
    doNothing: state.w.slice(),
    scale10: scaleToVol(state.w, S, mission.target),
    parity10: scaleToVol(riskParityWeights(S), S, mission.target),
    back6040: BENCH_WEIGHTS.slice(),
    halfRisk: state.w.map((x) => x / 2),
  };
  return WHAT_IF_IDS.map((id) => {
    const w = targets[id];
    const p = ticketPreview(state.w, w, S, mission, state.nav);
    const shares = riskShares(w, S);
    const topAsset = shares.reduce((best, s, i) => (s > shares[best] ? i : best), 0);
    const topShare = shares[topAsset];
    const verdicts: WhatIfVerdict[] = [p.vol >= lo && p.vol <= hi ? "onTarget" : "offTarget"];
    if (topShare > CONCENTRATED) verdicts.push("concentrated");
    else if (topShare <= SPREAD) verdicts.push("spread");
    if (p.cost * 1e4 > room) verdicts.push("costly");
    return { id, targets: w, cost: p.cost, vol: p.vol, sharpe: p.sharpe, topAsset, topShare, loss95: (Z95 * p.vol * state.nav) / Math.sqrt(12), verdicts };
  });
}
