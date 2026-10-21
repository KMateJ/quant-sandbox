import NumberStepper from "../../../../components/NumberStepper";
import { useI18n } from "../../../../i18n";
import type { Direction, InstrumentType, StrategyLeg } from "../../payoff.types";
import { ensureDefaults } from "../../payoff.legs";
import { EXOTIC_TYPES, LEG_FIELDS, VANILLA_TYPES } from "./legFields";
import NumericInput from "./NumericInput";

type Props = {
  leg: StrategyLeg;
  number: number;
  selected: boolean;
  onToggleSelect: () => void;
  onUpdate: (patch: Partial<StrategyLeg>) => void;
  onRemove: () => void;
};

/// Editor for one leg: selection checkbox, instrument, direction, quantity and type-specific fields.
export default function LegCard({ leg, number, selected, onToggleSelect, onUpdate, onRemove }: Props) {
  const { t } = useI18n();

  return (
    <div className={selected ? "payoff-leg-card payoff-leg-card--selected" : "payoff-leg-card"}>
      <div className="payoff-leg-header">
        <label className="payoff-leg-select">
          <input type="checkbox" checked={selected} onChange={onToggleSelect} aria-label={t("payoffSelectLeg")} />
          <span className="stat-title">{t("payoffLegTitle")} {number}</span>
        </label>
        <button type="button" className="delete-leg-button" onClick={onRemove}>
          {t("payoffDelete")}
        </button>
      </div>

      <div className="payoff-leg-grid">
        <label className="payoff-field">
          <span className="payoff-label">{t("payoffFieldInstrument")}</span>
          <select
            className="payoff-select"
            value={leg.type}
            onChange={(e) => onUpdate(ensureDefaults(e.target.value as InstrumentType, leg))}
          >
            <optgroup label={t("payoffGroupVanilla")}>
              {VANILLA_TYPES.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
            </optgroup>
            <optgroup label={t("payoffGroupExotic")}>
              {EXOTIC_TYPES.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
            </optgroup>
          </select>
        </label>

        <label className="payoff-field">
          <span className="payoff-label">{t("payoffFieldDirection")}</span>
          <select
            className="payoff-select"
            value={leg.direction}
            onChange={(e) => onUpdate({ direction: e.target.value as Direction })}
          >
            <option value="long">{t("payoffDirectionLong")}</option>
            <option value="short">{t("payoffDirectionShort")}</option>
          </select>
        </label>

        <div className="payoff-field payoff-field-full">
          <span className="payoff-label">{t("payoffFieldQuantity")}</span>
          <NumberStepper
            label=""
            min={1}
            max={1000}
            step={1}
            value={leg.quantity}
            onChange={(quantity) => onUpdate({ quantity })}
            formatValue={(value) => `${value} ${t("payoffQuantityUnit")}`}
          />
        </div>

        {LEG_FIELDS[leg.type].map((field) => (
          <label key={field.key} className={field.full ? "payoff-field payoff-field-full" : "payoff-field"}>
            <span className="payoff-label">{t(field.label)}</span>
            <NumericInput
              value={leg[field.key]}
              fallbackValue={field.fallback(leg)}
              onCommit={(value) => onUpdate({ [field.key]: value })}
              inputMode={field.decimal ? "decimal" : "numeric"}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
