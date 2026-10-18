import { useMemo, useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { ASSET_A, ASSET_B, minVarianceWeight, twoAssetCurve, twoAssetPoint } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";
import { assetMarkers, curveSeries } from "./figureSeries";

/// Mixes of two assets in σ–μ space: lower correlation bends the curve to the left.
export default function TwoAssetFrontierFigure() {
  const { t } = useI18n();
  const [rho, setRho] = useState(0.2);
  const curve = useMemo(() => twoAssetCurve(rho), [rho]);
  const wMin = minVarianceWeight(rho);
  const minVar = twoAssetPoint(Math.min(Math.max(wMin, 0), 1), rho);

  return (
    <GuideFigure title={t("gfTwoAssetTitle")} labId="portfolio-lab">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRho")} min={-1} max={1} step={0.05} value={rho} onChange={setRho} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfTwoAssetAria", { rho: rho.toFixed(2) })}>
        <ScatterChart
          series={[
            curveSeries("perfect", t("gfRhoPlusOne"), twoAssetCurve(1), SERIES_PALETTE[2], "6 4"),
            curveSeries("hedge", t("gfRhoMinusOne"), twoAssetCurve(-1), SERIES_PALETTE[1], "2 4"),
            curveSeries("mix", t("gfPortfolios"), curve, SERIES_PALETTE[0]),
            assetMarkers(t, [ASSET_A, ASSET_B]),
          ]}
          xDomain={[0, 0.32]}
          yDomain={[0.05, 0.13]}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          xLabel={t("gfAxisVolatility")}
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMinVarWeight"), value: pct(wMin, 1), tone: "accent" },
          { label: t("gfMinVol"), value: pct(minVar.sigma, 2) },
          { label: t("gfVol5050"), value: pct(twoAssetPoint(0.5, rho).sigma, 2), tone: "strong" },
          { label: t("gfAvgVol5050"), value: pct((ASSET_A.sigma + ASSET_B.sigma) / 2, 2) },
          { label: t("gfReturn5050"), value: pct(twoAssetPoint(0.5, rho).mu, 1) },
        ]}
      />
    </GuideFigure>
  );
}
