import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { RANDOM_WALK_MAX_PATHS } from "../../lib/stochastic/stochasticModels.math";

type Props = {
  steps: number;
  setSteps: (value: number) => void;
  paths: number;
  setPaths: (value: number) => void;
  probability: number;
  setProbability: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  speed: number;
  setSpeed: (value: number) => void;
  activeStep: number;
  setActiveStep: (value: number) => void;
  playing: boolean;
  setPlaying: (value: boolean) => void;
  onResample: () => void;
};

export default function RandomWalkControls(props: Props) {
  const { t } = useI18n();
  const pct = (value: number) => `${(value * 100).toFixed(0)}%`;
  return (
    <Panel title={t("stochControlsLabel")}>
      <div className="controls-grid">
        <SliderField
          label={t("stochWalkSteps")}
          min={20}
          max={500}
          step={20}
          value={props.steps}
          onChange={props.setSteps}
          sectionId="walk-steps"
        />
        <SliderField
          label={t("stochWalkPaths")}
          min={4}
          max={RANDOM_WALK_MAX_PATHS}
          step={4}
          value={props.paths}
          onChange={props.setPaths}
        />
        <SliderField
          label={t("stochWalkProbability")}
          min={0.1}
          max={0.9}
          step={0.01}
          value={props.probability}
          onChange={props.setProbability}
          formatValue={pct}
          sectionId="walk-bias"
        />
        <SliderField
          label={t("stochWalkSeed")}
          min={1}
          max={9999}
          step={1}
          value={props.seed}
          onChange={props.setSeed}
        />
      </div>
      <ControlGroup label={t("stochAnimationLabel")}>
        <div className="stoch-playback-row">
          <button
            className="preset-btn"
            type="button"
            onClick={() => {
              if (props.playing) props.setPlaying(false);
              else {
                if (props.activeStep >= props.steps) props.setActiveStep(0);
                props.setPlaying(true);
              }
            }}
          >
            {t(props.playing ? "stochPause" : "stochPlay")}
          </button>
          <button className="preset-btn" type="button" onClick={props.onResample}>
            {t("stochResample")}
          </button>
        </div>
        <SliderField
          label={t("stochAnimationSpeed")}
          min={60}
          max={500}
          step={20}
          value={props.speed}
          onChange={props.setSpeed}
          formatValue={(value) => `${(1000 / value).toFixed(1)} ${t("stochStepsPerSecond")}`}
        />
        <label className="stoch-progress-label" htmlFor="stoch-walk-progress">
          {t("stochWalkProgress", { current: props.activeStep, total: props.steps })}
        </label>
        <input
          id="stoch-walk-progress"
          className="stoch-progress-input"
          type="range"
          min={0}
          max={props.steps}
          step={1}
          value={Math.min(props.activeStep, props.steps)}
          onChange={(event) => {
            props.setPlaying(false);
            props.setActiveStep(Number(event.target.value));
          }}
          aria-label={t("stochWalkProgress", { current: props.activeStep, total: props.steps })}
        />
      </ControlGroup>
    </Panel>
  );
}
