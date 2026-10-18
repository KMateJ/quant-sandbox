import { useCallback, useRef } from "react";
import type { PlotFrame } from "../../components/charts";
import FrameSpy from "./components/FrameSpy";
import { nearestPointIndex } from "./portfolioLab.math";
import type { FrontierPoint } from "./portfolioLab.types";

// Pixels around a cloud dot within which a click on empty plot area still picks it.
const NEAR_EMPTY_CLICK = 8;

/// Click-to-adopt for the random-portfolio cloud (series `cloudKey`): a click on a dot adopts it, and a click on
/// empty plot area near a dot (`onPlotClick`) picks the nearest dot.
export function useCloudPick(cloud: FrontierPoint[], onPick: (index: number) => void, cloudKey = "cloud") {
  const frame = useRef<PlotFrame | null>(null);
  const onFrame = useCallback((f: PlotFrame) => {
    frame.current = f;
  }, []);

  return {
    layer: (f: PlotFrame) => <FrameSpy frame={f} onFrame={onFrame} />,
    onSelectPoint: (index: number, seriesKey: string) => {
      if (seriesKey === cloudKey) onPick(index);
    },
    onPlotClick: (x: number, y: number) => {
      const f = frame.current;
      if (!f) return;
      const hit = nearestPointIndex(cloud, (c) => [f.x(c.vol), f.y(c.ret)], f.x(x), f.y(y), NEAR_EMPTY_CLICK);
      if (hit >= 0) onPick(hit);
    },
  };
}
