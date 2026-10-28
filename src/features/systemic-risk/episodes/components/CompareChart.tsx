import { useCallback, useMemo, useState } from "react";
import { LineChart } from "../../../../components/charts";
import { usePinnedSeries } from "../../../../components/charts/usePinnedSeries";
import { ChartContainer } from "../../../../components/layout";
import { SegmentedControl } from "../../../../components/ui";
import PinButton from "../../../../components/ui/PinButton";
import { useI18n } from "../../../../i18n";
import type { EpisodesPage } from "../useEpisodesPage";

type Metric = "defaults" | "loss";

/// Failures or cumulative loss by model day: as happened (model) against the current what-if, with pin for more runs.
export default function CompareChart({ page }: { page: EpisodesPage }) {
  const { t } = useI18n();
  const [metric, setMetric] = useState<Metric>("defaults");
  const whatIf = page.off.size > 0;
  const happenedKey = metric;
  const whatIfKey = metric === "defaults" ? "wDefaults" : "wLoss";
  const series = useMemo(
    () => [
      { key: happenedKey, label: t("syrEpSeriesHappened"), color: "var(--chart-1)", strokeWidth: 2.4 },
      ...(whatIf ? [{ key: whatIfKey, label: t("syrEpSeriesWhatIf"), color: "var(--chart-4)", strokeWidth: 2.4, dash: "5 3" }] : []),
    ],
    [happenedKey, whatIfKey, whatIf, t],
  );
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedSeries(page.rows, "day", series, ghostLabel);
  const fmt = (v: number) => v.toFixed(0);
  return (
    <ChartContainer
      title={t("syrEpChartTitle")}
      height={230}
      actions={
        <>
          <SegmentedControl<Metric>
            ariaLabel={t("syrEpMetricAria")}
            value={metric}
            onChange={setMetric}
            options={[{ value: "defaults", label: t("syrEpMetricFailures") }, { value: "loss", label: t("syrEpMetricLoss") }]}
          />
          <PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />
        </>
      }
    >
      <LineChart
        data={pin.data}
        xKey="day"
        series={pin.series}
        xDomain={[0, page.steps]}
        curve="linear"
        referenceLines={[{ axis: "x", value: page.playback.step, color: "var(--muted)", dash: "4 3" }]}
        tooltipLabel={(x) => t("syrEpDayValue", { day: x })}
        yFormat={fmt}
        valueFormat={fmt}
      />
    </ChartContainer>
  );
}
