import { useEffect, useMemo, useRef } from "react";
import { allPassed } from "../../lib/game/objectives";
import { replayRates } from "./engine/policy.math";
import type { RatesPolicy } from "./engine/rates.types";
import { RATES_PROGRESS } from "./ratesProgress";
import type { RatesDeskModel } from "./useRatesDesk";

/// Reference rules replayed on the same curve path.
export const DEBRIEF_POLICIES: readonly RatesPolicy[] = ["dv01Daily10Y", "dv01Weekly10Y", "krdDaily", "none"];

/// Debrief numbers: policy replays, your run and the P&L split; records progress once per session.
export function useRatesDebrief(desk: RatesDeskModel) {
  const { mission, seed, state, objectives, demo, pnl } = desk;
  const policies = useMemo(() => DEBRIEF_POLICIES.map((p) => ({ policy: p, ...replayRates(mission, seed, p) })), [mission, seed]);
  const last = state.hist[state.hist.length - 1];
  const parts = { bonds: last.naked, futures: state.futPnl, costs: -state.costs, total: last.hedged };
  const passed = allPassed(objectives);

  // Once per session (it remounts on a new path or restart); the ref keeps StrictMode from recording twice.
  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || demo) return;
    recorded.current = true;
    RATES_PROGRESS.record(mission.id, passed, pnl);
  }, [state.settled, mission.id, passed, pnl, demo]);

  return { policies, parts, passed };
}
