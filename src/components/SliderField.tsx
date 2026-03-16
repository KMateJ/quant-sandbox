type SliderFieldProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export default function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
}: SliderFieldProps) {
  return (
    <label className="slider-field">
      <div className="slider-row">
        <span className="slider-label">{label}</span>
        <span className="value-badge">
          {formatValue ? formatValue(value) : String(value)}
        </span>
      </div>

      <input
        className="slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="slider-minmax">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </label>
  );
}