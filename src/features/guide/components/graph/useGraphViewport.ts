import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Point } from "../../guide.graph.layout";

export type View = { k: number; x: number; y: number };
export type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
const IDENTITY: View = { k: 1, x: 0, y: 0 };
const clampK = (k: number) => Math.min(3, Math.max(0.3, k));

/// The view that centres `b` in a `width × height` viewBox with `pad` user units around it,
/// zooming in at most `maxK` so a small neighbourhood doesn't fill the canvas with giant discs.
export function fitView(b: Bounds, width: number, height: number, pad = { x: 24, y: 24 }, maxK = 1.6): View {
  const w = Math.max(1, b.maxX - b.minX);
  const h = Math.max(1, b.maxY - b.minY);
  const k = clampK(Math.min((width - 2 * pad.x) / w, (height - 2 * pad.y) / h, maxK));
  return { k, x: width / 2 - k * (b.minX + w / 2), y: height / 2 - k * (b.minY + h / 2) };
}

/// Zoom (wheel, around the cursor; buttons, around the centre), pan (drag the background) and node dragging
/// for an SVG graph. Dragged nodes keep their own position; nothing else is re-laid out. `wasDrag()` lets a
/// click handler ignore the click that ends a drag. `home` is the fitted view; a new `home` (other filters)
/// moves the view there.
export function useGraphViewport(home: View = IDENTITY, size = { width: 0, height: 0 }) {
  const [view, setView] = useState<View>(home);
  const [base, setBase] = useState<View>(home);
  if (base !== home) {
    setBase(home);
    setView(home);
  }
  const [moved, setMoved] = useState<Record<string, Point>>({});
  const gesture = useRef<{ kind: "pan" | "node"; id?: string; startX: number; startY: number; origin: Point; dist: number; onTap?: () => void } | null>(null);
  const lastDrag = useRef(0);

  const toSvg = (event: { clientX: number; clientY: number }, svg: SVGSVGElement) => {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  // A native, non-passive listener: React's wheel handlers are passive and cannot stop the page from scrolling.
  const svgRef = useRef<SVGSVGElement | null>(null);
  const onWheel = useCallback((event: globalThis.WheelEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    event.preventDefault();
    const p = toSvg(event, svg);
    setView((v) => {
      const k = clampK(v.k * Math.exp(-event.deltaY * 0.0015));
      // Keep the point under the cursor fixed while zooming.
      return { k, x: p.x - ((p.x - v.x) * k) / v.k, y: p.y - ((p.y - v.y) * k) / v.k };
    });
  }, []);
  useEffect(() => {
    const svg = svgRef.current;
    svg?.addEventListener("wheel", onWheel, { passive: false });
    return () => svg?.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const startPan = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || event.target !== event.currentTarget) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { kind: "pan", startX: event.clientX, startY: event.clientY, origin: { x: view.x, y: view.y }, dist: 0 };
  };

  /// Starts dragging a node; a press that barely moves counts as a tap (`onTap`), because pointer capture
  /// keeps the browser from delivering the click to the node itself.
  const startNodeDrag = (event: PointerEvent<Element>, id: string, at: Point, onTap?: () => void) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    (event.currentTarget.closest("svg") as SVGSVGElement).setPointerCapture(event.pointerId);
    gesture.current = { kind: "node", id, startX: event.clientX, startY: event.clientY, origin: at, dist: 0, onTap };
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g) return;
    const scale = event.currentTarget.getScreenCTM()?.a ?? 1;
    const dx = (event.clientX - g.startX) / scale;
    const dy = (event.clientY - g.startY) / scale;
    g.dist = Math.max(g.dist, Math.hypot(dx, dy));
    if (g.kind === "pan") setView((v) => ({ ...v, x: g.origin.x + dx, y: g.origin.y + dy }));
    else if (g.id) setMoved((m) => ({ ...m, [g.id!]: { x: g.origin.x + dx / view.k, y: g.origin.y + dy / view.k } }));
  };

  const onPointerUp = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (g.dist > 3) lastDrag.current = Date.now();
    else g.onTap?.();
  };

  const cancel = () => {
    gesture.current = null;
  };

  const reset = () => {
    setView(home);
    setMoved({});
  };

  const zoomBy = (factor: number) =>
    setView((v) => {
      const k = clampK(v.k * factor);
      const cx = size.width / 2;
      const cy = size.height / 2;
      return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
    });

  return {
    transform: `translate(${view.x} ${view.y}) scale(${view.k})`,
    zoom: view.k,
    panX: view.x,
    panY: view.y,
    moved,
    reset,
    zoomBy,
    wasDrag: () => Date.now() - lastDrag.current < 250,
    startNodeDrag,
    svgRef,
    svgHandlers: { onPointerDown: startPan, onPointerMove, onPointerUp, onPointerCancel: cancel },
  };
}
