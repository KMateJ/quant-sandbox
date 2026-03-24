import type React from "react";
import { useEffect, useState } from "react";
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
  isUpdating?: boolean;
};

export default function HestonPathsChart({
  data,
  pathKeys,
  strike,
  isOpen,
  setIsOpen,
  onUpdate,
  isUpdating = false,
}: Props) {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonStockPathsTitle")}
      subtitle={t("hestonStockPathsSubtitle")}
      headerLeft={
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
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
            disabled={isUpdating}
          >
            {t("hestonUpdatePaths")}
          </button>
        </div>
      }
    >
      {isOpen && (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: isMobile ? 4 : 12,
                left: isMobile ? -24 : -8,
                bottom: isMobile ? 28 : 8,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="t"
                stroke="#94a3b8"
                tick={{ fontSize: isMobile ? 11 : 12 }}
                minTickGap={isMobile ? 24 : 12}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: isMobile ? 11 : 12 }}
                width={isMobile ? 36 : 48}
              />
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
              <Legend
                wrapperStyle={{
                  fontSize: isMobile ? "11px" : "12px",
                  paddingTop: isMobile ? "8px" : "4px",
                }}
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
      )}
    </SectionCard>
  );
}
