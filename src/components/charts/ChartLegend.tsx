import type { Ref } from "react";
import type { ChartSeries } from "./chart.types";
import { IntuitionTrigger } from "../intuition";

/// Simple colored-marker legend rendered below the plot.
export default function ChartLegend({ series, ref }: { series: ChartSeries[]; ref?: Ref<HTMLDivElement> }) {
  const items = series.filter((s) => s.legend !== false && s.label);
  if (items.length === 0) return null;

  return (
    <div ref={ref} className="chart-legend">
      {items.map((s) => (
        <span key={s.key} className="chart-legend-item intuition-reveal">
          <span
            className="chart-legend-swatch"
            style={{
              background: s.dash ? "transparent" : s.color,
              borderColor: s.color,
              borderStyle: s.dash ? "dashed" : "solid",
            }}
          />
          {s.label}
          {s.intuitionSectionId && <IntuitionTrigger sectionId={s.intuitionSectionId} />}
        </span>
      ))}
    </div>
  );
}
