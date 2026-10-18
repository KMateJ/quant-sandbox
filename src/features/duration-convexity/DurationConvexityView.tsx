import { useCallback, useMemo } from "react";
import { BlockMath } from "react-katex";
import { usePinnedScatter } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { PinButton, Popover } from "../../components/ui";
import { useI18n } from "../../i18n";
import { useDurationConvexity } from "./useDurationConvexity";
import BondParamsPanel from "./components/BondParamsPanel";
import YieldShockControl from "./components/YieldShockControl";
import SensitivityChart from "./components/SensitivityChart";
import { sensitivitySeries } from "./components/sensitivitySeries";
import ShockResult from "./components/ShockResult";
import ErrorChart from "./components/ErrorChart";
import { IntuitionTrigger } from "../../components/intuition";

export default function DurationConvexityView() {
  const { t } = useI18n();
  const model = useDurationConvexity();

  // Pin the exact-repricing curve of the current bond, then change the bond and compare against the ghost.
  const [exact, ...approximations] = useMemo(() => sensitivitySeries(model.curve, t), [model.curve, t]);
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedScatter([exact], ghostLabel);

  const formulas = (
    <Popover
      align="end"
      trigger={
        <button type="button" className="dc-formula-trigger">
          {t("dcFormulasLabel")}
        </button>
      }
    >
      <div className="dc-formula-body">
        <span className="dc-formula-label">{t("dcFormulaDuration")}</span>
        <BlockMath math={"\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y"} />
        <span className="dc-formula-label">{t("dcFormulaDurConvex")}</span>
        <BlockMath math={"\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2"} />
      </div>
    </Popover>
  );

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("durationConvexityTitle")} description={t("durationConvexityDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("dcParamsTitle")}>
          <BondParamsPanel model={model} />
        </Panel>

        <div className="module-main">
          <Panel title={t("dcShockTitle")} className="dc-shock-panel">
            <YieldShockControl model={model} />
          </Panel>

          <div className="dc-main-row">
            <ChartContainer
              title={t("dcChartTitle")}
              actions={<><PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />{formulas}<IntuitionTrigger sectionId="exact-repricing" /></>}
            >
              <div className="chart-wrap">
                <SensitivityChart model={model} lines={[...pin.series, ...approximations]} />
              </div>
            </ChartContainer>

            <Panel title={t("dcResultTitle")} className="dc-result-panel">
              <ShockResult model={model} />
            </Panel>
          </div>

          <ChartContainer title={t("dcErrorTitle")} actions={<IntuitionTrigger sectionId="approximation-error" />}>
            <div className="chart-wrap dc-error-wrap">
              <ErrorChart model={model} />
            </div>
          </ChartContainer>
        </div>
      </Workspace>
    </div>
  );
}
