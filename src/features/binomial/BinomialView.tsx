import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import BinomialTreeChart from "./components/BinomealTreeCharts";
import BinomialSliderDock from "./components/BinomialSliderDock";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/layout";
import { useBinomialView } from "./useBinomialView";
import { IntuitionTrigger } from "../../components/intuition";
import ControlGroup from "../../components/ui/ControlGroup";
export default function BinomialView() {
  const model = useBinomialView();
  const { isMobile, mode, setMode, sliders, optionKind, setOptionKind, showPrimaryMetric, toggleShowPrimaryMetric, showSecondaryMetric, toggleShowSecondaryMetric, tree, primaryToggleLabel, secondaryToggleLabel } = model;
  const { t: translate } = useI18n();
  return (<div className="intuition-on-demand">
    <PageHeader title={translate("navBinomial")} />
    <div className="view-layout binomial-view">
      {!isMobile ? (
        <div className="view-controls">
          <BinomialControls
            mode={mode}
            sliders={sliders}
            optionKind={optionKind}
            onModeChange={setMode}
            onOptionKindChange={setOptionKind}
          />
          <div className="card binomial-display-card">
            <ControlGroup label={translate("binomialShowLabel")}>
            <div className="metric-switch intuition-reveal">
              <button
                type="button"
                aria-pressed={showPrimaryMetric}
                className={showPrimaryMetric ? "metric-button active" : "metric-button"}
                onClick={toggleShowPrimaryMetric}
              >
                {primaryToggleLabel}
              </button>
              <button
                type="button"
                aria-pressed={showSecondaryMetric}
                className={showSecondaryMetric ? "metric-button active" : "metric-button"}
                onClick={toggleShowSecondaryMetric}
              >
                {secondaryToggleLabel}
              </button>
              <IntuitionTrigger sectionId={mode === "rates" ? "short-rate-tree" : "replication"} />
            </div>
            </ControlGroup>
          </div>
        </div>
      ) : null}

      <div className="view-main view-main--docked view-main--chart-first">
        <BinomialTreeChart
          tree={tree}
          optionKind={optionKind}
          showPrimaryMetric={showPrimaryMetric}
          showSecondaryMetric={showSecondaryMetric}
          primaryToggleLabel={primaryToggleLabel}
          secondaryToggleLabel={secondaryToggleLabel}
          onModeChange={setMode}
          onOptionKindChange={setOptionKind}
          onTogglePrimaryMetric={toggleShowPrimaryMetric}
          onToggleSecondaryMetric={toggleShowSecondaryMetric}
        />
        <BinomialSummary tree={tree} />
      </div>

      {isMobile ? (
        <BinomialSliderDock
          sliders={sliders}
        />
      ) : null}
    </div>
  </div>);
}
