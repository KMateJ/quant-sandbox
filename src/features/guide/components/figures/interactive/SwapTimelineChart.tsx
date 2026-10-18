import { ParentSize } from "@visx/responsive";
import { useI18n } from "../../../../../i18n";
import type { SwapPayment } from "../../../guide.interactive.swapTimeline.math";
import SwapTimelineArrow, { type SwapLeg } from "./SwapTimelineArrow";

export type SwapSelection = { t: number; leg: SwapLeg } | null;

type Props = {
  payments: SwapPayment[];
  /// Amount drawn at full half-height; fixed across curve shifts so arrows can visibly grow.
  maxAmount: number;
  selected: SwapSelection;
  onSelect: (selection: SwapSelection) => void;
  format: (value: number) => string;
};

const HEIGHT = 250;
const PAD_X = 28;
const LABEL_SPACE = 26;

/// Timeline 0–3 years: fixed payments as downward arrows, floating payments as upward arrows.
export default function SwapTimelineChart(props: Props) {
  const { t } = useI18n();
  return (
    <div className="ix-sw-chart">
      <ParentSize debounceTime={0}>
        {({ width }) => (width > 0 ? <Timeline {...props} width={width} label={(year) => t("ixSwYearShort", { t: year })} /> : null)}
      </ParentSize>
    </div>
  );
}

function Timeline({ payments, maxAmount, selected, onSelect, format, width, label }: Props & { width: number; label: (t: number) => string }) {
  const { t } = useI18n();
  const axisY = HEIGHT / 2;
  const half = axisY - LABEL_SPACE;
  const years = payments.length;
  const x = (year: number) => PAD_X + (year / years) * (width - 2 * PAD_X);
  const barWidth = width < 420 ? 12 : 18;
  const scale = (amount: number) => (amount / maxAmount) * half;

  return (
    <svg width={width} height={HEIGHT} role="group" aria-label={t("ixSwChartAria")}>
      <line className="ix-sw-axis" x1={PAD_X - 10} x2={width - PAD_X + 10} y1={axisY} y2={axisY} />
      {Array.from({ length: years + 1 }, (_, year) => (
        <g key={year}>
          <line className="ix-sw-tick" x1={x(year)} x2={x(year)} y1={axisY - 4} y2={axisY + 4} />
          {/* Left of the date's arrows (which sit either side of the tick), so the last label stays inside. */}
          <text
            className="ix-sw-year"
            x={year === 0 ? x(year) + 4 : x(year) - barWidth - 8}
            y={axisY + 16}
            textAnchor={year === 0 ? "start" : "end"}
          >
            {label(year)}
          </text>
        </g>
      ))}
      {payments.map((p) =>
        (["floating", "fixed"] as const).map((leg) => {
          const amount = leg === "fixed" ? p.fixed : p.floating;
          const pv = leg === "fixed" ? p.pvFixed : p.pvFloating;
          const legLabel = t(leg === "fixed" ? "ixSwFixed" : "ixSwFloating");
          return (
            <SwapTimelineArrow
              key={`${p.t}-${leg}`}
              leg={leg}
              x={x(p.t) + (leg === "floating" ? -barWidth / 2 - 2 : barWidth / 2 + 2)}
              axisY={axisY}
              width={barWidth}
              length={scale(amount)}
              pvLength={scale(pv)}
              selected={selected?.t === p.t && selected.leg === leg}
              ariaLabel={t("ixSwArrowAria", { leg: legLabel, t: p.t, amount: format(amount), pv: format(pv) })}
              onSelect={() => onSelect({ t: p.t, leg })}
            />
          );
        })
      )}
    </svg>
  );
}
