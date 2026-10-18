import type { KeyboardEvent, PointerEvent } from "react";
import { GROWTH_MAX, GROWTH_MIN, GROWTH_STEP, snapGrowth } from "../../../guide.interactive.multiplesPeers.math";
import { pct } from "../figureFormat";

type Props = {
  cx: number;
  cy: number;
  baseline: number;
  growth: number;
  /// Growth at a pointer x offset from the plot's left edge.
  growthAt: (px: number) => number;
  plotLeft: number;
  label: string;
  ariaLabel: string;
  onChange: (growth: number) => void;
};

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 4, PageDown: -4 };

/// The target firm: a marker on the regression line that is dragged sideways (or moved with the keys) to set its growth.
export default function MultiplesPeersTarget({ cx, cy, baseline, growth, growthAt, plotLeft, label, ariaLabel, onChange }: Props) {
  const fromPointer = (event: PointerEvent<SVGGElement>) => {
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    onChange(snapGrowth(growthAt(event.clientX - svg.getBoundingClientRect().left - plotLeft)));
  };
  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    fromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const step = KEY_STEP[event.key];
    if (event.key === "Home") onChange(GROWTH_MIN);
    else if (event.key === "End") onChange(GROWTH_MAX);
    else if (step) onChange(snapGrowth(growth + step * GROWTH_STEP));
    else return;
    event.preventDefault();
  };

  return (
    <g
      className="ixmp-target"
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={GROWTH_MIN * 100}
      aria-valuemax={GROWTH_MAX * 100}
      aria-valuenow={Math.round(growth * 1000) / 10}
      aria-valuetext={pct(growth)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      <line className="ixmp-target-guide" x1={cx} x2={cx} y1={cy} y2={baseline} />
      <rect className="ixmp-target-hit" x={cx - 16} y={cy - 16} width={32} height={baseline - cy + 16} />
      <rect className="ixmp-target-mark" x={cx - 8} y={cy - 8} width={16} height={16} transform={`rotate(45 ${cx} ${cy})`} />
      <text className="ixmp-target-label" x={cx} y={cy - 16} textAnchor="middle">{label}</text>
    </g>
  );
}
