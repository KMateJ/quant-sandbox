import type { ReactNode } from "react";
import { LineChart, SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { DensityPoint } from "./rescaledWalk.types";

type Props = {
  data: DensityPoint[];
  title: string;
  actions?: ReactNode;
  caption?: string;
};

/// Empirical density of a standardised sample against the standard-normal density.
export default function DensityComparisonChart({ data, title, actions, caption }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = [
    {
      key: "empirical",
      label: t("stochEmpiricalDensity"),
      color: SERIES_ROLE.empirical,
      strokeWidth: 1.5,
      area: true,
      areaColor: SERIES_ROLE.empirical,
    },
    {
      key: "normal",
      label: t("stochNormalDensity"),
      color: SERIES_ROLE.candidate,
      strokeWidth: 2,
      dash: "6 4",
    },
  ];
  return (
    <ChartContainer className="stoch-distribution-frame" title={title} actions={actions}>
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
      {caption && <p className="stoch-chart-caption">{caption}</p>}
    </ChartContainer>
  );
}
