import { useMemo } from "react";
import { ChartContainer } from "../../../components/layout";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../components/charts";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { DeltaHedgingModel } from "../useDeltaHedging";

/// The hedged book marked to market: replicating portfolio minus option value along the path.
/// A perfect hedge would stay on the zero line.
export default function HedgeErrorChart({ model }: { model: DeltaHedgingModel }) {
  const { t } = useI18n();
  const { result, params, isMobile } = model;

  const data = useMemo(() => result.rows.map((r) => ({ t: r.t, error: r.error })), [result]);
  const edge = Math.max(result.maxAbsError * 1.15, 0.05);
  const series: ChartSeries[] = [
    { key: "error", label: t("deltaHedgingErrorLabel"), color: SERIES_PALETTE[0], strokeWidth: 2, area: true },
  ];

  return (
    <ChartContainer title={t("deltaHedgingErrorChartTitle")} actions={<IntuitionTrigger sectionId="hedge-error" />}>
      <div className="dh-chart dh-chart--wide">
        <LineChart
          data={data}
          xKey="t"
          series={series}
          xDomain={[0, params.maturity]}
          yDomain={[-edge, edge]}
          referenceLines={[{ axis: "y", value: 0, color: CHART_COLORS.axis, width: 1.5 }]}
          isMobile={isMobile}
          curve="linear"
          legend={false}
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <p className="dh-caption">{t("deltaHedgingErrorCaption", { n: result.rebalances })}</p>
    </ChartContainer>
  );
}
