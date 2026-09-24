import { useState } from "react";
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
import { useMediaQuery } from "../../../components/useMediaQuery";
import {
  axisTickStyle,
  chartMargin,
  useChartTouchDismiss,
  yAxisWidth,
} from "../../../components/chartConfig";
import { useI18n } from "../../../i18n";
import type { GreekKey, HestonGreekProfilePoint } from "../heston.types";

type Props = {
  data: HestonGreekProfilePoint[];
  strike: number;
};

const METRICS: { key: GreekKey; label: string }[] = [
  { key: "delta", label: "Delta" },
  { key: "gamma", label: "Gamma" },
  { key: "vega", label: "Vega" },
  { key: "theta", label: "Theta" },
  { key: "rho", label: "Rho" },
];

export default function HestonGreeksChart({ data, strike }: Props) {
  const { language } = useI18n();
  const isHu = language === "hu";
  const isMobile = useMediaQuery("(max-width: 640px)");
  const dismissRef = useChartTouchDismiss<HTMLDivElement>();

  const [metric, setMetric] = useState<GreekKey>("delta");
  const [showBs, setShowBs] = useState(true);
  const [showHeston, setShowHeston] = useState(true);

  const bsKey = `${metric}_bs`;
  const hestonKey = `${metric}_heston`;

  return (
    <SectionCard
      className="chart-card"
      title={isHu ? "Görögök az árfolyam mentén" : "Greeks across spot"}
      subtitle={
        isHu
          ? "Válaszd ki a görögöt, és kapcsold be/ki a modelleket"
          : "Pick a Greek and toggle each model on or off"
      }
    >
      <div className="metric-switch greeks-chart-switch">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            className={metric === m.key ? "metric-button active" : "metric-button"}
            onClick={() => setMetric(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="metric-switch greeks-chart-switch">
        <button
          type="button"
          className={showBs ? "metric-button active" : "metric-button"}
          aria-pressed={showBs}
          onClick={() => setShowBs((v) => !v)}
        >
          Black–Scholes
        </button>
        <button
          type="button"
          className={showHeston ? "metric-button active" : "metric-button"}
          aria-pressed={showHeston}
          onClick={() => setShowHeston((v) => !v)}
        >
          Heston
        </button>
      </div>

      <div className="chart-wrap" ref={dismissRef}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin(isMobile)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="S" stroke="#94a3b8" tick={axisTickStyle(isMobile)} />
            <YAxis
              stroke="#94a3b8"
              width={yAxisWidth(isMobile)}
              tick={axisTickStyle(isMobile)}
            />
            <ReferenceLine x={strike} stroke="#94a3b8" strokeDasharray="4 4" />
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
                return [numericValue.toFixed(4), String(name)];
              }}
              labelFormatter={(label) => `S = ${label}`}
            />
            <Legend />
            {showBs ? (
              <Line
                type="monotone"
                dataKey={bsKey}
                stroke="#3b82f6"
                strokeWidth={2}
                name="Black–Scholes"
                dot={false}
                isAnimationActive={false}
              />
            ) : null}
            {showHeston ? (
              <Line
                type="monotone"
                dataKey={hestonKey}
                stroke="#f59e0b"
                strokeWidth={2}
                name="Heston (MC)"
                dot={false}
                isAnimationActive={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
