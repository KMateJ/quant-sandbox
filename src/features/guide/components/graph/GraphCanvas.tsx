import { useMemo, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../../../i18n";
import { localizedPath } from "../../../../languageRoutes";
import { edgeKey, type GraphEdge, type GraphNode } from "../../guide.graph";
import { placeLabels, type Point } from "../../guide.graph.layout";
import GraphClusters from "./GraphClusters";
import GraphEdges from "./GraphEdges";
import GraphZoom from "./GraphZoom";
import { neighbourIds, nodeColor, nodeHref, nodeRadius } from "./useGuideGraph";
import { fitView, useGraphViewport, type Bounds } from "./useGraphViewport";

type Props = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  positions: Map<string, Point>;
  width: number;
  height: number;
  label: (n: GraphNode) => string;
  isRead: (n: GraphNode) => boolean;
  /// Node under the pointer or keyboard focus; drives the neighbourhood highlight.
  active: string | null;
  onActive: (id: string | null) => void;
  /// Nodes matching the search box, drawn emphasised.
  matches: ReadonlySet<string>;
  ariaLabel: string;
  /// How many of the highest-ranked lessons carry a label when nothing is hovered or selected.
  restLabels?: number;
  /// Label the hovered node's neighbours too (off in the small rail graph, where space is tight).
  labelNeighbours?: boolean;
  /// Scales node discs (the rail graph draws them smaller).
  nodeScale?: number;
  /// A selected learning path: step number per node and the edges it uses. Shown when nothing is hovered.
  path?: { steps: ReadonlyMap<string, number>; edges: ReadonlySet<string> } | null;
  /// Click selects instead of navigating (the global page); without it, clicks open the node.
  onSelect?: (id: string) => void;
  /// The full page shows zoom buttons and a faint name over each track's cluster.
  chrome?: boolean;
};

