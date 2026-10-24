import { zeroGrid } from "../engine/curve.math";
import { reduceRates } from "../engine/book.math";
import { objectiveLimits } from "../engine/limits.math";
import { bucketsOf, curveScenarios, isExpired, ratesRisk } from "../engine/risk.math";
import type { CurveFactors, RatesAction, RatesMission, RatesState } from "../engine/rates.types";

export type WhatIfId = "doNothing" | "dv01With10Y" | "dv01With5Y" | "dv01With2Y" | "keyRate" | "rollToBack";
export type WhatIfVerdict = "inBand" | "outsideBand" | "curveRiskLeft" | "curveRiskSmall" | "costly" | "blocked";
export type WhatIfResult = {
  id: WhatIfId;
  actions: RatesAction[];
  /// Signed contracts traded per future.
  trades: number[];
  traded: number;
  cost: number;
  netAfter: number;
  bucket: number;
  bucketValue: number;
  worstScenario: number;
  verdicts: WhatIfVerdict[];
};

/// Every what-if id, for copy coverage.
export const WHAT_IF_IDS: readonly WhatIfId[] = ["doNothing", "dv01With10Y", "dv01With5Y", "dv01With2Y", "keyRate", "rollToBack"];

const DEFAULT_BAND = 1000;
const CURVE_RISK = 1500;
const COSTLY_SHARE = 0.25;
const COSTLY_FLAT = 5000;

const liveIndex = (mission: RatesMission, day: number, prefix: string) =>
  mission.futures.findIndex((f) => f.id.startsWith(prefix) && !isExpired(f, day));

function candidates(mission: RatesMission, state: RatesState): { id: WhatIfId; actions: RatesAction[] | null }[] {
  const hedge = (prefix: string): RatesAction[] | null => {
    const j = liveIndex(mission, state.day, prefix);
    return j < 0 ? null : [{ type: "dv01Hedge", future: j }];
  };
  const list: { id: WhatIfId; actions: RatesAction[] | null }[] = [
    { id: "doNothing", actions: [] },
    { id: "dv01With10Y", actions: hedge("10Y") },
    { id: "dv01With5Y", actions: hedge("5Y") },
    { id: "dv01With2Y", actions: hedge("2Y") },
    { id: "keyRate", actions: [{ type: "krdHedge" }] },
  ];
  const front = mission.futures.findIndex((f) => f.expiryDay !== undefined);
  if (front >= 0) {
    const back = mission.futures.findIndex((f, i) => i !== front && f.id.startsWith("10Y") && f.expiryDay === undefined);
    const open = !isExpired(mission.futures[front], state.day) && state.contracts[front] !== 0 && back >= 0;
    list.push({
      id: "rollToBack",
      actions: open ? [{ type: "trade", future: front, qty: -state.contracts[front], tag: "auto" }, { type: "dv01Hedge", future: back }] : null,
    });
  }
  return list;
}

/// Each candidate hedge applied to a copy of the book: trades, cost, DV01 and curve risk after, worst scenario.
export function ratesWhatIf(mission: RatesMission, state: RatesState, path: CurveFactors[]): WhatIfResult[] {
  const zeros = zeroGrid(path[state.day]);
  const limits = objectiveLimits(mission);
  const band = limits.dv01Band ?? DEFAULT_BAND;
  const curveLimit = limits.krdLimit ?? CURVE_RISK;
  const costCap = mission.objectives.find((o) => o.kind === "costsBelow");
  const costly = costCap && costCap.kind === "costsBelow" ? COSTLY_SHARE * costCap.limit : COSTLY_FLAT;
  return candidates(mission, state).map(({ id, actions }) => {
    const blocked = actions === null || state.settled;
    const acts = blocked ? [] : actions;
    const after = acts.reduce((s, a) => reduceRates(s, a, mission, path), state);
    const risk = ratesRisk(after, mission, zeros);
    const buckets = bucketsOf(risk.kNet);
    const bucket = buckets.reduce((w, v, k) => (Math.abs(v) > Math.abs(buckets[w]) ? k : w), 0);
    const cost = after.costs - state.costs;
    const worstScenario = Math.min(...curveScenarios(after, mission, zeros).map((s) => s.hedged));
    const verdicts: WhatIfVerdict[] = blocked
      ? ["blocked"]
      : [
          Math.abs(risk.net) <= band ? "inBand" : "outsideBand",
          Math.abs(buckets[bucket]) > curveLimit ? "curveRiskLeft" : "curveRiskSmall",
          ...(cost > costly ? (["costly"] as const) : []),
        ];
    return {
      id,
      actions: acts,
      trades: after.contracts.map((q, i) => q - state.contracts[i]),
      traded: after.traded - state.traded,
      cost,
      netAfter: risk.net,
      bucket,
      bucketValue: buckets[bucket],
      worstScenario,
      verdicts,
    };
  });
}
