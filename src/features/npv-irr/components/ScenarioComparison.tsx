import { useI18n } from "../../../i18n";
import { money, pct, ratio } from "../npvIrr.format";
import type { ProjectMetrics, Scenario } from "../npvIrr.types";

type ScenarioComparisonProps = {
  stats: { scenario: Scenario; metrics: ProjectMetrics }[];
};

/// Side-by-side KPI comparison across every scenario.
export default function ScenarioComparison({ stats }: ScenarioComparisonProps) {
  const { t } = useI18n();
  return (
    <div className="data-table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("npvColScenario")}</th>
            <th className="num">{t("npvValue")}</th>
            <th className="num">{t("npvIrr")}</th>
            <th className="num">{t("npvPi")}</th>
            <th className="num">{t("npvPayback")}</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(({ scenario, metrics }) => (
            <tr key={scenario.id}>
              <td>
                <span className="npv-swatch" style={{ background: scenario.color }} aria-hidden="true" />
                {scenario.name}
              </td>
              <td className="num" style={{ color: metrics.npv >= 0 ? "var(--positive)" : "var(--negative)" }}>{money(metrics.npv)}</td>
              <td className="num">{Number.isFinite(metrics.irr) ? pct(metrics.irr) : "—"}</td>
              <td className="num" style={{ color: metrics.pi >= 1 ? "var(--positive)" : "var(--negative)" }}>{ratio(metrics.pi)}</td>
              <td className="num">{metrics.payback === null ? "—" : `${metrics.payback.toFixed(1)} ${t("npvYearsUnit")}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
