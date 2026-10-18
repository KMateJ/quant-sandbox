import { ControlGroup } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { ReplicationModel } from "../useReplication";

/// Clicked nodes sorted by S_T, each removable; empty state nudges toward the chart.
export default function NodeList({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { shape, removeNode, clearNodes } = model;
  const rows = shape.nodes
    .map((node, index) => ({ ...node, index }))
    .sort((a, b) => a.x - b.x);

  return (
    <ControlGroup
      label={`${t("replNodes")} (${rows.length})`}
      hint={rows.length ? (
        <button type="button" className="repl-link-button" onClick={clearNodes}>
          {t("replClear")}
        </button>
      ) : null}
    >
      {rows.length === 0 ? (
        <p className="repl-empty">{t("replEmpty")}</p>
      ) : (
        <ul className="repl-node-list">
          {rows.map((row) => (
            <li key={row.index} className="repl-node-row">
              <span className="repl-node-coord">{t("replNodeX")} {row.x.toFixed(1)}</span>
              <span className="repl-node-coord">{t("replNodeY")} {row.y.toFixed(1)}</span>
              <button
                type="button"
                className="delete-leg-button"
                aria-label={t("replRemove")}
                onClick={() => removeNode(row.index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </ControlGroup>
  );
}
