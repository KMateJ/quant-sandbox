import { useMemo } from "react";
import { PathCloudChart, SERIES_PALETTE, SERIES_ROLE } from "../../../components/charts";
import type { PathOverlay, PlotFrame } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { gaussianDensity, histogram, rebasedWindow, sidewaysDensity, sqrtTimeEnvelope } from "./brownianFundamentals.math";
import { BM_FEATURED_PATHS } from "./brownianFundamentals.types";
import type { BrownianExperiment } from "./useBrownianExperiment";

const Y_RANGE = 2.5;
const X_MAX = 1.45;
/// Gap and peak width (in time units) of the sideways histogram after the fan.
const GAP = 0.03;
const PEAK = 0.32;

/// Every window segment restarted at zero: a fan whose width √u depends only on the
/// elapsed time u, ending in the sideways histogram of W(t) − W(s) against N(0, t − s).
export default function IncrementFanChart({ experiment }: { experiment: BrownianExperiment }) {
  const { t: tr } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { cloud, s, t } = experiment;
  const width = t - s;
  const dx = 1 / cloud.steps;

  const fan = useMemo(() => rebasedWindow(cloud, s, t), [cloud, s, t]);
  const bins = useMemo(() => {
    const last = fan.values.subarray((fan.points - 1) * fan.pathCount);
    return histogram(last, 40, -Y_RANGE, Y_RANGE);
  }, [fan]);

  const anchor = width + GAP;
  const scale = PEAK / gaussianDensity(0, 0, width);

  const overlays = useMemo<PathOverlay[]>(() => {
    const upper = sqrtTimeEnvelope(cloud.steps, width);
    const featured = Array.from({ length: BM_FEATURED_PATHS }, (_, path) => ({
      key: `f-${path}`,
      color: SERIES_PALETTE[path],
      strokeWidth: 2.2,
      points: Array.from({ length: fan.points }, (_, k) => ({ x: k * dx, y: fan.values[k * fan.pathCount + path] })),
    }));
    return [
      { key: "up", points: upper, color: SERIES_ROLE.reference, strokeWidth: 2 },
      { key: "down", points: upper.map((p) => ({ x: p.x, y: -p.y })), color: SERIES_ROLE.reference, strokeWidth: 2 },
      ...featured,
    ];
  }, [cloud.steps, width, fan, dx]);
  const normal = sidewaysDensity(anchor, 0, width, PEAK);

  const layer = (frame: PlotFrame) => (
    <g pointerEvents="none">
      <line x1={frame.x(anchor)} x2={frame.x(anchor)} y1={0} y2={frame.height} stroke={SERIES_ROLE.reference} strokeOpacity={0.4} />
      {bins.map((bin) => (
        <rect
          key={bin.from}
          x={frame.x(anchor)}
          y={frame.y(bin.to)}
          width={Math.max(0, frame.x(anchor + bin.density * scale) - frame.x(anchor))}
          height={Math.max(0, frame.y(bin.from) - frame.y(bin.to) - 1)}
          fill={SERIES_ROLE.empirical}
          opacity={0.55}
        />
      ))}
      <polyline
        points={normal.map((p) => `${frame.x(p.x)},${frame.y(p.y)}`).join(" ")}
        fill="none"
        stroke={SERIES_ROLE.candidate}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
    </g>
  );

  return (
    <ChartContainer
      className="stoch-distribution-frame"
      title={tr("stochIncFanChart")}
      actions={
        <span className="stoch-chart-readout">
          {tr("stochIncFanReadout", { w: width.toFixed(2), sd: Math.sqrt(width).toFixed(3) })}
        </span>
      }
    >
      <div className="stoch-path-chart">
        <PathCloudChart
          values={fan.values}
          pathCount={fan.pathCount}
          stepCount={fan.points}
          dx={dx}
          xDomain={[0, X_MAX]}
          yDomain={[-Y_RANGE, Y_RANGE]}
          maxOpacity={0.18}
          overlays={overlays}
          layer={layer}
          isMobile={isMobile}
          ariaLabel={tr("stochIncFanChart")}
        />
      </div>
      <ul className="stoch-path-legend stoch-envelope-legend" aria-hidden="true">
        <li><span style={{ backgroundColor: SERIES_ROLE.reference }} />±√u</li>
        <li><span style={{ backgroundColor: SERIES_ROLE.empirical }} />{tr("stochEmpiricalDensity")}</li>
        <li><span style={{ backgroundColor: SERIES_ROLE.candidate }} />N(0, t − s)</li>
      </ul>
      <p className="stoch-chart-caption">{tr("stochIncFanCaption")}</p>
    </ChartContainer>
  );
}
