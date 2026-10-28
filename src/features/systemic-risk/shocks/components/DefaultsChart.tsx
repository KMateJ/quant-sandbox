import { useCallback, useMemo } from "react";
import { LineChart } from "../../../../components/charts";
import { usePinnedSeries } from "../../../../components/charts/usePinnedSeries";
import { ChartContainer } from "../../../../components/layout";
import PinButton from "../../../../components/ui/PinButton";
import { useI18n } from "../../../../i18n";
import type { ChartRows } from "../shocks.math";

type Props = { rows: ChartRows["defaults"]; cursor: number; steps: number };

/// Share of institutions failed over the days, with "Pin" to keep this run as a ghost while the setup changes.
export default function DefaultsChart({ rows, cursor, steps }: Props) {
  const { t } = useI18n();
  const series = useMemo(() => [{ key: "pct", label: t("syrShockDefaultsSeries"), color: "var(--chart-4)", strokeWidth: 2.4 }], [t]);
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedSeries(rows, "day", series, ghostLabel);
  return (
    <ChartContainer title={t("syrShockDefaultsTitle")} height={240} actions={<PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />}>
      <LineChart
        data={pin.data}
        xKey="day"
        series={pin.series}
        xDomain={[0, steps]}
        yDomain={[0, 100]}
        curve="linear"
        referenceLines={[{ axis: "x", value: cursor, color: "var(--muted)", dash: "4 3" }]}
        xFormat={(v) => t("syrShockDay", { day: v })}
        yFormat={(v) => `${v}%`}
        valueFormat={(v) => `${v.toFixed(0)}%`}
        tooltipLabel={(x) => t("syrShockDay", { day: x })}
      />
    </ChartContainer>
  );
}
