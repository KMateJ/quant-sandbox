import { useMemo } from "react";
import { ChartContainer } from "../../../components/layout";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { DeltaHedgingModel } from "../useDeltaHedging";

const num2 = (v: number) => v.toFixed(2);

/// Two charts on the same time axis: the stock against the strike, and the delta actually held
/// (steps) against the continuous Black–Scholes delta.
export default function HedgePathCharts({ model }: { model: DeltaHedgingModel }) {
  const { t } = useI18n();
  const { result, heldSteps, params, isMobile } = model;

  const stockData = useMemo(() => result.rows.map((r) => ({ t: r.t, S: r.S })), [result]);
  const deltaData = useMemo(
    () => [...result.rows.map((r) => ({ t: r.t, deltaTrue: r.deltaTrue })), ...heldSteps].sort((a, b) => a.t - b.t),
    [result, heldSteps],
  );

  const stockSeries: ChartSeries[] = [{ key: "S", label: t("deltaHedgingStockLabel"), color: SERIES_PALETTE[0], strokeWidth: 2 }];
  const deltaSeries: ChartSeries[] = [
    { key: "deltaTrue", label: t("deltaHedgingDeltaTrueLabel"), color: SERIES_ROLE.reference, strokeWidth: 1.5, dash: "5 4" },
    { key: "deltaHeld", label: t("deltaHedgingDeltaHeldLabel"), color: SERIES_ROLE.candidate, strokeWidth: 2 },
  ];
  const tooltipLabel = (x: number) => `t = ${x.toFixed(2)}`;

  return (
    <div className="dh-pair">
      <ChartContainer title={t("deltaHedgingStockChartTitle")} actions={<IntuitionTrigger sectionId="random-path" />}>
        <div className="dh-chart">
          <LineChart
            data={stockData}
            xKey="t"
            series={stockSeries}
            xDomain={[0, params.maturity]}
            referenceLines={[{ axis: "y", value: params.strike, color: CHART_COLORS.axis, dash: "4 4" }]}
            isMobile={isMobile}
            curve="linear"
            tooltipLabel={tooltipLabel}
            valueFormat={num2}
          />
        </div>
      </ChartContainer>

      <ChartContainer title={t("deltaHedgingDeltaChartTitle")} actions={<IntuitionTrigger sectionId="delta" />}>
        <div className="dh-chart">
          <LineChart
            data={deltaData}
            xKey="t"
            series={deltaSeries}
            xDomain={[0, params.maturity]}
            yDomain={[0, 1]}
            isMobile={isMobile}
            curve="linear"
            tooltipLabel={tooltipLabel}
            valueFormat={(v) => v.toFixed(3)}
          />
        </div>
      </ChartContainer>
    </div>
  );
}
