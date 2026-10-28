import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { RESCALED_MAX_EXPONENT } from "../../lib/stochastic/rescaledWalk.types";

const stepsLabel = (exponent: number) => (2 ** exponent).toLocaleString();
const MARKS = [0, 4, 8, RESCALED_MAX_EXPONENT].map((value) => ({ value, label: stepsLabel(value) }));

type Props = {
  exponent: number;
  setExponent: (value: number) => void;
  paths: number;
  setPaths: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  onResample: () => void;
};

export default function RescaledControls(props: Props) {
  const { t } = useI18n();
  return (
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochRescaledLevel")} hint={<span className="stoch-control-hint">{t("stochRescaledLevelHint")}</span>}>
        <SliderField
          label={t("stochRescaledSteps")}
          min={0}
          max={RESCALED_MAX_EXPONENT}
          step={1}
          value={props.exponent}
          onChange={props.setExponent}
          formatValue={stepsLabel}
          marks={MARKS}
        />
      </ControlGroup>
      <div className="controls-grid">
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
      </div>
      <button className="preset-btn stoch-resample-btn" type="button" onClick={props.onResample}>
        {t("stochResample")}
      </button>
    </Panel>
  );
}
