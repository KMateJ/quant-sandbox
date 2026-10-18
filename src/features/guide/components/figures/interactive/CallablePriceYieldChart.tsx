import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useI18n } from "../../../../../i18n";
import { CALLABLE, type CallableQuote } from "../../../guide.interactive.callablePriceYield.math";
import { fmt, pct } from "../figureFormat";

type Curve = { y: number; straight: number; callable: number }[];
type Props = { curve: Curve; y: number; quote: CallableQuote; onChange: (y: number) => void; width: number };

const HEIGHT = 300;
const PAD = { left: 40, right: 14, top: 16, bottom: 30 };
const P_MIN = 70;
const P_MAX = 140;
const STEP = 0.0005;
const KEY_STEP: Record<string, number> = { ArrowRight: 5 * STEP, ArrowUp: 5 * STEP, ArrowLeft: -5 * STEP, ArrowDown: -5 * STEP, PageUp: 20 * STEP, PageDown: -20 * STEP };
const clampY = (y: number) => Math.round(Math.min(CALLABLE.maxYield, Math.max(CALLABLE.minYield, y)) / STEP) * STEP;

/// Price–yield curves with the call's value shaded between them and a draggable point on the callable curve.
export default function CallablePriceYieldChart({ curve, y, quote, onChange, width }: Props) {
  const { t } = useI18n();
  const svg = useRef<SVGSVGElement>(null);
  const { minYield, maxYield } = CALLABLE;
  const x = (v: number) => PAD.left + ((v - minYield) / (maxYield - minYield)) * (width - PAD.left - PAD.right);
  const py = (p: number) => PAD.top + (1 - (p - P_MIN) / (P_MAX - P_MIN)) * (HEIGHT - PAD.top - PAD.bottom);
  const path = (key: "straight" | "callable") => curve.map((c, i) => `${i ? "L" : "M"}${x(c.y).toFixed(1)} ${py(c[key]).toFixed(1)}`).join("");
  const gap = `${path("straight")}${[...curve].reverse().map((c) => `L${x(c.y).toFixed(1)} ${py(c.callable).toFixed(1)}`).join("")}Z`;
  // Tangent through the chosen point: slope dP/dy = −D·P from the effective duration, drawn ±1.5 percentage points.
  const slope = -quote.duration * quote.callable;
  const tan = [Math.max(minYield, y - 0.015), Math.min(maxYield, y + 0.015)].map((v) => ({ x: x(v), y: py(quote.callable + slope * (v - y)) }));
  const negative = quote.convexity < 0;

  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return;
    const u = (event.clientX - rect.left - PAD.left) / (rect.width - PAD.left - PAD.right);
    onChange(clampY(minYield + u * (maxYield - minYield)));
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const next = event.key === "Home" ? minYield : event.key === "End" ? maxYield : KEY_STEP[event.key] !== undefined ? y + KEY_STEP[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    onChange(clampY(next));
  };

  return (
    <svg
      ref={svg}
      className="cb-chart"
      width={width}
      height={HEIGHT}
      role="group"
      aria-label={t("ixCbAria")}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
    >
      {[80, 100, 120, 140].map((p) => (
        <g key={p}>
          <line className="cb-grid" x1={PAD.left} x2={width - PAD.right} y1={py(p)} y2={py(p)} />
          <text className="cb-tick" x={PAD.left - 6} y={py(p) + 4} textAnchor="end">{p}</text>
        </g>
      ))}
      {[0.02, 0.04, 0.06, 0.08, 0.1].map((v) => (
        <text key={v} className="cb-tick" x={x(v)} y={HEIGHT - 8} textAnchor="middle">{pct(v, 0)}</text>
      ))}
      <path className="cb-gap" d={gap} />
      <path className="cb-line cb-line--straight" d={path("straight")} />
      <path className="cb-line cb-line--callable" d={path("callable")} />
      <line className="cb-tangent" x1={tan[0].x} y1={tan[0].y} x2={tan[1].x} y2={tan[1].y} />
      <line className="cb-guide" x1={x(y)} x2={x(y)} y1={py(quote.callable)} y2={HEIGHT - PAD.bottom} />
      <g
        className="cb-handle"
        role="slider"
        tabIndex={0}
        aria-label={t("ixCbHandle")}
        aria-valuemin={minYield * 100}
        aria-valuemax={maxYield * 100}
        aria-valuenow={Number((y * 100).toFixed(2))}
        aria-valuetext={t("ixCbHandleText", { y: pct(y, 2), p: fmt(quote.callable, 2) })}
        onKeyDown={onKeyDown}
      >
        <circle cx={x(y)} cy={py(quote.callable)} r={8} />
      </g>
      <text className={negative ? "cb-badge is-negative" : "cb-badge"} x={x(y)} y={py(quote.callable) - 16} textAnchor={x(y) > width - 110 ? "end" : x(y) < 110 ? "start" : "middle"}>
        {t(negative ? "ixCbNegative" : "ixCbPositive")}
      </text>
    </svg>
  );
}
