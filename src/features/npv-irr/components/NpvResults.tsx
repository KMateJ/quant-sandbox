import { Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { NpvScheduleRow } from "../npvIrr.types";

type NpvResultsProps = {
  npv: number;
  irr: number;
  pi: number;
  payback: number | null;
  rows: NpvScheduleRow[];
};

const money = (v: number) => v.toFixed(0);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Metric strip plus the discounted cashflow schedule beneath the NPV chart.
export default function NpvResults({ npv, irr, pi, payback, rows }: NpvResultsProps) {
  const { t } = useI18n();

  const columns: DataColumn<NpvScheduleRow>[] = [
    { key: "year", header: t("npvColYear"), render: (r) => r.year },
    { key: "cf", header: t("npvColCashflow"), align: "end", render: (r) => money(r.cashflow) },
    { key: "df", header: t("npvColDiscount"), align: "end", render: (r) => r.discount.toFixed(3) },
    { key: "pv", header: t("npvColPv"), align: "end", render: (r) => money(r.pv) },
    { key: "cum", header: t("npvColCumPv"), align: "end", render: (r) => money(r.cumulativePv) },
  ];

  const npvColor = npv >= 0 ? "var(--positive)" : "var(--negative)";

  return (
    <>
      <div className="metric-strip">
        <div className="stat-card">
          <div className="stat-title">{t("npvValue")}</div>
          <div className="stat-value" style={{ color: npvColor }}>{money(npv)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("npvIrr")}</div>
          <div className="stat-value">{Number.isFinite(irr) ? pct(irr) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("npvPi")}</div>
          <div className="stat-value">{pi.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("npvPayback")}</div>
          <div className="stat-value">
            {payback === null ? "—" : `${payback.toFixed(1)} ${t("npvYearsUnit")}`}
          </div>
        </div>
      </div>

      <Panel title={t("npvScheduleTitle")}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.year}
          caption={t("npvScheduleCaption")}
        />
      </Panel>
    </>
  );
}
