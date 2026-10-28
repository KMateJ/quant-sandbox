import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { PlotFrame } from "./chart.types";
import { estimateTextWidth } from "./labels.logic";
import { constrain, keyMove, type DragHandle, type HandleValue } from "./dragHandle.logic";

type Props = {
  frame: PlotFrame;
  handles: DragHandle[];
  /// Fires continuously while a handle moves (pointer or keyboard).
  onChange: (id: string, value: HandleValue) => void;
  /// Fires once when a drag ends.
  onCommit?: (id: string) => void;
};

const fmt = (h: DragHandle, v: number | undefined) => (v === undefined ? "" : h.format ? h.format(v) : v.toFixed(2));

/// Draggable reference lines and points for a chart's `layer`: pointer and touch drag with capture,
/// and slider keyboard control on each focusable handle.
export default function DragHandles({ frame, handles, onChange, onCommit }: Props) {
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGGElement>(null);
  const span = {
    x: Math.abs(frame.xInvert(frame.width) - frame.xInvert(0)),
    y: Math.abs(frame.yInvert(0) - frame.yInvert(frame.height)),
  };

  // Pointer position in plot coordinates, independent of how the SVG is scaled.
  const toData = (event: PointerEvent<Element>): HandleValue => {
    const svg = svgRef.current?.ownerSVGElement;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return {};
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
    return { x: frame.xInvert(p.x - frame.left), y: frame.yInvert(p.y - frame.top) };
  };

  const start = (event: PointerEvent<SVGGElement>, h: DragHandle) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(h.id);
  };
  const move = (event: PointerEvent<SVGGElement>, h: DragHandle) => {
    if (dragging !== h.id) return;
    onChange(h.id, constrain(h, toData(event)));
  };
  const end = (h: DragHandle) => {
    if (dragging !== h.id) return;
    setDragging(null);
    onCommit?.(h.id);
  };
  // Last keyboard value per handle, with the prop value it was based on: key repeats faster than the parent
  // re-renders (e.g. URL-backed state) continue from it instead of from the stale prop.
  const pending = useRef(new Map<string, { from: HandleValue; value: HandleValue }>());
  const onKey = (event: KeyboardEvent<SVGGElement>, h: DragHandle) => {
    const last = pending.current.get(h.id);
    const base = last && last.from.x === h.x && last.from.y === h.y ? { ...h, ...last.value } : h;
    const next = keyMove(base, event.key, event.shiftKey, span);
    if (!next) return;
    event.preventDefault();
    pending.current.set(h.id, { from: { x: h.x, y: h.y }, value: next });
    onChange(h.id, next);
  };

  return (
    <g ref={svgRef} className="drag-handles" pointerEvents="auto">
      {handles.map((h, i) => {
        // Line handles of the same kind stack their knobs, so labels never sit on top of each other.
        const lane = handles.slice(0, i).filter((o) => o.axis === h.axis).length;
        const cx = h.x === undefined ? frame.width : frame.x(h.x);
        const cy = h.y === undefined ? 0 : frame.y(h.y);
        const value = h.axis === "y" ? h.y : h.x;
        const active = dragging === h.id;
        const valueText = h.axis === "xy" ? `${fmt(h, h.x)}, ${fmt(h, h.y)}` : fmt(h, value);
        // A vertical line near the right edge puts its label on the left of the knob so it stays inside the plot.
        const flip = h.axis === "x" && cx + 10 + estimateTextWidth(active ? valueText : h.label ?? "", 12) > frame.width;
        return (
          <g
            key={h.id}
            className={`drag-handle drag-handle--${h.axis}${active ? " is-active" : ""}`}
            style={{ color: h.color ?? "var(--primary)" }}
            role="slider"
            tabIndex={0}
            aria-label={h.label ?? h.id}
            aria-valuenow={value}
            aria-valuetext={valueText}
            aria-orientation={h.axis === "y" ? "vertical" : "horizontal"}
            onPointerDown={(e) => start(e, h)}
            onPointerMove={(e) => move(e, h)}
            onPointerUp={() => end(h)}
            onPointerCancel={() => end(h)}
            onKeyDown={(e) => onKey(e, h)}
          >
            {h.axis === "x" && <line className="drag-handle-line" x1={cx} x2={cx} y1={0} y2={frame.height} />}
            {h.axis === "y" && <line className="drag-handle-line" x1={0} x2={frame.width} y1={cy} y2={cy} />}
            {/* A wide transparent band makes thin lines easy to grab. */}
            {h.axis === "x" && <rect className="drag-handle-hit" x={cx - 8} y={0} width={16} height={frame.height} />}
            {h.axis === "y" && <rect className="drag-handle-hit" x={0} y={cy - 8} width={frame.width} height={16} />}
            <circle className="drag-handle-knob" cx={h.axis === "y" ? frame.width - 8 - lane * 18 : cx} cy={h.axis === "x" ? 8 + lane * 18 : cy} r={active ? 8 : 6.5} />
            {(h.label || active) && (
              // A "y" handle's knob sits at the right edge, so its label goes to the left of the knob to stay inside the plot.
              <text className="drag-handle-label" x={h.axis === "y" ? frame.width - 8 - lane * 18 - 10 : flip ? cx - 10 : cx + 10} y={(h.axis === "x" ? 8 + lane * 18 : cy) + 4} textAnchor={h.axis === "y" || flip ? "end" : undefined}>
                {active ? valueText : h.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
