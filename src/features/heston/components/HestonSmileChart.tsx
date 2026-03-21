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
import { useI18n } from "../../../i18n";

type Props = {
  data: SmilePoint[];
  strikeRatio: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HestonSmileChart({ data, strikeRatio, isOpen, setIsOpen }: Props) {
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

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonSmileTitle")}
      subtitle={t("hestonSmileSubtitle")}
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
            <XAxis dataKey="moneyness" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[yMin, yMax]} />
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
    )}
    </SectionCard>
  );
}