import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import { lessonNodeId, neighbourhood } from "../../guide.graph";
import type { GuideId } from "../../guide.types";
import GraphCanvas from "./GraphCanvas";
import { GUIDE_GRAPH, layoutGraph, useNodeLabel } from "./useGuideGraph";

const WIDTH = 240;
const HEIGHT = 180;

/// Local graph for the lesson rail: this lesson and its direct neighbours. The rail is too narrow for
/// SVG labels, so the hovered lesson's title is shown as wrapping text under the canvas instead.
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
    const hood = neighbourhood(lessonsOnly, centre, 1);
    const ids = new Set(hood.nodes.map((n) => n.id));
    const edges = hood.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    return { nodes: hood.nodes, edges, positions: layoutGraph(hood.nodes, edges, WIDTH, HEIGHT, 3) };
  }, [centre]);
  const shown = local.nodes.find((n) => n.id === (active ?? centre));

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
        active={active}
        onActive={setActive}
        matches={new Set([centre])}
        ariaLabel={t("ggAria")}
        showLabels={false}
        nodeScale={0.6}
      />
      <p className={active && active !== centre ? "gg-local-caption is-hover" : "gg-local-caption"}>{shown ? label(shown) : ""}</p>
      <Link className="gg-local-link" to={`/guide/graph?focus=${lessonId}`}>{t("ggOpenGraph")}</Link>
    </div>
  );
}
