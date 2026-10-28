import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../../components/charts";
import { useI18n } from "../../../../i18n";
import type { FfData, Window } from "../../famaFrench.types";
import type { FundTabModel } from "../../useFundTab";

type Props = { m: FundTabModel; data: FfData; window: Window };

const fmtGrowth = (v: number) => `${Number(Math.exp(v).toPrecision(2))}×`;

/// Growth of 1 in the fund versus the reader's replica (and the OLS replica once revealed), on a log scale.
export default function ReplicaChart({ m, data, window }: Props) {
  const { t } = useI18n();
  const ln = (v: number) => Math.log(Math.max(v, 1e-6));
  const rows = m.growth.fund.map((fund, i) => ({ x: i, fund: ln(fund), you: ln(m.growth.you[i]), ols: ln(m.growth.ols[i]) }));
  const series: ChartSeries[] = [
    { key: "fund", label: t("ffmSeriesFund"), color: SERIES_PALETTE[0], strokeWidth: 2.4 },
    { key: "you", label: t("ffmSeriesYou"), color: SERIES_PALETTE[3], strokeWidth: 2 },
  ];
  if (m.revealed) series.push({ key: "ols", label: t("ffmSeriesOls"), color: SERIES_PALETTE[1], dash: "5 4", strokeWidth: 1.8 });
  return (
    <LineChart
      data={rows}
      xKey="x"
      series={series}
      curve="linear"
      xDomain={[0, rows.length - 1]}
      xFormat={(x) => (data.months[window.from + Math.round(x)] ?? "").slice(0, 4)}
      tooltipLabel={(x) => data.months[window.from + Math.round(x)] ?? ""}
      yFormat={fmtGrowth}
      valueFormat={fmtGrowth}
    />
  );
}
