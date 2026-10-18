import { useState } from "react";
import DraggableBar from "../../../components/charts/DraggableBar";
import { useI18n } from "../../../i18n";
import type { CashFlowRow } from "../bondPricing.types";
import { brokenCashflowAxis, zigzagPath } from "../bondPricing.math";
import TimelineBar from "./TimelineBar";
import TimelineTip from "./TimelineTip";

const M = { top: 26, right: 16, bottom: 34, left: 48 };
const CLIP_ID = "bond-cf-break-clip";
/// Drag and keyboard step for a cash flow (Shift: ×10).
const STEP = 0.25;
const NO_COLOR = { positive: "transparent", negative: "transparent" };

type Props = {
  rows: CashFlowRow[];
  width: number;
  height: number;
  split: boolean;
  /// Largest cash flow a bar can be dragged to.
  maxFlow: number;
  onFlow: (index: number, value: number) => void;
};

/// Cash-flow timeline on a broken axis: coupons fill the full-resolution lower band while the large
/// principal sits in a compressed upper band, so every payment — and its discount shrink — stays
/// visible. Each column is a slider: drag it (or use the arrow keys) to reshape that period's cash flow.
export default function TimelineChart({ rows, width, height, split, maxFlow, onFlow }: Props) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  // While a bar is dragged, the axis keeps its scale so the bar follows the pointer.
  const [frozen, setFrozen] = useState<{ couponMax: number; totalMax: number } | null>(null);

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = Math.max(0, height - M.top - M.bottom);
  const n = rows.length;
  const scale = frozen ?? {
    couponMax: Math.max(...rows.map((r) => r.coupon), 0),
    totalMax: Math.max(...rows.map((r) => r.cashflow), 1),
  };
  const { couponMax, totalMax } = scale;
  const axis = brokenCashflowAxis({ couponMax: split ? couponMax : 0, totalMax, top: M.top, innerH });
  const base = axis.base;
  const slotW = innerW / n;
  const barW = Math.min(slotW * 0.55, 26);
  const cx = (i: number) => M.left + slotW * (i + 0.5);
  const labelEvery = Math.ceil(n / 10);
  const tick = (v: number) => (v < 10 ? v.toFixed(1) : v.toFixed(0));
  const x0 = M.left;
  const x1 = width - M.right;
  // Slider coordinates are relative to the plot top; bars past the top are drawn at the top.
  const sliderY = (v: number) => Math.min(innerH, Math.max(0, axis.y(v) - M.top));

  const yTicks = axis.hasBreak ? [0, couponMax, totalMax] : [0, totalMax / 2, totalMax];
  const active = hover != null ? rows[hover] : null;

  return (
    <div className="bond-timeline" style={{ height }}>
      <svg width={width} height={height} role="group" aria-label={t("bondDragAria")} style={{ touchAction: "none" }}>
        <defs>
          <clipPath id={CLIP_ID}>
            <rect x={0} y={M.top} width={width} height={axis.gapTopY - M.top} />
            <rect x={0} y={axis.gapBottomY} width={width} height={height - axis.gapBottomY} />
          </clipPath>
        </defs>

        {yTicks.map((v, k) => {
          const y = axis.y(v);
          return (
            <g key={k}>
              <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
              <text x={x0 - 8} y={y + 4} textAnchor="end" fontSize={11} fill="var(--muted)">{tick(v)}</text>
            </g>
          );
        })}
        <line x1={x0} y1={base} x2={x1} y2={base} stroke="var(--border)" />

        <g clipPath={`url(#${CLIP_ID})`}>
          {rows.map((r, i) => (
            <g key={r.period} className="bond-timeline-col"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              <g transform={`translate(0,${M.top})`}>
                <DraggableBar x={cx(i) - slotW / 2} width={slotW} plotHeight={innerH} zeroY={innerH}
                  y={sliderY} valueFromY={(py) => axis.invert(py + M.top)}
                  value={r.cashflow} limits={[0, maxFlow]} step={STEP} colors={NO_COLOR}
                  label={t("bondDragBarAria", { time: r.time.toFixed(2) })}
                  valueText={`${r.cashflow.toFixed(2)} · ${t("bondHoverPv")} ${r.presentValue.toFixed(2)}`}
                  onChange={(v) => onFlow(i, v)}
                  onDragStart={() => setFrozen((f) => f ?? scale)} onDragEnd={() => setFrozen(null)} />
              </g>
              <g pointerEvents="none">
                <TimelineBar row={r} x={cx(i) - barW / 2} cx={cx(i)} barW={barW} axis={axis} isHover={hover === i} />
              </g>
              {(i % labelEvery === 0 || i === n - 1) && (
                <text x={cx(i)} y={base + 16} textAnchor="middle" fontSize={11} fill="var(--muted)" pointerEvents="none">
                  {r.time.toFixed(r.time < 10 ? 1 : 0)}
                </text>
              )}
            </g>
          ))}
        </g>

        {axis.hasBreak && (
          <g pointerEvents="none">
            <path d={zigzagPath(x0, x1, axis.gapBottomY)} fill="none" stroke="var(--border-hover)" strokeWidth={1} />
            <path d={zigzagPath(x0, x1, axis.gapTopY)} fill="none" stroke="var(--border-hover)" strokeWidth={1} />
          </g>
        )}
      </svg>

      {active && <TimelineTip row={active} left={cx(hover!)} top={axis.y(active.cashflow)} />}
    </div>
  );
}
