import { useCallback } from "react";
import { usePinnedSeries } from "../../components/charts";
import type { ChartDatum, ChartSeries } from "../../components/charts";
import { useI18n } from "../../i18n";

/// Pin & compare for a studio curve chart: `pinned` are the series frozen on Pin (labelled `pinLabel`, e.g. the
/// current parameters, when given); `fixed` are drawn live only (e.g. a reference density that never moves).
export function usePinnedCurves(data: ChartDatum[], pinned: ChartSeries[], fixed: ChartSeries[] = [], pinLabel?: string) {
  const { t } = useI18n();
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const labelled = pinLabel ? pinned.map((s) => ({ ...s, label: `${s.label} · ${pinLabel}` })) : pinned;
  const pin = usePinnedSeries(data, "x", labelled, ghostLabel);
  return { ...pin, series: [...pin.series.slice(0, pin.series.length - labelled.length), ...pinned, ...fixed] };
}
