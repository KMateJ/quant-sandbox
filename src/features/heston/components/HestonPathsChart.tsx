import { useMemo } from "react";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { ChartContainer } from "../../../components/layout";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../components/charts";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import type { HestonPathPoint } from "../heston.types";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

type Props = {
  data: HestonPathPoint[];
  pathKeys: string[];
  strike: number;
};

export default function HestonPathsChart({
  data,
  pathKeys,
  strike,
}: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const series = useMemo<ChartSeries[]>(
    () =>
      pathKeys.map((key, index) => ({
        key,
        label: key,
        color: SERIES_PALETTE[index % SERIES_PALETTE.length],
        strokeWidth: 2,
      })),
    [pathKeys]
  );

  return (
    <ChartContainer
      title={t("hestonStockPathsTitle")}
      actions={<IntuitionTrigger sectionId="visual-paths" />}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="t"
          series={series}
          referenceLines={[
            { axis: "y", value: strike, color: CHART_COLORS.axis, dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `t = ${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
    </ChartContainer>
  );
}
