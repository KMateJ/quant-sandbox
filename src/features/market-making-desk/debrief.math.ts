import type { MmMarket, MmMission, MmPolicyId, MmState } from "./engine/mm.types";
import { midAtFrom, mmPnl, mmPnlParts } from "./engine/objectives.math";
import { MM_POLICIES, replayMm } from "./engine/policy.math";
import { makerFills } from "./help/advice.math";
import { maxAbsInventory } from "./help/whatIf.math";

export type MmPolicyRow = { policy: MmPolicyId | "you"; pnl: number; maxInv: number; adverse: number; fees: number };

const rowOf = (policy: MmPolicyRow["policy"], mission: MmMission, s: MmState): MmPolicyRow => {
  const p = mmPnlParts(mission, s);
  return { policy, pnl: mmPnl(s), maxInv: maxAbsInventory(s), adverse: p.adverse, fees: p.fees };
};

/// The four robots replayed on the same market, then your run.
export function policyRows(mission: MmMission, seed: number, market: MmMarket, own: MmState): MmPolicyRow[] {
  return [...MM_POLICIES.map((id) => rowOf(id, mission, replayMm(mission, seed, id, market).state)), rowOf("you", mission, own)];
}

/// Markout buckets in ticks per share (ends clamped) for the reveal chart.
export const MARKOUT_BUCKETS = [-3, -2, -1, 0, 1, 2, 3] as const;

/// Your maker fills counted by signed markout after `mission.markout` s, in whole ticks per share (+ = the move paid you).
export function markoutHistogram(mission: MmMission, s: MmState): { bucket: number; n: number }[] {
  const midAt = midAtFrom(s);
  const tick = mission.flow.tick;
  const counts = MARKOUT_BUCKETS.map(() => 0);
  for (const f of makerFills(s)) {
    const move = (midAt(Math.min(f.t + mission.markout, s.t)) - f.mid) / tick;
    const b = Math.max(-3, Math.min(3, Math.round(f.side === "buy" ? move : -move)));
    counts[b + 3] += 1;
  }
  return MARKOUT_BUCKETS.map((bucket, i) => ({ bucket, n: counts[i] }));
}
