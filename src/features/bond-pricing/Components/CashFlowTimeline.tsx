import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import type { CashFlowRow } from "../bondPricing.types";
import { brokenCashflowAxis, zigzagPath } from "../bondPricing.math";
import { BOND_COLORS } from "../bondColors";
import TimelineBar from "./TimelineBar";

const COUPON = BOND_COLORS.coupon;
const PRINCIPAL = BOND_COLORS.principal;
const M = { top: 26, right: 16, bottom: 34, left: 48 };
const CLIP_ID = "bond-cf-break-clip";

type Props = { rows: CashFlowRow[] };

/// Cash-flow timeline on a broken axis: coupons fill the full-resolution lower band
/// while the large principal sits in a compressed upper band, so every payment —
/// and its discount shrink — stays visible. Hover reveals the exact discounting.
function Timeline({ rows, width, height, split }: Props & { width: number; height: number; split: boolean }) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = Math.max(0, height - M.top - M.bottom);
  const n = rows.length;
  const couponMax = Math.max(...rows.map((r) => r.coupon), 0);
  const totalMax = Math.max(...rows.map((r) => r.cashflow), 1);
  const axis = brokenCashflowAxis({ couponMax: split ? couponMax : 0, totalMax, top: M.top, innerH });
  const base = axis.base;
  const slotW = innerW / n;
  const barW = Math.min(slotW * 0.55, 26);
  const cx = (i: number) => M.left + slotW * (i + 0.5);
  const labelEvery = Math.ceil(n / 10);
  const num = (v: number) => v.toFixed(2);
  const tick = (v: number) => (v < 10 ? v.toFixed(1) : v.toFixed(0));
  const x0 = M.left;
  const x1 = width - M.right;

  const yTicks = axis.hasBreak ? [0, couponMax, totalMax] : [0, totalMax / 2, totalMax];
  const active = hover != null ? rows[hover] : null;

  return (
    <div className="bond-timeline" style={{ height }}>
      <svg width={width} height={height} role="img">
        <defs>
          <clipPath id={CLIP_ID}>
            <rect x={0} y={M.top} width={width} height={axis.gapTopY - M.top} />
            <rect x={0} y={axis.gapBottomY} width={width} height={height - axis.gapBottomY} />
          </clipPath>
        </defs>

        {/* y gridlines + value ticks */}
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
            <g key={r.period} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx(i) - slotW / 2} y={M.top} width={slotW} height={innerH} fill="transparent" />
              <TimelineBar row={r} x={cx(i) - barW / 2} cx={cx(i)} barW={barW} axis={axis} isHover={hover === i} />
              {(i % labelEvery === 0 || i === n - 1) && (
                <text x={cx(i)} y={base + 16} textAnchor="middle" fontSize={11} fill="var(--muted)">
                  {r.time.toFixed(r.time < 10 ? 1 : 0)}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* broken-axis marker */}
        {axis.hasBreak && (
          <g>
            <path d={zigzagPath(x0, x1, axis.gapBottomY)} fill="none" stroke="var(--border-hover)" strokeWidth={1} />
            <path d={zigzagPath(x0, x1, axis.gapTopY)} fill="none" stroke="var(--border-hover)" strokeWidth={1} />
          </g>
        )}
      </svg>

      {active && (
        <div className="bond-timeline-tip" style={{ left: cx(hover!), top: axis.y(active.cashflow) }}>
          <div className="tip-row"><span>{t("bondHoverTime")}</span><b>{active.time.toFixed(2)} {t("bondHoverYears")}</b></div>
          <div className="tip-row"><span>{t("bondHoverCashflow")}</span><b>{num(active.cashflow)}</b></div>
          <div className="tip-row"><span>{t("bondHoverDf")}</span><b>{active.discountFactor.toFixed(4)}</b></div>
          <div className="tip-row"><span>{t("bondHoverPv")}</span><b>{num(active.presentValue)}</b></div>
        </div>
      )}
    </div>
  );
}

export default function CashFlowTimeline({ rows }: Props) {
  const { t } = useI18n();
  const [split, setSplit] = useState(true);
  return (
    <div className="bond-timeline-wrap">
      <div className="bond-legend">
        <span className="bond-legend-item intuition-reveal"><i style={{ background: COUPON }} />{t("bondTimelineCoupon")}<IntuitionTrigger sectionId="coupon-rate" /></span>
        <span className="bond-legend-item intuition-reveal"><i style={{ background: PRINCIPAL }} />{t("bondTimelinePrincipal")}<IntuitionTrigger sectionId="face-value" /></span>
        <span className="bond-legend-item intuition-reveal"><i className="faint" />{t("bondTimelineCashflowLegend")}<IntuitionTrigger sectionId="cash-flows" /></span>
        <span className="bond-legend-item intuition-reveal"><i className="solid" />{t("bondTimelinePvLegend")}<IntuitionTrigger sectionId="price" /></span>
        <span className="intuition-reveal intuition-control-help bond-legend-split">
        <button
          type="button"
          className={`bond-toggle${split ? " active" : ""}`}
          aria-pressed={split}
          onClick={() => setSplit((v) => !v)}
        >
          {t("bondTimelineSplitLabel")}
        </button>
        <IntuitionTrigger sectionId="split-scale" />
        </span>
      </div>
      <div className="bond-timeline-slot">
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? <Timeline rows={rows} width={width} height={height} split={split} /> : null
          }
        </ParentSize>
      </div>
      <div className="bond-timeline-axis">{t("bondTimelineAxisTime")}</div>
    </div>
  );
}
