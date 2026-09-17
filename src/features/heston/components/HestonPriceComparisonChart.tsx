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
import type { PriceComparisonPoint } from "../heston.types";
import { useI18n } from "../../../i18n";

type Props = {
  data: PriceComparisonPoint[];
  strike: number;
};

export default function HestonPriceComparisonChart({
  data,
  strike,
}: Props) {
  const maxPrice =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.bs, d.heston)))
      : 1;

  const yMax = Number((maxPrice * 1.1).toFixed(4));
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const dismissRef = useChartTouchDismiss<HTMLDivElement>();

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonPriceComparisonTitle")}
    >
      <div className="chart-wrap" ref={dismissRef}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargin(isMobile)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="S" stroke="#94a3b8" tick={axisTickStyle(isMobile)} />
            <YAxis
              stroke="#94a3b8"
              domain={[0, yMax]}
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
                return [numericValue.toFixed(3), String(name)];
              }}
              labelFormatter={(label) => `S = ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="bs"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Black–Scholes"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="heston"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Heston (MC, smoothed)"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}