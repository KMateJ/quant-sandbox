import type { ReactNode } from "react";
import { PathCloudChart } from "../../components/charts";
import type { PathOverlay } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import type { GeometryCloud } from "./pathGeometry.types";

type Props = {
  cloud: GeometryCloud;
  /// Memoise: the chart refits its y range whenever the array changes.
  overlays: PathOverlay[];
  title: string;
  caption?: string;
  actions?: ReactNode;
  visibleSteps?: number;
  /// Opacity cap for the background cloud (lower = more context, less clutter).
  cloudOpacity?: number;
  legend?: { color: string; label: string }[];
};

/// Faint Brownian cloud on [0, 1] with highlighted curves drawn on top.
export default function GeometryPathChart({
  cloud,
  overlays,
  title,
  caption,
  actions,
  visibleSteps,
  cloudOpacity = 0.2,
  legend,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <ChartContainer className="stoch-path-frame" title={title} actions={actions}>
      <div className="stoch-path-chart">
        <PathCloudChart
          values={cloud.values}
          pathCount={cloud.pathCount}
          stepCount={cloud.steps + 1}
          dx={1 / cloud.steps}
          xDomain={[0, 1]}
          visibleSteps={visibleSteps}
          overlays={overlays}
          maxOpacity={cloudOpacity}
          isMobile={isMobile}
          ariaLabel={title}
        />
      </div>
      {legend && (
        <ul className="stoch-path-legend stoch-envelope-legend" aria-hidden="true">
          {legend.map((item) => (
            <li key={item.label}><span style={{ backgroundColor: item.color }} />{item.label}</li>
          ))}
        </ul>
      )}
      {caption && <p className="stoch-chart-caption">{caption}</p>}
    </ChartContainer>
  );
}
