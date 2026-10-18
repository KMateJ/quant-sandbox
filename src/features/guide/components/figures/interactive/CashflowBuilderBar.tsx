import type { KeyboardEvent, PointerEvent } from "react";
import { CASHFLOW_MAX, CASHFLOW_MIN, snapCashflow } from "../../../guide.interactive.cashflowBuilder.math";

type Props = {
  x: number;
  width: number;
  plotHeight: number;
  zeroY: number;
  y: (value: number) => number;
  valueFromY: (py: number) => number;
  flow: number;
  pv: number;
  label: string;
  onChange: (value: number) => void;
};

const KEY_STEP: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };

/// One year's column: a draggable cash-flow bar with its present value as a lighter bar behind it.
export default function CashflowBuilderBar({ x, width, plotHeight, zeroY, y, valueFromY, flow, pv, label, onChange }: Props) {
  const setFromPointer = (event: PointerEvent<SVGGElement>) => {
    // The column's hit rect spans the plot, so its top is the plot's top.
    const top = event.currentTarget.getBoundingClientRect().top;
    onChange(snapCashflow(valueFromY(event.clientY - top)));
  };
  const onPointerDown = (event: PointerEvent<SVGGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event);
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const step = KEY_STEP[event.key] ?? 0;
    if (event.key === "Home") onChange(CASHFLOW_MIN);
    else if (event.key === "End") onChange(CASHFLOW_MAX);
    else if (step) onChange(snapCashflow(flow + (event.shiftKey ? step * 10 : step)));
    else return;
    event.preventDefault();
  };

  const rect = (value: number) => ({ y: Math.min(y(value), zeroY), height: Math.abs(y(value) - zeroY) });
  const pvRect = rect(pv);
  const flowRect = rect(flow);
  const inset = width * 0.18;

  return (
    <g
      className="ixcf-col"
      transform={`translate(${x},0)`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={CASHFLOW_MIN}
      aria-valuemax={CASHFLOW_MAX}
      aria-valuenow={flow}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      <rect className="ixcf-hit" x={0} y={0} width={width} height={plotHeight} />
      <rect className="ixcf-pv" x={0} width={width} rx={3} {...pvRect} />
      <rect className={flow < 0 ? "ixcf-flow negative" : "ixcf-flow"} x={inset} width={width - 2 * inset} rx={3} {...flowRect} />
      <rect className="ixcf-handle" x={inset - 2} y={y(flow) - 3} width={width - 2 * inset + 4} height={6} rx={3} />
      <text className="ixcf-value" x={width / 2} y={flow >= 0 ? y(flow) - 8 : y(flow) + 16} textAnchor="middle">
        {flow}
      </text>
    </g>
  );
}
