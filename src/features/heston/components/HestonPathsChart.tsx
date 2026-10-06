import { useEffect, useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import { LineChart, type ChartSeries } from "../../../components/charts";
import type { HestonPathPoint } from "../heston.types";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";

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
};

export default function HestonPathsChart({
  data,
  pathKeys,
  strike,
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

  const series = useMemo<ChartSeries[]>(
    () =>
      pathKeys.map((key, index) => ({
        key,
        label: key,
        color: lineColors[index % lineColors.length],
        strokeWidth: 2,
      })),
    [pathKeys]
  );

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonStockPathsTitle")}
      headerRight={<IntuitionTrigger sectionId="visual-paths" />}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="t"
          series={series}
          referenceLines={[
            { axis: "y", value: strike, color: "#94a3b8", dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `t = ${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
    </SectionCard>
  );
}
