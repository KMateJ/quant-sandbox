import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import type { PriceComparisonPoint } from "../heston.types";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

type Props = {
  data: PriceComparisonPoint[];
  strike: number;
};

export default function HestonPriceComparisonChart({
  data,
  strike,
}: Props) {
  const maxPrice =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.bs, d.heston)))
      : 1;

  const yMax = Number((maxPrice * 1.1).toFixed(4));
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = [
    { key: "bs", label: t("hestonSeriesBs"), color: SERIES_ROLE.reference, strokeWidth: 2 },
    { key: "heston", label: t("hestonSeriesHestonMcSmoothed"), color: SERIES_ROLE.candidate, strokeWidth: 2 },
  ];

  return (
    <ChartContainer
      title={t("hestonPriceComparisonTitle")}
      actions={<IntuitionTrigger sectionId="spot-strike" />}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="S"
          series={series}
          yDomain={[0, yMax]}
          referenceLines={[
            { axis: "x", value: strike, color: CHART_COLORS.axis, dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `S = ${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
    </ChartContainer>
  );
}