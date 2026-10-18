import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../../../components/layout";
import { useMediaQuery } from "../../../../components/useMediaQuery";
import { useI18n } from "../../../../i18n";
import { guideTracks } from "../../guide.meta";
import type { GuideTrackId } from "../../guide.types";
import { useGuideProgress } from "../../useGuideProgress";
import GraphCanvas from "./GraphCanvas";
import GraphControls, { type GraphView } from "./GraphControls";
import GraphDetails from "./GraphDetails";
import GraphLegend from "./GraphLegend";
import GraphList from "./GraphList";
import GraphPath from "./GraphPath";
import { useFilteredGraph, useLearningPath, useNodeLabel } from "./useGuideGraph";

const WIDTH = 960;
const HEIGHT = 640;
const ALL_TRACKS = new Set(guideTracks.map((t) => t.id));

/// Obsidian-style map of the guides: lessons by track, the lessons they build on, and the labs that practise them.
export default function GuideGraphPage() {
  const { t } = useI18n();
  const narrow = useMediaQuery("(max-width: 700px)");
  const { isRead } = useGuideProgress();
  const label = useNodeLabel();
  const [tracks, setTracks] = useState<ReadonlySet<GuideTrackId>>(ALL_TRACKS);
  const [showLabs, setShowLabs] = useState(false);
  const [query, setQuery] = useState("");
  const [chosenView, setView] = useState<GraphView | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // The selected lesson lives in the URL (?focus=<lesson id>) so a path can be linked to and shared.
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus");
  const selected = focus ? `lesson:${focus}` : null;
  const select = (id: string | null) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id && id !== selected && id.startsWith("lesson:")) next.set("focus", id.slice("lesson:".length));
      else next.delete("focus");
      return next;
    }, { replace: true });
  const path = useLearningPath(selected);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && select(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const view = chosenView ?? (narrow ? "list" : "graph");

  const { nodes, edges, positions } = useFilteredGraph(tracks, showLabs, WIDTH, HEIGHT);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return new Set(q ? nodes.filter((n) => label(n).toLowerCase().includes(q)).map((n) => n.id) : []);
  }, [query, nodes, label]);

  const pathPanel = path && (
    <GraphPath
      target={path.target}
      steps={path.steps}
      direct={path.direct}
      label={label}
      isRead={(n) => n.kind === "lesson" && isRead(n.lessonId)}
      onClear={() => select(null)}
    />
  );

  const toggleTrack = (id: GuideTrackId) =>
    setTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="page-shell">
      <div className="page-content gg-page">
        <PageHeader title={t("ggTitle")} description={t("ggDesc")} />
        <GraphControls
          tracks={tracks}
          onToggleTrack={toggleTrack}
          showLabs={showLabs}
          onShowLabs={setShowLabs}
          query={query}
          onQuery={setQuery}
          view={view}
          onView={setView}
        />
        {view === "graph" ? (
          <div className="gg-layout">
            <div className="gg-stage">
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                positions={positions}
                width={WIDTH}
                height={HEIGHT}
                label={label}
                isRead={(n) => n.kind === "lesson" && isRead(n.lessonId)}
                active={active}
                onActive={setActive}
                matches={matches}
                ariaLabel={t("ggAria")}
                path={path?.highlight ?? null}
                onSelect={select}
                chrome
              />
              <GraphLegend showLabs={showLabs} />
              <p className="gg-hint">{t("ggHint")}</p>
            </div>
            <div className="gg-side">
              {pathPanel}
              <GraphDetails node={active ? byId.get(active) ?? null : path ? path.target : null} edges={edges} byId={byId} label={label} />
            </div>
          </div>
        ) : (
          <>
            {pathPanel}
            <GraphList tracks={tracks} edges={edges} byId={byId} label={label} matches={matches} />
          </>
        )}
      </div>
    </div>
  );
}
