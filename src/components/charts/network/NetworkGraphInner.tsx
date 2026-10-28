import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Point } from "../../../lib/graph/forceLayout";
import { layoutFor, layoutKey } from "./network.logic";
import type { NetNode, NetStatus, NetworkGraphProps } from "./network.types";
import NetworkEdges from "./NetworkEdges";
import NetworkLegend from "./NetworkLegend";
import NetworkNodes from "./NetworkNodes";
import NetworkZoom from "./NetworkZoom";
import { fitView, useGraphViewport, type Bounds } from "./useGraphViewport";
import { useConnectDrag } from "./useConnectDrag";

const REACH = 34;

/// SVG network: pan/zoom, draggable nodes, selection, draw-an-edge mode and a keyboard path
/// (Enter selects; with a node selected, C then Enter on another node connects them; Esc clears).
/// Height of the legend strip drawn over the bottom of the frame (user units).
const LEGEND_SPACE = 40;

export default function NetworkGraphInner(props: NetworkGraphProps & { width: number }) {
  const { nodes, edges, width, height, seed = 3, selectedId, onSelect, onEdgeSelect, connectMode, onConnect, dimmed, ariaLabel, labels } = props;
  const uid = useId().replace(/:/g, "");
  const key = `${layoutKey(nodes)}#${props.layoutKey ?? ""}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the layout follows the node set, not array identity or edge edits
  const laid = useMemo(() => props.positions ?? layoutFor(nodes, edges, width, height, seed), [props.positions, key, width, height, seed]);
  const home = useMemo(() => {
    const b: Bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    // Fit each node's full extent, not its centre: the label below (≈3.3 units per character at 11px),
    // the badge above-right and the selection ring all scale with the zoom.
    for (const n of nodes) {
      const p = laid.get(n.id);
      if (!p) continue;
      const half = Math.max(n.radius + 8, n.label.length * 3.3);
      b.minX = Math.min(b.minX, p.x - half); b.maxX = Math.max(b.maxX, p.x + half + (n.badge ? 24 : 0));
      b.minY = Math.min(b.minY, p.y - n.radius - 12); b.maxY = Math.max(b.maxY, p.y + n.radius + 18);
    }
    // The legend sits over the bottom of the frame, so fit into the area above it.
    return Number.isFinite(b.minX) ? fitView(b, width, height - LEGEND_SPACE, { x: 16, y: 16 }, 1.4) : undefined;
  }, [laid, nodes, width, height]);
  const vp = useGraphViewport(home, { width, height });
  const at = (id: string): Point => vp.moved[id] ?? laid.get(id) ?? { x: 0, y: 0 };
  const radius = useMemo(() => new Map(nodes.map((n) => [n.id, n.radius])), [nodes]);
  const lastTap = useRef(0);
  const [armed, setArmed] = useState<string | null>(null);
  const select = (id: string | null) => { lastTap.current = Date.now(); onSelect?.(id); };

  const toGraph = (event: { clientX: number; clientY: number }, svg: SVGSVGElement): Point => {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
    return { x: (p.x - vp.panX) / vp.zoom, y: (p.y - vp.panY) / vp.zoom };
  };
  const current = new Map(nodes.map((n) => [n.id, at(n.id)] as const));
  const connect = useConnectDrag(vp.svgRef, toGraph, current, REACH / vp.zoom, onConnect, select);

  const activate = (id: string) => {
    if (armed && armed !== id) onConnect?.(armed, id);
    else select(id);
    setArmed(null);
  };
  const press = (event: PointerEvent<Element>, n: NetNode, p: Point) =>
    connectMode ? connect.begin(event, n.id) : vp.startNodeDrag(event, n.id, p, () => select(n.id));
  const keyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") { setArmed(null); onSelect?.(null); }
    else if ((event.key === "c" || event.key === "C") && selectedId && onConnect) setArmed(selectedId);
  };
  const base = vp.svgHandlers;
  const present = useMemo(() => new Set<NetStatus>(nodes.map((n) => n.status ?? "ok")), [nodes]);
  const from = connect.drag ? at(connect.drag.from) : null;
  const armedName = armed ? nodes.find((n) => n.id === armed)?.label ?? "" : "";

  return (
    <div className="net-wrap">
      <svg
        ref={vp.svgRef}
        className={`net-canvas${connectMode ? " is-connect" : ""}`}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="group"
        aria-label={ariaLabel}
        {...base}
        onPointerMove={(e) => { base.onPointerMove(e); connect.move(e); }}
        onPointerUp={(e) => { base.onPointerUp(); connect.end(e); }}
        onPointerCancel={() => { base.onPointerCancel(); connect.cancel(); }}
        onClick={(e) => { if (e.target === e.currentTarget && !vp.wasDrag() && Date.now() - lastTap.current > 250) onSelect?.(null); }}
        onDoubleClick={vp.reset}
        onKeyDown={keyDown}
      >
        <g transform={vp.transform}>
          <NetworkEdges edges={edges} at={at} radiusOf={(id) => radius.get(id) ?? 8} uid={uid} dimmed={dimmed} onSelect={onEdgeSelect} />
          {connect.drag && from && (
            <line className="net-rubber" x1={from.x} y1={from.y} x2={connect.drag.to.x} y2={connect.drag.to.y} />
          )}
          <NetworkNodes nodes={nodes} at={at} selectedId={selectedId} armedId={armed} dimmed={dimmed} statusWords={labels.status} onPress={press} onActivate={activate} />
        </g>
      </svg>
      <NetworkZoom zoomIn={labels.zoomIn} zoomOut={labels.zoomOut} fit={labels.fit} group={labels.zoomGroup} onZoomIn={() => vp.zoomBy(1.25)} onZoomOut={() => vp.zoomBy(0.8)} onFit={vp.reset} />
      <NetworkLegend present={present} words={labels.status} />
      <p className="net-hint" role="status">
        {armed ? labels.connecting.replace("{{name}}", armedName) : connectMode ? labels.connectHint : ""}
      </p>
    </div>
  );
}
