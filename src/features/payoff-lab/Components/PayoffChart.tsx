import { useMemo } from "react";
import {
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
import type { PayoffChartPoint } from "../payoff.types";
import { getYAxisDomain } from "../payoff.math";

type PayoffChartProps = {
  chartData: PayoffChartPoint[];
  strikes: number[];
  showComponents: boolean;
  syntheticDetected: boolean;
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
  showComponents,
  syntheticDetected,
  chartOpen,
  onToggleChart,
}: PayoffChartProps) {
  const yDomain = useMemo(() => getYAxisDomain(chartData), [chartData]);

  const componentKeys = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter(
      (key) => key.startsWith("leg-")
    );
  }, [chartData]);

  return (
    <SectionCard
      className="chart-card"
      title="Kifizetési diagram"
      subtitle="A stratégia lejáratkori alakja"
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleChart}>
          {chartOpen ? "Összecsukás" : "Megjelenítés"}
        </button>
      }
    >
      {chartOpen ? (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />

              <XAxis
                dataKey="S"
                type="number"
                domain={[10, 200]}
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

              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 4" />

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
                labelFormatter={(label) => `S = ${label}`}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="total"
                name="Összesített"
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
                    name={key.replace("leg-", "Láb ")}
                    dot={false}
                    stroke={lineColors[(index + 1) % lineColors.length]}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    isAnimationActive={false}
                  />
                ))}

              {syntheticDetected && (
                <Line
                  type="monotone"
                  dataKey="syntheticForward"
                  name="Synthetic Forward"
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
          <div>{chartData.length} pont</div>
          <div>{strikes.length} strike marker</div>
          <div>{syntheticDetected ? "synthetic overlay aktív" : "nincs overlay"}</div>
        </div>
      )}
    </SectionCard>
  );
}