import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import { RESCALED_LEVELS } from "./rescaledWalk.types";

type Props = {
  level: number;
  setLevel: (value: number) => void;
  paths: number;
  setPaths: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  onResample: () => void;
};

export default function RescaledControls(props: Props) {
  const { t } = useI18n();
  return (
    <section className="stoch-controls" aria-label={t("stochControlsLabel")}>
      <ControlGroup label={t("stochRescaledLevel")} hint={<span className="stoch-control-hint">{t("stochRescaledLevelHint")}</span>}>
        <div className="stoch-segmented" role="group" aria-label={t("stochRescaledLevel")}>
          {RESCALED_LEVELS.map((value) => (
            <button
              key={value}
              type="button"
              className={value === props.level ? "is-active" : ""}
              aria-pressed={value === props.level}
              onClick={() => props.setLevel(value)}
            >
              {value.toLocaleString()}
            </button>
          ))}
        </div>
      </ControlGroup>
      <div className="stoch-control-grid stoch-control-grid-2">
        <SliderField
          label={t("stochRescaledPaths")}
          min={1}
          max={6}
          step={1}
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
