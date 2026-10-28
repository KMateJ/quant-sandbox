import { DragHandles, LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import { TOXIC_DELTA_MAX, type IncomePoint, type ToxicSummary } from "../../../guide.micro.adverseSelection.math";

type Props = { rows: IncomePoint[]; summary: ToxicSummary; delta: number; onDelta: (delta: number) => void };

/// Income per minute against the half-spread, with and without informed customers; the handle picks δ.
export default function ToxicIncomeChart({ rows, summary, delta, onDelta }: Props) {
  const { t } = useI18n();
  const lines = [{ axis: "x" as const, value: summary.best, color: SERIES_PALETTE[1], width: 1.5 }];
  if (summary.breakEven > 0) lines.push({ axis: "x", value: summary.breakEven, color: SERIES_PALETTE[3], width: 1.5 });
  return (
    <LineChart
      data={rows}
      xKey="delta"
      xDomain={[0, TOXIC_DELTA_MAX]}
      series={[
        { key: "noInformed", label: t("gfMsToxicWithout"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "5 4" },
        { key: "income", label: t("gfMsToxicWith"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
      ]}
      referenceLines={lines}
      curve="linear"
      tooltipLabel={(x) => `δ = ${x.toFixed(1)}¢`}
      valueFormat={(v) => v.toFixed(0)}
      xFormat={(v) => `${v}¢`}
      layer={(frame) => (
        <DragHandles
          frame={frame}
          handles={[{ id: "delta", axis: "x", x: delta, min: 0, max: TOXIC_DELTA_MAX, step: 0.1, label: t("gfMsToxicHandle"), format: (v) => `${v.toFixed(1)}¢` }]}
          onChange={(_, v) => v.x !== undefined && onDelta(v.x)}
        />
      )}
    />
  );
}
