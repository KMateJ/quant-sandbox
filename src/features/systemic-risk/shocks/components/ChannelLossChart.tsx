import { useMemo } from "react";
import { LineChart } from "../../../../components/charts";
import { SERIES_PALETTE } from "../../../../components/charts/chart.theme";
import { ChartContainer } from "../../../../components/layout";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { CHANNEL_KEYS, type ChartRows } from "../shocks.math";

const LOSS_KEY = { direct: "direct", fireSales: "fireSale", funding: "funding", ccp: "ccp" } as const;

type Props = { rows: ChartRows["losses"]; cursor: number; steps: number };

/// Cumulative losses ($bn) by contagion channel, one named line per channel.
export default function ChannelLossChart({ rows, cursor, steps }: Props) {
  const { t } = useI18n();
  const series = useMemo(() => CHANNEL_KEYS.map((k, i) => ({
    key: LOSS_KEY[k], label: t(`syrShockCh_${k}` as TranslationKey), color: SERIES_PALETTE[i], strokeWidth: 2,
  })), [t]);
  return (
    <ChartContainer title={t("syrShockLossTitle")} height={240}>
      <LineChart
        data={rows}
        xKey="day"
        series={series}
        xDomain={[0, steps]}
        curve="linear"
        referenceLines={[{ axis: "x", value: cursor, color: "var(--muted)", dash: "4 3" }]}
        xFormat={(v) => t("syrShockDay", { day: v })}
        yFormat={(v) => `$${v}bn`}
        valueFormat={(v) => `$${v.toFixed(1)}bn`}
        tooltipLabel={(x) => t("syrShockDay", { day: x })}
      />
    </ChartContainer>
  );
}
