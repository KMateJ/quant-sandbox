import { useMemo } from "react";
import { translations, useI18n } from "../../../../i18n";
import { CATEGORY_ACCENT, modules } from "../../../../modules/registry";
import { guideContent } from "../../../../Language/guides";
import { guideLessons, guidePath } from "../../guide.meta";
import { buildGuideGraph, learningPath, type GraphEdge, type GraphNode, type GuideGraph } from "../../guide.graph";
import { forceLayout, type LayoutEdge, type Point } from "../../guide.graph.layout";
import type { GuideTrackId } from "../../guide.types";

/// The whole curriculum graph; built once per page load (pure, a few milliseconds).
export const GUIDE_GRAPH: GuideGraph = buildGuideGraph({
  lessons: guideLessons,
  content: guideContent,
  titleOf: (lesson, lang) => translations[lang][lesson.titleKey],
  moduleIdForPath: (path) => modules.find((m) => m.path === path.split(/[?#]/)[0])?.id,
});

const EDGE_SHAPE: Record<GraphEdge["kind"], Pick<LayoutEdge, "length" | "strength">> = {
  citation: { length: 90, strength: 0.05 },
  sequence: { length: 60, strength: 0.12 },
  practice: { length: 70, strength: 0.04 },
};

/// Disc size follows PageRank (area roughly proportional to rank), so foundational lessons stand out.
export const nodeRadius = (n: GraphNode) => (n.kind === "lab" ? 4 + Math.sqrt(n.rank) * 1.5 : 5 + Math.sqrt(n.rank) * 4.5);
export const nodeColor = (n: GraphNode) => (n.kind === "lesson" ? CATEGORY_ACCENT[n.track] : "var(--muted)");
export const nodeHref = (n: GraphNode) =>
  n.kind === "lesson" ? guidePath(n.lessonId) : modules.find((m) => m.id === n.moduleId)?.path ?? "/";

/// Deterministic positions for a subset of the graph, fitted into `width × height`.
export function layoutGraph(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number, seed = 7): Map<string, Point> {
  const group = new Map(nodes.map((n) => [n.id, n.kind === "lesson" ? n.track : "labs"]));
  return forceLayout(
    nodes.map((n) => ({ id: n.id, group: n.kind === "lesson" ? n.track : "labs", radius: nodeRadius(n) })),
    edges.map((e) => {
      const shape = EDGE_SHAPE[e.kind];
      // Citations inside one track get longer springs, so a big track loosens instead of knotting.
      const sameTrack = e.kind === "citation" && group.get(e.source) === group.get(e.target);
      return { source: e.source, target: e.target, ...shape, length: shape.length * (sameTrack ? 1.4 : 1) };
    }),
    { width, height, seed }
  );
}

/// Filtered nodes and edges plus their layout, recomputed only when the filters change.
export function useFilteredGraph(tracks: ReadonlySet<GuideTrackId>, showLabs: boolean, width: number, height: number) {
  return useMemo(() => {
    const nodes = GUIDE_GRAPH.nodes.filter((n) => (n.kind === "lesson" ? tracks.has(n.track) : showLabs));
    const ids = new Set(nodes.map((n) => n.id));
    // A lab only stays if a visible lesson practises it.
    const edges = GUIDE_GRAPH.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    const linked = new Set(edges.flatMap((e) => [e.source, e.target]));
    const visible = nodes.filter((n) => n.kind === "lesson" || linked.has(n.id));
    return { nodes: visible, edges, positions: layoutGraph(visible, edges, width, height) };
  }, [tracks, showLabs, width, height]);
}

/// Localised label of a node.
export function useNodeLabel() {
  const { t } = useI18n();
  return (n: GraphNode) => {
    if (n.kind === "lesson") return t(guideLessons.find((l) => l.id === n.lessonId)!.titleKey);
    const m = modules.find((mod) => mod.id === n.moduleId);
    return m ? t(m.navKey) : n.moduleId;
  };
}

/// Ids of a node and everything directly connected to it.
export function neighbourIds(edges: GraphEdge[], id: string | null): Set<string> {
  if (!id) return new Set();
  const out = new Set([id]);
  for (const e of edges) {
    if (e.source === id) out.add(e.target);
    if (e.target === id) out.add(e.source);
  }
  return out;
}

const CURRICULUM_ORDER = new Map(GUIDE_GRAPH.nodes.map((n, i) => [n.id, i]));
const NODE_BY_ID = new Map(GUIDE_GRAPH.nodes.map((n) => [n.id, n]));

/// The reading path to `selected` over the whole curriculum (not just the visible tracks), with numbered steps.
export function useLearningPath(selected: string | null) {
  return useMemo(() => {
    const target = selected ? NODE_BY_ID.get(selected) : undefined;
    if (!target || target.kind !== "lesson") return null;
    const path = learningPath(GUIDE_GRAPH, target.id, CURRICULUM_ORDER);
    return {
      target,
      steps: path.steps.map((id) => NODE_BY_ID.get(id)!),
      direct: path.direct,
      highlight: { steps: new Map(path.steps.map((id, i) => [id, i + 1])), edges: path.edges },
    };
  }, [selected]);
}
