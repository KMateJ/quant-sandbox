import { ScatterChart } from "../../../components/charts";
import type {
  ScatterSeries,
  ChartReferenceLine,
  ScatterBand,
  ScatterAnnotation,
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
  annotations?: ScatterAnnotation[];
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  legend?: boolean;
  yNumTicks?: number;
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
  annotations = [],
  onDragStart,
  onDragEnd,
  legend = true,
  yNumTicks,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const n = labels.length;
  const xFormat = makeIndexFormat(labels);

  const refs: ChartReferenceLine[] = [...extraRefs];
  if (selectedIndex != null) {
    refs.push({ axis: "x", value: selectedIndex, color: "#38bdf8", width: 2 });
  }

  return (
    <ScatterChart
      series={series}
      xDomain={[-0.4, n - 0.6]}
      yDomain={yDomain}
      referenceLines={refs}
      bands={selectedIndex == null ? bands : [...bands, { from: selectedIndex - 0.16, to: selectedIndex + 0.16, color: "#38bdf8", opacity: 0.12 }]}
      annotations={annotations}
      isMobile={isMobile}
      legend={legend}
      xTickValues={labels.map((_, i) => i)}
      xFormat={xFormat}
      yFormat={yFormat}
      yLabel={yLabel}
      yNumTicks={yNumTicks}
      onSelectPoint={onSelectIndex}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={
        onDragRate || onSelectIndex
          ? (_x, y, i) => {
              onSelectIndex?.(i);
              onDragRate?.(i, y);
            }
          : undefined
      }
    />
  );
}
