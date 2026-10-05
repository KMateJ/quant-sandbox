import { ScatterChart } from "../../../components/charts";
import type {
  ScatterSeries,
  ChartReferenceLine,
  ScatterBand,
} from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { makeIndexFormat } from "../curveChartUtils";

type Props = {
  labels: string[];
  series: ScatterSeries[];
  yDomain: [number, number];
  yFormat: (v: number) => string;
  yLabel: string;
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
  /// Called with (nodeIndex, rate) while a draggable node is moved.
  onDragRate?: (index: number, y: number) => void;
  extraRefs?: ChartReferenceLine[];
  bands?: ScatterBand[];
};

/// Term-structure chart on an evenly-spaced maturity axis (node index → label).
/// Handles the vertical selection guide and maps vertical drags back to a node.
export default function MaturityChart({
  labels,
  series,
  yDomain,
  yFormat,
  yLabel,
  selectedIndex,
  onSelectIndex,
  onDragRate,
  extraRefs = [],
  bands = [],
}: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const n = labels.length;
  const xFormat = makeIndexFormat(labels);

  const refs: ChartReferenceLine[] = [...extraRefs];
  if (selectedIndex != null) {
    refs.push({ axis: "x", value: selectedIndex, color: "#64748b", dash: "4 4" });
  }

  const clampIndex = (x: number) => Math.max(0, Math.min(n - 1, Math.round(x)));

  return (
    <ScatterChart
      series={series}
      xDomain={[-0.4, n - 0.6]}
      yDomain={yDomain}
      referenceLines={refs}
      bands={bands}
      isMobile={isMobile}
      legend
      xFormat={xFormat}
      yFormat={yFormat}
      yLabel={yLabel}
      onDrag={
        onDragRate || onSelectIndex
          ? (x, y) => {
              const i = clampIndex(x);
              onSelectIndex?.(i);
              onDragRate?.(i, y);
            }
          : undefined
      }
    />
  );
}
