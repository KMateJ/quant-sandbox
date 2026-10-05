import { TooltipWithBounds } from "@visx/tooltip";
import { CHART_COLORS } from "./chart.theme";
import type { ChartDatum, ChartSeries } from "./chart.types";

type Props = {
  left: number;
  top: number;
  datum: ChartDatum;
  xKey: string;
  series: ChartSeries[];
  label?: (x: number) => string;
  valueFormat?: (value: number) => string;
};

export default function ChartTooltip({
  left,
  top,
  datum,
  xKey,
  series,
  label,
  valueFormat,
}: Props) {
  const x = Number(datum[xKey]);
  const fmt = valueFormat ?? ((v: number) => v.toFixed(3));

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
      <div style={{ marginBottom: 4 }}>{label ? label(x) : String(x)}</div>
      {series.map((s) => {
        const v = datum[s.key];
        if (typeof v !== "number") return null;
        return (
          <div
            key={s.key}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: s.color,
              }}
            />
            <span>
              {s.label}: {fmt(v)}
            </span>
          </div>
        );
      })}
    </TooltipWithBounds>
  );
}
