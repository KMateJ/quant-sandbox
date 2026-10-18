import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { PinButton } from "../../components/ui";
import { useI18n } from "../../i18n";
import AllocationBar from "./components/AllocationBar";
import CompositionAreaChart from "./components/CompositionAreaChart";
import OptimalResult from "./components/OptimalResult";
import OptimizationChart from "./components/OptimizationChart";
import OptimizationControls from "./components/OptimizationControls";
import { useFrontierBrush } from "./useFrontierBrush";
import { useFrontierSeries } from "./useFrontierSeries";
import { useOptimization } from "./useOptimization";
import { IntuitionTrigger } from "../../components/intuition";

/// Portfolio Optimization: a Markowitz optimization workbench over the shared
/// portfolio universe — objective, constraints, efficient frontier and solution.
/// The frontier, its composition and the weights panel share one brushed "active" portfolio.
export default function PortfolioOptimizationView() {
  const { t } = useI18n();
  const model = useOptimization();
  const brush = useFrontierBrush(model.branch, model.selected, model.selectReturn);
  const chart = useFrontierSeries(model);
  const { pin } = chart;

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("optTitle")} description={t("optDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("optConfigTitle")}>
          <OptimizationControls model={model} />
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("optChartTitle")}
            actions={<><PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} /><IntuitionTrigger sectionId="portfolio-selection" /></>}
          >
            <OptimizationChart model={model} chart={chart} brush={brush} />
            <p className="control-hint opt-brush-hint">{t("optBrushHint")}</p>
          </ChartContainer>

          <ChartContainer title={t("optCompositionTitle")} actions={<IntuitionTrigger sectionId="allocation" />}>
            <CompositionAreaChart assets={model.assets} brush={brush} className="chart-wrap opt-comp-wrap" />
          </ChartContainer>

          <OptimalResult selected={brush.active} preview={brush.hoverIndex != null} objective={model.objective} cost={model.cost} />

          <Panel title={t("optAllocationTitle")} actions={<IntuitionTrigger sectionId="allocation" />}>
            <AllocationBar assets={model.assets} weights={brush.active.weights} />
          </Panel>
        </div>
      </Workspace>
    </div>
  );
}
