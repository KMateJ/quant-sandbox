import { DataTable, StatCard, type DataColumn } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { isSignificant } from "../../alpha.math";
import type { FactorId } from "../../famaFrench.types";
import type { FundTabModel } from "../../useFundTab";
import FactorName from "../FactorName";

type Row = { id: FactorId; i: number };
const f2 = (v: number) => v.toFixed(2);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Live fit of the reader's replica, and after the reveal the OLS loadings with standard errors.
export default function FitReadout({ m }: { m: FundTabModel }) {
  const { t } = useI18n();
  const rows: Row[] = m.factors.map((id, i) => ({ id, i }));
  const columns: DataColumn<Row>[] = [
    { key: "factor", header: t("ffmColFactor"), render: (r) => <FactorName id={r.id} /> },
    { key: "yours", header: t("ffmColYours"), align: "end", render: (r) => f2(m.loadings[r.i]) },
    ...(m.truth ? [{ key: "truth", header: t("ffmColTruth"), align: "end" as const, render: (r: Row) => f2(m.truth![r.i]) }] : []),
    { key: "ols", header: t("ffmColOls"), align: "end", render: (r) => `${f2(m.fit.betas[r.i].b)} ± ${f2(2 * m.fit.betas[r.i].se)}` },
    { key: "t", header: "t", align: "end", render: (r) => m.fit.betas[r.i].t.toFixed(1) },
    { key: "sig", header: t("ffmColSig"), render: (r) => t(isSignificant(m.fit.betas[r.i].t) ? "ffmSignificant" : "ffmNotSignificant") },
  ];
  return (
    <>
      <div className="stats-grid">
        <StatCard label={t("ffmStatR2")} value={pct(m.stats.r2)} />
        <StatCard label={t("ffmStatTe")} value={pct(m.stats.te)} />
        <StatCard label={t("ffmStatResid")} value={pct(m.stats.resid)} />
        {m.revealed && <StatCard label={t("ffmStatOlsR2")} value={pct(m.fit.r2)} />}
      </div>
      {m.revealed && <DataTable columns={columns} rows={rows} getRowKey={(r) => r.id} />}
    </>
  );
}
