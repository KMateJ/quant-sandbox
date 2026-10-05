type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /// Treat the model value as a fraction but edit it in percent (×100 with a % suffix).
  percent?: boolean;
  suffix?: string;
};

/// Compact labelled numeric input for precise parameter entry (no slider).
export default function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  percent = false,
  suffix,
}: NumberInputProps) {
  const factor = percent ? 100 : 1;
  const display = Number((value * factor).toFixed(4));
  const unit = suffix ?? (percent ? "%" : "");

  const clamp = (v: number) => {
    let next = v / factor;
    if (min != null) next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    return next;
  };

  return (
    <label className="num-field">
      <span className="num-label">{label}</span>
      <span className="num-input-wrap">
        <input
          className="num-input"
          type="number"
          value={display}
          step={step ?? (percent ? 0.5 : 1)}
          onChange={(e) => {
            const raw = Number(e.target.value);
            if (!Number.isNaN(raw)) onChange(clamp(raw));
          }}
        />
        {unit && <span className="num-suffix">{unit}</span>}
      </span>
    </label>
  );
}
