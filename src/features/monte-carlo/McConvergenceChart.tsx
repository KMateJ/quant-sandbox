import { useMemo } from "react";
import { LineChart, type ChartSeries, type PlotFrame } from "../../components/charts";
import { useI18n } from "../../i18n";
import { ESTIMATOR_COLOR, ESTIMATOR_LABEL } from "./monteCarlo.estimators";
import type { McEstimator, McRacePoint } from "./monteCarlo.types";

type Props = { race: McRacePoint[]; shown: McEstimator[]; sims: number; isMobile: boolean };

/// Running estimates with their ±1.96·SE bands, converging to the Black–Scholes price.
export default function McConvergenceChart({ race, shown, sims, isMobile }: Props) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(3);
  // Every estimate stays in view (lines aren't clipped), but bands only count from 5% of the run on:
  // the first few draws have huge bands that would flatten everything; earlier band parts are clamped.
  const yDomain = useMemo((): [number, number] => {
    const late = race.filter((p) => p.n >= sims * 0.05);
    const vals = late.flatMap((p) => shown.flatMap((k) => [p[`${k}Lo`], p[`${k}Hi`]]))
      .concat(race.flatMap((p) => shown.map((k) => p[k])), race[0]?.analytic ?? 0);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * 0.15 || 0.5;
    return [Math.max(0, lo - pad), hi + pad];
  }, [race, shown, sims]);

  const series: ChartSeries[] = [
    ...shown.map((k): ChartSeries => ({
      key: k,
      label: k === "plain" && shown.length === 1 ? t("monteCarloEstimateLabel") : t(ESTIMATOR_LABEL[k]),
      color: ESTIMATOR_COLOR[k],
      strokeWidth: 2,
    })),
    { key: "analytic", label: t("monteCarloAnalyticLabel"), color: "#22c55e", strokeWidth: 2, dash: "6 4" },
  ];

  const bands = (frame: PlotFrame) => {
    const clamp = (v: number) => frame.y(Math.min(yDomain[1], Math.max(yDomain[0], v)));
    return (
      <g aria-hidden="true" pointerEvents="none">
        {shown.map((k) => {
          const top = race.map((p) => `${frame.x(p.n)},${clamp(p[`${k}Hi`])}`);
          const bottom = race.map((p) => `${frame.x(p.n)},${clamp(p[`${k}Lo`])}`).reverse();
          return <polygon key={k} points={[...top, ...bottom].join(" ")} fill={ESTIMATOR_COLOR[k]} fillOpacity={shown.length > 1 ? 0.1 : 0.16} />;
        })}
      </g>
    );
  };

  return (
    <LineChart
      data={race}
      xKey="n"
      series={series}
      xDomain={[0, sims]}
      yDomain={yDomain}
      isMobile={isMobile}
      tooltipLabel={(x) => `N = ${x.toFixed(0)}`}
      valueFormat={num}
      curve="linear"
      layer={bands}
    />
  );
}
