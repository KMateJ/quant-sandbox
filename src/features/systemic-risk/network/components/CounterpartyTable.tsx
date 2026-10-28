import { DataTable, type DataColumn } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { CounterpartyRow } from "../network.types";
import type { NetworkPageModel } from "../useNetworkPage";

/// Who the selected institution lent to and borrowed from; a counterparty name selects that institution.
export default function CounterpartyTable({ rows, m }: { rows: CounterpartyRow[]; m: NetworkPageModel }) {
  const { t } = useI18n();
  if (!rows.length) return <p className="control-hint">{t("syrNoCounterparties")}</p>;
  const columns: DataColumn<CounterpartyRow>[] = [
    { key: "who", header: t("syrColCounterparty"), render: (r) => <button type="button" className="syr-link" onClick={() => m.select(r.other)}>{m.labelOf(r.other)}</button> },
    { key: "type", header: t("syrColType"), render: (r) => t(`syrType_${r.type}`) },
    { key: "dir", header: t("syrColDirection"), render: (r) => t(`syrDir_${r.direction}`) },
    { key: "amount", header: t("syrColAmount"), align: "end", render: (r) => r.amount.toFixed(1) },
    { key: "share", header: t("syrColShare"), align: "end", render: (r) => (Number.isFinite(r.shareOfEquity) ? `${Math.round(r.shareOfEquity * 100)}%` : "–") },
  ];
  return <DataTable columns={columns} rows={rows} getRowKey={(r) => r.exposureId} caption={t("syrCounterpartiesCaption")} />;
}
