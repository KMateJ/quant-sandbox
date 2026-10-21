import { useI18n } from "../../../i18n";
import type { StrategyLeg } from "../payoff.types";

type Props = {
  legs: StrategyLeg[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: () => void;
};

/// Leg chips of the phone dock with add / remove buttons.
export default function PayoffDockLegs({ legs, activeId, onSelect, onAdd, onRemove }: Props) {
  const { t } = useI18n();
  return (
    <div className="payoff-dock-legs">
      {legs.map((leg, index) => (
        <button
          key={leg.id}
          type="button"
          className={leg.id === activeId ? "dock-leg-chip active" : "dock-leg-chip"}
          onClick={() => onSelect(leg.id)}
        >
          {t("payoffLegTitle")} {index + 1}
        </button>
      ))}
      <button type="button" className="dock-chip dock-chip--add" onClick={onAdd} aria-label={t("payoffAddLeg")}>
        +
      </button>
      {legs.length > 1 && (
        <button type="button" className="dock-chip dock-chip--del" onClick={onRemove} aria-label={t("payoffDelete")}>
          ✕
        </button>
      )}
    </div>
  );
}
