import { useState, type ReactNode } from "react";
import { useI18n } from "../../../../i18n";
import type { Direction, PositionGroup, StrategyLeg } from "../../payoff.types";
import { netCost } from "../../payoff.positions";
import NumericInput from "./NumericInput";

type Props = {
  group: PositionGroup;
  /// Member legs with the position's quantity and direction already applied.
  effectiveLegs: StrategyLeg[];
  onUpdate: (patch: Partial<PositionGroup>) => void;
  onUngroup: () => void;
  onRemove: () => void;
  /// Appends a fresh leg defined in this position's own terms.
  onAddLeg: () => void;
  children: ReactNode;
};

/// A bundle of legs treated as one instrument: named, scaled and flipped as a whole.
export default function PositionCard({ group, effectiveLegs, onUpdate, onUngroup, onRemove, onAddLeg, children }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const cost = netCost(effectiveLegs);

  return (
    <section className="payoff-position-card" aria-label={group.name}>
      <div className="payoff-position-head">
        <button
          type="button"
          className="payoff-position-toggle"
          aria-expanded={open}
          aria-label={open ? t("payoffCollapse") : t("payoffExpand")}
          onClick={() => setOpen(!open)}
        >
          {open ? "▾" : "▸"}
        </button>
        <input
          className="payoff-input payoff-position-name"
          value={group.name}
          aria-label={t("payoffPositionName")}
          onChange={(e) => onUpdate({ name: e.target.value })}
        />
      </div>

      <div className="payoff-position-controls">
        <select
          className="payoff-select"
          value={group.direction}
          aria-label={t("payoffFieldDirection")}
          onChange={(e) => onUpdate({ direction: e.target.value as Direction })}
        >
          <option value="long">{t("payoffDirectionLong")}</option>
          <option value="short">{t("payoffDirectionShort")}</option>
        </select>
        <label className="payoff-position-qty">
          <span>×</span>
          <NumericInput
            value={group.quantity}
            fallbackValue={1}
            inputMode="decimal"
            onCommit={(quantity) => onUpdate({ quantity: quantity > 0 ? quantity : group.quantity })}
          />
        </label>
      </div>

      <div className="payoff-position-meta">
        <span>{t("payoffPositionLegs", { n: effectiveLegs.length })}</span>
        <span>
          {t("payoffPositionCost")}: <strong>{cost.toFixed(2)}</strong>
        </span>
      </div>

      {open && <div className="payoff-position-legs">{children}</div>}

      <div className="payoff-position-actions">
        <button
          type="button"
          className="metric-button"
          onClick={() => {
            onAddLeg();
            setOpen(true);
          }}
        >
          {t("payoffAddLegToPosition")}
        </button>
        <button type="button" className="metric-button" onClick={onUngroup}>{t("payoffUngroup")}</button>
        <button type="button" className="delete-leg-button" onClick={onRemove}>{t("payoffDeletePosition")}</button>
      </div>
    </section>
  );
}
