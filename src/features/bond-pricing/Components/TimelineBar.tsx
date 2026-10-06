import type { CashFlowRow, BrokenAxis } from "../bondPricing.types";
import { BOND_COLORS } from "../bondColors";

const COUPON = BOND_COLORS.coupon;
const PRINCIPAL = BOND_COLORS.principal;

type Props = {
  row: CashFlowRow;
  x: number;
  cx: number;
  barW: number;
  axis: BrokenAxis;
  isHover: boolean;
};

/// One payment: faint undiscounted cash flow, solid present value (coupon stacked
/// under principal), a cap at the full cash flow and a dashed discount-shrink stem.
export default function TimelineBar({ row, x, cx, barW, axis, isHover }: Props) {
  const base = axis.base;
  const cfCouponTop = axis.y(row.coupon);
  const cfTotalTop = axis.y(row.cashflow);
  const pvCouponTop = axis.y(row.coupon * row.discountFactor);
  const pvTotalTop = axis.y(row.presentValue);
  const hasPrincipal = row.principal > 0;
  const showShrink = pvTotalTop - cfTotalTop > 2;

  return (
    <g>
      {/* faint future cash flow */}
      <rect x={x} y={cfCouponTop} width={barW} height={base - cfCouponTop} fill={COUPON} opacity={0.22} rx={2} />
      {hasPrincipal && (
        <rect x={x} y={cfTotalTop} width={barW} height={cfCouponTop - cfTotalTop} fill={PRINCIPAL} opacity={0.22} rx={2} />
      )}
      {/* cap at the top of the undiscounted cash flow */}
      <line x1={x} y1={cfTotalTop} x2={x + barW} y2={cfTotalTop} stroke="var(--muted)" strokeWidth={1.5} opacity={isHover ? 0.9 : 0.55} />
      {/* discount "shrink" stem from present value up to the full cash flow */}
      {showShrink && (
        <line x1={cx} y1={pvTotalTop} x2={cx} y2={cfTotalTop} stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 3" opacity={isHover ? 0.85 : 0.45} />
      )}
      {/* solid present value */}
      <rect x={x} y={pvCouponTop} width={barW} height={base - pvCouponTop} fill={COUPON} opacity={isHover ? 1 : 0.92} rx={2} />
      {hasPrincipal && (
        <rect x={x} y={pvTotalTop} width={barW} height={pvCouponTop - pvTotalTop} fill={PRINCIPAL} opacity={isHover ? 1 : 0.92} rx={2} />
      )}
      {/* lollipop head on the present-value bar */}
      <circle cx={cx} cy={pvTotalTop} r={isHover ? 4 : 3} fill={hasPrincipal ? PRINCIPAL : COUPON} stroke="var(--surface)" strokeWidth={1} />
    </g>
  );
}
