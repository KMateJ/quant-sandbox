import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useI18n } from "../../../i18n";
import type { CashFlowRow } from "../bondPricing.types";

const COUPON = "#f59e0b";
const PRINCIPAL = "#38bdf8";
const H = 320;
const M = { top: 26, right: 16, bottom: 34, left: 44 };

type Props = { rows: CashFlowRow[] };

/// Cash-flow timeline: faint future cash flows with solid present-value bars overlaid,
/// coupon vs principal distinguished by colour; hover reveals discounting detail.
function Timeline({ rows, width }: Props & { width: number }) {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = H - M.top - M.bottom;
  const n = rows.length;
  const maxCF = Math.max(...rows.map((r) => r.cashflow), 1);
  const slotW = innerW / n;
  const barW = Math.min(slotW * 0.55, 26);
  const h = (v: number) => (v / maxCF) * innerH;
  const cx = (i: number) => M.left + slotW * (i + 0.5);
  const labelEvery = Math.ceil(n / 10);
  const num = (v: number) => v.toFixed(2);

  const active = hover != null ? rows[hover] : null;

  return (
    <div className="bond-timeline" style={{ height: H }}>
      <svg width={width} height={H} role="img">
        {/* y axis ticks */}
        {[0, 0.5, 1].map((f) => {
          const y = M.top + innerH - f * innerH;
          return (
            <g key={f}>
              <line x1={M.left} y1={y} x2={width - M.right} y2={y} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
              <text x={M.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="var(--muted)">
                {(maxCF * f).toFixed(0)}
              </text>
            </g>
          );
        })}
        {/* baseline */}
        <line x1={M.left} y1={M.top + innerH} x2={width - M.right} y2={M.top + innerH} stroke="var(--border)" />

        {rows.map((r, i) => {
          const base = M.top + innerH;
          const cpH = h(r.coupon);
          const prH = h(r.principal);
          const cpPvH = h(r.coupon * r.discountFactor);
          const prPvH = h(r.principal * r.discountFactor);
          const x = cx(i) - barW / 2;
          const isHover = hover === i;
          return (
            <g key={r.period} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* hover capture */}
              <rect x={cx(i) - slotW / 2} y={M.top} width={slotW} height={innerH} fill="transparent" />
              {/* faint future cash flow */}
              <rect x={x} y={base - cpH} width={barW} height={cpH} fill={COUPON} opacity={0.26} rx={2} />
              {prH > 0 && <rect x={x} y={base - cpH - prH} width={barW} height={prH} fill={PRINCIPAL} opacity={0.26} rx={2} />}
              {/* solid present value */}
              <rect x={x} y={base - cpPvH} width={barW} height={cpPvH} fill={COUPON} opacity={isHover ? 1 : 0.9} rx={2} />
              {prPvH > 0 && <rect x={x} y={base - cpPvH - prPvH} width={barW} height={prPvH} fill={PRINCIPAL} opacity={isHover ? 1 : 0.9} rx={2} />}
              {/* x label */}
              {(i % labelEvery === 0 || i === n - 1) && (
                <text x={cx(i)} y={base + 16} textAnchor="middle" fontSize={11} fill="var(--muted)">
                  {r.time.toFixed(r.time < 10 ? 1 : 0)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {active && (
        <div
          className="bond-timeline-tip"
          style={{ left: cx(hover!), top: M.top + innerH - h(active.cashflow) }}
        >
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
  return (
    <div className="bond-timeline-wrap">
      <div className="bond-legend">
        <span className="bond-legend-item"><i style={{ background: COUPON }} />{t("bondTimelineCoupon")}</span>
        <span className="bond-legend-item"><i style={{ background: PRINCIPAL }} />{t("bondTimelinePrincipal")}</span>
        <span className="bond-legend-item"><i className="faint" />{t("bondTimelineCashflowLegend")}</span>
        <span className="bond-legend-item"><i className="solid" />{t("bondTimelinePvLegend")}</span>
      </div>
      <ParentSize>{({ width }) => (width > 0 ? <Timeline rows={rows} width={width} /> : null)}</ParentSize>
      <div className="bond-timeline-axis">{t("bondTimelineAxisTime")}</div>
    </div>
  );
}
