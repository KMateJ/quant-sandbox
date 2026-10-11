import { useMemo } from "react";
import { LineChart, SERIES_ROLE } from "../../components/charts";
import type { ChartDatum, ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { candidateCurve, referenceCurve } from "./scalingLaws.math";
import type { ScaleMode, ScalingPoint } from "./scalingLaws.types";

type Props = {
  points: ScalingPoint[];
  alpha: number;
  mode: ScaleMode;
};

const LOG10 = (value: number) => Math.log(value) / Math.LN10;

/// Empirical spread of Sₙ against the √n law and an adjustable nᵃ candidate.
/// On log–log axes a power law is a straight line, so the slope reveals the exponent.
export default function ScalingChart({ points, alpha, mode }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const log = mode === "loglog";

  const rows: ChartDatum[] = useMemo(() => {
    const reference = referenceCurve(points);
    const candidate = candidateCurve(points, alpha);
    return points.map((point, index) => {
      const x = log ? LOG10(point.n) : point.n;
      const scale = (value: number) => (log ? LOG10(value) : value);
      return {
        x,
        empirical: scale(point.empirical),
        reference: scale(reference[index]),
        candidate: scale(candidate[index]),
      };
    });
  }, [points, alpha, log]);

  const series: ChartSeries[] = [
    { key: "empirical", label: t("stochSqrtEmpiricalSeries"), color: SERIES_ROLE.empirical, strokeWidth: 2 },
    { key: "reference", label: t("stochSqrtReferenceSeries"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
    { key: "candidate", label: t("stochSqrtCandidateSeries"), color: SERIES_ROLE.candidate, strokeWidth: 2, dash: "2 4" },
  ];

  const format = (value: number) => (log ? (10 ** value).toFixed(2) : value.toFixed(2));
  const tooltipLabel = (x: number) =>
    log ? `n = ${(10 ** x).toFixed(0)}` : `n = ${x.toFixed(0)}`;

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochSqrtChartTitle")}
      actions={<span className="stoch-chart-readout">{t(log ? "stochScaleLogLog" : "stochScaleLinear")}</span>}
    >
      <div className="stoch-path-chart">
        <LineChart
          data={rows}
          xKey="x"
          series={series}
          isMobile={isMobile}
          tooltipLabel={tooltipLabel}
          valueFormat={format}
        />
      </div>
      <p className="stoch-chart-caption">{t("stochSqrtChartCaption")}</p>
    </ChartContainer>
  );
}
