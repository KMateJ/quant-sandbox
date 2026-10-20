import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import { CATEGORY_LABEL_KEYS } from "../../../../modules/registry";
import { guideLessons, guideTracks } from "../../guide.meta";
import { prerequisiteLevels, lessonLinks } from "../../guide.ui";
import type { GraphNode } from "../../guide.graph";
import GraphLevels from "./GraphLevels";
import { CURRICULUM_ORDER, GUIDE_GRAPH, NODE_BY_ID, nodeColor, nodeHref } from "./useGuideGraph";

type Props = {
  node: GraphNode | null;
  label: (n: GraphNode) => string;
  isRead: (n: GraphNode) => boolean;
  onSelect: (id: string) => void;
};

/// "02.04": track number and position of a lesson in its track.
function lessonCode(n: GraphNode): string {
  if (n.kind !== "lesson") return "";
  const track = guideTracks.findIndex((tr) => tr.id === n.track) + 1;
  const pos = guideLessons.filter((l) => l.track === n.track).findIndex((l) => l.id === n.lessonId) + 1;
  return `${String(track).padStart(2, "0")}.${String(pos).padStart(2, "0")}`;
}

/// Side panel: the active node, then what to read first (by distance), what it leads to and the labs that practise it.
export default function GraphDetails({ node, label, isRead, onSelect }: Props) {
  const { t } = useI18n();
  if (!node) return <aside className="gg-details"><p className="gg-muted">{t("ggEmpty")}</p></aside>;

  const lesson = node.kind === "lesson" ? node : null;
  const levels = lesson ? prerequisiteLevels(GUIDE_GRAPH.edges, lesson.id, CURRICULUM_ORDER) : [];
  const links = lesson ? lessonLinks(GUIDE_GRAPH.edges, lesson.id) : { buildsOn: [], leadsTo: [] };
  const before = levels.flatMap((l) => l.ids).map((id) => NODE_BY_ID.get(id)!);
  const trackCount = new Set(before.map((n) => (n.kind === "lesson" ? n.track : ""))).size;
  const read = before.filter(isRead).length;
  const inTrack = lesson ? guideLessons.filter((l) => l.track === lesson.track) : [];
  const labsOf = (id: string, side: "source" | "target") =>
    GUIDE_GRAPH.edges.filter((e) => e.kind === "practice" && e[side] === id).map((e) => NODE_BY_ID.get(side === "source" ? e.target : e.source)!);
  const labs = lesson ? labsOf(lesson.id, "source") : labsOf(node.id, "target");
  const row = (n: GraphNode) => (
    <li key={n.id}>
      <span className="gg-dot" style={{ "--dot": nodeColor(n) } as CSSProperties} aria-hidden="true" />
      {n.kind === "lesson" ? (
        <button type="button" onClick={() => onSelect(n.id)}><span className="gg-code">{lessonCode(n)}</span> {label(n)}</button>
      ) : (
        <Link to={nodeHref(n)}>{label(n)}</Link>
      )}
    </li>
  );

  return (
    <aside className="gg-details" aria-live="polite">
      <div className="gg-details-head">
        <span className="gg-dot" style={{ "--dot": nodeColor(node) } as CSSProperties} aria-hidden="true" />
        <span className="gg-eyebrow">
          {lesson ? `${t(CATEGORY_LABEL_KEYS[lesson.track])} · ${lessonCode(lesson)}` : t("ggLab")}
        </span>
      </div>
      <h2 className="gg-details-title">{label(node)}</h2>
      {lesson && (
        <p className="gg-muted">
          {t("ggSummary", { n: inTrack.findIndex((l) => l.id === lesson.lessonId) + 1, total: inTrack.length, count: before.length, tracks: trackCount })}
        </p>
      )}
      <Link className="gg-details-open" to={nodeHref(node)}>{t(lesson ? "ggOpenLesson" : "ggOpenLab")}</Link>
      {lesson && (
        <section className="gg-details-group">
          <h3>{t("ggReadFirst")}</h3>
          {before.length === 0 ? (
            <p className="gg-muted">{t("ggNothingBefore")}</p>
          ) : (
            <>
              <p className="gg-code">{t("ggPathProgress", { read, total: before.length })}</p>
              <GraphLevels levels={levels} nodes={NODE_BY_ID} label={label} code={lessonCode} isRead={isRead} onSelect={onSelect} />
            </>
          )}
        </section>
      )}
      {links.leadsTo.length > 0 && (
        <section className="gg-details-group">
          <h3>{t("ggLeadsTo")}</h3>
          <ul>{links.leadsTo.map((id) => row(NODE_BY_ID.get(id)!))}</ul>
        </section>
      )}
      {labs.length > 0 && (
        <section className="gg-details-group">
          <h3>{t(lesson ? "ggLabs" : "ggPracticedIn")}</h3>
          <ul>{labs.map(row)}</ul>
        </section>
      )}
    </aside>
  );
}
