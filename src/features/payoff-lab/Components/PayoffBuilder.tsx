import { useEffect, useRef, useState } from "react";
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
import { useI18n } from "../../../i18n";

type PayoffBuilderProps = {
  legs: StrategyLeg[];
  mode: ViewMode;
  controlsOpen: boolean;
  selectedPreset: PresetKey | null;
  showComponents: boolean;
  onToggleControls: () => void;
  onModeChange: (mode: ViewMode) => void;
  onPresetChange: (preset: PresetKey | null) => void;
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
    payout: 10,
    lowerStrike: 90,
    upperStrike: 110,
    triggerStrike: 100,
    settlementStrike: 110,
  };
}

function isVanillaOption(type: InstrumentType) {
  return type === "call" || type === "put";
}

function isDigitalOption(type: InstrumentType) {
  return type === "digital-call" || type === "digital-put";
}

function isAssetOption(type: InstrumentType) {
  return type === "asset-call" || type === "asset-put";
}

function isGapOption(type: InstrumentType) {
  return type === "gap-call" || type === "gap-put";
}

function formatNumericValue(value: number | undefined, fallbackValue: number) {
  const resolved = typeof value === "number" && Number.isFinite(value)
    ? value
    : fallbackValue;
  return String(resolved);
}

function parseNumericDraft(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

type NumericInputProps = {
  value: number | undefined;
  fallbackValue: number;
  onCommit: (value: number) => void;
  className?: string;
  selectOnFocus?: boolean;
  inputMode?: "numeric" | "decimal";
};

function NumericInput({
  value,
  fallbackValue,
  onCommit,
  className = "payoff-input",
  selectOnFocus = true,
  inputMode = "numeric",
}: NumericInputProps) {
  const [draft, setDraft] = useState(() =>
    formatNumericValue(value, fallbackValue)
  );
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const shouldSelectOnPointerUpRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(formatNumericValue(value, fallbackValue));
    }
  }, [fallbackValue, isEditing, value]);

  function commitDraft() {
    const parsed = parseNumericDraft(draft);

    if (parsed === null) {
      setDraft(formatNumericValue(value, fallbackValue));
      return;
    }

    onCommit(parsed);
    setDraft(String(parsed));
  }

  return (
    <input
      ref={inputRef}
      className={className}
      type="text"
      inputMode={inputMode}
      enterKeyHint="done"
      autoComplete="off"
      spellCheck={false}
      value={draft}
      onFocus={() => {
        setIsEditing(true);

        if (!selectOnFocus) return;

        shouldSelectOnPointerUpRef.current = true;
        requestAnimationFrame(() => {
          inputRef.current?.select();
        });
      }}
      onPointerUp={(event) => {
        if (!shouldSelectOnPointerUpRef.current) return;

        event.preventDefault();
        shouldSelectOnPointerUpRef.current = false;
        inputRef.current?.select();
      }}
      onChange={(event) => {
        shouldSelectOnPointerUpRef.current = false;
        setDraft(event.target.value);
      }}
      onBlur={() => {
        shouldSelectOnPointerUpRef.current = false;
        setIsEditing(false);
        commitDraft();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
          return;
        }

        if (event.key === "Escape") {
          shouldSelectOnPointerUpRef.current = false;
          setIsEditing(false);
          setDraft(formatNumericValue(value, fallbackValue));
          event.currentTarget.blur();
        }
      }}
    />
  );
}


