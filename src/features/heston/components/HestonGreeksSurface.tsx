import { lazy, Suspense } from "react";
import { useI18n } from "../../../i18n";
import type { GreekKey, HestonGreeksSurfaceData } from "../heston.types";
import { HESTON_GREEKS } from "../heston.greeks";

const Surface3D = lazy(() => import("../../../components/charts/surface3d/Surface3D"));

type Props = {
  surface: HestonGreeksSurfaceData | null;
  metric: GreekKey;
};

/// Renders the Heston surface for the selected greek over (spot × maturity).
export default function HestonGreeksSurface({ surface, metric }: Props) {
  const { t } = useI18n();
  const grid = surface?.byGreek[metric];
  const decimals = HESTON_GREEKS.find((g) => g.key === metric)?.decimals ?? 4;

  if (!surface || !grid) {
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
              xs: surface.spots,
              zs: surface.maturities,
              values: grid.values,
              min: grid.min,
              max: grid.max,
            }}
            xLabel={t("hestonSurfaceAxisSpot")}
            zLabel={t("hestonSurfaceAxisMaturity")}
            valueLabel={t(HESTON_GREEKS.find((g) => g.key === metric)!.labelKey)}
            formatX={(v) => v.toFixed(0)}
            formatZ={(v) => v.toFixed(2)}
            formatValue={(v) => v.toFixed(decimals)}
          />
        </Suspense>
      </div>
      <p className="surface3d-hint">{t("hestonSurfaceHint")}</p>
    </div>
  );
}
