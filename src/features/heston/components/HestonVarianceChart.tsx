import { useMemo } from "react";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import type { HestonPathPoint } from "../heston.types";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

const lineColors = [
  "#1d4ed8",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

type Props = {
  data: HestonPathPoint[];
  pathKeys: string[];
  theta: number;
};

export default function HestonVarianceChart({
  data,
  pathKeys,
  theta,
}: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const series = useMemo<ChartSeries[]>(
    () =>
      pathKeys.map((key, index) => ({
        key,
        label: key,
        color: lineColors[index % lineColors.length],
        strokeWidth: 2,
      })),
    [pathKeys]
  );

  return (
    <ChartContainer
      title={t("hestonVariancePathsTitle")}
      actions={<IntuitionTrigger sectionId="mean-reversion" />}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="t"
          series={series}
          referenceLines={[
            { axis: "y", value: theta, color: "#94a3b8", dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `t = ${x}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
    </ChartContainer>
  );
}