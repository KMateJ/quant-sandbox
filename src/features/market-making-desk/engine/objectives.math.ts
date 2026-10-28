import { capStatus, countStatus, floorStatus } from "../../../lib/game/objectives";
import type { ObjectiveResult, ObjectiveStatus } from "../../../lib/game/game.types";
import { decompose } from "../../../lib/market/maker";
import type { MmMission, MmObjective, MmState } from "./mm.types";

const WARN = 0.8;

/// Mid in $ at tick `t` from the state's history (clamped to the last recorded tick).
export const midAtFrom = (s: MmState) => (t: number) => s.hist[Math.min(t, s.hist.length - 1)].mid;

/// Exact P&L split of the state so far (spread, adverse, inventory, fees, total) in $.
export function mmPnlParts(mission: MmMission, s: MmState) {
  return decompose(s.ledger, midAtFrom(s), s.t, mission.markout);
}

/// Final P&L in $ marked at the last recorded mid.
export const mmPnl = (s: MmState) => s.hist[s.hist.length - 1].pnl;

function beat(edge: number | null, settled: boolean): ObjectiveStatus {
  if (edge === null || !settled) return "onTrack";
  return edge > 0 ? "pass" : "fail";
}

function evaluateOne(def: MmObjective, mission: MmMission, s: MmState, policyPnl?: number): ObjectiveResult<MmObjective> {
  switch (def.kind) {
    case "pnlFloor": {
      const value = mmPnl(s);
      return { def, status: floorStatus(value, def.floor, def.floor, s.settled), value };
    }
    case "inventoryCap":
      return { def, status: countStatus(s.breaches, def.allowed, s.settled), value: s.breaches };
    case "adverseCap": {
      const value = Math.max(0, -mmPnlParts(mission, s).adverse);
      return { def, status: capStatus(value, def.limit, def.limit * WARN, s.settled), value };
    }
    case "maxDrawdown":
      return { def, status: capStatus(s.mdd, def.limit, def.limit * WARN, s.settled), value: s.mdd };
    case "beatPolicy": {
      const edge = policyPnl === undefined ? null : mmPnl(s) - policyPnl;
      return { def, status: beat(edge, s.settled), value: edge ?? 0 };
    }
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Live or final status of every objective; `policyPnl` is the benchmark robot's final P&L for `beatPolicy`.
export function evaluateMm(mission: MmMission, s: MmState, policyPnl?: number): ObjectiveResult<MmObjective>[] {
  return mission.objectives.map((def) => evaluateOne(def, mission, s, policyPnl));
}
