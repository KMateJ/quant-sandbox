import { useEffect, useMemo, useRef, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import RandomWalkControls from "./RandomWalkControls";
import TerminalDistribution from "./TerminalDistribution";
import WalkPathChart from "./WalkPathChart";
import { createRandomWalkDraws, simulateRandomWalk, walkMoments } from "./stochasticModels.math";

export default function RandomWalkExperiment() {
  const { t } = useI18n();
  const [steps, setSteps] = useState(100);
  const [paths, setPaths] = useState(200);
  const [probability, setProbability] = useState(0.5);
  const [seed, setSeed] = useState(7);
  const [speed, setSpeed] = useState(180);
  const [activeStep, setActiveStep] = useState(100);
  const [playing, setPlaying] = useState(false);
  const activeStepRef = useRef(activeStep);
  activeStepRef.current = activeStep;
  const draws = useMemo(() => createRandomWalkDraws(seed), [seed]);
  const result = useMemo(
    () => simulateRandomWalk(draws, steps, paths, probability),
    [draws, steps, paths, probability]
  );

  useEffect(() => {
    if (!playing) return;
    let currentStep = Math.min(activeStepRef.current, steps);
    const timer = window.setInterval(() => {
      currentStep++;
      setActiveStep(currentStep);
      if (currentStep >= steps) {
        window.clearInterval(timer);
        setPlaying(false);
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, steps]);

  const shownStep = Math.min(activeStep, steps);
  const stepPositions = result.positionsByStep.subarray(
    shownStep * paths,
    (shownStep + 1) * paths
  );
  const empirical = walkMoments(stepPositions);
  const expectedVariance = 4 * shownStep * probability * (1 - probability);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <RandomWalkControls
          steps={steps}
          setSteps={setSteps}
          paths={paths}
          setPaths={setPaths}
          probability={probability}
          setProbability={setProbability}
          seed={seed}
          setSeed={setSeed}
          speed={speed}
          setSpeed={setSpeed}
          activeStep={shownStep}
          setActiveStep={setActiveStep}
          playing={playing}
          setPlaying={setPlaying}
          onResample={() => setSeed((value) => (value >= 9999 ? 1 : value + 1))}
        />
        <Panel title={t("stochWalkMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochEmpiricalMean")} value={(empirical.mean).toFixed(2)} />
            <StatCard label={t("stochTheoreticalMean")} value={(shownStep * (2 * probability - 1)).toFixed(2)} />
            <StatCard label={t("stochEmpiricalVariance")} value={(empirical.variance).toFixed(2)} />
            <StatCard label={t("stochTheoreticalVariance")} value={(expectedVariance).toFixed(2)} />
          </div>
          <p className="stoch-metric-note">{t("stochDisplayedPathNote", { paths })}</p>
          <IntuitionTrigger sectionId="walk-variance" variant="button" />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <WalkPathChart
          positions={result.positionsByStep}
          pathCount={paths}
          steps={steps}
          activeStep={shownStep}
        />
        <TerminalDistribution values={stepPositions} />
      </div>
    </div>
  );
}
