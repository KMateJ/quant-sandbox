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
import type { HestonPathPoint } from "../heston.types";

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
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HestonVarianceChart({
  data,
  pathKeys,
  theta,
  isOpen,
  setIsOpen,
}: Props) {
  return (
    <SectionCard
      className="chart-card"
      title="Heston variance paths"
      subtitle="The volatility state evolves randomly and mean-reverts"
      headerLeft={
        <button
          type="button"
          className="toggle-button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? "-" : "+"}
        </button>
      }
    >
      {isOpen && (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="t" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ReferenceLine y={theta} stroke="#94a3b8" strokeDasharray="4 4" />
              <Tooltip />
              <Legend />
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
      )}
    </SectionCard>
  );
}