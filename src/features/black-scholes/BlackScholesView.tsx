import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import BlackScholesControls from "./BlackScholesControls";
import BlackScholesChart from "./BlackScholesChart";
import { IntuitionTrigger } from "../../components/intuition";
import { useBlackScholesView } from "./useBlackScholesView";

type ViewMode = "2d" | "3d";

export default function BlackScholesView() {
  const model = useBlackScholesView();
  const { t, metric, setMetric, optionType, metricOptions, getMetricTitle, view3d, setView3d } = model;

  const metricTabs: TabItem[] = metricOptions.map((o) => ({ id: o.key, label: o.label }));
  const viewTabs: TabItem<ViewMode>[] = [
    { id: "2d", label: t("blackScholesView2d") },
    { id: "3d", label: t("blackScholesView3d") },
  ];

  return (
    <>
      <PageHeader title={t("navBlackScholes")} />

      <Workspace columns="sidebar" className="bs-workspace">
        <Panel title={t("blackScholesControlsTitle")}>
          <BlackScholesControls model={model} />
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={
              <span className="bs-chart-title">
                {getMetricTitle(metric, optionType, t)}
                <IntuitionTrigger sectionId={metric} />
              </span>
            }
            actions={
              <Tabs<ViewMode>
                segmented
                items={viewTabs}
                value={view3d ? "3d" : "2d"}
                onChange={(id) => setView3d(id === "3d")}
                ariaLabel={t("blackScholesView3d")}
              />
            }
          >
            <Tabs
              className="bs-metric-tabs"
              items={metricTabs}
              value={metric}
              onChange={(id) => setMetric(id as typeof metric)}
              ariaLabel={t("blackScholesControlsTitle")}
            />
            <BlackScholesChart model={model} />
          </ChartContainer>
        </div>
      </Workspace>
    </>
  );
}
