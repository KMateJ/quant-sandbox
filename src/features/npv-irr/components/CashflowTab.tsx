import { useState } from "react";
import { Panel, ChartContainer } from "../../../components/layout";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import CashflowTable from "./CashflowTable";
import CashflowChart, { type CashflowMode } from "./CashflowChart";
import ScenarioSummaryTable from "./ScenarioSummaryTable";
import { money } from "../npvIrr.format";
import type { NpvLab } from "../useNpvLab";

type CashflowTabProps = { lab: NpvLab };

/// Cashflow analysis: editable schedule, bar visualisation and scenario summary.
export default function CashflowTab({ lab }: CashflowTabProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<CashflowMode>("nominal");
  const [cumulative, setCumulative] = useState(false);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const editFlow = (year: number, value: number) => {
    if (lab.model.pattern !== "custom") lab.updateModel({ pattern: "custom" });
    lab.setCustomFlow(year - 1, value);
  };

  const modeTabs: TabItem<CashflowMode>[] = [
    { id: "nominal", label: t("npvModeNominal") },
    { id: "pv", label: t("npvModePv") },
  ];

  return (
    <div className="npv-cashflow-tab">
      <div className="npv-cf-grid">
        <Panel title={t("npvScheduleTitle")}>
          <CashflowTable
            model={lab.model}
            rows={lab.schedule}
            editFlow={editFlow}
            updateModel={lab.updateModel}
            hoverYear={hoverYear}
            onHoverYear={setHoverYear}
          />
        </Panel>
        <ChartContainer
          title={t("npvCashflowChart")}
          actions={
            <div className="npv-chart-actions">
              <Tabs<CashflowMode> segmented items={modeTabs} value={mode} onChange={setMode} ariaLabel={t("npvCashflowChart")} />
              <button type="button" className={cumulative ? "metric-button active" : "metric-button"} aria-pressed={cumulative} onClick={() => setCumulative((v) => !v)}>
                {t("npvToggleCumulative")}
              </button>
            </div>
          }
        >
          <div className="chart-wrap">
            <CashflowChart rows={lab.schedule} mode={mode} showCumulative={cumulative} hoverYear={hoverYear} onHoverYear={setHoverYear} valueFormat={money} />
          </div>
          <p className="npv-chart-hint">{t("npvCashflowLegend")}</p>
        </ChartContainer>
      </div>
      <ScenarioSummaryTable stats={lab.scenarioStats} activeId={lab.activeId} />
    </div>
  );
}
