import { useMemo } from "react";
import { ScatterChart, SERIES_PALETTE, SERIES_ROLE } from "../../../components/charts";
import type { ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { SegmentedControl } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import {
  conditionalGaussian,
  covarianceEllipse,
  jointCovariance,
  scatterPoints,
  sidewaysDensity,
} from "./brownianFundamentals.math";
import { BM_FEATURED_PATHS, type JointMode } from "./brownianFundamentals.types";

type Props = {
  xs: Float64Array;
  ys: Float64Array;
  s: number;
  t: number;
  mode: JointMode;
  setMode: (mode: JointMode) => void;
  slice: number;
  setSlice: (value: number) => void;
};

const R = 3.5;
const SLICE_HALF = 0.12;
const SLICE_LIMIT = 2.6;

/// Joint cloud with its theoretical 1σ / 2σ ellipses, the conditional-mean line and a
/// draggable slice X = a whose conditional law is drawn sideways.
export default function JointScatterChart({ xs, ys, s, t, mode, setMode, slice, setSlice }: Props) {
  const { t: tr } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const yName = mode === "levels" ? "W(t)" : "W(t) − W(s)";
  const theory = jointCovariance(s, t, mode);
  const cond = conditionalGaussian(theory, slice);
  const slope = theory.xy / theory.xx;

  const cloud = useMemo(() => scatterPoints(xs, ys), [xs, ys]);
  const series = useMemo<ScatterSeries[]>(() => {
    const inSlice = cloud.filter((p) => Math.abs(p.x - slice) <= SLICE_HALF);
    const ellipse = (k: number): ScatterSeries => ({
      key: `e${k}`, label: `${k}σ`, color: SERIES_ROLE.reference, line: true, strokeWidth: 1.8, dash: k === 2 ? "6 4" : undefined,
      points: covarianceEllipse(theory, k),
    });
    return [
      { key: "cloud", label: tr("stochJointCloud"), color: SERIES_ROLE.cloud, points: cloud, radius: 2.4, opacity: 0.35, outline: false },
      { key: "slice", label: tr("stochJointSlice"), color: SERIES_ROLE.estimate, points: inSlice, radius: 3, opacity: 0.9, outline: false },
      ellipse(1),
      ellipse(2),
      { key: "mean", label: tr("stochJointMeanLine"), color: SERIES_ROLE.estimate, line: true, strokeWidth: 1.5, dash: "3 3", points: [{ x: -R, y: -R * slope }, { x: R, y: R * slope }] },
      { key: "cond", label: tr("stochJointCondDensity"), color: SERIES_ROLE.candidate, line: true, strokeWidth: 2.2, points: sidewaysDensity(slice, cond.mean, cond.variance, 0.9) },
      {
        key: "featured", label: tr("stochPathLabel"), color: SERIES_PALETTE[0], radius: 6,
        points: Array.from({ length: BM_FEATURED_PATHS }, (_, i) => ({ x: xs[i], y: ys[i], color: SERIES_PALETTE[i] })),
      },
      { key: "handle", label: tr("stochJointSlice"), color: SERIES_ROLE.estimate, radius: 8, draggable: true, points: [{ x: slice, y: cond.mean }] },
    ];
  }, [cloud, slice, theory, cond.mean, cond.variance, slope, xs, ys, tr]);

  return (
    <ChartContainer
      className="stoch-distribution-frame"
      title={tr("stochJointChart", { y: yName })}
      actions={
        <SegmentedControl<JointMode>
          options={[
            { value: "levels", label: "W(t)" },
            { value: "increments", label: "W(t) − W(s)" },
          ]}
          value={mode}
          onChange={setMode}
          ariaLabel={tr("stochJointModeLabel")}
        />
      }
    >
      <div className="stoch-joint-chart">
        <ScatterChart
          series={series}
          xDomain={[-R, R]}
          yDomain={[-R, R]}
          bands={[{ from: slice - SLICE_HALF, to: slice + SLICE_HALF, color: SERIES_ROLE.estimate, opacity: 0.12 }]}
          legend={false}
          isMobile={isMobile}
          xLabel="W(s)"
          yLabel={yName}
          xFormat={(v) => v.toFixed(1)}
          yFormat={(v) => v.toFixed(1)}
          onDrag={(x) => setSlice(Math.max(-SLICE_LIMIT, Math.min(SLICE_LIMIT, x)))}
        />
      </div>
      <p className="stoch-chart-caption">
        <strong>
          {tr("stochJointSliceReadout", {
            a: slice.toFixed(2),
            y: yName,
            m: cond.mean.toFixed(2),
            v: cond.variance.toFixed(2),
          })}
        </strong>{" "}
        {tr(mode === "levels" ? "stochJointLevelsCaption" : "stochJointIncrementsCaption")}
      </p>
    </ChartContainer>
  );
}
