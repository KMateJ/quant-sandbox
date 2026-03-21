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
import { useI18n } from "../../../i18n";

type Props = {
  data: PriceComparisonPoint[];
  strike: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HestonPriceComparisonChart({
  data,
  strike,
  isOpen,
  setIsOpen
}: Props) {
  const maxPrice =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.bs, d.heston)))
      : 1;

  const yMax = Number((maxPrice * 1.1).toFixed(4));
  const { t } = useI18n();

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonPriceComparisonTitle")}
      subtitle={t("hestonPriceComparisonSubtitle")}
      headerLeft={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "-" : "+"}
          </button>
        </div>
      }
    >
    {isOpen && (
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
    )}
    </SectionCard>
  );
}