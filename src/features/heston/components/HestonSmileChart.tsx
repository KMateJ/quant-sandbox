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
import type { SmilePoint } from "../heston.types";

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

  return (
    <SectionCard
      className="chart-card"
      title="Implied volatility smile"
      subtitle="Black–Scholes vs Heston implied vol across moneyness"
    >
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="moneyness" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[yMin, yMax]} />
            <ReferenceLine
              x={strikeRatio}
              stroke="#94a3b8"
              strokeDasharray="4 4"
            />
            <Tooltip />
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