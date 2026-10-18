import { TooltipWithBounds } from "@visx/tooltip";
import { CHART_COLORS } from "./chart.theme";
import type { ScatterPoint, ScatterSeries } from "./chart.types";

type Props = {
  left: number;
  top: number;
  point: ScatterPoint;
  series: ScatterSeries;
  fmtX: (value: number) => string;
  fmtY: (value: number) => string;
};

/// Hover card for a scatter marker: series label, coordinates and optional extra rows.
export default function ScatterTooltip({ left, top, point, series, fmtX, fmtY }: Props) {
  return (
    <TooltipWithBounds
      left={left}
      top={top}
      style={{
        position: "absolute",
        background: CHART_COLORS.tooltipBg,
        border: `1px solid ${CHART_COLORS.tooltipBorder}`,
        borderRadius: 8,
        color: CHART_COLORS.tooltipText,
        padding: "8px 10px",
        fontSize: 12,
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: point.color ?? series.color }} />
        <span>{point.label ?? series.label}</span>
      </div>
      <div>x: {fmtX(point.x)}</div>
      <div>y: {fmtY(point.y)}</div>
      {point.tooltipRows && point.tooltipRows.length > 0 && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${CHART_COLORS.tooltipBorder}`, display: "flex", flexDirection: "column", gap: 2 }}>
          {point.tooltipRows.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {row.color && <span style={{ width: 8, height: 8, borderRadius: 999, background: row.color }} />}
              <span style={{ flex: 1 }}>{row.label}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </TooltipWithBounds>
  );
}
