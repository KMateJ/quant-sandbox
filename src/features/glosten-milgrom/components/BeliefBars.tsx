import { useI18n } from "../../../i18n";
import { fmt3 } from "./gmChart";

/// Two horizontal bars: P(V = 0) and P(V = 1) under the maker's current belief.
export default function BeliefBars({ belief }: { belief: number }) {
  const { t } = useI18n();
  const rows = [
    { key: "v0", label: t("glmValue0"), p: 1 - belief },
    { key: "v1", label: t("glmValue1"), p: belief },
  ];
  return (
    <div className="glm-belief-bars">
      {rows.map((r) => (
        <div key={r.key} className="glm-belief-row">
          <span className="glm-belief-label">{r.label}</span>
          <span className="glm-belief-track">
            <span className="glm-belief-fill" style={{ width: `${r.p * 100}%` }} />
          </span>
          <span className="glm-belief-value">{fmt3(r.p)}</span>
        </div>
      ))}
    </div>
  );
}
