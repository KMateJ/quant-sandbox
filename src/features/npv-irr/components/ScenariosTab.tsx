import { Panel, ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import ScenarioManager from "./ScenarioManager";
import ScenarioComparison from "./ScenarioComparison";
import ProjectInputs from "./ProjectInputs";
import NpvProfileChart from "./NpvProfileChart";
import NpvBars from "./NpvBars";
import { money, pct } from "../npvIrr.format";
import { RATE_MAX, type NpvLab } from "../useNpvLab";

type ScenariosTabProps = { lab: NpvLab; advanced: boolean; setAdvanced: (v: boolean) => void };

/// Manage, edit and compare multiple scenarios with overlaid NPV curves.
export default function ScenariosTab({ lab, advanced, setAdvanced }: ScenariosTabProps) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const overlays = lab.scenarioProfiles
    .filter((p) => p.scenario.id !== lab.activeId)
    .map((p) => ({ name: p.scenario.name, color: p.scenario.color, profile: p.profile }));
  const bars = lab.scenarioStats.map(({ scenario, metrics }) => ({ label: scenario.name, value: metrics.npv, color: scenario.color }));

  return (
    <div className="npv-scenarios-tab">
      <div className="npv-scenarios-left">
        <Panel title={t("npvScenariosTitle")}>
          <ScenarioManager lab={lab} />
        </Panel>
        <Panel title={`${t("npvEditing")}: ${lab.active.name}`}>
          <ProjectInputs model={lab.model} updateModel={lab.updateModel} advanced={advanced} setAdvanced={setAdvanced} />
        </Panel>
      </div>

      <div className="module-main">
        <ChartContainer title={t("npvScenarioOverlay")}>
          <div className="chart-wrap">
            <NpvProfileChart
              profile={lab.profile}
              rate={lab.model.rate}
              onRateChange={(r) => lab.updateModel({ rate: r })}
              irr={lab.metrics.irr}
              npvAtRate={lab.metrics.npv}
              rateMax={RATE_MAX}
              overlays={overlays}
              showIrr
              showPiRegion={false}
              isMobile={isMobile}
              valueFormat={money}
              rateFormat={(v) => pct(v)}
            />
          </div>
          <p className="npv-chart-hint">{t("npvOverlayHint")}</p>
        </ChartContainer>
        <Panel title={t("npvScenarioKpis")}>
          <ScenarioComparison stats={lab.scenarioStats} />
        </Panel>
        <ChartContainer title={t("npvNpvComparison")}>
          <div className="npv-bars-wrap">
            <NpvBars data={bars} valueFormat={money} />
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
