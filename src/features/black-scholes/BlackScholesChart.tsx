import { lazy, Suspense } from "react";
import { LineChart } from "../../components/charts";
import type { useBlackScholesView } from "./useBlackScholesView";
import BsSpotLayer from "./BsSpotLayer";
import BsSpotReadout from "./BsSpotReadout";

const Surface3D = lazy(() => import("../../components/charts/surface3d/Surface3D"));

/// Chooses between the 2D maturity curves and the 3D (spot × maturity) surface.
export default function BlackScholesChart({
  model,
}: {
  model: ReturnType<typeof useBlackScholesView>;
}) {
  const { t, view3d, surface, metricLabel, chartData, chartSeries, yDomain, isMobile, tooltipDigits } = model;

  if (view3d && surface) {
    return (
      <div className="bs-chart-fill">
        <div className="surface3d-wrap">
          <Suspense fallback={<div className="surface3d-loading">{t("blackScholesView3d")}…</div>}>
            <Surface3D
              data={{
                xs: surface.spots,
                zs: surface.maturities,
                values: surface.values,
                min: surface.min,
                max: surface.max,
              }}
              xLabel={t("blackScholesAxisSpot")}
              zLabel={t("blackScholesAxisMaturity")}
              valueLabel={metricLabel}
              formatX={(v) => v.toFixed(0)}
              formatZ={(v) => v.toFixed(2)}
              formatValue={(v) => v.toFixed(tooltipDigits)}
            />
          </Suspense>
        </div>
        <p className="surface3d-hint">{t("blackScholesSurfaceHint")}</p>
      </div>
    );
  }

  return (
    <div className="bs-chart-fill">
      <div className="chart-wrap bs-chart-tall">
        <LineChart
          data={chartData}
          xKey="S"
          series={chartSeries}
          xDomain={[10, 200]}
          yDomain={yDomain}
          isMobile={isMobile}
          tooltipLabel={(x) => `${t("blackScholesTooltipStock")} = ${x}`}
          valueFormat={(v) => v.toFixed(tooltipDigits)}
          layer={(frame) => <BsSpotLayer frame={frame} model={model} />}
        />
      </div>
      <BsSpotReadout model={model} />
    </div>
  );
}
