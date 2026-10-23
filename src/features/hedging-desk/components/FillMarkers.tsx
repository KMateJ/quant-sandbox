import type { PlotFrame } from "../../../components/charts";
import { SERIES_PALETTE } from "../../../components/charts";
import type { Fill } from "../engine/desk.types";

const SIZE = 6;

/// 6px squares on the price path at each desk fill: blue for buys, red for sells, one per (day, side).
export default function FillMarkers({ frame, fills, spot }: { frame: PlotFrame; fills: Fill[]; spot: number[] }) {
  const seen = new Set<string>();
  const marks = fills.filter((f) => {
    const k = `${f.day}:${f.side}`;
    if (f.tag === "client" || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return (
    <g className="hdesk-fill-markers" aria-hidden="true">
      {marks.map((f) => (
        <rect
          key={`${f.day}:${f.side}`}
          x={frame.x(f.day) - SIZE / 2}
          y={frame.y(spot[f.day]) - SIZE / 2}
          width={SIZE}
          height={SIZE}
          fill={f.side === "buy" ? SERIES_PALETTE[1] : SERIES_PALETTE[3]}
        />
      ))}
    </g>
  );
}
