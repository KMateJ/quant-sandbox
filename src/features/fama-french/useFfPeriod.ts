import { useCallback, useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { FF_URL_SCHEMA, MIN_WINDOW_MONTHS } from "./famaFrench.url";
import type { FfData, FfTabId, Window } from "./famaFrench.types";

/// The open tab and the shared sample period (URL state), with the period clamped to the loaded data.
export function useFfPeriod(data: FfData) {
  const [state, setState] = useUrlState(FF_URL_SCHEMA);
  const last = data.months.length - 1;

  const window = useMemo<Window>(() => {
    const to = Math.min(state.to, last);
    return { from: Math.max(0, Math.min(state.from, to - MIN_WINDOW_MONTHS)), to };
  }, [state.from, state.to, last]);

  const setWindow = useCallback((from: number, to: number) => setState({ from, to }), [setState]);
  const setTab = useCallback((tab: FfTabId) => setState({ tab }), [setState]);

  return { tab: state.tab, window, setWindow, setTab };
}
