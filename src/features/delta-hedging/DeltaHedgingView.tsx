import { PageHeader, Workspace, Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { useDeltaHedging } from "./useDeltaHedging";
import DeltaHedgingControls from "./components/DeltaHedgingControls";
import HedgePathCharts from "./components/HedgePathCharts";
import HedgeErrorChart from "./components/HedgeErrorChart";
import HedgeMetrics from "./components/HedgeMetrics";
import HedgeFrequencyPanel from "./components/HedgeFrequencyPanel";
import HedgeExplainer from "./components/HedgeExplainer";

/// Sell a call, hold Δ shares, rebalance now and then: follow one path, then see how the leftover
/// error behaves across many paths and rebalancing frequencies.
export default function DeltaHedgingView() {
  const { t } = useI18n();
  const model = useDeltaHedging();

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("deltaHedgingTitle")} description={t("deltaHedgingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("deltaHedgingControlsTitle")}>
          <DeltaHedgingControls model={model} />
        </Panel>

        <div className="module-main dh-main">
          <HedgePathCharts model={model} />
          <HedgeErrorChart model={model} />
          <HedgeMetrics model={model} />
          <HedgeFrequencyPanel model={model} />
          <HedgeExplainer />
        </div>
      </Workspace>
    </div>
  );
}
