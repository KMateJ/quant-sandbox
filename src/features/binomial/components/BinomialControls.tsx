import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliderField";
import NumberStepper from "../../../components/NumberStepper";
import type { OptionKind } from "../binomial.types";

type BinomialControlsProps = {
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  steps: number;
  optionKind: OptionKind;
  controlsOpen: boolean;
  onToggleControls: () => void;
  onS0Change: (value: number) => void;
  onKChange: (value: number) => void;
  onUChange: (value: number) => void;
  onDChange: (value: number) => void;
  onRChange: (value: number) => void;
  onStepsChange: (value: number) => void;
  onOptionKindChange: (value: OptionKind) => void;
};

export default function BinomialControls({
  S0,
  K,
  u,
  d,
  r,
  steps,
  optionKind,
  controlsOpen,
  onToggleControls,
  onS0Change,
  onKChange,
  onUChange,
  onDChange,
  onRChange,
  onStepsChange,
  onOptionKindChange,
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
              label="u (up factor)"
              min={1.01}
              max={2}
              step={0.01}
              value={u}
              onChange={onUChange}
              formatValue={(v) => v.toFixed(2)}
            />

            <SliderField
              label="d (down factor)"
              min={0.1}
              max={0.99}
              step={0.01}
              value={d}
              onChange={onDChange}
              formatValue={(v) => v.toFixed(2)}
            />

            <SliderField
              label="r (éves kamat)"
              min={0}
              max={0.3}
              step={0.01}
              value={r}
              onChange={onRChange}
              formatValue={(v) => v.toFixed(2)}
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
              <div className="stat-title">Periódushossz</div>
              <div className="stat-value">Δt = 1 év</div>
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          <div>S₀ = {S0}</div>
          <div>K = {K}</div>
          <div>u = {u.toFixed(2)}</div>
          <div>d = {d.toFixed(2)}</div>
          <div>r = {r.toFixed(2)}</div>
          <div>N = {steps}</div>
          <div>{optionKind}</div>
        </div>
      )}
    </SectionCard>
  );
}