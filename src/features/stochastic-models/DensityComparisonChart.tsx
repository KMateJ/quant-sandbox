import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { DensityPoint } from "./rescaledWalk.types";

type Props = { data: DensityPoint[] };

/// Empirical density of W⁽ⁿ⁾(1) against the standard-normal limit density.
export default function DensityComparisonChart({ data }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = [
    {
      key: "empirical",
      label: t("stochEmpiricalDensity"),
      color: "#60a5fa",
      strokeWidth: 1.5,
      area: true,
      areaColor: "#60a5fa",
    },
    {
      key: "normal",
      label: t("stochNormalDensity"),
      color: "#f59e0b",
      strokeWidth: 2,
      dash: "6 4",
    },
  ];
  return (
    <ChartContainer className="stoch-distribution-frame" title={t("stochRescaledDensity")}>
      <div className="stoch-density-chart">
        <LineChart
          data={data}
          xKey="x"
          series={series}
          xDomain={[-4, 4]}
          isMobile={isMobile}
          tooltipLabel={(x) => `x = ${x.toFixed(2)}`}
          valueFormat={(value) => value.toFixed(3)}
        />
      </div>
    </ChartContainer>
  );
}
