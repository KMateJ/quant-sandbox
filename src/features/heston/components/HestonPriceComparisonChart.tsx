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
import type { PriceComparisonPoint } from "../heston.types";

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

  return (
    <SectionCard
      className="chart-card"
      title="BS vs Heston price"
      subtitle="Option value as a function of stock price"
    >
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="S" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, yMax]} />
            <ReferenceLine x={strike} stroke="#94a3b8" strokeDasharray="4 4" />
            <Tooltip />
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