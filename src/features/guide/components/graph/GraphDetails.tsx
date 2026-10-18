import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { CATEGORY_LABEL_KEYS } from "../../../../modules/registry";
import type { GraphEdge, GraphNode } from "../../guide.graph";
import { nodeColor, nodeHref } from "./useGuideGraph";

type Props = {
  node: GraphNode | null;
  edges: GraphEdge[];
  byId: Map<string, GraphNode>;
  label: (n: GraphNode) => string;
};

const SHORT_LIST = 6;

/// Side panel: the active node, a button to open it, and its links grouped by kind (empty groups are left out).
export default function GraphDetails({ node, edges, byId, label }: Props) {
  const { t } = useI18n();
  if (!node) return <aside className="gg-details"><p className="gg-muted">{t("ggEmpty")}</p></aside>;

  const related = (pick: (e: GraphEdge) => string | null) =>
    edges.map(pick).filter((id): id is string => Boolean(id)).map((id) => byId.get(id)).filter((n): n is GraphNode => Boolean(n));
  const out = (kind: GraphEdge["kind"]) => related((e) => (e.kind === kind && e.source === node.id ? e.target : null));
  const into = (kind: GraphEdge["kind"]) => related((e) => (e.kind === kind && e.target === node.id ? e.source : null));

  const groups: [TranslationKey, GraphNode[]][] = node.kind === "lesson"
    ? [["ggBuildsOn", out("citation")], ["ggPrevious", into("sequence")], ["ggNext", out("sequence")], ["ggCitedBy", into("citation")], ["ggLabs", out("practice")]]
    : [["ggPracticedIn", into("practice")]];
  const isStart = node.kind === "lesson" && out("citation").length === 0 && into("sequence").length === 0;

  return (
    <aside className="gg-details" aria-live="polite">
      <div className="gg-details-head">
        <span className="gg-dot" style={{ background: nodeColor(node) }} aria-hidden="true" />
        <span className="gg-muted">{node.kind === "lesson" ? t(CATEGORY_LABEL_KEYS[node.track]) : t("ggLab")}</span>
      </div>
      <h2 className="gg-details-title">{label(node)}</h2>
      <Link className="gg-details-open" to={nodeHref(node)}>
        {t(node.kind === "lesson" ? "ggOpenLesson" : "ggOpenLab")} →
      </Link>
      {isStart && <p className="gg-muted">{t("ggStartingPoint")}</p>}
      {groups.filter(([, list]) => list.length > 0).map(([key, list]) => (
        <DetailsGroup key={key} title={t(key)} list={list} label={label} />
      ))}
    </aside>
  );
}

function DetailsGroup({ title, list, label }: { title: string; list: GraphNode[]; label: (n: GraphNode) => string }) {
  const { t } = useI18n();
  const [all, setAll] = useState(false);
  const shown = all ? list : list.slice(0, SHORT_LIST);
  return (
    <section className="gg-details-group">
      <h3>{title} <span className="gg-count">{list.length}</span></h3>
      <ul>
        {shown.map((n) => (
          <li key={n.id}>
            <span className="gg-dot" style={{ background: nodeColor(n) }} aria-hidden="true" />
            <Link to={nodeHref(n)}>{label(n)}</Link>
          </li>
        ))}
      </ul>
      {list.length > SHORT_LIST && (
        <button type="button" className="gg-more" onClick={() => setAll(!all)}>
          {all ? t("ggShowFewer") : t("ggShowAll", { n: list.length })}
        </button>
      )}
    </section>
  );
}
