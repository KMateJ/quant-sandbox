import { useEffect, useMemo, useRef, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
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
        <section className="stoch-metrics" aria-label={t("stochWalkMetrics")}>
          <h3>{t("stochWalkMetrics")}</h3>
          <div className="stoch-metric-grid">
            <Metric label={t("stochEmpiricalMean")} value={empirical.mean} />
            <Metric label={t("stochTheoreticalMean")} value={shownStep * (2 * probability - 1)} />
            <Metric label={t("stochEmpiricalVariance")} value={empirical.variance} />
            <Metric label={t("stochTheoreticalVariance")} value={expectedVariance} />
          </div>
          <p className="stoch-metric-note">
            {t("stochDisplayedPathNote", { count: Math.min(paths, 8), paths })}
          </p>
          <IntuitionTrigger sectionId="walk-variance" variant="button" />
        </section>
      </aside>
      <div className="stoch-stage">
        <WalkPathChart data={result.data} steps={steps} activeStep={shownStep} />
        <TerminalDistribution values={stepPositions} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="stoch-metric">
      <span>{label}</span>
      <strong>{value.toFixed(2)}</strong>
    </div>
  );
}
