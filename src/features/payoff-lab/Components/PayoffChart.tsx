import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionCard from "../../../components/SectionCard";
import type { PayoffChartPoint, ViewMode } from "../payoff.types";
import { getYAxisDomain } from "../payoff.math";
import { useI18n } from "../../../i18n";

type PayoffChartProps = {
  chartData: PayoffChartPoint[];
  strikes: number[];
  xDomain: [number, number];
  mode: ViewMode;
  showComponents: boolean;
  syntheticOverlayActive: boolean;
  syntheticOverlayLabel: string | null;
  chartOpen: boolean;
  onToggleChart: () => void;
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
  chartOpen,
  onToggleChart,
}: PayoffChartProps) {
  const { language, t } = useI18n();

  const yDomain = useMemo(() => getYAxisDomain(chartData), [chartData]);

  const componentKeys = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter((key) => key.startsWith("leg-"));
  }, [chartData]);

  const overlayStatusText = syntheticOverlayActive
    ? language === "hu"
      ? `overlay: ${syntheticOverlayLabel ?? "synthetic"}`
      : `overlay: ${syntheticOverlayLabel ?? "synthetic"}`
    : t("payoffChartOverlayInactive");

  return (
    <SectionCard
      className="chart-card"
      title={t("payoffChartTitle")}
      subtitle={t("payoffChartSubtitle")}
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleChart}>
          {chartOpen ? "-" : "+"}
        </button>
      }
    >
      {chartOpen ? (
        <div className="chart-wrap" style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="profitZeroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />

              <XAxis
                dataKey="S"
                type="number"
                domain={xDomain}
                tickCount={8}
                stroke="#94a3b8"
              />

              <YAxis domain={yDomain} tickCount={7} stroke="#94a3b8" />

              {strikes.map((strike) => (
                <ReferenceLine
                  key={strike}
                  x={strike}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
              ))}

              <ReferenceLine
                y={0}
                stroke={mode === "profit" ? "#ef4444" : "#64748b"}
                strokeWidth={mode === "profit" ? 2.5 : 1.5}
                strokeDasharray={mode === "profit" ? "" : "4 4"}
              />

              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value, name) => {
                  const numericValue =
                    typeof value === "number" ? value : Number(value ?? 0);
                  return [numericValue.toFixed(3), String(name)];
                }}
                labelFormatter={(label) => `${t("payoffChartTooltipLabel")}${label}`}
              />

              <Legend />

              {mode === "profit" && (
                <Area
                  type="monotone"
                  dataKey="total"
                  name=""
                  stroke="none"
                  fill="url(#profitZeroGradient)"
                  fillOpacity={1}
                  baseLine={0}
                  isAnimationActive={false}
                  legendType="none"
                />
              )}

              <Line
                type="monotone"
                dataKey="total"
                name={t("payoffChartTotal")}
                dot={false}
                stroke="#60a5fa"
                strokeWidth={3}
                isAnimationActive={false}
              />

              {showComponents &&
                componentKeys.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key.replace("leg-", t("payoffChartLegPrefix"))}
                    dot={false}
                    stroke={lineColors[(index + 1) % lineColors.length]}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    isAnimationActive={false}
                  />
                ))}

              {syntheticOverlayActive && (
                <Line
                  type="monotone"
                  dataKey="syntheticOverlay"
                  name={syntheticOverlayLabel ?? "Synthetic Overlay"}
                  dot={false}
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  strokeDasharray="3 3"
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="param-summary">
          <div>
            {chartData.length} {t("payoffChartPoints")}
          </div>
          <div>
            {strikes.length} {t("payoffChartStrikeMarkers")}
          </div>
          <div>{overlayStatusText}</div>
        </div>
      )}
    </SectionCard>
  );
}
