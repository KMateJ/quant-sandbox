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
import type { SmilePoint } from "../heston.types";
import { useI18n } from "../../../i18n";

type Props = {
  data: SmilePoint[];
  strikeRatio: number;
};

export default function HestonSmileChart({ data, strikeRatio }: Props) {
  const minIv =
    data.length > 0
      ? Math.min(...data.map((d) => Math.min(d.bsIv, d.hestonIv)))
      : 0;

  const maxIv =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.bsIv, d.hestonIv)))
      : 1;

  const yMin = Number(Math.max(0, minIv - 0.03).toFixed(4));
  const yMax = Number((maxIv + 0.03).toFixed(4));
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const dismissRef = useChartTouchDismiss<HTMLDivElement>();

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonSmileTitle")}
    >
      <div className="chart-wrap" ref={dismissRef}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin(isMobile)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="moneyness" stroke="#94a3b8" tick={axisTickStyle(isMobile)} />
            <YAxis
              stroke="#94a3b8"
              domain={[yMin, yMax]}
              width={yAxisWidth(isMobile)}
              tick={axisTickStyle(isMobile)}
            />
            <ReferenceLine
              x={strikeRatio}
              stroke="#94a3b8"
              strokeDasharray="4 4"
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
                return [numericValue.toFixed(4), String(name)];
              }}
              labelFormatter={(label) => `K / S₀ = ${label}`}
            />
            <Legend />
            <Line
              dataKey="bsIv"
              name="BS implied vol"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="hestonIv"
              name="Heston implied vol"
              stroke="#f59e0b"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}