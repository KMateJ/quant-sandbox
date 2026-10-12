import SliderField from "../../components/SliderField";
import { ControlGroup, SegmentedControl } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { CLT_LEVELS, STEP_DISTRIBUTIONS, type StepDistribution } from "./clt.types";

const DISTRIBUTION_KEYS: Record<StepDistribution, TranslationKey> = {
  coin: "stochCltDistCoin",
  uniform: "stochCltDistUniform",
  exponential: "stochCltDistExponential",
};

type Props = {
  distribution: StepDistribution;
  setDistribution: (value: StepDistribution) => void;
  n: number;
  setN: (value: number) => void;
  samples: number;
  setSamples: (value: number) => void;
  seed: number;
  setSeed: (value: number) => void;
  onResample: () => void;
};

export default function CltControls(props: Props) {
  const { t } = useI18n();
  const hint = (key: TranslationKey) => <span className="stoch-control-hint">{t(key)}</span>;
  return (
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochCltDistribution")} hint={hint("stochCltDistHint")}>
        <SegmentedControl
          options={STEP_DISTRIBUTIONS.map((value) => ({ value, label: t(DISTRIBUTION_KEYS[value]) }))}
          value={props.distribution}
          onChange={props.setDistribution}
          ariaLabel={t("stochCltDistribution")}
        />
      </ControlGroup>
      <ControlGroup label={t("stochCltLevel")} hint={hint("stochCltLevelHint")}>
        <SegmentedControl<number>
          options={CLT_LEVELS.map((value) => ({ value, label: value }))}
          value={props.n}
          onChange={props.setN}
          ariaLabel={t("stochCltLevel")}
        />
      </ControlGroup>
      <div className="controls-grid">
        <SliderField
          label={t("stochCltSamples")}
          min={1000}
          max={20000}
          step={1000}
          value={props.samples}
          onChange={props.setSamples}
          formatValue={(value) => value.toLocaleString()}
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
