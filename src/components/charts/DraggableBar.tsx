import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { keyTarget, snapToStep } from "./draggableBars.logic";

type Props = {
  x: number;
  width: number;
  plotHeight: number;
  zeroY: number;
  y: (value: number) => number;
  valueFromY: (py: number) => number;
  value: number;
  shadow?: number;
  limits: [number, number];
  step: number;
  label: string;
  valueText: string;
  colors: { positive: string; negative: string };
  onChange: (value: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

/// One column: a bar dragged up or down (or moved with the keyboard as a slider), with an optional lighter
/// shadow bar behind it.
export default function DraggableBar({ x, width, plotHeight, zeroY, y, valueFromY, value, shadow, limits, step, label, valueText, colors, onChange, onDragStart, onDragEnd }: Props) {
  const [active, setActive] = useState(false);
  const [lo, hi] = limits;
  const setFromPointer = (event: PointerEvent<SVGGElement>) => {
    // The column's hit rect spans the plot, so its top is the plot's top.
    const top = event.currentTarget.getBoundingClientRect().top;
    onChange(snapToStep(valueFromY(event.clientY - top), lo, hi, step));
  };
  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    onDragStart();
    setFromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const next = keyTarget(event.key, event.shiftKey, value, lo, hi, step);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  };

  const rect = (v: number) => ({ y: Math.min(y(v), zeroY), height: Math.abs(y(v) - zeroY) });
  const fill = value < 0 ? colors.negative : colors.positive;
  const inset = width * 0.18;

  return (
    <g
      transform={`translate(${x},0)`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={lo}
      aria-valuemax={hi}
      aria-valuenow={value}
      aria-valuetext={valueText}
      style={{ cursor: "ns-resize", outline: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <rect x={0} y={0} width={width} height={plotHeight} fill={active ? "var(--surface-muted)" : "transparent"} />
      {shadow !== undefined && <rect x={0} width={width} rx={3} fill={shadow < 0 ? colors.negative : colors.positive} fillOpacity={0.22} {...rect(shadow)} />}
      <rect x={inset} width={width - 2 * inset} rx={3} fill={fill} {...rect(value)} />
      <rect x={inset - 2} y={y(value) - 3} width={width - 2 * inset + 4} height={6} rx={3} fill="var(--text)" opacity={active ? 0.55 : 0} />
      <text x={width / 2} y={value >= 0 ? y(value) - 8 : y(value) + 16} textAnchor="middle" fontSize={12} fill="var(--text)" pointerEvents="none" style={{ fontVariantNumeric: "tabular-nums" }}>
        {valueText}
      </text>
    </g>
  );
}
