import { sliderFill } from "./sliderFill";
import { useId } from "react";
import { IntuitionTrigger } from "./intuition";

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
  sectionId?: string;
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
  sectionId,
}: SliderFieldProps) {
  const id = useId();
  const pos = (v: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);
  return (
    <div className="slider-field">
      <div className="slider-row">
        <span className="slider-label"><label htmlFor={id}>{label}</label>{sectionId && <IntuitionTrigger sectionId={sectionId} />}</span>
        <span className="value-badge">
          {formatValue ? formatValue(value) : String(value)}
        </span>
      </div>

      <div className={marks ? "slider-track-wrap" : undefined}>
        <input
          id={id}
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
    </div>
  );
}