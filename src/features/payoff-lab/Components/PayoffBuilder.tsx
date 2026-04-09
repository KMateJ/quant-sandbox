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
                    max={20}
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
                      <span className="payoff-label">
                        {t("payoffFieldPremium")}
                      </span>
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
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.payout ?? 10}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            payout: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {isGapOption(leg.type) && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{label.triggerStrike}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.triggerStrike ?? 100}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            triggerStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.settlementStrike}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.settlementStrike ?? 110}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            settlementStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
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
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.lowerStrike ?? 90}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            lowerStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.upperStrike}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.upperStrike ?? 110}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            upperStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
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
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.payout ?? 10}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            payout: e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </>
                )}

                {leg.type === "supershare" && (
                  <>
                    <label className="payoff-field">
                      <span className="payoff-label">{label.lowerStrike}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.lowerStrike ?? 90}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            lowerStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>

                    <label className="payoff-field">
                      <span className="payoff-label">{label.upperStrike}</span>
                      <input
                        className="payoff-input"
                        type="number"
                        value={leg.upperStrike ?? 110}
                        onChange={(e) =>
                          updateLeg(leg.id, {
                            upperStrike:
                              e.target.value === "" ? undefined : Number(e.target.value),
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
                      <span className="payoff-label">
                        {t("payoffFieldStrikeMarker")}
                      </span>
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
                    <span className="payoff-label">
                      {t("payoffFieldEntryPrice")}
                    </span>
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
                      <span className="payoff-label">
                        {t("payoffFieldCashAmount")}
                      </span>
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
                      <span className="payoff-label">
                        {t("payoffFieldRate")}
                      </span>
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
