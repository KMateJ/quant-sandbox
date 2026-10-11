import { patternInflow } from "../npvIrr.math";
import { useI18n } from "../../../i18n";
import { money } from "../npvIrr.format";
import type { NpvScheduleRow, ProjectModel } from "../npvIrr.types";

type CashflowTableProps = {
  model: ProjectModel;
  rows: NpvScheduleRow[];
  editFlow: (year: number, value: number) => void;
  updateModel: (patch: Partial<ProjectModel>) => void;
  hoverYear: number | null;
  onHoverYear: (year: number | null) => void;
};

function toCsv(rows: NpvScheduleRow[]): string {
  const header = "year,cashflow,discount_factor,present_value,cumulative_pv";
  const body = rows.map((r) => [r.year, r.cashflow.toFixed(2), r.discount.toFixed(4), r.pv.toFixed(2), r.cumulativePv.toFixed(2)].join(","));
  return [header, ...body].join("\n");
}

/// Editable per-year cashflow schedule with add/remove year and CSV export.
export default function CashflowTable({ model, rows, editFlow, updateModel, hoverYear, onHoverYear }: CashflowTableProps) {
  const { t } = useI18n();

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "npv-cashflows.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="npv-cf-table-block">
      <div className="npv-cf-toolbar">
        <button type="button" className="metric-button" onClick={() => updateModel({ years: model.years + 1 })} disabled={model.years >= 25}>
          {t("npvAddYear")}
        </button>
        <button type="button" className="metric-button" onClick={() => updateModel({ years: model.years - 1 })} disabled={model.years <= 1}>
          {t("npvRemoveYear")}
        </button>
        <button type="button" className="metric-button" onClick={exportCsv}>{t("npvExportCsv")}</button>
      </div>
      <div className="data-table-scroll">
        <table className="data-table npv-cf-table">
          <thead>
            <tr>
              <th>{t("npvColYear")}</th>
              <th className="num">{t("npvColCashflow")}</th>
              <th className="num">{t("npvColDiscount")}</th>
              <th className="num">{t("npvColPv")}</th>
              <th className="num">{t("npvColCumPv")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className={hoverYear === r.year ? "is-hover" : undefined} onMouseEnter={() => onHoverYear(r.year)} onMouseLeave={() => onHoverYear(null)}>
                <td>{r.year}</td>
                <td className="num">
                  {r.year === 0 ? (
                    <span style={{ color: "var(--negative)" }}>{money(r.cashflow)}</span>
                  ) : (
                    <input
                      className="npv-cf-input"
                      type="number"
                      value={Math.round(patternInflow(model, r.year))}
                      onChange={(e) => { const v = Number(e.target.value); if (!Number.isNaN(v)) editFlow(r.year, v); }}
                      aria-label={`${t("npvColCashflow")} ${r.year}`}
                    />
                  )}
                </td>
                <td className="num">{r.discount.toFixed(3)}</td>
                <td className="num" style={{ color: r.pv >= 0 ? "var(--positive)" : "var(--negative)" }}>{money(r.pv)}</td>
                <td className="num" style={{ color: r.cumulativePv >= 0 ? "var(--positive)" : "var(--negative)" }}>{money(r.cumulativePv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
