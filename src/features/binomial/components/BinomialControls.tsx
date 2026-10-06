import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliderField";
import NumberStepper from "../../../components/NumberStepper";
import type { SliderDescriptor } from "../../../components/SliderDock";
import { IntuitionTrigger } from "../../../components/intuition";
import type { OptionKind, TreeMode } from "../binomial.types";
import { useI18n } from "../../../i18n";

type Props = {
  mode: TreeMode;
  sliders: SliderDescriptor[];
  optionKind: OptionKind;
  controlsOpen: boolean;
  onToggleControls: () => void;
  onModeChange: (value: TreeMode) => void;
  onOptionKindChange: (value: OptionKind) => void;
};

export default function BinomialControls({
  mode, sliders, optionKind, controlsOpen, onToggleControls, onModeChange, onOptionKindChange,
}: Props) {
  const { t } = useI18n();
  const isRates = mode === "rates";
  return (
    <SectionCard
      title=""
      className="binomial-controls"
      headerLeft={
        <button type="button" className="toggle-button" aria-label={t("binomialToggleControls")} aria-expanded={controlsOpen} onClick={onToggleControls}>
          {controlsOpen ? "-" : "+"}
        </button>
      }
    >
      <div className="metric-switch intuition-reveal">
        {(["equity", "rates"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={mode === value ? "metric-button active" : "metric-button"}
            aria-pressed={mode === value}
            onClick={() => onModeChange(value)}
          >
            {t(value === "rates" ? "binomialModeRates" : "binomialModeEquity")}
          </button>
        ))}
        <IntuitionTrigger sectionId={isRates ? "short-rate-tree" : "stock-tree"} />
      </div>
      {!isRates && (
        <div className="metric-switch intuition-reveal">
          {(["call", "put"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              className={optionKind === kind ? "metric-button active" : "metric-button"}
              aria-pressed={optionKind === kind}
              onClick={() => onOptionKindChange(kind)}
            >
              {t(kind === "call" ? "binomialOptionCall" : "binomialOptionPut")}
            </button>
          ))}
          <IntuitionTrigger sectionId="spot-strike" />
        </div>
      )}
      {controlsOpen ? (
        <>
          <div className="controls-grid">
            {sliders.map((slider) => {
              const props = {
                label: slider.name, sectionId: slider.sectionId,
                min: slider.min, max: slider.max, step: slider.step,
                value: slider.value, onChange: slider.onChange,
              };
              return slider.key === "steps"
                ? <NumberStepper key={slider.key} {...props} formatValue={(value) => `${value} ${t("binomialStepsUnit")}`} />
                : <SliderField key={slider.key} {...props} formatValue={slider.format} />;
            })}
          </div>
          <div className="stats-row">
            <div className="stat-card intuition-reveal">
              <div className="stat-title">{t("binomialPeriodLength")} <IntuitionTrigger sectionId="tree-horizon" /></div>
              <div className="stat-value">{t("binomialPeriodValue")}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          {sliders.map((slider) => <div key={slider.key}>{slider.symbol} = {slider.format(slider.value)}</div>)}
          <div>{t(isRates ? "binomialModeRates" : optionKind === "call" ? "binomialOptionCall" : "binomialOptionPut")}</div>
        </div>
      )}
    </SectionCard>
  );
}
