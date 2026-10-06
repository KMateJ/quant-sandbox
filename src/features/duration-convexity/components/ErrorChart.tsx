import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart } from "../../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

/// Secondary view: approximation error (estimate − exact) vs yield shock. The
/// duration error (shaded) diverges from zero much faster than the convexity-
/// corrected error, answering "when does duration stop being good enough?".
export default function ErrorChart({ model }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { errors, result, maxBp } = model;

  const series: ChartSeries[] = [
    {
      key: "durationError",
      intuitionSectionId: "approximation-error",
      label: t("dcDurationErrLabel"),
      color: "#38bdf8",
      strokeWidth: 2,
      area: true,
      areaColor: "#38bdf8",
    },
    {
      key: "durConvexError",
      intuitionSectionId: "approximation-error",
      label: t("dcDurConvexErrLabel"),
      color: "#f59e0b",
      strokeWidth: 2,
      dash: "2 3",
    },
  ];

  const referenceLines: ChartReferenceLine[] = [
    { axis: "y", value: 0, color: "#64748b", dash: "2 4" },
    { axis: "x", value: result.dyBp, color: "#94a3b8", dash: "4 4" },
  ];

  return (
    <LineChart
      data={errors}
      xKey="dyBp"
      series={series}
      xDomain={[-maxBp, maxBp]}
      referenceLines={referenceLines}
      isMobile={isMobile}
      tooltipLabel={(x) => `Δy = ${x > 0 ? "+" : ""}${x.toFixed(0)} bp`}
      valueFormat={(v) => `${v.toFixed(2)}%`}
    />
  );
}
