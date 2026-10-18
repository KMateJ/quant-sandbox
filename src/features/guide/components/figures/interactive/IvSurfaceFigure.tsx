import { lazy, Suspense, useDeferredValue, useMemo, useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import type { SurfaceData } from "../../../../../components/charts/surface3d/surface3d.geometry";
import { useI18n } from "../../../../../i18n";
import { ivAt, ivSurface } from "../../../guide.interactive.ivSurface.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";

const Surface3D = lazy(() => import("../../../../../components/charts/surface3d/Surface3D"));

const RHOS = [-0.7, 0, 0.3];
const XIS = [0.2, 0.5, 0.8];

// Each surface costs ~60–150 ms; there are only nine control combinations, so keep them all.
const cache = new Map<string, SurfaceData>();
function cachedSurface(key: string): SurfaceData {
  if (!cache.has(key)) {
    const [rho, xi] = key.split(":").map(Number);
    cache.set(key, ivSurface(rho, xi));
  }
  return cache.get(key)!;
}

const skewPp = (s: SurfaceData, T: number) => `${((ivAt(s, 80, T) - ivAt(s, 120, T)) * 100).toFixed(2)} pp`;

/// Rotatable Heston implied-volatility surface over strike × maturity; ρ tilts it, ξ bends it.
export default function IvSurfaceFigure() {
  const { t } = useI18n();
  const [rho, setRho] = useState(-0.7);
  const [xi, setXi] = useState(0.5);
  // Deferred so the buttons respond at once while the new surface is priced.
  const key = useDeferredValue(`${rho}:${xi}`);
  const surface = useMemo(() => cachedSurface(key), [key]);
  const computing = <div className="surface3d-loading">{t("ixIvComputing")}</div>;

  return (
    <GuideFigure title={t("ixIvTitle")} labId="heston">
      <div className="gf-toolbar ix-iv-controls">
        <div className="ix-iv-control">
          <span>{t("ixIvRho")}</span>
          <SegmentedControl<number> ariaLabel={t("ixIvRho")} value={rho} onChange={setRho} options={RHOS.map((v) => ({ value: v, label: v.toFixed(1) }))} />
        </div>
        <div className="ix-iv-control">
          <span>{t("ixIvXi")}</span>
          <SegmentedControl<number> ariaLabel={t("ixIvXi")} value={xi} onChange={setXi} options={XIS.map((v) => ({ value: v, label: v.toFixed(1) }))} />
        </div>
      </div>
      <div className="surface3d-wrap ix-iv-surface" role="img" aria-label={t("ixIvAria")}>
        <Suspense fallback={computing}>
          <Surface3D
            data={surface}
            xLabel={t("ixIvAxisStrike")}
            zLabel={t("ixIvAxisMaturity")}
            valueLabel={t("ixIvValue")}
            formatX={(v) => v.toFixed(0)}
            formatZ={(v) => v.toFixed(2)}
            formatValue={(v) => pct(v, 1)}
          />
        </Suspense>
      </div>
      <p className="surface3d-hint">{t("ixIvHint")}</p>
      <FigureReadout
        items={[
          ...[80, 100, 120].map((K) => ({ label: t("ixIvAt", { k: K }), value: pct(ivAt(surface, K, 1), 2) })),
          { label: t("ixIvSkew", { t: "0.25" }), value: skewPp(surface, 0.25) },
          { label: t("ixIvSkew", { t: "1" }), value: skewPp(surface, 1), tone: "accent" },
          { label: t("ixIvSkew", { t: "2" }), value: skewPp(surface, 2) },
        ]}
      />
    </GuideFigure>
  );
}
