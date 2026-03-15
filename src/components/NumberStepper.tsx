type NumberStepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export default function NumberStepper({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
}: NumberStepperProps) {
  const displayValue = formatValue ? formatValue(value) : String(value);

  const decrease = () => {
    onChange(Math.max(min, Number((value - step).toFixed(10))));
  };

  const increase = () => {
    onChange(Math.min(max, Number((value + step).toFixed(10))));
  };

  return (
    <div className="slider-field">
      <div className="slider-row">
        <span className="slider-label">{label}</span>
        <span className="value-badge">{displayValue}</span>
      </div>

      <div className="stepper-row">
        <button type="button" className="stepper-button" onClick={decrease}>
          −
        </button>

        <input
          className="slider-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />

        <button type="button" className="stepper-button" onClick={increase}>
          +
        </button>
      </div>

      <div className="slider-minmax">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}