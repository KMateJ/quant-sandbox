import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import EnvelopeChart from "./EnvelopeChart";
import ScalingChart from "./ScalingChart";
import ScalingControls from "./ScalingControls";
import { maxRelativeGap, scalingData, stdByStep } from "./scalingLaws.math";
import { createRandomWalkDraws, simulateRandomWalk } from "./stochasticModels.math";
import type { ScaleMode } from "./scalingLaws.types";

export default function WhySqrtExplore() {
  const { t } = useI18n();
  const [steps, setSteps] = useState(250);
  const [paths, setPaths] = useState(5);
  const [seed, setSeed] = useState(7);
  const [mode, setMode] = useState<ScaleMode>("linear");
  const [horizonK, setHorizonK] = useState(4);

  const draws = useMemo(() => createRandomWalkDraws(seed), [seed]);
  const cloud = useMemo(() => simulateRandomWalk(draws, steps, paths, 0.5), [draws, steps, paths]);
  const std = useMemo(() => stdByStep(cloud.positionsByStep, paths, steps), [cloud, paths, steps]);
  const scaling = useMemo(() => scalingData(seed, paths), [seed, paths]);
  const finalStd = std[std.length - 1].y;

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <ScalingControls
          steps={steps}
          setSteps={setSteps}
          paths={paths}
          setPaths={setPaths}
          seed={seed}
          setSeed={setSeed}
          mode={mode}
          setMode={setMode}
          horizonK={horizonK}
          setHorizonK={setHorizonK}
          onResample={() => setSeed((value) => (value >= 9999 ? 1 : value + 1))}
        />
        <Panel title={t("stochSqrtMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochSqrtEmpiricalAtN", { n: steps })} value={finalStd.toFixed(2)} />
            <StatCard label={t("stochSqrtTheoryAtN", { n: steps })} value={Math.sqrt(steps).toFixed(2)} />
            <StatCard label={t("stochSqrtMaxGap")} value={`${(maxRelativeGap(std) * 100).toFixed(1)}%`} />
            <StatCard label={t("stochSqrtFittedSlope")} value={scaling.slope.toFixed(3)} />
          </div>
          <p className="stoch-metric-note">{t("stochSqrtObservation")}</p>
          <IntuitionTrigger sectionId="scaling-exponents" variant="button" />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <EnvelopeChart positions={cloud.positionsByStep} pathCount={paths} steps={steps} std={std} />
        <ScalingChart points={scaling.points} mode={mode} />
      </div>
    </div>
  );
}
