import { useCallback, useMemo } from "react";
import { useTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "@visx/vendor/d3-array";
import type { ScaleLinear } from "@visx/vendor/d3-scale";
import type { ChartDatum } from "./chart.types";

type PointerEvt =
  | React.MouseEvent<SVGRectElement>
  | React.TouchEvent<SVGRectElement>;

/// Nearest-point tooltip state and pointer handler for the line chart.
export function useChartTooltip(
  data: ChartDatum[],
  xKey: string,
  xScale: ScaleLinear<number, number>,
  marginLeft: number
) {
  const tooltip = useTooltip<ChartDatum>();
  const { showTooltip, hideTooltip } = tooltip;

  const getX = useCallback((d: ChartDatum) => Number(d[xKey]), [xKey]);
  const bisect = useMemo(
    () => bisector<ChartDatum, number>((d) => Number(d[xKey])).left,
    [xKey]
  );

  const handleMove = useCallback(
    (event: PointerEvt) => {
      const point = localPoint(event);
      if (!point || data.length === 0) return;
      const x0 = xScale.invert(point.x - marginLeft);
      const index = bisect(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0 ?? d1;
      if (d0 && d1) d = x0 - getX(d0) > getX(d1) - x0 ? d1 : d0;
      if (!d) return;
      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(getX(d)),
        tooltipTop: point.y,
      });
    },
    [data, xScale, marginLeft, bisect, getX, showTooltip]
  );

  return { ...tooltip, handleMove, hideTooltip, getX };
}
