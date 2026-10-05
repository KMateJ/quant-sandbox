import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { CashFlowRow } from "../bondPricing.types";

type PresentValueTableProps = {
  rows: CashFlowRow[];
  price: number;
};

/// Per-payment PV breakdown; the footer connects the PV sum to the bond price.
export default function PresentValueTable({ rows, price }: PresentValueTableProps) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(2);

  const columns: DataColumn<CashFlowRow>[] = [
    { key: "period", header: t("bondTablePayment"), render: (r) => r.period },
    { key: "time", header: t("bondTableTime"), align: "end", render: (r) => r.time.toFixed(2) },
    { key: "cf", header: t("bondTableCashflow"), align: "end", render: (r) => num(r.cashflow) },
    { key: "df", header: t("bondTableDf"), align: "end", render: (r) => r.discountFactor.toFixed(4) },
    { key: "pv", header: t("bondTablePv"), align: "end", render: (r) => num(r.presentValue) },
  ];

  return (
    <div className="bond-pv">
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.period}
      />
      <div className="bond-pv-sum">
        <span className="bond-pv-sum-label">{t("bondTableSumLabel")}</span>
        <span className="bond-pv-sum-value">{num(price)}</span>
      </div>
    </div>
  );
}
