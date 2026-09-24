import {
  CartesianGrid,
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
import type { HestonPathPoint } from "../heston.types";
import { useI18n } from "../../../i18n";

const lineColors = [
  "#1d4ed8",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

type Props = {
  data: HestonPathPoint[];
  pathKeys: string[];
  theta: number;
};

export default function HestonVarianceChart({
  data,
  pathKeys,
  theta,
}: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const dismissRef = useChartTouchDismiss<HTMLDivElement>();

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonVariancePathsTitle")}
    >
      <div className="chart-wrap" ref={dismissRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={chartMargin(isMobile)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="t" stroke="#94a3b8" tick={axisTickStyle(isMobile)} />
              <YAxis
                stroke="#94a3b8"
                width={yAxisWidth(isMobile)}
                tick={axisTickStyle(isMobile)}
              />
              <ReferenceLine y={theta} stroke="#94a3b8" strokeDasharray="4 4" />
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
                labelFormatter={(label) => `t = ${label}`}
              />
              {pathKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  dot={false}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
    </SectionCard>
  );
}