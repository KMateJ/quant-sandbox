import { lazy, Suspense } from "react";
import { LineChart } from "../../components/charts";
import type { useBlackScholesView } from "./useBlackScholesView";

const Surface3D = lazy(() => import("../../components/charts/surface3d/Surface3D"));

/// Chooses between the 2D maturity curves and the 3D (spot × maturity) surface.
export default function BlackScholesChart({
  model,
}: {
  model: ReturnType<typeof useBlackScholesView>;
}) {
  const { t, view3d, surface, metricLabel, chartData, chartSeries, yDomain, strike, isMobile, tooltipDigits } = model;

  if (view3d && surface) {
    return (
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
        <p className="surface3d-hint">{t("blackScholesSurfaceHint")}</p>
      </div>
    );
  }

  return (
    <div className="chart-wrap">
      <LineChart
        data={chartData}
        xKey="S"
        series={chartSeries}
        xDomain={[10, 200]}
        yDomain={yDomain}
        referenceLines={[{ axis: "x", value: strike, color: "#94a3b8", dash: "4 4" }]}
        isMobile={isMobile}
        tooltipLabel={(x) => `${t("blackScholesTooltipStock")} = ${x}`}
        valueFormat={(v) => v.toFixed(tooltipDigits)}
      />
    </div>
  );
}
