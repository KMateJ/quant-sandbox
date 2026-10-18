import { useState } from "react";
import { Panel, ChartContainer } from "../../../components/layout";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import CashflowTable from "./CashflowTable";
import CashflowChart, { type CashflowMode } from "./CashflowChart";
import CashflowDragChart from "./CashflowDragChart";
import ScenarioSummaryTable from "./ScenarioSummaryTable";
import { money } from "../npvIrr.format";
import type { NpvLab } from "../useNpvLab";

type CashflowTabProps = { lab: NpvLab };
/// The chart either shows the schedule (nominal or discounted) or turns into draggable input bars.
type CashflowView = CashflowMode | "drag";

/// Cashflow analysis: editable schedule, bar visualisation and scenario summary.
export default function CashflowTab({ lab }: CashflowTabProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<CashflowView>("nominal");
  const [cumulative, setCumulative] = useState(false);
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const editFlow = (year: number, value: number) => {
    if (lab.model.pattern !== "custom") lab.updateModel({ pattern: "custom" });
    lab.setCustomFlow(year - 1, value);
  };

  const modeTabs: TabItem<CashflowView>[] = [
    { id: "nominal", label: t("npvModeNominal") },
    { id: "pv", label: t("npvModePv") },
    { id: "drag", label: t("npvModeDrag") },
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
              <Tabs<CashflowView> segmented items={modeTabs} value={mode} onChange={setMode} ariaLabel={t("npvCashflowChart")} />
              {mode !== "drag" && (
                <button type="button" className={cumulative ? "metric-button active" : "metric-button"} aria-pressed={cumulative} onClick={() => setCumulative((v) => !v)}>
                  {t("npvToggleCumulative")}
                </button>
              )}
            </div>
          }
        >
          <div className="chart-wrap">
            {mode === "drag" ? (
              <CashflowDragChart model={lab.model} rows={lab.schedule} editFlow={editFlow} updateModel={lab.updateModel} valueFormat={money} />
            ) : (
              <CashflowChart rows={lab.schedule} mode={mode} showCumulative={cumulative} hoverYear={hoverYear} onHoverYear={setHoverYear} valueFormat={money} />
            )}
          </div>
          <p className="npv-chart-hint">{t(mode === "drag" ? "npvDragEditHint" : "npvCashflowLegend")}</p>
        </ChartContainer>
      </div>
      <ScenarioSummaryTable stats={lab.scenarioStats} activeId={lab.activeId} />
    </div>
  );
}
