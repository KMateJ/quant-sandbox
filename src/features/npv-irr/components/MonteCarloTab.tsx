import { Panel, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import MonteCarloControls from "./MonteCarloControls";
import MonteCarloHistogram from "./MonteCarloHistogram";
import MonteCarloStats from "./MonteCarloStats";
import { money } from "../npvIrr.format";
import type { NpvLab } from "../useNpvLab";

type MonteCarloTabProps = { lab: NpvLab };

/// Monte Carlo simulation view: uncertainty inputs, NPV histogram and statistics.
export default function MonteCarloTab({ lab }: MonteCarloTabProps) {
  const { t } = useI18n();

  return (
    <div className="npv-mc-tab">
      <Panel title={t("npvMcControlsTitle")}>
        <MonteCarloControls config={lab.mcConfig} setConfig={lab.setMcConfig} run={lab.runSimulation} running={lab.mcRunning} />
      </Panel>

      <div className="module-main">
        {lab.mcResult ? (
          <>
            <MonteCarloStats result={lab.mcResult} />
            <ChartContainer title={t("npvMcHistogram")}>
              <div className="chart-wrap">
                <MonteCarloHistogram result={lab.mcResult} valueFormat={money} />
              </div>
              <p className="npv-chart-hint">{t("npvMcHistHint")}</p>
            </ChartContainer>
          </>
        ) : (
          <Panel title={t("npvMcHistogram")}>
            <p className="npv-empty">{t("npvMcEmpty")}</p>
          </Panel>
        )}
      </div>
    </div>
  );
}
