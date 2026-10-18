import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import { lessonNodeId, neighbourhood } from "../../guide.graph";
import type { GuideId } from "../../guide.types";
import GraphCanvas from "./GraphCanvas";
import { GUIDE_GRAPH, layoutGraph, useNodeLabel } from "./useGuideGraph";

const WIDTH = 240;
const HEIGHT = 200;

/// Local graph for the lesson rail: this lesson and the lessons directly connected to it.
export default function LessonGraph({ lessonId }: { lessonId: GuideId }) {
  const { t } = useI18n();
  const label = useNodeLabel();
  const [active, setActive] = useState<string | null>(null);
  const centre = lessonNodeId(lessonId);

  const local = useMemo(() => {
    const lessonsOnly = {
      nodes: GUIDE_GRAPH.nodes.filter((n) => n.kind === "lesson"),
      edges: GUIDE_GRAPH.edges.filter((e) => e.kind !== "practice"),
    };
    // The rail is narrow: the lesson and its direct neighbours only.
    const hood = neighbourhood(lessonsOnly, centre, 1);
    const nodes = hood.nodes;
    const ids = new Set(nodes.map((n) => n.id));
    const edges = hood.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    return { nodes, edges, positions: layoutGraph(nodes, edges, WIDTH, HEIGHT, 3), distance: hood.distance };
  }, [centre]);

  return (
    <div className="gg-local">
      <div className="guide-rail-label">{t("ggLocalTitle")}</div>
      <GraphCanvas
        nodes={local.nodes}
        edges={local.edges}
        positions={local.positions}
        width={WIDTH}
        height={HEIGHT}
        label={label}
        isRead={() => false}
        active={active ?? centre}
        onActive={setActive}
        matches={new Set([centre])}
        ariaLabel={t("ggAria")}
        restLabels={0}
        labelNeighbours={false}
        nodeScale={0.6}
      />
      <Link className="gg-local-link" to={`/guide/graph?focus=${lessonId}`}>{t("ggOpenGraph")} →</Link>
    </div>
  );
}
