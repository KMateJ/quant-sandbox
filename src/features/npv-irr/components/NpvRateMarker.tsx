import { Line as SvgLine } from "@visx/shape";
import { CHART_COLORS } from "../../../components/charts/chart.theme";

type MarkerProps = { x: number; y: number; plotWidth: number; plotHeight: number; npv: number; valueFormat: (v: number) => string };

/// The current discount rate on the NPV profile: a vertical line, a dot on the curve and the NPV badge.
export function NpvRateMarker({ x, y, plotWidth, plotHeight, npv, valueFormat }: MarkerProps) {
  return (
    <>
      <SvgLine from={{ x, y: 0 }} to={{ x, y: plotHeight }} stroke="#e2e8f0" strokeWidth={1.5} />
      <circle cx={x} cy={y} r={6} fill="#0b1220" stroke="#e2e8f0" strokeWidth={2} />
      <g transform={`translate(${Math.min(x + 8, plotWidth - 70)}, ${Math.max(y - 10, 12)})`}>
        <rect x={0} y={-12} width={66} height={18} rx={4} fill="#1e293b" stroke="#475569" />
        <text x={6} y={1} fill={npv >= 0 ? "#86efac" : "#fca5a5"} fontSize={11} fontWeight={700}>
          {valueFormat(npv)}
        </text>
      </g>
    </>
  );
}

type HoverProps = { x: number; plotWidth: number; rate: string; npv: number; valueFormat: (v: number) => string };

/// Rate and NPV under the pointer, shown at the top of the plot.
export function NpvHoverReadout({ x, plotWidth, rate, npv, valueFormat }: HoverProps) {
  return (
    <g transform={`translate(${Math.min(x, plotWidth - 96)}, 2)`}>
      <rect x={0} y={0} width={92} height={32} rx={4} fill="#1e293b" stroke="#475569" />
      <text x={6} y={13} fill={CHART_COLORS.tooltipText} fontSize={10}>{rate}</text>
      <text x={6} y={26} fill={npv >= 0 ? "#86efac" : "#fca5a5"} fontSize={11} fontWeight={700}>
        {valueFormat(npv)}
      </text>
    </g>
  );
}
