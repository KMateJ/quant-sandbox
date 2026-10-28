import { useMemo } from "react";
import { DragHandles, LineChart } from "../../../../components/charts";
import { SERIES_PALETTE } from "../../../../components/charts/chart.theme";
import { useI18n } from "../../../../i18n";
import { SWEEP_DEFAULTS, type FragilityPoint } from "../../engine/fragility.math";

type Props = {
  points: FragilityPoint[];
  revealed: boolean;
  guess: number | null;
  truth: number;
  onGuess: (degree: number) => void;
};

const MAX_X = 12.5;

/// Probability and extent of contagion against average links per bank. Before the reveal the plot only holds the
/// draggable guess marker; afterwards the sweep points drawn so far, the truth and the guess.
export default function FragilityChart({ points, revealed, guess, truth, onGuess }: Props) {
  const { t } = useI18n();
  const series = useMemo(() => [
    { key: "p", label: t("syrShockFragP"), color: SERIES_PALETTE[3], strokeWidth: 2.4 },
    { key: "extent", label: t("syrShockFragExtent"), color: SERIES_PALETTE[0], strokeWidth: 2 },
  ], [t]);
  const data = SWEEP_DEFAULTS.degrees.map((degree) => {
    const pt = revealed ? points.find((p) => p.degree === degree) : undefined;
    return { degree, p: pt && 100 * pt.pContagion, extent: pt && 100 * pt.meanExtent };
  });
  const lines = revealed
    ? [{ axis: "x" as const, value: truth, color: "var(--chart-4)", dash: "5 3" }, ...(guess === null ? [] : [{ axis: "x" as const, value: guess, color: "var(--primary)" }])]
    : [];
  const fmt = (v: number) => t("syrShockLinks", { n: v.toFixed(1) });
  return (
    <div className="syr-frag-chart">
      <LineChart
        data={data}
        xKey="degree"
        series={series}
        xDomain={[0, MAX_X]}
        yDomain={[0, 100]}
        curve="linear"
        referenceLines={lines}
        xFormat={(v) => String(v)}
        yFormat={(v) => `${v}%`}
        valueFormat={(v) => `${v.toFixed(0)}%`}
        tooltipLabel={fmt}
        layer={revealed ? undefined : (frame) => (
          <DragHandles
            frame={frame}
            handles={[{ id: "guess", axis: "x", x: guess ?? 6, min: 0.5, max: 12, step: 0.5, label: t("syrShockGuessMarker"), format: fmt }]}
            onChange={(_, v) => v.x !== undefined && onGuess(v.x)}
          />
        )}
      />
    </div>
  );
}
