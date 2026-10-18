import PayoffBuilder from "./Components/PayoffBuilder";
import PayoffDock from "./Components/PayoffDock";
import PayoffChart from "./Components/PayoffChart";
import PayoffSummary from "./Components/PayoffSummary";
import { usePayoffView } from "./usePayoffView";

/// Leg-by-leg strategy builder: controls, payoff/profit chart and synthetic detection.
export default function StrategyLab() {
  const model = usePayoffView();
  const { isMobile, legs, setLegs, mode, setMode, controlsOpen, setControlsOpen, showComponents, setShowComponents, selectedPreset, setSelectedPreset, xDomain, syntheticMatches, primarySyntheticMatch, chartData, strikes } = model;
  return (
    <div className="view-layout">
      <div className="view-controls">
        <PayoffBuilder
          legs={legs}
          mode={mode}
          controlsOpen={controlsOpen}
          selectedPreset={selectedPreset}
          showComponents={showComponents}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onModeChange={setMode}
          onPresetChange={setSelectedPreset}
          onShowComponentsChange={setShowComponents}
          onChange={setLegs}
        />
      </div>
      <div className="view-main view-main--dock-tall">
        <PayoffChart
          chartData={chartData}
          strikes={strikes}
          xDomain={xDomain}
          mode={mode}
          showComponents={showComponents}
          syntheticOverlayActive={mode === "payoff" && syntheticMatches.length > 0}
          syntheticOverlayLabel={primarySyntheticMatch?.label ?? null}
        />
        <PayoffSummary legs={legs} mode={mode} />
      </div>

      {isMobile ? (
        <PayoffDock
          legs={legs}
          onChange={setLegs}
          onClearPreset={() => setSelectedPreset(null)}
        />
      ) : null}
    </div>
  );
}
