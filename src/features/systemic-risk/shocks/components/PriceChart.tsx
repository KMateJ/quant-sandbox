import { useMemo } from "react";
import { LineChart } from "../../../../components/charts";
import { SERIES_PALETTE } from "../../../../components/charts/chart.theme";
import { ChartContainer } from "../../../../components/layout";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { ASSET_ORDER, type ChartRows } from "../shocks.math";

type Props = { rows: ChartRows["prices"]; cursor: number; steps: number };

/// Asset prices as a percentage of their starting level.
export default function PriceChart({ rows, cursor, steps }: Props) {
  const { t } = useI18n();
  const series = useMemo(() => ASSET_ORDER.map((a, i) => ({
    key: a, label: t(`syrShockAsset_${a}` as TranslationKey), color: SERIES_PALETTE[i], strokeWidth: 2,
  })), [t]);
  return (
    <ChartContainer title={t("syrShockPriceTitle")} height={240}>
      <LineChart
        data={rows}
        xKey="day"
        series={series}
        xDomain={[0, steps]}
        yDomain={[40, 100]}
        curve="linear"
        referenceLines={[{ axis: "x", value: cursor, color: "var(--muted)", dash: "4 3" }]}
        xFormat={(v) => t("syrShockDay", { day: v })}
        yFormat={(v) => `${v}%`}
        valueFormat={(v) => `${v.toFixed(1)}%`}
        tooltipLabel={(x) => t("syrShockDay", { day: x })}
      />
    </ChartContainer>
  );
}
