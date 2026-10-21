import { useState } from "react";
import { useI18n } from "../../../i18n";
import { useChartInViewport } from "../../../components/chartConfig";
import { sliderFill } from "../../../components/sliderFill";
import type { StrategyLeg } from "../payoff.types";
import { createEmptyLeg } from "../payoff.legs";
import { buildDockFields } from "./payoffDock.fields";
import PayoffDockLegs from "./PayoffDockLegs";

type PayoffDockProps = {
  legs: StrategyLeg[];
  onChange: (legs: StrategyLeg[]) => void;
  onClearPreset: () => void;
};

export default function PayoffDock({ legs, onChange, onClearPreset }: PayoffDockProps) {
  const { t } = useI18n();
  const [activeLegId, setActiveLegId] = useState<string | null>(legs[0]?.id ?? null);
  const [activeFieldKey, setActiveFieldKey] = useState<string>("type");
  const chartInView = useChartInViewport();

  const activeLeg = legs.find((leg) => leg.id === activeLegId) ?? legs[0] ?? null;

  function commitLeg(patch: Partial<StrategyLeg>) {
    if (!activeLeg) return;
    onClearPreset();
    onChange(legs.map((leg) => (leg.id === activeLeg.id ? { ...leg, ...patch } : leg)));
  }

  function addLeg() {
    onClearPreset();
    const next = createEmptyLeg(legs.length + 1);
    onChange([...legs, next]);
    setActiveLegId(next.id);
    setActiveFieldKey("type");
  }

  function removeActiveLeg() {
    if (!activeLeg || legs.length <= 1) return;
    onClearPreset();
    const remaining = legs.filter((leg) => leg.id !== activeLeg.id);
    onChange(remaining);
    setActiveLegId(remaining[0]?.id ?? null);
  }

  const legChips = (
    <PayoffDockLegs
      legs={legs}
      activeId={activeLeg?.id ?? null}
      onSelect={setActiveLegId}
      onAdd={addLeg}
      onRemove={removeActiveLeg}
    />
  );

  if (!activeLeg) {
    return (
      <div className="slider-dock payoff-dock" role="group">
        <div className="slider-dock-handle" aria-hidden="true" />
        {legChips}
      </div>
    );
  }

  const fields = buildDockFields(activeLeg, t);
  const activeField = fields.find((field) => field.key === activeFieldKey) ?? fields[0];

  return (
    <div
      className={`slider-dock payoff-dock ${chartInView ? "" : "slider-dock--hidden"}`}
      role="group"
      aria-label={t("payoffLegTitle")}
    >
      <div className="slider-dock-handle" aria-hidden="true" />
      {legChips}

      <div className="slider-dock-chips">
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            className={field.key === activeField.key ? "dock-chip active" : "dock-chip"}
            onClick={() => setActiveFieldKey(field.key)}
          >
            <span className="dock-chip-symbol">{field.label}</span>
            <span className="dock-chip-value">
              {field.kind === "slider"
                ? field.format(field.value)
                : field.options.find((o) => o.value === field.value)?.label ?? field.value}
            </span>
          </button>
        ))}
      </div>

      <div className="slider-dock-control">
        <span className="dock-current-name">{activeField.label}</span>
        {activeField.kind === "slider" ? (
          <div className="slider-dock-row">
            <input
              className="slider-input"
              type="range"
              min={activeField.min}
              max={activeField.max}
              step={activeField.step}
              value={activeField.value}
              style={sliderFill(activeField.value, activeField.min, activeField.max)}
              onChange={(event) => commitLeg(activeField.patch(Number(event.target.value)))}
            />
            <span className="dock-current-value">{activeField.format(activeField.value)}</span>
          </div>
        ) : (
          <div className="payoff-dock-options">
            {activeField.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === activeField.value ? "payoff-dock-option active" : "payoff-dock-option"}
                onClick={() => commitLeg(activeField.patch(option.value))}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
