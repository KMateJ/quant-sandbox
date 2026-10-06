import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { CashFlowRow } from "../bondPricing.types";
import { IntuitionTrigger } from "../../../components/intuition";

type PresentValueTableProps = {
  rows: CashFlowRow[];
  price: number;
};

/// Collapsed-by-default, compact per-payment PV breakdown so the table stays
/// secondary to the timeline; the summary keeps the PV-sum = price link visible.
export default function PresentValueTable({ rows, price }: PresentValueTableProps) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(2);

  const columns: DataColumn<CashFlowRow>[] = [
    { key: "period", header: t("bondTablePayment"), render: (r) => r.period },
    { key: "time", header: <span className="intuition-reveal">{t("bondTableTime")}<IntuitionTrigger sectionId="payment-frequency" /></span>, align: "end", render: (r) => r.time.toFixed(2) },
    { key: "cf", header: <span className="intuition-reveal">{t("bondTableCashflow")}<IntuitionTrigger sectionId="cash-flows" /></span>, align: "end", render: (r) => num(r.cashflow) },
    { key: "df", header: <span className="intuition-reveal">{t("bondTableDf")}<IntuitionTrigger sectionId="discount-factor" /></span>, align: "end", render: (r) => r.discountFactor.toFixed(4) },
    { key: "pv", header: <span className="intuition-reveal">{t("bondTablePv")}<IntuitionTrigger sectionId="price" /></span>, align: "end", render: (r) => num(r.presentValue) },
  ];

  return (
    <details className="bond-pv-collapse">
      <summary className="bond-pv-summary">
        <span className="bond-pv-summary-title">{t("bondTableTitle")}</span>
        <span className="bond-pv-summary-sum">
          {t("bondTableSumLabel")}
          <b>{num(price)}</b>
        </span>
      </summary>
      <div className="bond-pv">
        <DataTable columns={columns} rows={rows} getRowKey={(r) => r.period} />
      </div>
    </details>
  );
}
