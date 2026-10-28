import { useMemo } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import EnvelopeChart from "./EnvelopeChart";
import ScalingChart from "./ScalingChart";
import ScalingControls from "./ScalingControls";
import SqrtPrediction from "./SqrtPrediction";
import { maxRelativeGap, scalingData, stdByStep } from "./scalingLaws.math";
import { createRandomWalkDraws, simulateRandomWalk } from "../../lib/stochastic/stochasticModels.math";
import { SQRT_URL_SCHEMA } from "../../lib/stochastic/stochStudio.url";

export default function WhySqrtExplore() {
  const { t } = useI18n();
  const [url, setUrl] = useUrlState(SQRT_URL_SCHEMA);
  const { steps, paths, seed, scale: mode } = url;

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
          setSteps={(value) => setUrl({ steps: value })}
          paths={paths}
          setPaths={(value) => setUrl({ paths: value })}
          seed={seed}
          setSeed={(value) => setUrl({ seed: value })}
          mode={mode}
          setMode={(scale) => setUrl({ scale })}
          onResample={() => setUrl({ seed: seed >= 9999 ? 1 : seed + 1 })}
        />
        <SqrtPrediction k={url.k} setK={(k) => setUrl({ k })} />
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
