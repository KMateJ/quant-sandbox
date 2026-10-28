import { DataTable, type DataColumn } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { factorStats } from "../../sort.math";
import { PORTFOLIO_IDS, type PortfolioId } from "../../sort.types";
import type { SortModel } from "../../useSortTab";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// The six portfolios: stock count, annualised mean excess return and volatility.
export default function SortTable({ model }: { model: SortModel }) {
  const { t } = useI18n();
  const { sorted, hover, setHover } = model;
  const stat = (id: PortfolioId) => factorStats(sorted.series[id]);
  const columns: DataColumn<PortfolioId>[] = [
    { key: "id", header: t("ffmSortColPort"), render: (id) => <span onPointerEnter={() => setHover(id)} onPointerLeave={() => setHover(null)} className={hover === id ? "ffm-cell-hover" : undefined}>{id}</span> },
    { key: "n", header: t("ffmSortColStocks"), align: "end", render: (id) => sorted.counts[id] },
    { key: "mean", header: t("ffmSortColMean"), align: "end", render: (id) => pct(stat(id).mean) },
    { key: "vol", header: t("ffmSortColVol"), align: "end", render: (id) => pct(stat(id).vol) },
  ];
  return <DataTable columns={columns} rows={[...PORTFOLIO_IDS]} getRowKey={(id) => id} caption={t("ffmSortTableTitle")} />;
}
