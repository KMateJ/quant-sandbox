import { LineChart, SERIES_ROLE } from "../../../../components/charts";
import { ChartContainer } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import type { SortModel } from "../../useSortTab";

/// t-statistic of your HML for value cuts of 10/90 ... 40/60, with the current cut marked.
export default function SweepChart({ model }: { model: SortModel }) {
  const { t } = useI18n();
  const { sweep, url } = model;
  const data = sweep.map((p) => ({ cut: Math.round(p.cut * 100), t: p.t }));
  const cutName = (v: number) => `${v}/${100 - v}`;

  return (
    <ChartContainer title={t("ffmSortSweepTitle")} height={240}>
      <LineChart
        data={data}
        xKey="cut"
        curve="linear"
        legend={false}
        xDomain={[10, 40]}
        series={[{ key: "t", label: t("ffmSortSweepSeries"), color: SERIES_ROLE.estimate, strokeWidth: 2 }]}
        referenceLines={[{ axis: "x", value: url.slo, color: "var(--muted)", dash: "4 4" }]}
        xFormat={cutName}
        tooltipLabel={cutName}
        valueFormat={(v) => v.toFixed(2)}
        yFormat={(v) => v.toFixed(1)}
      />
    </ChartContainer>
  );
}
