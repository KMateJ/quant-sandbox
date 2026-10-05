import { sliderFill } from "./sliderFill";

type SliderMark = {
  value: number;
  label: string;
};

type SliderFieldProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  /// Labelled reference ticks along the track; replaces the plain min/max row.
  marks?: SliderMark[];
};

export default function SliderField({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  marks,
}: SliderFieldProps) {
  const pos = (v: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);
  return (
    <label className="slider-field">
      <div className="slider-row">
        <span className="slider-label">{label}</span>
        <span className="value-badge">
          {formatValue ? formatValue(value) : String(value)}
        </span>
      </div>

      <div className={marks ? "slider-track-wrap" : undefined}>
        <input
          className="slider-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={sliderFill(value, min, max)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {marks && (
          <div className="slider-ticks" aria-hidden="true">
            {marks.map((m) => (
              <span
                key={m.value}
                className="slider-tick"
                style={{ left: `${pos(m.value)}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {marks ? (
        <div className="slider-marks">
          {marks.map((m) => (
            <span
              key={m.value}
              className="slider-mark"
              style={{ left: `${pos(m.value)}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      ) : (
        <div className="slider-minmax">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </label>
  );
}