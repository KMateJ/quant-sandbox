import { Link } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import type { GraphNode } from "../../guide.graph";
import { nodeColor, nodeHref } from "./useGuideGraph";

type Props = {
  target: GraphNode;
  /// Lessons in reading order, ending with `target`.
  steps: GraphNode[];
  direct: ReadonlySet<string>;
  label: (n: GraphNode) => string;
  isRead: (n: GraphNode) => boolean;
  onClear: () => void;
};

/// The reading path to a selected lesson: numbered steps, read ticks and the lessons it builds on directly.
export default function GraphPath({ target, steps, direct, label, isRead, onClear }: Props) {
  const { t } = useI18n();
  const before = steps.filter((n) => n.id !== target.id);
  const read = before.filter(isRead).length;

  return (
    <section className="gg-path" aria-label={t("ggPathTitle")}>
      <div className="gg-path-head">
        <h3>{t("ggPathTitle")}</h3>
        <button type="button" className="gg-reset" onClick={onClear}>{t("ggClear")}</button>
      </div>
      {before.length === 0 ? (
        <p className="gg-muted">{t("ggPathStart")}</p>
      ) : (
        <p className="gg-muted">{t("ggPathProgress", { read, total: before.length })}</p>
      )}
      <ol className="gg-path-steps">
        {steps.map((n, i) => (
          <li key={n.id} className={[n.id === target.id ? "is-target" : "", isRead(n) ? "is-read" : ""].join(" ").trim() || undefined}>
            <span className="gg-path-num" style={{ background: nodeColor(n) }}>{i + 1}</span>
            <span className="gg-path-text">
              <Link to={nodeHref(n)}>{label(n)}</Link>
              {direct.has(n.id) && <span className="gg-muted"> · {t("ggPathDirect")}</span>}
              {isRead(n) && <span className="gg-muted"> · {t("ggRead")}</span>}
            </span>
          </li>
        ))}
      </ol>
      <Link className="gg-path-open" to={nodeHref(target)}>
        {t(target.kind === "lesson" ? "ggOpenLesson" : "ggOpenLab")}
      </Link>
    </section>
  );
}
