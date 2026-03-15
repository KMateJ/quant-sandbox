import { useMemo, useState } from "react";
import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import { buildBinomialTree } from "./binomial.math";
import type { OptionKind } from "./binomial.types";
import BinomialTreeChart from "./components/BinomealTreeCharts";
import BinomialExplanation from "./components/BinomealExplanation";

export default function BinomialView() {
  const [S0, setS0] = useState(100);
  const [K, setK] = useState(100);
  const [u, setU] = useState(1.2);
  const [d, setD] = useState(0.85);
  const [r, setR] = useState(0.05);
  const [steps, setSteps] = useState(4);
  const [optionKind, setOptionKind] = useState<OptionKind>("call");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [showStockPrices, setShowStockPrices] = useState(true);
  const [showOptionValues, setShowOptionValues] = useState(true);

  const tree = useMemo(
    () =>
      buildBinomialTree({
        S0,
        K,
        u,
        d,
        r,
        steps,
        optionKind,
      }),
    [S0, K, u, d, r, steps, optionKind]
  );

  return (
    <div className="view-layout">
      <div className="view-controls">
        <BinomialControls
          S0={S0}
          K={K}
          u={u}
          d={d}
          r={r}
          steps={steps}
          optionKind={optionKind}
          controlsOpen={controlsOpen}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onS0Change={setS0}
          onKChange={setK}
          onUChange={setU}
          onDChange={setD}
          onRChange={setR}
          onStepsChange={setSteps}
          onOptionKindChange={setOptionKind}
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