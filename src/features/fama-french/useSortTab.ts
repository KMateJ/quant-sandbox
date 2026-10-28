import { useCallback, useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { slice } from "./famaFrench.math";
import type { FfData, Window } from "./famaFrench.types";
import { breakpointSweep, cutValues, factorStats, makeUniverse, matchWithOfficial, percentileOf, regionOf, sortPortfolios, stockReturns, yourFactors } from "./sort.math";
import type { Cuts, Stock } from "./sort.types";
import { MIN_BM_GAP, PERCENT_STEP, SORT_URL_SCHEMA } from "./sort.url";

export type CutId = "size" | "lo" | "hi";
export type SortFactor = "smb" | "hml";

const snapPercent = (p: number) => Math.round((p * 100) / PERCENT_STEP) * PERCENT_STEP;

/// State of the build-the-factors tab: seeded universe, breakpoints (URL), the six portfolios and your factors.
export function useSortTab(data: FfData, window: Window) {
  const [url, setUrl] = useUrlState(SORT_URL_SCHEMA);
  const [factor, setFactor] = useState<SortFactor>("hml");
  const [hover, setHover] = useState<string | null>(null);
  const universe = useMemo<Stock[]>(() => makeUniverse(url.sseed), [url.sseed]);
  const returns = useMemo(() => stockReturns(universe, data, window, url.sseed), [universe, data, window, url.sseed]);
  const cuts = useMemo<Cuts>(() => ({ sizeCut: url.ssz / 100, bmLo: url.slo / 100, bmHi: url.shi / 100 }), [url.ssz, url.slo, url.shi]);
  const values = useMemo(() => cutValues(universe, cuts), [universe, cuts]);
  const sorted = useMemo(() => sortPortfolios(universe, returns, cuts, url.sw), [universe, returns, cuts, url.sw]);
  const mine = useMemo(() => yourFactors(sorted.series), [sorted]);
  const sweep = useMemo(() => breakpointSweep(universe, returns, cuts, url.sw), [universe, returns, cuts, url.sw]);
  const stats = useMemo(() => {
    const own = mine[factor];
    return { own: factorStats(own), official: factorStats(slice(data.factors[factor], window)), corr: matchWithOfficial(own, data, factor, window) };
  }, [mine, factor, data, window]);
  const regions = useMemo(() => universe.map((s) => regionOf(s, values)), [universe, values]);

  /// Moves a breakpoint to the value the reader dragged to, snapped to the nearest 5% percentile.
  const setCut = useCallback(
    (id: CutId, value: number) => {
      const p = snapPercent(percentileOf(universe, id === "size" ? "logSize" : "logBm", value));
      if (id === "size") setUrl({ ssz: Math.min(95, Math.max(5, p)) });
      else if (id === "lo") setUrl({ slo: Math.min(url.shi - MIN_BM_GAP, Math.max(5, p)) });
      else setUrl({ shi: Math.max(url.slo + MIN_BM_GAP, Math.min(95, p)) });
    },
    [universe, setUrl, url.shi, url.slo]
  );

  return { url, setUrl, factor, setFactor, hover, setHover, universe, values, sorted, mine, sweep, stats, regions, setCut, window };
}
export type SortModel = ReturnType<typeof useSortTab>;
