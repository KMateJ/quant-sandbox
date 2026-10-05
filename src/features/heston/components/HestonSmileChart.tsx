import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import type { SmilePoint } from "../heston.types";
import { useI18n } from "../../../i18n";

type Props = {
  data: SmilePoint[];
  strikeRatio: number;
};

const series: ChartSeries[] = [
  { key: "bsIv", label: "BS implied vol", color: "#3b82f6" },
  { key: "hestonIv", label: "Heston implied vol", color: "#f59e0b" },
];

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
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonSmileTitle")}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="moneyness"
          series={series}
          yDomain={[yMin, yMax]}
          referenceLines={[
            { axis: "x", value: strikeRatio, color: "#94a3b8", dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `K / S₀ = ${x}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
    </SectionCard>
  );
}