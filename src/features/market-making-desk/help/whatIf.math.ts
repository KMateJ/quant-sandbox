import { reduceMm } from "../engine/book.math";
import type { MmAction, MmMarket, MmMission, MmPolicyId, MmState } from "../engine/mm.types";
import { mmPnl, mmPnlParts } from "../engine/objectives.math";
import { MM_POLICIES, policyActions } from "../engine/policy.math";
import { adverseWarnAt } from "./advice.math";

export type MmWhatIfId = MmPolicyId | "doNothing";
export type MmWhatIfVerdict = "safe" | "risky" | "breaches" | "toxic";
export type MmWhatIf = { id: MmWhatIfId; pnl: number; maxInv: number; adverse: number; breaches: number; verdict: MmWhatIfVerdict };

export const WHAT_IF_IDS: readonly MmWhatIfId[] = [...MM_POLICIES, "doNothing"];
export const WHAT_IF_VERDICTS: readonly MmWhatIfVerdict[] = ["safe", "risky", "breaches", "toxic"];
const RISKY = 0.7;

/// Robot actions at tick `s.t`; the first tick of a what-if also gets the robot's opening quote.
function actionsAt(id: MmWhatIfId, s: MmState, mission: MmMission, first: boolean): MmAction[] {
  if (id === "doNothing") return first ? [{ type: "pull" }] : [];
  const opening = first && s.t > 0 ? policyActions(id, { ...s, t: 0 }, mission) : [];
  return [...opening, ...policyActions(id, s, mission)];
}

/// Run the rest of the mission from `state` with one robot (or pulled quotes); `state` is not changed.
export function replayFrom(id: MmWhatIfId, mission: MmMission, state: MmState, market: MmMarket): MmState {
  let s = state;
  let first = true;
  while (!s.settled) {
    for (const a of actionsAt(id, s, mission, first)) s = reduceMm(s, a, mission, market);
    first = false;
    s = reduceMm(s, { type: "step", ticks: 1 }, mission, market);
  }
  return s;
}

/// Largest |inventory| over the recorded history.
export const maxAbsInventory = (s: MmState) => s.hist.reduce((m, h) => Math.max(m, Math.abs(h.inv)), 0);

/// Five continuations side by side (four robots and "pull now"); deterministic, run on demand (not per tick).
export function mmWhatIf(mission: MmMission, state: MmState, market: MmMarket): MmWhatIf[] {
  return WHAT_IF_IDS.map((id) => {
    const end = replayFrom(id, mission, state, market);
    const parts = mmPnlParts(mission, end);
    const adverse = Math.max(0, -parts.adverse);
    const maxInv = maxAbsInventory(end);
    const breaches = end.breaches - state.breaches;
    const verdict: MmWhatIfVerdict = breaches > 0 ? "breaches"
      : adverse > 0 && adverse > adverseWarnAt(mission, parts.spread) ? "toxic"
      : maxInv > RISKY * mission.limit ? "risky" : "safe";
    return { id, pnl: mmPnl(end), maxInv, adverse, breaches, verdict };
  });
}
