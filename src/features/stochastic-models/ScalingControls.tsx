import SliderField from "../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { pathsToSlider, sliderToPaths, spreadFactor } from "./scalingLaws.math";
import type { ScaleMode } from "./scalingLaws.types";
import { RANDOM_WALK_MAX_PATHS, RANDOM_WALK_MAX_STEPS } from "./stochasticModels.math";

type Props = {
  steps: number;
  setSteps: (value: number) => void;
  paths: number;
  setPaths: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  mode: ScaleMode;
  setMode: (value: ScaleMode) => void;
  horizonK: number;
  setHorizonK: (value: number) => void;
  onResample: () => void;
};

const MODES: ScaleMode[] = ["linear", "loglog"];
const MIN_PATHS = 2;
const PATH_MARKS = [2, 10, 100, 1000];

export default function ScalingControls(props: Props) {
  const { t } = useI18n();
  const factor = spreadFactor(props.horizonK);
  return (
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochWalkPaths")} hint={<span className="stoch-control-hint">{t("stochSqrtPathsHint")}</span>}>
        <SliderField
          label={t("stochWalkPaths")}
          min={pathsToSlider(MIN_PATHS)}
          max={pathsToSlider(RANDOM_WALK_MAX_PATHS)}
          step={0.01}
          value={pathsToSlider(props.paths)}
          onChange={(value) => props.setPaths(sliderToPaths(value))}
          formatValue={(value) => sliderToPaths(value).toFixed(0)}
          marks={PATH_MARKS.map((n) => ({ value: pathsToSlider(n), label: String(n) }))}
        />
      </ControlGroup>

      <div className="controls-grid">
        <SliderField
          label={t("stochSqrtHorizon")}
          min={50}
          max={RANDOM_WALK_MAX_STEPS}
          step={50}
          value={props.steps}
          onChange={props.setSteps}
          formatValue={(value) => value.toFixed(0)}
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

      <ControlGroup label={t("stochSqrtScaleLabel")}>
        <SegmentedControl
          options={MODES.map((value) => ({
            value,
            label: t(value === "loglog" ? "stochScaleLogLog" : "stochScaleLinear"),
          }))}
          value={props.mode}
          onChange={props.setMode}
          ariaLabel={t("stochSqrtScaleLabel")}
        />
      </ControlGroup>

      <ControlGroup label={t("stochSqrtPredictorLabel")} hint={<span className="stoch-control-hint">{t("stochSqrtPredictorHint")}</span>}>
        <SliderField
          label={t("stochSqrtPredictorK")}
          min={2}
          max={16}
          step={1}
          value={props.horizonK}
          onChange={props.setHorizonK}
          formatValue={(value) => `×${value.toFixed(0)}`}
        />
        <p className="stoch-predictor-note">
          {t("stochSqrtPredictor", { k: props.horizonK, factor: factor.toFixed(2) })}
        </p>
      </ControlGroup>

      <button className="preset-btn stoch-resample-btn" type="button" onClick={props.onResample}>
        {t("stochResample")}
      </button>
    </Panel>
  );
}
