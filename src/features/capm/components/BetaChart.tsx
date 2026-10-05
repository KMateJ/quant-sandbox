import { ScatterChart } from "../../../components/charts";
import type { ChartReferenceLine, ScatterSeries } from "../../../components/charts";
import type { Regression } from "../../../lib/stats/regression";
import { useI18n } from "../../../i18n";
import type { BetaObservation } from "../capm.types";
import { CAPM_COLORS } from "../capm.colors";

type Props = {
  observations: BetaObservation[];
  regression: Regression;
  isMobile: boolean;
};

const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

/// Regression scatter showing that beta is the slope of asset returns on market returns.
export default function BetaChart({ observations, regression, isMobile }: Props) {
  const { t } = useI18n();

  const xs = observations.map((o) => o.market);
  const ys = observations.map((o) => o.asset);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yLo = Math.min(0, ...ys);
  const yHi = Math.max(0, ...ys);

  const line = [xMin, xMax].map((x) => ({
    x,
    y: regression.intercept + regression.slope * x,
  }));

  const series: ScatterSeries[] = [
    {
      key: "obs",
      label: t("capmObsLabel"),
      color: CAPM_COLORS.capmPoint,
      radius: 4,
      opacity: 0.6,
      points: observations.map((o) => ({ x: o.market, y: o.asset })),
    },
    {
      key: "fit",
      label: t("capmRegressionLabel"),
      color: CAPM_COLORS.sml,
      line: true,
      strokeWidth: 2.5,
      points: line,
    },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: 0, color: CAPM_COLORS.guide, dash: "2 4" },
    { axis: "y", value: 0, color: CAPM_COLORS.guide, dash: "2 4" },
  ];

  return (
    <ScatterChart
      series={series}
      xDomain={[Math.min(0, xMin) * 1.1, xMax * 1.1]}
      yDomain={[yLo * 1.1, yHi * 1.1]}
      referenceLines={referenceLines}
      isMobile={isMobile}
      xFormat={pct}
      yFormat={pct}
      xLabel={t("capmMarketLabel")}
      yLabel={t("capmActualLabel")}
    />
  );
}
