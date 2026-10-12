import SliderField from "../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../components/ui";
import { Panel } from "../../components/layout";
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
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochRescaledLevel")} hint={<span className="stoch-control-hint">{t("stochRescaledLevelHint")}</span>}>
        <SegmentedControl
          options={RESCALED_LEVELS.map((value) => ({ value, label: value.toLocaleString() }))}
          value={props.level}
          onChange={props.setLevel}
          ariaLabel={t("stochRescaledLevel")}
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