export default function PayoffBuilder({
  legs,
  mode,
  controlsOpen,
  selectedPreset,
  showComponents,
  onToggleControls,
  onModeChange,
  onPresetChange,
  onShowComponentsChange,
  onChange,
}: PayoffBuilderProps) {
  const { language, t } = useI18n();

  const label = {
    payout: language === "hu" ? "Fix kifizetés" : "Cash payout",
    lowerStrike: language === "hu" ? "Alsó strike" : "Lower strike",
    upperStrike: language === "hu" ? "Felső strike" : "Upper strike",
    triggerStrike: language === "hu" ? "Trigger strike" : "Trigger strike",
    settlementStrike: language === "hu" ? "Elszámolási strike" : "Settlement strike",
  };

  function addLeg() {
    onPresetChange(null);
    onChange([...legs, createEmptyLeg(legs.length + 1)]);
  }

  function removeLeg(id: string) {
    onPresetChange(null);
    onChange(legs.filter((leg) => leg.id !== id));
  }

  function updateLeg(id: string, patch: Partial<StrategyLeg>) {
    onPresetChange(null);
    onChange(legs.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg)));
  }

  function applyPreset(key: PresetKey) {
    onPresetChange(key);
    onChange(getPresetStrategy(key));
  }

  function ensureDefaults(
    type: InstrumentType,
    leg: StrategyLeg
  ): Partial<StrategyLeg> {
    if (isVanillaOption(type)) {
      return {
        type,
        strike: leg.strike ?? 100,
        premium: leg.premium ?? 0,
      };
    }

    if (isDigitalOption(type)) {
      return {
        type,
        strike: leg.strike ?? 100,
        premium: leg.premium ?? 0,
        payout: leg.payout ?? 10,
      };
    }

    if (isAssetOption(type)) {
      return {
        type,
        strike: leg.strike ?? 100,
        premium: leg.premium ?? 0,
      };
    }

    if (isGapOption(type)) {
      return {
        type,
        triggerStrike: leg.triggerStrike ?? leg.strike ?? 100,
        settlementStrike: leg.settlementStrike ?? 110,
        premium: leg.premium ?? 0,
      };
    }

    if (type === "double-digital") {
      return {
        type,
        lowerStrike: leg.lowerStrike ?? 90,
        upperStrike: leg.upperStrike ?? 110,
        premium: leg.premium ?? 0,
        payout: leg.payout ?? 10,
      };
    }

    if (type === "supershare") {
      return {
        type,
        lowerStrike: leg.lowerStrike ?? 90,
        upperStrike: leg.upperStrike ?? 110,
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
          {controlsOpen ? "-" : "+"}
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
          {t("payoffBuilderShowPayoff")}
        </button>

        <button
          type="button"
          className={
            mode === "profit" ? "metric-button active" : "metric-button"
          }
          onClick={() => onModeChange("profit")}
        >
          {t("payoffBuilderShowProfit")}
        </button>

        <button
          type="button"
          className={showComponents ? "metric-button active" : "metric-button"}
          onClick={() => onShowComponentsChange(!showComponents)}
        >
          {t("payoffBuilderShowComponents")}
        </button>
      </div>

      <div className="payoff-preset-bar">
        <label className="payoff-field">
          <span className="payoff-label">{t("payoffPresetLabel")}</span>
          <select
            className="payoff-select"
            value={selectedPreset ?? "custom"}
            onChange={(e) => {
              if (e.target.value === "custom") {
                onPresetChange(null);
                return;
              }

              applyPreset(e.target.value as PresetKey);
            }}
          >
            <option value="custom">{t("payoffPresetCustom")}</option>

            <optgroup label={t("payoffPresetGroupBasics")}>
              <option value="long-call">Long Call</option>
              <option value="long-put">Long Put</option>
              <option value="long-stock">Long Stock</option>
              <option value="cash">Cash</option>
            </optgroup>

            <optgroup label={t("payoffPresetGroupStrategies")}>
              <option value="covered-call">Covered Call</option>
              <option value="protective-put">Protective Put</option>
              <option value="collar">Collar</option>
              <option value="bull-call-spread">Bull Call Spread</option>
              <option value="bear-put-spread">Bear Put Spread</option>
              <option value="long-straddle">Long Straddle</option>
              <option value="short-straddle">Short Straddle</option>
              <option value="long-strangle">Long Strangle</option>
              <option value="short-strangle">Short Strangle</option>
              <option value="risk-reversal">Risk Reversal</option>
              <option value="long-call-butterfly">Call Butterfly</option>
              <option value="box-spread">Box Spread</option>
            </optgroup>

            <optgroup label={t("payoffPresetGroupSynthetic")}>
              <option value="synthetic-long-forward">
                Synthetic Long Forward
              </option>
              <option value="synthetic-short-forward">
                Synthetic Short Forward
              </option>
            </optgroup>

            <optgroup label={language === "hu" ? "Exotikusak" : "Exotics"}>
              <option value="digital-call">Digital Call</option>
              <option value="digital-put">Digital Put</option>
              <option value="asset-call">Asset-or-Nothing Call</option>
              <option value="gap-call">Gap Call</option>
              <option value="double-digital">Double Digital</option>
              <option value="supershare">Supershare</option>
            </optgroup>
          </select>
        </label>
      </div>

      {controlsOpen ? (
        <div className="controls-grid">
          {legs.map((leg, index) => (
            <div key={leg.id} className="payoff-leg-card">
              <div className="payoff-leg-header">
                <div className="stat-title">
                  {t("payoffLegTitle")} {index + 1}
                </div>
                <button
                  type="button"
                  className="delete-leg-button"
                  onClick={() => removeLeg(leg.id)}
                >
                  {t("payoffDelete")}
                </button>
              </div>

              <div className="payoff-leg-grid">
                <label className="payoff-field">
                  <span className="payoff-label">
                    {t("payoffFieldInstrument")}
                  </span>
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
                    <optgroup label={language === "hu" ? "Vanilla" : "Vanilla"}>
                      <option value="call">{t("payoffTypeCall")}</option>
                      <option value="put">{t("payoffTypePut")}</option>
                      <option value="stock">{t("payoffTypeStock")}</option>
                      <option value="forward">{t("payoffTypeForward")}</option>
                      <option value="cash">{t("payoffTypeCash")}</option>
                    </optgroup>
                    <optgroup label={language === "hu" ? "Exotikusak" : "Exotics"}>
                      <option value="digital-call">Digital Call</option>
                      <option value="digital-put">Digital Put</option>
                      <option value="asset-call">Asset-or-Nothing Call</option>
                      <option value="asset-put">Asset-or-Nothing Put</option>
                      <option value="gap-call">Gap Call</option>
                      <option value="gap-put">Gap Put</option>
                      <option value="double-digital">Double Digital</option>
                      <option value="supershare">Supershare</option>
                    </optgroup>
                  </select>
                </label>

                <label className="payoff-field">
                  <span className="payoff-label">
                    {t("payoffFieldDirection")}
                  </span>
                  <select
                    className="payoff-select"
                    value={leg.direction}
                    onChange={(e) =>
                      updateLeg(leg.id, {
                        direction: e.target.value as Direction,
                      })
                    }
                  >
                    <option value="long">{t("payoffDirectionLong")}</option>
                    <option value="short">{t("payoffDirectionShort")}</option>
                  </select>
                </label>

                <div className="payoff-field payoff-field-full">
                  <span className="payoff-label">
                    {t("payoffFieldQuantity")}
                  </span>
                  <NumberStepper
                    label=""
                    min={1}
                    max={1000}
                    step={1}
                    value={leg.quantity}
                    onChange={(value) => updateLeg(leg.id, { quantity: value })}
                    formatValue={(value) =>
                      `${value} ${t("payoffQuantityUnit")}`
                    }
                  />
                </div>

                {(isVanillaOption(leg.type) || isAssetOption(leg.type)) && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldStrike")}
                      </span>
                      <NumericInput
                        value={leg.strike}
                        fallbackValue={100}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            strike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldPremium")}
                      </span>
                      <NumericInput
                        value={leg.premium}
                        fallbackValue={0}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            premium: value,
                          })
                        }
                        inputMode="decimal"
                      />
                    </label>
                  </>
                )}

                {isDigitalOption(leg.type) && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{t("payoffFieldStrike")}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.strike ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            strike: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{t("payoffFieldPremium")}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.premium ?? 0}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            premium: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field payoff-field-full">
                      <span className="payoff-label">{label.payout}</span>
                      <NumericInput
                        value={leg.payout}
                        fallbackValue={10}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            payout: value,
                          })
                        }
                        inputMode="decimal"
                      />
                    </label>
                  </>
                )}

                {isGapOption(leg.type) && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{label.triggerStrike}</span>
                      <NumericInput
                        value={leg.triggerStrike}
                        fallbackValue={100}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            triggerStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.settlementStrike}</span>
                      <NumericInput
                        value={leg.settlementStrike}
                        fallbackValue={110}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            settlementStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field payoff-field-full">
                      <span className="payoff-label">{t("payoffFieldPremium")}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.premium ?? 0}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            premium: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {leg.type === "double-digital" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{label.lowerStrike}</span>
                      <NumericInput
                        value={leg.lowerStrike}
                        fallbackValue={90}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            lowerStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.upperStrike}</span>
                      <NumericInput
                        value={leg.upperStrike}
                        fallbackValue={110}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            upperStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{t("payoffFieldPremium")}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.premium ?? 0}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            premium: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.payout}</span>
                      <NumericInput
                        value={leg.payout}
                        fallbackValue={10}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            payout: value,
                          })
                        }
                        inputMode="decimal"
                      />
                    </label>
                  </>
                )}

                {leg.type === "supershare" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{label.lowerStrike}</span>
                      <NumericInput
                        value={leg.lowerStrike}
                        fallbackValue={90}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            lowerStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.upperStrike}</span>
                      <NumericInput
                        value={leg.upperStrike}
                        fallbackValue={110}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            upperStrike: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field payoff-field-full">
                      <span className="payoff-label">{t("payoffFieldPremium")}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.premium ?? 0}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            premium: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}


                {leg.type === "forward" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldForwardPrice")}
                      </span>
                      <NumericInput
                        value={leg.forwardPrice}
                        fallbackValue={100}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            forwardPrice: value,
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldStrikeMarker")}
                      </span>
                      <NumericInput
                        value={leg.strike ?? leg.forwardPrice}
                        fallbackValue={100}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            strike: value,
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {leg.type === "stock" && (
                  <label className="payoff-field">
                    <span className="payoff-label">
                      {t("payoffFieldEntryPrice")}
                    </span>
                    <NumericInput
                      value={leg.entryPrice}
                      fallbackValue={100}
                      onCommit={(value) =>
                        updateLeg(leg.id, {
                          entryPrice: value,
                        })
                      }
                    />
                  </label>
                )}

                {leg.type === "cash" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldCashAmount")}
                      </span>
                      <NumericInput
                        value={leg.cashAmount}
                        fallbackValue={100}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            cashAmount: value,
                          })
                        }
                        inputMode="decimal"
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">
                        {t("payoffFieldRate")}
                      </span>
                      <NumericInput
                        value={leg.rate}
                        fallbackValue={0.05}
                        onCommit={(value) =>
                          updateLeg(leg.id, {
                            rate: value,
                          })
                        }
                        inputMode="decimal"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="metric-button" onClick={addLeg}>
            {t("payoffAddLeg")}
          </button>
        </div>
      ) : (
        <div className="param-summary">
          <div>
            {legs.length} {t("payoffCollapsedLegCount")}
          </div>
          <div>{mode === "payoff" ? t("payoffBuilderShowPayoff") : t("payoffBuilderShowProfit")}</div>
          <div>
            {showComponents
              ? t("payoffCollapsedComponentsVisible")
              : t("payoffCollapsedComponentsHidden")}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
