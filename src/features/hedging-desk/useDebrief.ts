import { useEffect, useMemo, useRef } from "react";
import { attribution, dailyPnl, thetaGamma } from "./engine/debrief.math";
import { replayPolicy } from "./engine/policy.math";
import { realizedVol } from "./engine/risk.math";
import { recordResult } from "./deskProgress";
import type { HedgingDeskModel } from "./useHedgingDesk";

/// Policies replayed on the same path: label key suffix and "rebalance every N days" (0 = never).
export const DEBRIEF_POLICIES = [
  { key: "Daily", every: 1 },
  { key: "Weekly", every: 5 },
  { key: "Monthly", every: 21 },
  { key: "None", every: 0 },
] as const;

/// Debrief numbers for the session: policy replays, attribution, theta vs gamma, daily P&L.
export function useDebrief(desk: HedgingDeskModel) {
  const { mission, market, state, pnl, objectives, seed, demo } = desk;
  const policies = useMemo(
    () => DEBRIEF_POLICIES.map((p) => ({ key: p.key, ...replayPolicy(mission, market, seed, p.every) })),
    [mission, market, seed],
  );
  const parts = useMemo(() => attribution(mission, market, state), [mission, market, state]);
  const tg = useMemo(() => thetaGamma(mission, market, state), [mission, market, state]);
  const daily = useMemo(() => dailyPnl(state.history, pnl), [state.history, pnl]);
  const rvFull = useMemo(() => realizedVol(market.spot, market.days, market.days), [market]);
  const passed = objectives.every((o) => o.status === "pass");

  // Once per session (it remounts on a new path or restart); the ref keeps StrictMode from recording twice.
  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || demo) return;
    recorded.current = true;
    recordResult(mission.id, passed, pnl);
  }, [state.settled, mission.id, passed, pnl, demo]);

  return { policies, parts, tg, daily, rvFull, passed };
}

export type DebriefModel = ReturnType<typeof useDebrief>;
