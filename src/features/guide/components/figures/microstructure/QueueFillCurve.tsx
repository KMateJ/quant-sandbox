import { useMemo } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { fillCurve, type QueueFlow } from "../../../guide.micro.queuePosition.math";

type Props = { flow: QueueFlow; ahead: number; maxAhead: number; xLabel: string; yLabel: string };

/// P(fill within one minute) against shares ahead, with the current position marked.
export default function QueueFillCurve({ flow, ahead, maxAhead, xLabel, yLabel }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const data = useMemo(() => fillCurve(flow, 1, maxAhead).map((d) => ({ ahead: d.ahead, p: d.p * 100 })), [flow, maxAhead]);
  return (
    <LineChart
      data={data}
      xKey="ahead"
      series={[{ key: "p", label: yLabel, color: SERIES_PALETTE[0], strokeWidth: 2 }]}
      xDomain={[0, maxAhead]}
      yDomain={[0, 100]}
      referenceLines={[{ axis: "x", value: ahead, color: "var(--primary)", dash: "4 3" }]}
      isMobile={isMobile}
      curve="linear"
      tooltipLabel={(x) => `${xLabel}: ${x.toFixed(0)}`}
      valueFormat={(v) => `${v.toFixed(1)}%`}
      yFormat={(v) => `${v.toFixed(0)}%`}
    />
  );
}
