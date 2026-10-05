import { Panel } from "../../../components/layout";
import { DataTable, type DataColumn } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { DcfPoint } from "../valuation.types";

type ValuationResultsProps = {
  enterpriseValue: number;
  terminalValue: number;
  pvTerminal: number;
  terminalShare: number;
  rows: DcfPoint[];
};

const money = (v: number) => v.toFixed(0);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Metric strip plus the explicit DCF schedule beneath the valuation chart.
export default function ValuationResults({
  enterpriseValue,
  terminalValue,
  pvTerminal,
  terminalShare,
  rows,
}: ValuationResultsProps) {
  const { t } = useI18n();

  const columns: DataColumn<DcfPoint>[] = [
    { key: "year", header: t("valuationColYear"), render: (r) => r.year },
    { key: "fcf", header: t("valuationColFcf"), align: "end", render: (r) => money(r.fcf) },
    { key: "df", header: t("valuationColDiscount"), align: "end", render: (r) => r.discount.toFixed(3) },
    { key: "pv", header: t("valuationColPv"), align: "end", render: (r) => money(r.pv) },
    { key: "cum", header: t("valuationColCumPv"), align: "end", render: (r) => money(r.cumulativePv) },
  ];

  return (
    <>
      <div className="metric-strip">
        <div className="stat-card">
          <div className="stat-title">{t("valuationEnterpriseValue")}</div>
          <div className="stat-value">{money(enterpriseValue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("valuationTerminalValue")}</div>
          <div className="stat-value">{money(terminalValue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("valuationPvTerminal")}</div>
          <div className="stat-value">{money(pvTerminal)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("valuationTerminalShare")}</div>
          <div className="stat-value">{pct(terminalShare)}</div>
        </div>
      </div>

      <Panel title={t("valuationScheduleTitle")}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(r) => r.year}
          caption={t("valuationScheduleCaption")}
        />
      </Panel>
    </>
  );
}
