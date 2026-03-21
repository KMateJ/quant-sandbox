import type React from "react";
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
  strike: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
};

export default function HestonPathsChart({
  data,
  pathKeys,
  strike,
  isOpen,
  setIsOpen,
  onUpdate,
}: Props) {
  const { t } = useI18n();
  
  return (
    <SectionCard
      className="chart-card"
      title={t("hestonStockPathsTitle")}
      subtitle={t("hestonStockPathsSubtitle")}
      headerLeft={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "-" : "+"}
          </button>

          <button
            type="button"
            className="nav-tab"
            onClick={onUpdate}
          >
            {t("hestonUpdatePaths")}
          </button>
        </div>
      }
    >
      {isOpen && (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="t" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <ReferenceLine y={strike} stroke="#94a3b8" strokeDasharray="4 4" />
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
                labelFormatter={(label) => `t = ${label}`}
              />
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