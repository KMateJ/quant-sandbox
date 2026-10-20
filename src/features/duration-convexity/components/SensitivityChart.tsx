import { useMediaQuery } from "../../../components/useMediaQuery";
import { ScatterChart } from "../../../components/charts";
import type {
  ChartReferenceLine,
  ScatterAnnotation,
  ScatterSeries,
} from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";
import { DURATION, DURCONVEX, EXACT } from "./sensitivitySeries";

type Props = {
  model: DcModel;
  /// The price-change curves to draw (from `sensitivitySeries`, possibly with pinned ghosts in front).
  lines: ScatterSeries[];
};

/// Main experiment: price change (%) vs yield shock Δy (bp). Exact repricing is
/// the dominant curved line; duration is its tangent; convexity bends back toward
/// it. Markers and a reference line expose the gap at the selected shock.
export default function SensitivityChart({ model, lines }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { result, measures, maxBp } = model;
  const setShock = (x: number) => model.setShockBp(Math.max(-maxBp, Math.min(maxBp, Math.round(x / 5) * 5)));

  const markers: ScatterSeries = {
    key: "selected",
    label: "",
    color: "#e2e8f0",
    legend: false,
    radius: 6,
    draggable: true,
    points: [
      { x: result.dyBp, y: result.exactPct, color: EXACT, label: t("dcExactLabel") },
      { x: result.dyBp, y: result.durConvexPct, color: DURCONVEX, label: t("dcDurConvexLabel") },
      { x: result.dyBp, y: result.durationPct, color: DURATION, label: t("dcDurationLabel") },
    ],
  };

  // Fit every drawn line, pinned ghosts included; dragging the shock leaves the lines (and so the axis) unchanged.
  const ys = lines.flatMap((series) => series.points.map((p) => p.y));
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const padY = (hi - lo) * 0.08 || 1;
  const yDomain: [number, number] = [lo - padY, hi + padY];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "y", value: 0, color: "#64748b", dash: "2 4" },
    { axis: "x", value: result.dyBp, color: "#94a3b8", dash: "4 4" },
  ];

  const annX = -maxBp * 0.58;
  const annY = -measures.modified * (annX / 10000) * 100;
  const annotations: ScatterAnnotation[] = [
    {
      x: annX,
      y: annY,
      text: t("dcTangentNote"),
      color: DURATION,
      anchor: "middle",
      fontSize: isMobile ? 10 : 12,
      dy: -8,
    },
  ];

  return (
    <ScatterChart
      series={[...lines, markers]}
      xDomain={[-maxBp, maxBp]}
      yDomain={yDomain}
      referenceLines={referenceLines}
      annotations={annotations}
      avoidLabelCollisions
      isMobile={isMobile}
      xLabel={t("dcChartXLabel")}
      yLabel={t("dcChartYLabel")}
      xFormat={(v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}`}
      yFormat={(v) => `${v.toFixed(0)}%`}
      onDrag={(x) => setShock(x)}
      onPlotClick={(x) => setShock(x)}
    />
  );
}
