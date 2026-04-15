import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliderField";
import NumberStepper from "../../../components/NumberStepper";
import type { OptionKind, TreeMode } from "../binomial.types";
import { useI18n } from "../../../i18n";

type BinomialControlsProps = {
  mode: TreeMode;
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  q: number;
  h: number;
  steps: number;
  optionKind: OptionKind;
  controlsOpen: boolean;
  onToggleControls: () => void;
  onModeChange: (value: TreeMode) => void;
  onS0Change: (value: number) => void;
  onKChange: (value: number) => void;
  onUChange: (value: number) => void;
  onDChange: (value: number) => void;
  onRChange: (value: number) => void;
  onQChange: (value: number) => void;
  onHChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onOptionKindChange: (value: OptionKind) => void;
};

export default function BinomialControls({
  mode,
  S0,
  K,
  u,
  d,
  r,
  q,
  h,
  steps,
  optionKind,
  controlsOpen,
  onToggleControls,
  onModeChange,
  onS0Change,
  onKChange,
  onUChange,
  onDChange,
  onRChange,
  onQChange,
  onHChange,
  onStepsChange,
  onOptionKindChange,
}: BinomialControlsProps) {
  const { language, t } = useI18n();
  const isRates = mode === "rates";

  const modeEquityLabel = language === "hu" ? "Részvényfa" : "Equity tree";
  const modeRatesLabel = language === "hu" ? "Kamatlábfa" : "Rate tree";
  const r0Label = language === "hu" ? "r₀ (kezdeti rövid kamat)" : "r₀ (initial short rate)";
  const qLabel = language === "hu" ? "q (up probability)" : "q (up probability)";
  const hLabel = language === "hu" ? "h (log-lépésköz)" : "h (log step size)";

  return (
    <SectionCard
      title=""
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleControls}>
          {controlsOpen ? "-" : "+"}
        </button>
      }
    >
      <div className="metric-switch" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className={mode === "equity" ? "metric-button active" : "metric-button"}
          onClick={() => onModeChange("equity")}
        >
          {modeEquityLabel}
        </button>
        <button
          type="button"
          className={mode === "rates" ? "metric-button active" : "metric-button"}
          onClick={() => onModeChange("rates")}
        >
          {modeRatesLabel}
        </button>
      </div>

      {!isRates && (
        <div className="metric-switch">
          <button
            type="button"
            className={optionKind === "call" ? "metric-button active" : "metric-button"}
            onClick={() => onOptionKindChange("call")}
          >
            {t("binomialOptionCall")}
          </button>
          <button
            type="button"
            className={optionKind === "put" ? "metric-button active" : "metric-button"}
            onClick={() => onOptionKindChange("put")}
          >
            {t("binomialOptionPut")}
          </button>
        </div>
      )}

      {controlsOpen ? (
        <>
          <div className="controls-grid">
            {isRates ? (
              <>
                <SliderField
                  label={r0Label}
                  min={0}
                  max={0.3}
                  step={0.01}
                  value={r}
                  onChange={onRChange}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label={qLabel}
                  min={0}
                  max={1}
                  step={0.01}
                  value={q}
                  onChange={onQChange}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label={hLabel}
                  min={0.02}
                  max={0.7}
                  step={0.01}
                  value={h}
                  onChange={onHChange}
                  formatValue={(v) => v.toFixed(2)}
                />
              </>
            ) : (
              <>
                <SliderField
                  label={t("binomialS0Label")}
                  min={20}
                  max={200}
                  step={1}
                  value={S0}
                  onChange={onS0Change}
                />

                <SliderField
                  label={t("binomialKLabel")}
                  min={20}
                  max={200}
                  step={1}
                  value={K}
                  onChange={onKChange}
                />
              </>
            )}

            {!isRates && (
              <>
                <SliderField
                  label={t("binomialULabel")}
                  min={1.01}
                  max={2}
                  step={0.01}
                  value={u}
                  onChange={onUChange}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label={t("binomialDLabel")}
                  min={0.1}
                  max={0.99}
                  step={0.01}
                  value={d}
                  onChange={onDChange}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label={t("binomialRLabel")}
                  min={0}
                  max={0.3}
                  step={0.01}
                  value={r}
                  onChange={onRChange}
                  formatValue={(v) => v.toFixed(2)}
                />
              </>
            )}

            <NumberStepper
              label={t("binomialStepsLabel")}
              min={1}
              max={8}
              step={1}
              value={steps}
              onChange={onStepsChange}
              formatValue={(v) => `${v} ${t("binomialStepsUnit")}`}
            />
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">{t("binomialPeriodLength")}</div>
              <div className="stat-value">{t("binomialPeriodValue")}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          <div>{isRates ? `r₀ = ${r.toFixed(2)}` : `S₀ = ${S0}`}</div>
          {isRates ? <div>h = {h.toFixed(2)}</div> : <div>K = {K}</div>}
          <div>u = {u.toFixed(2)}</div>
          <div>d = {d.toFixed(2)}</div>
          {isRates ? <div>q = {q.toFixed(2)}</div> : <div>r = {r.toFixed(2)}</div>}
          <div>N = {steps}</div>
          <div>{isRates ? modeRatesLabel : optionKind}</div>
        </div>
      )}
    </SectionCard>
  );
}
