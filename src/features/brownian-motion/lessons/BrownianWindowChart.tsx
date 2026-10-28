import { useMemo, type ReactNode } from "react";
import { IntervalSelector, PathCloudChart, SERIES_PALETTE, SERIES_ROLE } from "../../../components/charts";
import type { PathOverlay, PlotFrame } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { cloudExtent, pathPoints } from "./brownianFundamentals.math";
import { BM_FEATURED_PATHS, BM_MIN_GAP, BM_TIME_STEP, BM_WINDOW_BOUNDS } from "./brownianFundamentals.types";
import type { BrownianExperiment } from "./useBrownianExperiment";

type Props = {
  experiment: BrownianExperiment;
  title: string;
  caption: string;
  actions?: ReactNode;
};

const featuredIndices = Array.from({ length: BM_FEATURED_PATHS }, (_, i) => i);

/// Hero chart shared by the Chapter 2 lessons: a faint cloud, a few coloured paths and a
/// draggable [s, t] window. Each coloured path shows its increment as a bar at t.
export default function BrownianWindowChart({ experiment, title, caption, actions }: Props) {
  const { t: tr } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { cloud, s, t, ws, wt, setWindow } = experiment;
  const yDomain = useMemo(() => cloudExtent(cloud), [cloud]);

  const overlays = useMemo<PathOverlay[]>(
    () =>
      featuredIndices.flatMap((path) => {
        const color = SERIES_PALETTE[path];
        return [
          { key: `full-${path}`, points: pathPoints(cloud, path), color, strokeWidth: 0.9 },
          { key: `seg-${path}`, points: pathPoints(cloud, path, s, t), color, strokeWidth: 2.4 },
          { key: `base-${path}`, points: [{ x: s, y: ws[path] }, { x: t, y: ws[path] }], color, strokeWidth: 1, dash: "3 3" },
          { key: `inc-${path}`, points: [{ x: t, y: ws[path] }, { x: t, y: wt[path] }], color, strokeWidth: 4 },
        ];
      }),
    [cloud, s, t, ws, wt]
  );

  const layer = (frame: PlotFrame) => (
    <>
      <IntervalSelector
        frame={frame}
        from={s}
        to={t}
        onChange={setWindow}
        bounds={BM_WINDOW_BOUNDS}
        minGap={BM_MIN_GAP}
        snap={BM_TIME_STEP}
        color={SERIES_ROLE.estimate}
        labels={["s", "t"]}
        slidable
      />
      {featuredIndices.map((path) => (
        <circle key={path} cx={frame.x(s)} cy={frame.y(ws[path])} r={3.5} fill={SERIES_PALETTE[path]} pointerEvents="none" />
      ))}
    </>
  );

  return (
    <ChartContainer className="stoch-path-frame" title={title} actions={actions}>
      <div className="stoch-path-chart stoch-hero-chart">
        <PathCloudChart
          values={cloud.values}
          pathCount={cloud.pathCount}
          stepCount={cloud.steps + 1}
          dx={1 / cloud.steps}
          xDomain={[0, 1]}
          yDomain={yDomain}
          maxOpacity={0.18}
          overlays={overlays}
          layer={layer}
          isMobile={isMobile}
          ariaLabel={title}
        />
      </div>
      <p className="stoch-chart-caption">
        <strong>{tr("stochBmDragHint")}</strong> {caption}
      </p>
    </ChartContainer>
  );
}
