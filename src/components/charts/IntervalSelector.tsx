import { useRef, type PointerEvent } from "react";
import type { PlotFrame } from "./chart.types";

type Handle = "from" | "to" | "body";

type Props = {
  frame: PlotFrame;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
  /// Allowed x range for both ends.
  bounds: [number, number];
  minGap: number;
  /// Positions snap to multiples of this step.
  snap: number;
  color: string;
  labels?: [string, string];
  /// Drag inside the band to slide the whole interval at fixed width.
  slidable?: boolean;
};

const HIT = 16;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/// Draggable [from, to] window for a chart layer: grab an edge to resize, the band to slide.
export default function IntervalSelector({ frame, from, to, onChange, bounds, minGap, snap, color, labels, slidable }: Props) {
  const drag = useRef<{ handle: Handle; origin: number; from: number; to: number } | null>(null);
  const round = (v: number) => Number((Math.round(v / snap) * snap).toFixed(6));
  const toData = (event: PointerEvent<SVGElement>) => {
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    return frame.xInvert(event.clientX - (rect?.left ?? 0) - frame.left);
  };

  const move = (event: PointerEvent<SVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = toData(event);
    const [lo, hi] = bounds;
    if (d.handle === "from") onChange(clamp(round(x), lo, to - minGap), to);
    else if (d.handle === "to") onChange(from, clamp(round(x), from + minGap, hi));
    else {
      const width = d.to - d.from;
      const next = clamp(round(d.from + x - d.origin), lo, hi - width);
      onChange(next, round(next + width));
    }
  };
  const end = () => {
    drag.current = null;
  };
  const events = (handle: Handle, cursor: string) => ({
    onPointerDown: (event: PointerEvent<SVGElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { handle, origin: toData(event), from, to };
    },
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
    style: { pointerEvents: "all" as const, cursor, touchAction: "none" as const },
  });

  const x0 = frame.x(from);
  const x1 = frame.x(to);
  const edges: [Handle, number, string | undefined][] = [
    ["from", x0, labels?.[0]],
    ["to", x1, labels?.[1]],
  ];

  return (
    <g>
      <rect
        x={x0}
        y={0}
        width={Math.max(0, x1 - x0)}
        height={frame.height}
        fill={color}
        opacity={0.1}
        {...(slidable ? events("body", "grab") : {})}
      />
      {edges.map(([handle, x, label]) => (
        <g key={handle}>
          <line x1={x} x2={x} y1={0} y2={frame.height} stroke={color} strokeWidth={2} />
          <rect x={x - 5} y={frame.height / 2 - 14} width={10} height={28} rx={3} fill={color} />
          {label && (
            <text x={x + 6} y={13} fill={color} fontSize={12} fontWeight={700}>
              {label}
            </text>
          )}
          <rect x={x - HIT / 2} y={0} width={HIT} height={frame.height} fill="transparent" {...events(handle, "ew-resize")} />
        </g>
      ))}
    </g>
  );
}
