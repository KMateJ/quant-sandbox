import { sliderFill } from "./sliderFill";
import { useId } from "react";
import { IntuitionTrigger } from "./intuition";

type NumberStepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  sectionId?: string;
};

export default function NumberStepper({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  sectionId,
}: NumberStepperProps) {
  const id = useId();
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
        <span className="slider-label"><label htmlFor={id}>{label}</label>{sectionId && <IntuitionTrigger sectionId={sectionId} />}</span>
        <span className="value-badge">{displayValue}</span>
      </div>

      <div className="stepper-row">
        <button type="button" className="stepper-button" onClick={decrease}>
          −
        </button>

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