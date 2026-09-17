import { useState } from "react";
import { useChartInViewport } from "./chartConfig";

export type SliderDescriptor = {
  key: string;
  symbol: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
};

type SliderDockProps = {
  sliders: SliderDescriptor[];
};

// Fixed bottom control bar for phones: pick a parameter via chips, drag one
// slider. Only visible while a chart is on screen.
export default function SliderDock({ sliders }: SliderDockProps) {
  const [activeKey, setActiveKey] = useState(sliders[0]?.key);
  const chartInView = useChartInViewport();
  const active = sliders.find((slider) => slider.key === activeKey) ?? sliders[0];

  if (!active) return null;

  return (
    <div
      className={`slider-dock ${chartInView ? "" : "slider-dock--hidden"}`}
      role="group"
      aria-label={active.name}
    >
      <div className="slider-dock-handle" aria-hidden="true" />

      <div className="slider-dock-chips">
        {sliders.map((slider) => (
          <button
            key={slider.key}
            type="button"
            className={slider.key === active.key ? "dock-chip active" : "dock-chip"}
            onClick={() => setActiveKey(slider.key)}
          >
            <span className="dock-chip-symbol">{slider.symbol}</span>
            <span className="dock-chip-value">{slider.format(slider.value)}</span>
          </button>
        ))}
      </div>

      <div className="slider-dock-control">
        <span className="dock-current-name">{active.name}</span>
        <div className="slider-dock-row">
          <input
            className="slider-input"
            type="range"
            min={active.min}
            max={active.max}
            step={active.step}
            value={active.value}
            onChange={(event) => active.onChange(Number(event.target.value))}
          />
          <span className="dock-current-value">{active.format(active.value)}</span>
        </div>
      </div>
    </div>
  );
}
