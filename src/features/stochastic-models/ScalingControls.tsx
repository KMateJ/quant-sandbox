import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { ScaleMode } from "./scalingLaws.types";

type Props = {
  paths: number;
  setPaths: (value: number) => void;
  alpha: number;
  setAlpha: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  mode: ScaleMode;
  setMode: (value: ScaleMode) => void;
  onResample: () => void;
};

const MODES: ScaleMode[] = ["linear", "loglog"];

export default function ScalingControls(props: Props) {
  const { t } = useI18n();
  return (
    <section className="stoch-controls" aria-label={t("stochControlsLabel")}>
      <ControlGroup label={t("stochSqrtScaleLabel")}>
        <div className="stoch-segmented" role="group" aria-label={t("stochSqrtScaleLabel")}>
          {MODES.map((value) => (
            <button
              key={value}
              type="button"
              className={value === props.mode ? "is-active" : ""}
              aria-pressed={value === props.mode}
              onClick={() => props.setMode(value)}
            >
              {t(value === "loglog" ? "stochScaleLogLog" : "stochScaleLinear")}
            </button>
          ))}
        </div>
      </ControlGroup>
      <div className="stoch-control-grid stoch-control-grid-2">
        <SliderField
          label={t("stochSqrtCandidateExponent")}
          min={0.2}
          max={1}
          step={0.05}
          value={props.alpha}
          onChange={props.setAlpha}
          formatValue={(value) => value.toFixed(2)}
        />
        <SliderField
          label={t("stochWalkPaths")}
          min={100}
          max={5000}
          step={100}
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
        <div className="stoch-resample-cell">
          <button className="button button-secondary" type="button" onClick={props.onResample}>
            {t("stochResample")}
          </button>
        </div>
      </div>
    </section>
  );
}
