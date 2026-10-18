import { useI18n } from "../../../../i18n";
import type { PositionGroup } from "../../payoff.types";

type Props = {
  selectedCount: number;
  groups: PositionGroup[];
  onGroup: () => void;
  onAddTo: (groupId: string) => void;
  onClear: () => void;
};

/// Actions for ticked legs: bundle them into a new position or move them into an existing one.
export default function GroupBar({ selectedCount, groups, onGroup, onAddTo, onClear }: Props) {
  const { t } = useI18n();

  if (selectedCount === 0) {
    return (
      <div className="payoff-group-bar">
        <span className="payoff-group-hint">{t("payoffGroupHint")}</span>
      </div>
    );
  }

  return (
    <div className="payoff-group-bar" aria-live="polite">
      <button type="button" className="metric-button active" onClick={onGroup}>
        {t("payoffGroupSelected", { n: selectedCount })}
      </button>
      {groups.length > 0 && (
        <select
          className="payoff-select payoff-group-target"
          value=""
          aria-label={t("payoffAddToPosition")}
          onChange={(e) => e.target.value && onAddTo(e.target.value)}
        >
          <option value="">{t("payoffAddToPosition")}</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      )}
      <button type="button" className="repl-link-button" onClick={onClear}>
        {t("payoffClearSelection")}
      </button>
    </div>
  );
}
