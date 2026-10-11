import { Panel, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { money, pct } from "../npvIrr.format";
import NpvBars from "./NpvBars";
import type { ProjectMetrics, Scenario } from "../npvIrr.types";

type ScenarioSummaryTableProps = {
  stats: { scenario: Scenario; metrics: ProjectMetrics }[];
  activeId: string;
};

/// Compact per-scenario summary plus an NPV comparison bar chart.
export default function ScenarioSummaryTable({ stats, activeId }: ScenarioSummaryTableProps) {
  const { t } = useI18n();
  const bars = stats.map(({ scenario, metrics }) => ({ label: scenario.name, value: metrics.npv, color: scenario.color }));

  return (
    <Panel title={t("npvScenarioSummary")}>
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("npvColScenario")}</th>
              <th className="num">{t("npvOutlayLabel")}</th>
              <th className="num">{t("npvAnnualLabel")}</th>
              <th className="num">{t("npvGrowthLabel")}</th>
              <th className="num">{t("npvIrr")}</th>
              <th className="num">{t("npvNpvAtRate")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(({ scenario, metrics }) => (
              <tr key={scenario.id} className={scenario.id === activeId ? "is-active-row" : undefined}>
                <td>
                  <span className="npv-swatch" style={{ background: scenario.color }} aria-hidden="true" />
                  {scenario.name}
                </td>
                <td className="num">{money(scenario.model.outlay)}</td>
                <td className="num">{money(scenario.model.annual)}</td>
                <td className="num">{scenario.model.pattern === "growing" ? pct(scenario.model.growth) : "—"}</td>
                <td className="num">{Number.isFinite(metrics.irr) ? pct(metrics.irr) : "—"}</td>
                <td className="num" style={{ color: metrics.npv >= 0 ? "var(--positive)" : "var(--negative)" }}>{money(metrics.npv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChartContainer title={t("npvNpvComparison")}>
        <div className="npv-bars-wrap">
          <NpvBars data={bars} valueFormat={money} />
        </div>
      </ChartContainer>
    </Panel>
  );
}
