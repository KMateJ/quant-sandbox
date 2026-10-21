import { useMemo } from "react";
import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ChartSeries } from "../../../components/charts";
import type { ChartComponent, PayoffChartPoint, ViewMode } from "../payoff.types";
import { getYAxisDomain } from "../payoff.math";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

type PayoffChartProps = {
  chartData: PayoffChartPoint[];
  strikes: number[];
  xDomain: [number, number];
  mode: ViewMode;
  /// Stand-alone legs and positions drawn as their own dashed curves (empty = total only).
  components: ChartComponent[];
  syntheticOverlayActive: boolean;
  syntheticOverlayLabel: string | null;
};

export default function PayoffChart({
  chartData,
  strikes,
  xDomain,
  mode,
  components,
  syntheticOverlayActive,
  syntheticOverlayLabel,
}: PayoffChartProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const yDomain = useMemo(() => getYAxisDomain(chartData), [chartData]);

  const series = useMemo<ChartSeries[]>(() => {
    const list: ChartSeries[] = [
      {
        key: "total",
        intuitionSectionId: "payoff-profit",
        label: t("payoffChartTotal"),
        color: SERIES_PALETTE[0],
        strokeWidth: 3,
        area: mode === "profit",
        areaColor: "var(--negative)",
      },
    ];

    components.forEach((component, index) => {
      const isPosition = component.key.startsWith("pos-");
      list.push({
        key: component.key,
        label: component.label,
        color: SERIES_PALETTE[(index + 1) % SERIES_PALETTE.length],
        strokeWidth: isPosition ? 2.5 : 2,
        dash: isPosition ? undefined : "6 4",
      });
    });

    if (syntheticOverlayActive) {
      list.push({
        key: "syntheticOverlay",
        intuitionSectionId: "synthetic-strategies",
        label: syntheticOverlayLabel ?? t("payoffChartSyntheticFallback"),
        color: SERIES_ROLE.candidate,
        strokeWidth: 2.5,
        dash: "3 3",
      });
    }

    return list;
  }, [
    t,
    mode,
    components,
    syntheticOverlayActive,
    syntheticOverlayLabel,
  ]);

  const referenceLines = useMemo<ChartReferenceLine[]>(() => {
    const lines: ChartReferenceLine[] = strikes.map((strike) => ({
      axis: "x",
      value: strike,
      color: CHART_COLORS.axis,
      dash: "4 4",
    }));
    lines.push({
      axis: "y",
      value: 0,
      color: mode === "profit" ? "var(--negative)" : CHART_COLORS.axis,
      width: mode === "profit" ? 2.5 : 1.5,
      dash: mode === "profit" ? undefined : "4 4",
    });
    return lines;
  }, [strikes, mode]);

  return (
    <SectionCard className="chart-card payoff-chart-card" title={t("payoffChartTitle")} headerRight={<IntuitionTrigger sectionId="instruments" />}>
      <div className="chart-wrap">
        <LineChart
          data={chartData}
          xKey="S"
          series={series}
          xDomain={xDomain}
          yDomain={yDomain}
          referenceLines={referenceLines}
          isMobile={isMobile}
          tooltipLabel={(x) => `${t("payoffChartTooltipLabel")}${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
    </SectionCard>
  );
}
