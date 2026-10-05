import { useState } from "react";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs } from "../../components/ui";
import { useI18n } from "../../i18n";
import AllocationBar from "./components/AllocationBar";
import CompositionAreaChart from "./components/CompositionAreaChart";
import OptimalResult from "./components/OptimalResult";
import OptimizationChart from "./components/OptimizationChart";
import OptimizationControls from "./components/OptimizationControls";
import { useOptimization } from "./useOptimization";

type View = "frontier" | "composition";

/// Portfolio Optimization: a Markowitz optimization workbench over the shared
/// portfolio universe — objective, constraints, efficient frontier and solution.
export default function PortfolioOptimizationView() {
  const { t } = useI18n();
  const model = useOptimization();
  const [view, setView] = useState<View>("frontier");

  const tabs = [
    { id: "frontier" as const, label: t("optViewFrontier") },
    { id: "composition" as const, label: t("optViewComposition") },
  ];

  return (
    <>
      <PageHeader title={t("optTitle")} description={t("optDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("optConfigTitle")}>
          <OptimizationControls model={model} />
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={view === "frontier" ? t("optChartTitle") : t("optCompositionTitle")}
            actions={<Tabs<View> items={tabs} value={view} onChange={setView} ariaLabel={t("optChartTitle")} segmented />}
          >
            {view === "frontier" ? (
              <OptimizationChart model={model} />
            ) : (
              <CompositionAreaChart
                branch={model.branch}
                assets={model.assets}
                selectedReturn={model.selected.ret}
                onSelect={model.selectReturn}
              />
            )}
          </ChartContainer>

          <OptimalResult selected={model.selected} objective={model.objective} cost={model.cost} />

          <Panel title={t("optAllocationTitle")}>
            <AllocationBar assets={model.assets} weights={model.selected.weights} />
          </Panel>
        </div>
      </Workspace>
    </>
  );
}
