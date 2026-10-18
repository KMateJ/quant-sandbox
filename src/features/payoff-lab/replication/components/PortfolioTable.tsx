import { DataTable, type DataColumn } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { legLabel } from "../replication.labels";
import { legColor } from "../replication.series";
import type { ReplicationLeg, ReplicationPortfolio } from "../replication.types";

type Row = ReplicationLeg & { index: number };

const fmt = (v: number) => v.toFixed(4);
const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(3)}`;

/// Positions of one replicating portfolio with unit prices and costs; swatches match the chart legs.
/// The slope-change column shows why each option is there: its quantity is f'(K+) − f'(K−).
export default function PortfolioTable({ portfolio }: { portfolio: ReplicationPortfolio }) {
  const { t } = useI18n();
  const rows: Row[] = portfolio.legs.map((leg, index) => ({ ...leg, index }));

  const columns: DataColumn<Row>[] = [
    {
      key: "instrument",
      header: t("replColInstrument"),
      render: (row) => (
        <span className="repl-instrument">
          <span className="repl-swatch" style={{ background: legColor(row.index) }} />
          {legLabel(row, t)}
        </span>
      ),
    },
    { key: "position", header: t("replColPosition"), render: (row) => (row.quantity >= 0 ? t("replLong") : t("replShort")) },
    {
      key: "slope",
      header: t("replColSlope"),
      align: "end",
      render: (row) => (row.kind === "call" || row.kind === "put" ? signed(row.quantity) : "—"),
    },
    { key: "qty", header: t("replColQty"), align: "end", render: (row) => fmt(Math.abs(row.quantity)) },
    { key: "unit", header: t("replColUnit"), align: "end", render: (row) => fmt(row.unitPrice) },
    { key: "cost", header: t("replColCost"), align: "end", render: (row) => fmt(row.quantity * row.unitPrice) },
  ];

  return (
    <>
      <DataTable columns={columns} rows={rows} getRowKey={(row) => row.index} />
      <div className="repl-total">
        <span>{t("replTotal")}</span>
        <strong>{fmt(portfolio.total)}</strong>
      </div>
    </>
  );
}
