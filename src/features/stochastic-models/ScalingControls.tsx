import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { spreadFactor } from "./scalingLaws.math";
import type { ScaleMode } from "./scalingLaws.types";

type Props = {
  steps: number;
  setSteps: (value: number) => void;
  alpha: number;
  setAlpha: (value: number) => void;
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

export default function ScalingControls(props: Props) {
  const { t } = useI18n();
  const factor = spreadFactor(props.horizonK);
  return (
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochSqrtCandidateExponent")} hint={<span className="stoch-control-hint">{t("stochSqrtExponentHint")}</span>}>
        <SliderField
          label="α"
          min={0.2}
          max={1}
          step={0.05}
          value={props.alpha}
          onChange={props.setAlpha}
          formatValue={(value) => value.toFixed(2)}
          marks={[
            { value: 0.25, label: "¼" },
            { value: 0.5, label: "½" },
            { value: 1, label: "1" },
          ]}
        />
      </ControlGroup>

      <div className="controls-grid">
        <SliderField
          label={t("stochSqrtHorizon")}
          min={50}
          max={500}
          step={50}
          value={props.steps}
          onChange={props.setSteps}
          formatValue={(value) => value.toFixed(0)}
        />
        <SliderField
          label={t("stochWalkPaths")}
          min={200}
          max={5000}
          step={200}
          value={props.paths}
          onChange={props.setPaths}
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
        <div className="stoch-segmented" role="group" aria-label={t("stochSqrtScaleLabel")}>
          {MODES.map((value) => (
            <button
              key={value}
              type="button"
              className={value === props.mode ? "preset-btn preset-btn--active" : "preset-btn"}
              aria-pressed={value === props.mode}
              onClick={() => props.setMode(value)}
            >
              {t(value === "loglog" ? "stochScaleLogLog" : "stochScaleLinear")}
            </button>
          ))}
        </div>
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
