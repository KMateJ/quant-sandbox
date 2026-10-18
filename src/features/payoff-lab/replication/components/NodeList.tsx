import { ControlGroup } from "../../../../components/ui";
import { sliderFill } from "../../../../components/sliderFill";
import { useI18n } from "../../../../i18n";
import type { ReplicationModel } from "../useReplication";

/// Clicked nodes sorted by S_T; each edge to the next node has its own steepness.
export default function NodeList({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { shape, removeNode, clearNodes, setEdgeSteepness } = model;
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
          {rows.map((row, i) => {
            const steepness = row.steepness ?? shape.steepness;
            const hasEdge = i < rows.length - 1;
            return (
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
                {hasEdge && (
                  <label className="repl-edge">
                    <span>{t("replEdge")}</span>
                    <input
                      className="slider-input"
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={steepness}
                      style={sliderFill(steepness, 0, 1)}
                      aria-label={t("replEdgeAria", { a: row.x, b: rows[i + 1].x })}
                      onChange={(e) => setEdgeSteepness(row.index, Number(e.target.value))}
                    />
                    <span className={row.steepness === undefined ? "repl-edge-value" : "repl-edge-value repl-edge-value--own"}>
                      {Math.round(steepness * 100)}%
                    </span>
                  </label>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ControlGroup>
  );
}
