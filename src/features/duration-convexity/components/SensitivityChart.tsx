import { useMediaQuery } from "../../../components/useMediaQuery";
import { ScatterChart } from "../../../components/charts";
import type {
  ChartReferenceLine,
  ScatterAnnotation,
  ScatterSeries,
} from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

const EXACT = "#22c55e";
const DURATION = "#38bdf8";
const DURCONVEX = "#f59e0b";

/// Main experiment: price change (%) vs yield shock Δy (bp). Exact repricing is
/// the dominant curved line; duration is its tangent; convexity bends back toward
/// it. Markers and a reference line expose the gap at the selected shock.
export default function SensitivityChart({ model }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { curve, result, measures, maxBp } = model;

  const lineSeries: ScatterSeries[] = [
    {
      key: "exact",
      label: t("dcExactLabel"),
      color: EXACT,
      line: true,
      strokeWidth: 2.8,
      points: curve.map((d) => ({ x: d.dyBp, y: d.exact })),
    },
    {
      key: "duration",
      label: t("dcDurationLabel"),
      color: DURATION,
      line: true,
      strokeWidth: 2,
      dash: "6 5",
      points: curve.map((d) => ({ x: d.dyBp, y: d.duration })),
    },
    {
      key: "durConvex",
      label: t("dcDurConvexLabel"),
      color: DURCONVEX,
      line: true,
      strokeWidth: 2.2,
      dash: "2 3",
      points: curve.map((d) => ({ x: d.dyBp, y: d.durConvex })),
    },
  ];

  const markers: ScatterSeries = {
    key: "selected",
    label: "",
    color: "#e2e8f0",
    legend: false,
    radius: 5,
    points: [
      { x: result.dyBp, y: result.exactPct, color: EXACT, label: t("dcExactLabel") },
      { x: result.dyBp, y: result.durConvexPct, color: DURCONVEX, label: t("dcDurConvexLabel") },
      { x: result.dyBp, y: result.durationPct, color: DURATION, label: t("dcDurationLabel") },
    ],
  };

  const ys = curve.flatMap((d) => [d.exact, d.duration, d.durConvex]);
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
      series={[...lineSeries, markers]}
      xDomain={[-maxBp, maxBp]}
      yDomain={yDomain}
      referenceLines={referenceLines}
      annotations={annotations}
      isMobile={isMobile}
      xLabel={t("dcChartXLabel")}
      yLabel={t("dcChartYLabel")}
      xFormat={(v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}`}
      yFormat={(v) => `${v.toFixed(0)}%`}
    />
  );
}
