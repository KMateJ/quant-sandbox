import type { ChartSeries } from "../../../components/charts";

/// Compact inline key for a chart whose own legend would crowd a short plot.
export default function SeriesKey({ series }: { series: ChartSeries[] }) {
  return (
    <span className="hdesk-key">
      {series.map((s) => (
        <span key={s.key} className="hdesk-key__item">
          <svg width="14" height="6" aria-hidden="true">
            <line x1="0" y1="3" x2="14" y2="3" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
          </svg>
          {s.label}
        </span>
      ))}
    </span>
  );
}
