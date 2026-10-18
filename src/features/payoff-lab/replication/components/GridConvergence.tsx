import SectionCard from "../../../../components/SectionCard";
import { DataTable, type DataColumn } from "../../../../components/ui";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import type { ReplicationModel } from "../useReplication";

type Row = ReplicationModel["convergence"][number];

/// How the static hedge price approaches the density price as listed strikes get denser.
export default function GridConvergence({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { convergence, bl, market, updateMarket } = model;

  const columns: DataColumn<Row>[] = [
    { key: "step", header: t("replColStep"), render: (row) => row.step },
    { key: "price", header: t("replColPrice"), align: "end", render: (row) => row.price.toFixed(4) },
    {
      key: "error",
      header: t("replColError"),
      align: "end",
      render: (row) => (
        <span className="repl-error">
          <span className="repl-error-bar" style={{ width: `${errorWidth(row.error, convergence)}%` }} />
          {`${row.error >= 0 ? "+" : "−"}${Math.abs(row.error).toFixed(4)}`}
        </span>
      ),
    },
    {
      key: "use",
      header: "",
      align: "end",
      render: (row) => (
        <button
          type="button"
          className={row.step === market.strikeStep ? "metric-button active" : "metric-button"}
          onClick={() => updateMarket({ strikeStep: row.step })}
        >
          {t("replUseGrid")}
        </button>
      ),
    },
  ];

  return (
    <SectionCard
      title={t("replGridTitle")}
      subtitle={t("replGridSubtitle", { p: bl.price.toFixed(4) })}
      headerRight={<IntuitionTrigger sectionId="breeden-litzenberger" />}
    >
      <DataTable columns={columns} rows={convergence} getRowKey={(row) => row.step} />
    </SectionCard>
  );
}

function errorWidth(error: number, rows: Row[]): number {
  const max = Math.max(...rows.map((r) => Math.abs(r.error)), 1e-12);
  return (Math.abs(error) / max) * 100;
}
