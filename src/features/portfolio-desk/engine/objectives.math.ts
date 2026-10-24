import { bandAtSettle, capStatus, countStatus } from "../../../lib/game/objectives";
import type { ObjectiveResult, ObjectiveStatus } from "../../../lib/game/game.types";
import { realizedVol, sharpeEdge } from "./risk.math";
import type { PortfolioMission, PortfolioObjective, PortfolioState } from "./portfolio.types";

const WARN = 0.8;
/// Sharpe edge counted as a win; a tie with the benchmark is not one.
const BEAT_MARGIN = 1e-6;

/// Realised statistics need two monthly returns; before that a live objective is on track.
const tooEarly = (s: PortfolioState) => s.hist.length < 3 && !s.settled;

function band(value: number, lo: number, hi: number, s: PortfolioState): ObjectiveStatus {
  return tooEarly(s) ? "onTrack" : bandAtSettle(value, lo, hi, s.settled);
}

function evaluateOne(def: PortfolioObjective, mission: PortfolioMission, s: PortfolioState): ObjectiveResult<PortfolioObjective> {
  switch (def.kind) {
    case "realizedVolBand": {
      const value = realizedVol(s.hist);
      return { def, status: band(value, def.lo, def.hi, s), value };
    }
    case "maxDrawdown":
      return { def, status: capStatus(s.mdd, def.limit, def.limit * WARN, s.settled), value: s.mdd };
    case "costsBelow": {
      const value = s.costs * 1e4;
      return { def, status: capStatus(value, def.limitBp, def.limitBp * WARN, s.settled), value };
    }
    case "riskShareMisses":
      return { def, status: countStatus(s.shareMisses, def.allowed, s.settled), value: s.shareMisses };
    case "beatBenchmarkSharpe": {
      const value = sharpeEdge(s.hist, mission.riskFree);
      return { def, status: band(value, BEAT_MARGIN, Infinity, s), value };
    }
    default: {
      const never: never = def;
      return never;
    }
  }
}

/// Live or final status of every mission objective. Costs are in bp of the opening NAV.
export function evaluatePortfolio(mission: PortfolioMission, state: PortfolioState): ObjectiveResult<PortfolioObjective>[] {
  return mission.objectives.map((def) => evaluateOne(def, mission, state));
}
