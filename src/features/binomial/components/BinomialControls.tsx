import NumberStepper from "../../../components/NumberStepper";
import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliederField";
import type { ExerciseStyle, OptionKind } from "../binomial.types";

type BinomialControlsProps = {
  S0: number;
  K: number;
  r: number;
  sigma: number;
  T: number;
  steps: number;
  optionKind: OptionKind;
  exerciseStyle: ExerciseStyle;
  controlsOpen: boolean;
  onToggleControls: () => void;
  onS0Change: (value: number) => void;
  onKChange: (value: number) => void;
  onRChange: (value: number) => void;
  onSigmaChange: (value: number) => void;
  onTChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onOptionKindChange: (value: OptionKind) => void;
  onExerciseStyleChange: (value: ExerciseStyle) => void;
};

export default function BinomialControls({
  S0,
  K,
  r,
  sigma,
  T,
  steps,
  optionKind,
  exerciseStyle,
  controlsOpen,
  onToggleControls,
  onS0Change,
  onKChange,
  onRChange,
  onSigmaChange,
  onTChange,
  onStepsChange,
  onOptionKindChange,
  onExerciseStyleChange,
}: BinomialControlsProps) {
  return (
    <SectionCard
      title=""
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleControls}>
          {controlsOpen ? "Összecsukás" : "Megjelenítés"}
        </button>
      }
    >
      <div className="metric-switch">
        <button
          type="button"
          className={optionKind === "call" ? "metric-button active" : "metric-button"}
          onClick={() => onOptionKindChange("call")}
        >
          Call
        </button>
        <button
          type="button"
          className={optionKind === "put" ? "metric-button active" : "metric-button"}
          onClick={() => onOptionKindChange("put")}
        >
          Put
        </button>
      </div>

      <div className="metric-switch">
        <button
          type="button"
          className={
            exerciseStyle === "european" ? "metric-button active" : "metric-button"
          }
          onClick={() => onExerciseStyleChange("european")}
        >
          Európai
        </button>
        <button
          type="button"
          className={
            exerciseStyle === "american" ? "metric-button active" : "metric-button"
          }
          onClick={() => onExerciseStyleChange("american")}
        >
          Amerikai
        </button>
      </div>

      {controlsOpen ? (
        <>
          <div className="controls-grid">
            <SliderField
              label="S₀ (kezdeti ár)"
              min={20}
              max={200}
              step={1}
              value={S0}
              onChange={onS0Change}
            />

            <SliderField
              label="K (strike)"
              min={20}
              max={200}
              step={1}
              value={K}
              onChange={onKChange}
            />

            <SliderField
              label="r (kamat)"
              min={0}
              max={0.2}
              step={0.005}
              value={r}
              onChange={onRChange}
              formatValue={(v) => v.toFixed(3)}
            />

            <SliderField
              label="σ (volatilitás)"
              min={0.01}
              max={1}
              step={0.01}
              value={sigma}
              onChange={onSigmaChange}
              formatValue={(v) => v.toFixed(2)}
            />

            <SliderField
              label="T (év)"
              min={0.25}
              max={5}
              step={0.25}
              value={T}
              onChange={onTChange}
              formatValue={(v) => `${v.toFixed(2)} év`}
            />

            <NumberStepper
              label="Lépések száma"
              min={1}
              max={8}
              step={1}
              value={steps}
              onChange={onStepsChange}
              formatValue={(v) => `${v} db`}
            />
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">Opció típusa</div>
              <div className="stat-value">
                {optionKind === "call" ? "Call" : "Put"} /{" "}
                {exerciseStyle === "european" ? "Európai" : "Amerikai"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          <div>S₀ = {S0}</div>
          <div>K = {K}</div>
          <div>r = {r.toFixed(3)}</div>
          <div>σ = {sigma.toFixed(2)}</div>
          <div>T = {T.toFixed(2)}</div>
          <div>lépések = {steps}</div>
          <div>{optionKind}</div>
          <div>{exerciseStyle}</div>
        </div>
      )}
    </SectionCard>
  );
}