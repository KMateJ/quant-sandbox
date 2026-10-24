import { useEffect, useMemo, useRef } from "react";
import { allPassed } from "../../lib/game/objectives";
import { ALM_PROGRESS } from "./almProgress";
import { replayAlm } from "./engine/policy.math";
import { attributionTotals, surplusSeries } from "./engine/series.math";
import type { AlmPolicy } from "./engine/alm.types";
import type { AlmDeskModel } from "./useAlmDesk";

/// Reference rules replayed on the same shocks, with the copy-key suffix of each.
export const DEBRIEF_POLICIES: readonly { policy: AlmPolicy; key: string }[] = [
  { policy: "matchYearly", key: "MatchYearly" },
  { policy: "matchOnce", key: "MatchOnce" },
  { policy: "buyHold", key: "BuyHold" },
  { policy: "none", key: "None" },
];

/// Debrief numbers: policy replays, your run's summary, attribution totals; records progress once per session.
export function useAlmDebrief(desk: AlmDeskModel) {
  const { mission, seed, state, objectives, demo } = desk;
  const policies = useMemo(
    () => DEBRIEF_POLICIES.map((p) => {
      const r = replayAlm(mission, seed, p.policy);
      return { key: p.key, final: r.final, worst: Math.min(...r.surplus), costs: r.costs, trades: r.trades };
    }),
    [mission, seed],
  );
  const you = useMemo(() => {
    const s = surplusSeries(state);
    return { final: s[s.length - 1], worst: Math.min(...s), costs: state.costs, trades: state.trades };
  }, [state]);
  const totals = useMemo(() => attributionTotals(state), [state]);
  const passed = allPassed(objectives);

  // Once per session (it remounts on a new path or restart); the ref keeps StrictMode from recording twice.
  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || demo) return;
    recorded.current = true;
    ALM_PROGRESS.record(mission.id, passed, you.final);
  }, [state.settled, mission.id, passed, you.final, demo]);

  return { policies, you, totals, passed };
}
