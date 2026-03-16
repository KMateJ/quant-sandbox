import { useMemo, useState } from "react";
import type { StrategyLeg, ViewMode } from "./payoff.types";
import {
  addSyntheticOverlay,
  buildChartData,
  collectRelevantStrikes,
  detectSyntheticLongForward,
  detectSyntheticShortForward,
} from "./payoff.math";
import PayoffBuilder from "./Components/PayoffBuilder";
import PayoffChart from "./Components/PayoffChart";
import PayoffSummary from "./Components/PayoffSummary";
import PayoffExplanation from "./Components/PayoffExplanation";

export default function PayoffView() {
  const [legs, setLegs] = useState<StrategyLeg[]>([
    {
      id: "initial-call",
      type: "call",
      direction: "long",
      quantity: 1,
      strike: 100,
    },
    {
      id: "initial-put",
      type: "put",
      direction: "short",
      quantity: 1,
      strike: 100,
    },
  ]);

  const [mode, setMode] = useState<ViewMode>("payoff");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [chartOpen, setChartOpen] = useState(true);
  const [showComponents, setShowComponents] = useState(false);

  const baseChartData = useMemo(
    () => buildChartData(legs, mode, 10, 200, 140, showComponents),
    [legs, mode, showComponents]
  );

  const syntheticDetected = useMemo(() => {
    const longForward = detectSyntheticLongForward(legs);
    const shortForward = detectSyntheticShortForward(legs);
    return longForward.detected || shortForward.detected;
  }, [legs]);

  const chartData = useMemo(
    () => addSyntheticOverlay(baseChartData, legs, mode),
    [baseChartData, legs, mode]
  );

  const strikes = useMemo(() => collectRelevantStrikes(legs), [legs]);

  return (
    <div className="view-layout">
      <div className="view-controls">
        <PayoffBuilder
          legs={legs}
          mode={mode}
          controlsOpen={controlsOpen}
          showComponents={showComponents}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onModeChange={setMode}
          onShowComponentsChange={setShowComponents}
          onChange={setLegs}
        />
      </div>

      <div className="view-main">
        <PayoffSummary legs={legs} mode={mode} />
        <PayoffChart
          chartData={chartData}
          strikes={strikes}
          showComponents={showComponents}
          syntheticDetected={syntheticDetected}
          chartOpen={chartOpen}
          onToggleChart={() => setChartOpen((prev) => !prev)}
        />
        <PayoffExplanation />
      </div>
    </div>
  );
}