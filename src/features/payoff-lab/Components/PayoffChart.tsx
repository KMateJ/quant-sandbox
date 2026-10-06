import { useMemo } from "react";
import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartReferenceLine, type ChartSeries } from "../../../components/charts";
import type { PayoffChartPoint, ViewMode } from "../payoff.types";
import { getYAxisDomain } from "../payoff.math";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

type PayoffChartProps = {
  chartData: PayoffChartPoint[];
  strikes: number[];
  xDomain: [number, number];
  mode: ViewMode;
  showComponents: boolean;
  syntheticOverlayActive: boolean;
  syntheticOverlayLabel: string | null;
};

const lineColors = [
  "#60a5fa",
  "#fbbf24",
  "#34d399",
  "#f472b6",
  "#a78bfa",
  "#f87171",
  "#22d3ee",
];

export default function PayoffChart({
  chartData,
  strikes,
  xDomain,
  mode,
  showComponents,
  syntheticOverlayActive,
  syntheticOverlayLabel,
}: PayoffChartProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const yDomain = useMemo(() => getYAxisDomain(chartData), [chartData]);

  const componentKeys = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter((key) => key.startsWith("leg-"));
  }, [chartData]);

  const series = useMemo<ChartSeries[]>(() => {
    const list: ChartSeries[] = [
      {
        key: "total",
        intuitionSectionId: "payoff-profit",
        label: t("payoffChartTotal"),
        color: "#60a5fa",
        strokeWidth: 3,
        area: mode === "profit",
        areaColor: "#ef4444",
      },
    ];

    if (showComponents) {
      componentKeys.forEach((key, index) => {
        list.push({
          key,
          label: key.replace("leg-", t("payoffChartLegPrefix")),
          color: lineColors[(index + 1) % lineColors.length],
          strokeWidth: 2,
          dash: "6 4",
        });
      });
    }

    if (syntheticOverlayActive) {
      list.push({
        key: "syntheticOverlay",
        intuitionSectionId: "synthetic-strategies",
        label: syntheticOverlayLabel ?? "Synthetic Overlay",
        color: "#fbbf24",
        strokeWidth: 2.5,
        dash: "3 3",
      });
    }

    return list;
  }, [
    t,
    mode,
    showComponents,
    componentKeys,
    syntheticOverlayActive,
    syntheticOverlayLabel,
  ]);

  const referenceLines = useMemo<ChartReferenceLine[]>(() => {
    const lines: ChartReferenceLine[] = strikes.map((strike) => ({
      axis: "x",
      value: strike,
      color: "#94a3b8",
      dash: "4 4",
    }));
    lines.push({
      axis: "y",
      value: 0,
      color: mode === "profit" ? "#ef4444" : "#64748b",
      width: mode === "profit" ? 2.5 : 1.5,
      dash: mode === "profit" ? undefined : "4 4",
    });
    return lines;
  }, [strikes, mode]);

  return (
    <SectionCard className="chart-card" title={t("payoffChartTitle")} headerRight={<IntuitionTrigger sectionId="instruments" />}>
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
