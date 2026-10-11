import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import EnvelopeChart from "./EnvelopeChart";
import ScalingChart from "./ScalingChart";
import ScalingControls from "./ScalingControls";
import { envelopeMismatch, scalingData } from "./scalingLaws.math";
import { createRandomWalkDraws, simulateRandomWalk } from "./stochasticModels.math";
import type { ScaleMode } from "./scalingLaws.types";

const CLOUD_PATHS = 30;

export default function WhySqrtExplore() {
  const { t } = useI18n();
  const [steps, setSteps] = useState(250);
  const [alpha, setAlpha] = useState(1);
  const [paths, setPaths] = useState(2000);
  const [seed, setSeed] = useState(7);
  const [mode, setMode] = useState<ScaleMode>("linear");
  const [horizonK, setHorizonK] = useState(4);

  const cloud = useMemo(
    () => simulateRandomWalk(createRandomWalkDraws(seed), steps, CLOUD_PATHS, 0.5),
    [seed, steps]
  );
  const scaling = useMemo(() => scalingData(seed, paths), [seed, paths]);
  const mismatch = useMemo(() => envelopeMismatch(steps, alpha), [steps, alpha]);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <ScalingControls
          steps={steps}
          setSteps={setSteps}
          alpha={alpha}
          setAlpha={setAlpha}
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
            <StatCard label={t("stochSqrtCandidateAlpha")} value={alpha.toFixed(2)} />
            <StatCard label={t("stochSqrtEnvelopeMatch")} value={`${(mismatch * 100).toFixed(0)}%`} />
            <StatCard label={t("stochSqrtFittedSlope")} value={scaling.slope.toFixed(3)} />
            <StatCard label={t("stochSqrtTheoreticalSlope")} value="0.500" />
          </div>
          <p className="stoch-metric-note">{t("stochSqrtObservation")}</p>
          <IntuitionTrigger sectionId="scaling-exponents" variant="button" />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <EnvelopeChart
          data={cloud.data}
          renderedPaths={cloud.renderedPaths}
          steps={steps}
          alpha={alpha}
        />
        <ScalingChart points={scaling.points} alpha={alpha} mode={mode} />
      </div>
    </div>
  );
}
