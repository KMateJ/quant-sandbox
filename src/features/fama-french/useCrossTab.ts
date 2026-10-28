import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { crossR2, crossSection, grs, meanAbsAlpha } from "./cross.math";
import { CROSS_MODELS, type CrossModel, type CrossRow } from "./cross.types";
import { CROSS_URL_SCHEMA } from "./cross.url";
import type { FfData, Window } from "./famaFrench.types";

/// State of the cross-section tab: the 25 portfolios under every model (so the axes never move while the
/// reader switches), the active model and the selected portfolio.
export function useCrossTab(data: FfData, window: Window) {
  const [url, setUrl] = useUrlState(CROSS_URL_SCHEMA);
  const all = useMemo(
    () => Object.fromEntries(CROSS_MODELS.map((m) => [m, crossSection(data, window, m)])) as Record<CrossModel, CrossRow[]>,
    [data, window]
  );
  const rows = all[url.cm];
  const summary = useMemo(() => ({ meanAlpha: meanAbsAlpha(rows), r2: crossR2(rows), grs: grs(data, window, url.cm) }), [rows, data, window, url.cm]);
  const extent = useMemo(() => {
    const v = CROSS_MODELS.flatMap((m) => all[m].flatMap((r) => [r.predicted, r.realised]));
    return [Math.min(...v, 0), Math.max(...v)] as [number, number];
  }, [all]);
  const selected = rows.find((r) => r.label === url.csel) ?? null;
  return { model: url.cm, setModel: (cm: CrossModel) => setUrl({ cm }), rows, all, summary, extent, selected, select: (csel: string) => setUrl({ csel }) };
}
export type CrossModelState = ReturnType<typeof useCrossTab>;
