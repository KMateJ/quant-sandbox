import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import BinomialTreeChart from "./components/BinomealTreeCharts";
import BinomialSliderDock from "./components/BinomialSliderDock";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/layout";
import { useBinomialView } from "./useBinomialView";
import { IntuitionTrigger } from "../../components/intuition";
export default function BinomialView() {
  const model = useBinomialView();
  const { isMobile, mode, setMode, S0, setS0, K, setK, u, setU, d, setD, r, setR, q, setQ, h, setH, steps, setSteps, optionKind, setOptionKind, controlsOpen, setControlsOpen, showPrimaryMetric, setShowPrimaryMetric, showSecondaryMetric, setShowSecondaryMetric, tree, primaryToggleLabel, secondaryToggleLabel } = model;
  const { t: translate } = useI18n();
  return (<>
    <PageHeader title={translate("navBinomial")} actions={<>
      <IntuitionTrigger sectionId={mode === "rates" ? "short-rate-tree" : "risk-neutral-probability"} />
      <IntuitionTrigger sectionId="replication" />
    </>} />
    <div className="view-layout binomial-view">
      {!isMobile ? (
        <div className="view-controls">
          <BinomialControls
            mode={mode}
            S0={S0}
            K={K}
            u={u}
            d={d}
            r={r}
            q={q}
            h={h}
            steps={steps}
            optionKind={optionKind}
            controlsOpen={controlsOpen}
            onToggleControls={() => setControlsOpen((prev) => !prev)}
            onModeChange={setMode}
            onS0Change={setS0}
            onKChange={setK}
            onUChange={setU}
            onDChange={setD}
            onRChange={setR}
            onQChange={setQ}
            onHChange={setH}
            onStepsChange={setSteps}
            onOptionKindChange={setOptionKind}
          />
          <div className="card" style={{ marginTop: 20 }}>
            <div className="metric-switch">
              <button
                type="button"
                className={showPrimaryMetric ? "metric-button active" : "metric-button"}
                onClick={() => setShowPrimaryMetric((prev) => !prev)}
              >
                {primaryToggleLabel}
              </button>
              <button
                type="button"
                className={showSecondaryMetric ? "metric-button active" : "metric-button"}
                onClick={() => setShowSecondaryMetric((prev) => !prev)}
              >
                {secondaryToggleLabel}
              </button>
            </div>
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
          onTogglePrimaryMetric={() => setShowPrimaryMetric((prev) => !prev)}
          onToggleSecondaryMetric={() => setShowSecondaryMetric((prev) => !prev)}
        />
        <BinomialSummary tree={tree} />
      </div>

      {isMobile ? (
        <BinomialSliderDock
          mode={mode}
          S0={S0}
          K={K}
          u={u}
          d={d}
          r={r}
          q={q}
          h={h}
          steps={steps}
          onS0Change={setS0}
          onKChange={setK}
          onUChange={setU}
          onDChange={setD}
          onRChange={setR}
          onQChange={setQ}
          onHChange={setH}
          onStepsChange={setSteps}
        />
      ) : null}
    </div>
  </>);
}
