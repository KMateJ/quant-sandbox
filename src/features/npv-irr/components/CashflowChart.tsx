import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, LinePath, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { CHART_COLORS } from "../../../components/charts/chart.theme";
import type { NpvScheduleRow } from "../npvIrr.types";

export type CashflowMode = "nominal" | "pv";

type CashflowChartProps = {
  rows: NpvScheduleRow[];
  mode: CashflowMode;
  showCumulative: boolean;
  hoverYear: number | null;
  onHoverYear: (year: number | null) => void;
  valueFormat: (v: number) => string;
};

function Inner(props: CashflowChartProps & { width: number; height: number }) {
  const { rows, mode, showCumulative, hoverYear, onHoverYear, valueFormat, width, height } = props;
  const margin = { top: 14, right: 14, bottom: 26, left: 50 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const value = (r: NpvScheduleRow) => (mode === "nominal" ? r.cashflow : r.pv);
  const bars = rows.map((r) => value(r));
  const cum = rows.map((r) => r.cumulativePv);
  const lo = Math.min(0, ...bars, ...(showCumulative ? cum : []));
  const hi = Math.max(0, ...bars, ...(showCumulative ? cum : []));
  const yScale = scaleLinear({ domain: [lo * 1.1, hi * 1.1], range: [innerH, 0] });
  const xScale = scaleBand({ domain: rows.map((r) => String(r.year)), range: [0, innerW], padding: 0.25 });

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        <AxisLeft scale={yScale} numTicks={6} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 10, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />
        <SvgLine from={{ x: 0, y: yScale(0) }} to={{ x: innerW, y: yScale(0) }} stroke="#64748b" strokeWidth={1} />
        {rows.map((r) => {
          const v = value(r);
          const bx = xScale(String(r.year)) ?? 0;
          const top = yScale(Math.max(0, v));
          const bh = Math.abs(yScale(v) - yScale(0));
          const isOutlay = r.year === 0 || v < 0;
          const active = hoverYear === r.year;
          return (
            <Bar
              key={r.year}
              x={bx}
              y={top}
              width={xScale.bandwidth()}
              height={bh}
              rx={2}
              fill={isOutlay ? "#ef4444" : "#22c55e"}
              opacity={active ? 1 : 0.82}
              stroke={active ? "#e2e8f0" : "none"}
              onMouseEnter={() => onHoverYear(r.year)}
              onMouseLeave={() => onHoverYear(null)}
            />
          );
        })}
        {showCumulative && (
          <LinePath
            data={rows}
            x={(r) => (xScale(String(r.year)) ?? 0) + xScale.bandwidth() / 2}
            y={(r) => yScale(r.cumulativePv)}
            stroke="#38bdf8"
            strokeWidth={2}
            curve={curveMonotoneX}
          />
        )}
        {hoverYear != null && (() => {
          const r = rows.find((row) => row.year === hoverYear);
          if (!r) return null;
          const bx = (xScale(String(r.year)) ?? 0) + xScale.bandwidth() / 2;
          return (
            <text x={Math.min(bx, innerW - 20)} y={10} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={700}>
              {valueFormat(value(r))}
            </text>
          );
        })()}
        <AxisBottom top={innerH} scale={xScale} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 10, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Yearly cashflow bars (nominal or discounted) with an optional cumulative-PV overlay.
export default function CashflowChart(props: CashflowChartProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>{({ width, height }) => (width > 0 && height > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
