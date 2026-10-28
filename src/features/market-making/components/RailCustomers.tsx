import { memo } from "react";
import type { CustomerEvent, FillRecord } from "../marketMaking.types";
import { RAIL_WINDOW, type RailFrame } from "../rail.math";

type Props = { frame: RailFrame; events: CustomerEvent[]; fills: FillRecord[]; centreAt: (t: number) => number; labels: boolean };

const LABEL_LIFE = 1.5;

/// Customers of the last 20 s at the price they would accept: filled = solid, faded = hollow; fresh fills get a ¢ label.
function RailCustomers({ frame, events, fills, centreAt, labels }: Props) {
  const from = frame.now - RAIL_WINDOW;
  const shown = events.filter((e) => e.t >= from);
  const fresh = labels ? fills.filter((f) => frame.now - f.t <= LABEL_LIFE) : [];
  return (
    <g>
      {shown.map((e, i) => {
        const y = Math.min(Math.max(frame.y(e.price), 4), frame.y(frame.centre - frame.range) - 4);
        return (
          <rect key={i} className={`mkm-customer mkm-customer--${e.buy ? "buy" : "sell"}${e.filled ? " is-filled" : ""}`}
            x={frame.x(e.t) - 3} y={y - 3} width={6} height={6} />
        );
      })}
      {fresh.map((f, i) => {
        const earned = Math.abs(f.price - centreAt(f.t));
        return (
          <text key={i} className="mkm-fill-label" x={frame.x(f.t)} y={frame.y(f.price) + (f.side === "sell" ? -8 : 14)}
            opacity={1 - (frame.now - f.t) / LABEL_LIFE}>
            +{earned.toFixed(1)}¢
          </text>
        );
      })}
    </g>
  );
}

export default memo(RailCustomers);
