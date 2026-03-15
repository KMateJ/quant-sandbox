import { useMemo, useState } from "react";
import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import { buildBinomialTree } from "./binomial.math";
import type { ExerciseStyle, OptionKind } from "./binomial.types";
import BinomialExplanation from "./components/BinomealExplanation";
import BinomialTreeChart from "./components/BinomealTreeCharts";

export default function BinomialView() {
  const [S0, setS0] = useState(100);
  const [K, setK] = useState(100);
  const [r, setR] = useState(0.05);
  const [sigma, setSigma] = useState(0.2);
  const [T, setT] = useState(1);
  const [steps, setSteps] = useState(4);
  const [optionKind, setOptionKind] = useState<OptionKind>("call");
  const [exerciseStyle, setExerciseStyle] =
    useState<ExerciseStyle>("european");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [showStockPrices, setShowStockPrices] = useState(true);
  const [showOptionValues, setShowOptionValues] = useState(true);

  const tree = useMemo(
    () =>
      buildBinomialTree({
        S0,
        K,
        r,
        sigma,
        T,
        steps,
        optionKind,
        exerciseStyle,
      }),
    [S0, K, r, sigma, T, steps, optionKind, exerciseStyle]
  );

  return (
    <div className="view-layout">
      <div className="view-controls">
        <BinomialControls
          S0={S0}
          K={K}
          r={r}
          sigma={sigma}
          T={T}
          steps={steps}
          optionKind={optionKind}
          exerciseStyle={exerciseStyle}
          controlsOpen={controlsOpen}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onS0Change={setS0}
          onKChange={setK}
          onRChange={setR}
          onSigmaChange={setSigma}
          onTChange={setT}
          onStepsChange={setSteps}
          onOptionKindChange={setOptionKind}
          onExerciseStyleChange={setExerciseStyle}
        />

        <div className="card" style={{ marginTop: 20 }}>
          <div className="metric-switch">
            <button
              type="button"
              className={showStockPrices ? "metric-button active" : "metric-button"}
              onClick={() => setShowStockPrices((prev) => !prev)}
            >
              Részvényárak
            </button>
            <button
              type="button"
              className={showOptionValues ? "metric-button active" : "metric-button"}
              onClick={() => setShowOptionValues((prev) => !prev)}
            >
              Opcióértékek
            </button>
          </div>
        </div>
      </div>

      <div className="view-main">
        <BinomialSummary tree={tree} />
        <BinomialTreeChart
          tree={tree}
          showStockPrices={showStockPrices}
          showOptionValues={showOptionValues}
        />
        <BinomialExplanation />
      </div>
    </div>
  );
}