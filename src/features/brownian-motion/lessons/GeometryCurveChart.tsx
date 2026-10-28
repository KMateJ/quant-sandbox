import type { ReactNode } from "react";
import { LineChart } from "../../../components/charts";
import type { ChartDatum, ChartReferenceLine, ChartSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { PinButton } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { usePinnedCurves } from "../../../components/lesson/usePinnedCurves";

type Props = {
  data: ChartDatum[];
  series: ChartSeries[];
  title: string;
  /// Variable name shown in the tooltip, e.g. "a" or "t".
  xLabel: string;
  caption?: string;
  actions?: ReactNode;
  xDomain?: [number, number];
  yDomain?: [number, number];
  referenceLines?: ChartReferenceLine[];
  /// Offers Pin & compare; the pinned curves are labelled with this text (e.g. the current parameters).
  pinLabel?: string;
};

/// Secondary Chapter 3 chart: empirical curves against their theoretical counterparts.
export default function GeometryCurveChart({ data, series, title, xLabel, caption, actions, xDomain, yDomain, referenceLines, pinLabel }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const pin = usePinnedCurves(data, series, [], pinLabel);
  const pinControl = pinLabel !== undefined && <PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />;

  return (
    <ChartContainer
      className="stoch-distribution-frame"
      title={title}
      actions={(actions || pinControl) && <span className="stoch-chart-actions">{actions}{pinControl}</span>}
    >
      <div className="stoch-density-chart">
        <LineChart
          data={pin.data}
          xKey="x"
          series={pin.series}
          xDomain={xDomain}
          yDomain={yDomain}
          referenceLines={referenceLines}
          isMobile={isMobile}
          tooltipLabel={(x) => `${xLabel} = ${x.toFixed(2)}`}
          valueFormat={(value) => value.toFixed(3)}
        />
      </div>
      {caption && <p className="stoch-chart-caption">{caption}</p>}
    </ChartContainer>
  );
}
