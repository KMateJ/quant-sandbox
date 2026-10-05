import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import type { PriceComparisonPoint } from "../heston.types";
import { useI18n } from "../../../i18n";

type Props = {
  data: PriceComparisonPoint[];
  strike: number;
};

const series: ChartSeries[] = [
  { key: "bs", label: "Black–Scholes", color: "#3b82f6", strokeWidth: 2 },
  { key: "heston", label: "Heston (MC, smoothed)", color: "#f59e0b", strokeWidth: 2 },
];

export default function HestonPriceComparisonChart({
  data,
  strike,
}: Props) {
  const maxPrice =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.bs, d.heston)))
      : 1;

  const yMax = Number((maxPrice * 1.1).toFixed(4));
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <SectionCard
      className="chart-card"
      title={t("hestonPriceComparisonTitle")}
    >
      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="S"
          series={series}
          yDomain={[0, yMax]}
          referenceLines={[
            { axis: "x", value: strike, color: "#94a3b8", dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `S = ${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
    </SectionCard>
  );
}