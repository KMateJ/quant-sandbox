import { lazy, Suspense } from "react";
import { useI18n } from "../../../i18n";
import type { HestonVolSurfaceData } from "../heston.types";

const Surface3D = lazy(() => import("../../../components/charts/surface3d/Surface3D"));

type Props = {
  surface: HestonVolSurfaceData | null;
};

/// Renders the Heston implied-volatility surface over (moneyness × maturity).
export default function HestonVolSurface({ surface }: Props) {
  const { t } = useI18n();

  if (!surface) {
    return (
      <div className="bs-chart-fill">
        <div className="surface3d-wrap">
          <div className="surface3d-loading">{t("hestonSurfaceComputing")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bs-chart-fill">
      <div className="surface3d-wrap">
        <Suspense fallback={<div className="surface3d-loading">{t("hestonSurfaceComputing")}</div>}>
          <Surface3D
            data={{
              xs: surface.moneyness,
              zs: surface.maturities,
              values: surface.values,
              min: surface.min,
              max: surface.max,
            }}
            xLabel={t("hestonVolAxisMoneyness")}
            zLabel={t("hestonSurfaceAxisMaturity")}
            valueLabel={t("hestonVolValueLabel")}
            formatX={(v) => v.toFixed(2)}
            formatZ={(v) => v.toFixed(2)}
            formatValue={(v) => `${(v * 100).toFixed(1)}%`}
          />
        </Suspense>
      </div>
      <p className="surface3d-hint">{t("hestonSurfaceHint")}</p>
    </div>
  );
}
