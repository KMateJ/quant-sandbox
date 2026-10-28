import { ScatterChart, SERIES_PALETTE } from "../../../../../components/charts";
import { useMediaQuery } from "../../../../../components/useMediaQuery";

type Props = { points: { x: number; y: number }[]; slope: number; labels: { pairs: string; fit: string; x: string; y: string } };

/// Δpₜ against Δpₜ₋₁ with the least-squares line; its negative slope is the bounce.
export default function RollBounceScatter({ points, slope, labels }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const ext = Math.max(1, ...points.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)))) * 1.05;
  return (
    <ScatterChart
      series={[
        { key: "pairs", label: labels.pairs, color: SERIES_PALETTE[0], radius: 2.5, opacity: 0.5, outline: false, points },
        { key: "fit", label: labels.fit, color: "var(--primary)", line: true, strokeWidth: 2, points: [{ x: -ext, y: -ext * slope }, { x: ext, y: ext * slope }] },
      ]}
      xDomain={[-ext, ext]}
      yDomain={[-ext, ext]}
      referenceLines={[{ axis: "x", value: 0, dash: "2 4" }, { axis: "y", value: 0, dash: "2 4" }]}
      isMobile={isMobile}
      xFormat={(v) => v.toFixed(0)}
      yFormat={(v) => v.toFixed(0)}
      xLabel={labels.x}
      yLabel={labels.y}
    />
  );
}
