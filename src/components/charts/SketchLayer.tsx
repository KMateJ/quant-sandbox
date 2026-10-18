import { useRef, useState, type PointerEvent } from "react";
import type { PlotFrame } from "./chart.types";
import { applyStroke, lineThrough, smoothSamples, type SketchPoint } from "./sketch.logic";

type Props = {
  frame: PlotFrame;
  /// "curve": draw freehand onto `xGrid`; "line": press, drag and release to set a straight line.
  mode: "curve" | "line";
  /// Controlled value: the sketched curve on the grid, or the two line points.
  value: SketchPoint[];
  onChange: (points: SketchPoint[]) => void;
  /// Fires once when a stroke ends.
  onCommit?: (points: SketchPoint[]) => void;
  /// Grid the curve is sampled on (required for "curve").
  xGrid?: number[];
  /// 0–1 smoothing applied when a curve stroke ends.
  smooth?: number;
  yRange?: [number, number];
  /// Accessible description; keyboard users use the lab's own inputs.
  ariaLabel: string;
  color?: string;
};

/// Freehand drawing layer for a chart: sketch a curve onto a grid, or draw a straight line by eye.
export default function SketchLayer({ frame, mode, value, onChange, onCommit, xGrid = [], smooth = 0, yRange, ariaLabel, color = "var(--primary)" }: Props) {
  const ref = useRef<SVGGElement>(null);
  const [drawing, setDrawing] = useState(false);
  const stroke = useRef<SketchPoint[]>([]);
  const base = useRef<SketchPoint[]>([]);

  const toData = (event: PointerEvent<Element>): SketchPoint => {
    const m = ref.current?.ownerSVGElement?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(m.inverse());
    return { x: frame.xInvert(p.x - frame.left), y: frame.yInvert(p.y - frame.top) };
  };

  const update = (point: SketchPoint) => {
    stroke.current.push(point);
    if (mode === "line") onChange(lineThrough(stroke.current[0], point));
    else onChange(applyStroke(xGrid, base.current, stroke.current, yRange));
  };

  const start = (event: PointerEvent<SVGRectElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    stroke.current = [];
    base.current = value;
    setDrawing(true);
    update(toData(event));
  };
  const move = (event: PointerEvent<SVGRectElement>) => {
    if (drawing) update(toData(event));
  };
  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    const finished = mode === "curve" && smooth > 0 ? smoothSamples(applyStroke(xGrid, base.current, stroke.current, yRange), smooth) : null;
    if (finished) onChange(finished);
    onCommit?.(finished ?? value);
  };

  const path = value.map((p, i) => `${i ? "L" : "M"}${frame.x(p.x)},${frame.y(p.y)}`).join(" ");

  return (
    <g ref={ref} className={drawing ? "sketch-layer is-drawing" : "sketch-layer"} style={{ color }} pointerEvents="auto">
      <rect
        className="sketch-surface"
        width={frame.width}
        height={frame.height}
        aria-label={ariaLabel}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />
      {value.length > 1 && <path className="sketch-path" d={path} />}
      {mode === "line" && value.map((p, i) => <circle key={i} className="sketch-end" cx={frame.x(p.x)} cy={frame.y(p.y)} r={4} />)}
    </g>
  );
}
