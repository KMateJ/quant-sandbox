import { Link } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import { CATEGORY_ACCENT, CATEGORY_LABEL_KEYS } from "../../../../modules/registry";
import { guideLessons, guidePath, guideTracks } from "../../guide.meta";
import { lessonNodeId, type GraphEdge, type GraphNode } from "../../guide.graph";
import type { GuideTrackId } from "../../guide.types";

type Props = {
  tracks: ReadonlySet<GuideTrackId>;
  edges: GraphEdge[];
  byId: Map<string, GraphNode>;
  label: (n: GraphNode) => string;
  matches: ReadonlySet<string>;
};

/// The graph as text: every lesson by track with the lessons it builds on. Default on narrow screens.
export default function GraphList({ tracks, edges, byId, label, matches }: Props) {
  const { t } = useI18n();
  const buildsOn = (id: string) =>
    edges.filter((e) => e.kind === "citation" && e.source === id).map((e) => byId.get(e.target)).filter((n): n is GraphNode => Boolean(n));

  return (
    <div className="gg-list">
      {guideTracks.filter((tr) => tracks.has(tr.id)).map((track) => (
        <section key={track.id} className="gg-list-track">
          <h2 style={{ color: CATEGORY_ACCENT[track.id] }}>{t(CATEGORY_LABEL_KEYS[track.id])}</h2>
          <ol>
            {guideLessons.filter((l) => l.track === track.id).map((lesson) => {
              const id = lessonNodeId(lesson.id);
              const deps = buildsOn(id);
              return (
                <li key={lesson.id} className={matches.has(id) ? "is-match" : undefined}>
                  <Link to={guidePath(lesson.id)}>{t(lesson.titleKey)}</Link>
                  {deps.length > 0 && (
                    <span className="gg-muted">
                      {" "}· {t("ggBuildsOn")}:{" "}
                      {deps.map((n, i) => (
                        <span key={n.id}>
                          {i > 0 && ", "}
                          <Link to={n.kind === "lesson" ? guidePath(n.lessonId) : "/"}>{label(n)}</Link>
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
