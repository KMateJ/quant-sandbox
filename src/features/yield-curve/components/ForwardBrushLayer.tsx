import { useRef, useState, type PointerEvent } from "react";
import { IntervalSelector, type PlotFrame } from "../../../components/charts";
import { snapInterval } from "../yieldCurve.math";

type Props = {
  frame: PlotFrame;
  lo: number;
  hi: number;
  labels: string[];
  color: string;
  onChange: (lo: number, hi: number) => void;
};

/// Chart layer for the forward interval: drag across the plot (mouse or touch) to brush a new
/// [t₁, t₂], snapped to the curve's maturities; the selected interval's edges and band stay draggable.
export default function ForwardBrushLayer({ frame, lo, hi, labels, color, onChange }: Props) {
  const anchor = useRef<number | null>(null);
  const [raw, setRaw] = useState<[number, number] | null>(null);
  const count = labels.length;

  const toX = (event: PointerEvent<SVGElement>) => {
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    return frame.xInvert(event.clientX - (rect?.left ?? 0) - frame.left);
  };
  const brushTo = (x: number) => {
    const a = anchor.current ?? x;
    setRaw([Math.min(a, x), Math.max(a, x)]);
    onChange(...snapInterval(a, x, count));
  };
  const end = () => {
    anchor.current = null;
    setRaw(null);
  };

  return (
    <g>
      <rect x={0} y={0} width={frame.width} height={frame.height} fill="transparent"
        style={{ cursor: "crosshair", touchAction: "none" }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          anchor.current = toX(event);
          brushTo(anchor.current);
        }}
        onPointerMove={(event) => { if (anchor.current !== null) brushTo(toX(event)); }}
        onPointerUp={end}
        onPointerCancel={end} />
      {raw && (
        <rect x={frame.x(raw[0])} y={0} width={Math.max(1, frame.x(raw[1]) - frame.x(raw[0]))} height={frame.height}
          fill={color} opacity={0.08} stroke={color} strokeDasharray="3 3" pointerEvents="none" />
      )}
      <IntervalSelector frame={frame} from={lo} to={hi} bounds={[0, count - 1]} minGap={1} snap={1}
        color={color} labels={[labels[lo], labels[hi]]} slidable
        onChange={(from, to) => onChange(...snapInterval(from, to, count))} />
    </g>
  );
}