/// SVG force graph: nodes are real links; hover/focus highlights a node's neighbourhood.
export default function GraphCanvas({ nodes, edges, positions, width, height, label, isRead, active, onActive, matches, ariaLabel, restLabels = 8, labelNeighbours = true, nodeScale = 1, path, onSelect, chrome = false }: Props) {
  const navigate = useNavigate();
  const { language } = useI18n();
  const radius = (n: GraphNode) => nodeRadius(n) * nodeScale;
  // Fit the laid-out graph into the canvas, leaving room for labels below and beside the outer nodes.
  const home = useMemo(() => {
    const b: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const p of positions.values()) {
      b.minX = Math.min(b.minX, p.x); b.maxX = Math.max(b.maxX, p.x);
      b.minY = Math.min(b.minY, p.y); b.maxY = Math.max(b.maxY, p.y);
    }
    return Number.isFinite(b.minX) ? fitView(b, width, height, chrome ? { x: 80, y: 40 } : { x: 40, y: 22 }, chrome ? 1.6 : 2.6) : undefined;
  }, [positions, width, height, chrome]);
  const { svgRef, svgHandlers, transform, zoom, panX, panY, moved, reset, zoomBy, wasDrag, startNodeDrag } = useGraphViewport(home, { width, height });
  // Hovering the selected lesson itself keeps its path lit; hovering anything else previews that node's neighbourhood.
  const target = path ? [...path.steps.entries()].find(([, step]) => step === path.steps.size)?.[0] : undefined;
  const hovering = active && active !== target ? active : null;
  const hover = useMemo(() => neighbourIds(edges, hovering), [edges, hovering]);
  const showPath = !hovering && path ? path : null;
  const lit = showPath ? new Set(showPath.steps.keys()) : hover;
  const focusing = Boolean(hovering || showPath);
  const restLabelled = useMemo(
    () => new Set([...nodes].filter((n) => n.kind === "lesson").sort((a, b) => b.rank - a.rank).slice(0, restLabels).map((n) => n.id)),
    [nodes, restLabels]
  );
  const priority = (n: GraphNode) =>
    n.id === active ? 5 : n.id === target ? 4 : matches.has(n.id) ? 3 :
    hovering ? (labelNeighbours && hover.has(n.id) ? 2 : -1) :
    showPath ? (showPath.steps.has(n.id) ? 2 : -1) : restLabelled.has(n.id) || zoom >= 1.3 ? 1 + n.rank / 100 : -1;
  const at = (id: string) => moved[id] ?? positions.get(id) ?? { x: 0, y: 0 };
  const toScreen = (p: Point) => ({ x: p.x * zoom + panX, y: p.y * zoom + panY });
  // Labels are placed in screen space so the overlap check matches what is drawn.
  const labels = placeLabels(
    nodes.filter((n) => n.kind === "lesson" || n.id === active).map((n) => {
      const s = toScreen(at(n.id));
      return { id: n.id, x: s.x, y: s.y + (radius(n) + 11) * Math.min(zoom, 1.4), text: label(n), priority: priority(n) };
    }).filter((c) => c.priority >= 0),
    width
  );
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const dim = (id: string) => (focusing && !lit.has(id) ? " is-dim" : "");
  const open = (n: GraphNode) => (onSelect ? onSelect(n.id) : navigate(nodeHref(n)));
  const edgeLit = (e: GraphEdge) =>
    showPath ? showPath.edges.has(edgeKey(e)) : Boolean(hovering) && (e.source === hovering || e.target === hovering);

  return (
    <div className="gg-canvas-wrap">
      <svg ref={svgRef} className="gg-canvas" viewBox={`0 0 ${width} ${height}`} role="group" aria-label={ariaLabel} {...svgHandlers} onDoubleClick={reset}>
        {chrome && !focusing && <GraphClusters nodes={nodes} at={(id) => toScreen(at(id))} />}
        <g transform={transform}>
          <GraphEdges edges={edges} at={at} radiusOf={(id) => radius(byId.get(id)!)} isLit={edgeLit} focusing={focusing} onPath={Boolean(showPath)} />
          {nodes.map((n, i) => {
            const p = at(n.id);
            return (
              <a
                key={n.id}
                // A plain SVG link skips the router basename, so the language prefix is added here; clicks use navigate().
                href={localizedPath(nodeHref(n), language)}
                className={`gg-node gg-node--${n.kind}${dim(n.id)}${matches.has(n.id) ? " is-match" : ""}${isRead(n) ? " is-read" : ""}${n.id === target ? " is-target" : ""}`}
                style={{ "--gg-color": nodeColor(n), "--i": Math.min(i, 40) } as CSSProperties}
                aria-label={label(n)}
                onPointerEnter={() => onActive(n.id)}
                onPointerLeave={() => onActive(null)}
                onFocus={() => onActive(n.id)}
                onBlur={() => onActive(null)}
                onPointerDown={(event) => startNodeDrag(event, n.id, p, () => open(n))}
                onClick={(event) => {
                  event.preventDefault();
                  // Mouse taps arrive via pointer-up (see useGraphViewport); this handles Enter on a focused node.
                  if (event.detail === 0 && !wasDrag()) open(n);
                }}
              >
                {isRead(n) && <circle className="gg-read-ring" cx={p.x} cy={p.y} r={radius(n) + 3.5} />}
                <circle cx={p.x} cy={p.y} r={radius(n)} />
                {showPath?.steps.has(n.id) && <text className="gg-step" x={p.x} y={p.y + 3.5} textAnchor="middle">{showPath.steps.get(n.id)}</text>}
              </a>
            );
          })}
        </g>
        <g className="gg-labels" aria-hidden="true">
          {[...labels].map(([id, l]) => (
            <text key={id} x={l.x} y={l.y} textAnchor={l.anchor} className={`gg-label${dim(id)}${id === active || id === target ? " is-strong" : ""}`}>{l.text}</text>
          ))}
        </g>
      </svg>
      {chrome && <GraphZoom onZoomIn={() => zoomBy(1.25)} onZoomOut={() => zoomBy(0.8)} onFit={reset} />}
    </div>
  );
}
