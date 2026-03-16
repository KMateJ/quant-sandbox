import SectionCard from "../../../components/SectionCard";
import NumberStepper from "../../../components/NumberStepper";
import type {
  Direction,
  InstrumentType,
  PresetKey,
  StrategyLeg,
  ViewMode,
} from "../payoff.types";
import { getPresetStrategy } from "../payoff.presets";

type PayoffBuilderProps = {
  legs: StrategyLeg[];
  mode: ViewMode;
  controlsOpen: boolean;
  showComponents: boolean;
  onToggleControls: () => void;
  onModeChange: (mode: ViewMode) => void;
  onShowComponentsChange: (value: boolean) => void;
  onChange: (legs: StrategyLeg[]) => void;
};

function createEmptyLeg(index: number): StrategyLeg {
  return {
    id: `leg-${Date.now()}-${index}`,
    type: "call",
    direction: "long",
    quantity: 1,
    strike: 100,
    premium: 0,
    entryPrice: 100,
    forwardPrice: 100,
    cashAmount: 100,
    rate: 0.05,
  };
}

const presets: { key: PresetKey; label: string }[] = [
  { key: "long-call", label: "Long Call" },
  { key: "long-put", label: "Long Put" },
  { key: "long-stock", label: "Long Stock" },
  { key: "cash", label: "Cash" },
  { key: "covered-call", label: "Covered Call" },
  { key: "protective-put", label: "Protective Put" },
  { key: "synthetic-long-forward", label: "Synthetic Long Forward" },
  { key: "synthetic-short-forward", label: "Synthetic Short Forward" },
  { key: "long-call-butterfly", label: "Call Butterfly" },
];

export default function PayoffBuilder({
  legs,
  mode,
  controlsOpen,
  showComponents,
  onToggleControls,
  onModeChange,
  onShowComponentsChange,
  onChange,
}: PayoffBuilderProps) {
  function addLeg() {
    onChange([...legs, createEmptyLeg(legs.length + 1)]);
  }

  function removeLeg(id: string) {
    onChange(legs.filter((leg) => leg.id !== id));
  }

  function updateLeg(id: string, patch: Partial<StrategyLeg>) {
    onChange(legs.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg)));
  }

  function applyPreset(key: PresetKey) {
    onChange(getPresetStrategy(key));
  }

  function ensureDefaults(
    type: InstrumentType,
    leg: StrategyLeg
  ): Partial<StrategyLeg> {
    if (type === "call" || type === "put") {
      return {
        type,
        strike: leg.strike ?? 100,
        premium: leg.premium ?? 0,
      };
    }

    if (type === "forward") {
      return {
        type,
        strike: leg.strike ?? 100,
        forwardPrice: leg.forwardPrice ?? leg.strike ?? 100,
      };
    }

    if (type === "stock") {
      return {
        type,
        entryPrice: leg.entryPrice ?? 100,
      };
    }

    if (type === "cash") {
      return {
        type,
        cashAmount: leg.cashAmount ?? 100,
        rate: leg.rate ?? 0.05,
      };
    }

    return { type };
  }

  return (
    <SectionCard
      className="payoff-builder-card"
      title=""
      headerLeft={
        <button
          type="button"
          className="toggle-button"
          onClick={onToggleControls}
        >
          {controlsOpen ? "+" : "-"}
        </button>
      }
    >
      <div className="metric-switch">
        <button
          type="button"
          className={
            mode === "payoff" ? "metric-button active" : "metric-button"
          }
          onClick={() => onModeChange("payoff")}
        >
          Payoff
        </button>
        <button
          type="button"
          className={
            mode === "profit" ? "metric-button active" : "metric-button"
          }
          onClick={() => onModeChange("profit")}
        >
          Profit
        </button>
        <button
          type="button"
          className={showComponents ? "metric-button active" : "metric-button"}
          onClick={() => onShowComponentsChange(!showComponents)}
        >
          Lábak külön
        </button>
      </div>

      <div className="metric-switch" style={{ marginBottom: 18 }}>
        {presets.map((preset) => (
          <button
            key={preset.key}
            type="button"
            className="metric-button"
            onClick={() => applyPreset(preset.key)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {controlsOpen ? (
        <div className="controls-grid">
          {legs.map((leg, index) => (
            <div key={leg.id} className="payoff-leg-card">
              <div className="payoff-leg-header">
                <div className="stat-title">Láb {index + 1}</div>
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => removeLeg(leg.id)}
                >
                  Törlés
                </button>
              </div>

              <div className="payoff-leg-grid">
                <label className="payoff-field">
                  <span className="payoff-label">Instrumentum</span>
                  <select
                    className="payoff-select"
                    value={leg.type}
                    onChange={(e) =>
                      updateLeg(
                        leg.id,
                        ensureDefaults(e.target.value as InstrumentType, leg)
                      )
                    }
                  >
                    <option value="call">Call</option>
                    <option value="put">Put</option>
                    <option value="stock">Stock</option>
                    <option value="forward">Forward</option>
                    <option value="cash">Cash</option>
                  </select>
                </label>

                <label className="payoff-field">
                  <span className="payoff-label">Irány</span>
                  <select
                    className="payoff-select"
                    value={leg.direction}
                    onChange={(e) =>
                      updateLeg(leg.id, {
                        direction: e.target.value as Direction,
                      })
                    }
                  >
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </label>

                <div className="payoff-field payoff-field-full">
                  <span className="payoff-label">Mennyiség</span>
                  <NumberStepper
                    label=""
                    min={1}
                    max={20}
                    step={1}
                    value={leg.quantity}
                    onChange={(value) => updateLeg(leg.id, { quantity: value })}
                    formatValue={(value) => `${value} db`}
                  />
                </div>

                {(leg.type === "call" || leg.type === "put") && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">Strike</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.strike ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            strike:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">Prémium</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.premium ?? 0}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            premium:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {leg.type === "forward" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">Forward ár</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.forwardPrice ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            forwardPrice:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">Strike marker</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.strike ?? leg.forwardPrice ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            strike:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {leg.type === "stock" && (
                  <label className="payoff-field">
                    <span className="payoff-label">Belépési ár</span>
                    <input
                      className="payoff-input"
                      type="number"
                      value={leg.entryPrice ?? 100}
                      onChange={(e) =>
                        updateLeg(leg.id, {
                          entryPrice:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                )}

                {leg.type === "cash" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">Cash összeg</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.cashAmount ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            cashAmount:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">Rate</span>
                      <input
                        className="payoff-input"
                        type="number"
                        step="0.01"
                        value={leg.rate ?? 0.05}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            rate:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="metric-button" onClick={addLeg}>
            + Láb hozzáadása
          </button>
        </div>
      ) : (
        <div className="param-summary">
          <div>{legs.length} láb</div>
          <div>{mode}</div>
          <div>
            {showComponents
              ? "egyedi görbék látszanak"
              : "csak összesített görbe"}
          </div>
        </div>
      )}
    </SectionCard>
  );
}