import { useMemo, useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { ASSET_A, ASSET_B, minVarianceWeight, sharpe, tangencyWeight, twoAssetCurve, twoAssetPoint } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { assetMarkers, curveSeries } from "./figureSeries";

const SIGMA_MAX = 0.45;

/// Two-asset frontier with short sales, the risk-free rate and the capital market line through the tangency portfolio.
export default function CapitalMarketLineFigure() {
  const { t } = useI18n();
  const [rho, setRho] = useState(0.2);
  const [rf, setRf] = useState(0.02);
  const curve = useMemo(() => twoAssetCurve(rho, -0.5, 1.5), [rho]);
  const tangency = twoAssetPoint(tangencyWeight(rho, rf), rho);
  const minVar = twoAssetPoint(minVarianceWeight(rho), rho);
  const slope = sharpe(tangency.mu, tangency.sigma, rf);
  const cml = [{ sigma: 0, mu: rf }, { sigma: SIGMA_MAX, mu: rf + slope * SIGMA_MAX }];

  return (
    <GuideFigure title={t("gfCmlTitle")} labId="efficient-frontier">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRho")} min={-0.9} max={0.95} step={0.05} value={rho} onChange={setRho} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFieldRf")} min={0} max={0.05} step={0.0025} value={rf} onChange={setRf} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfCmlAria")}>
        <ScatterChart
          series={[
            curveSeries("frontier", t("gfFrontier"), curve, SERIES_PALETTE[0]),
            curveSeries("cml", t("gfCml"), cml, SERIES_PALETTE[1], "6 4"),
            assetMarkers(t, [ASSET_A, ASSET_B]),
            {
              key: "special",
              label: t("gfSpecialPortfolios"),
              color: SERIES_PALETTE[2],
              radius: 6,
              points: [
                { x: tangency.sigma, y: tangency.mu, label: t("gfTangency") },
                { x: minVar.sigma, y: minVar.mu, label: t("gfMinVariance") },
              ],
            },
          ]}
          xDomain={[0, SIGMA_MAX]}
          yDomain={[0, 0.16]}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          xLabel={t("gfAxisVolatility")}
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfTangencyWeight"), value: pct(tangency.w, 1), tone: "accent" },
          { label: t("gfTangencyMu"), value: pct(tangency.mu, 2) },
          { label: t("gfTangencySigma"), value: pct(tangency.sigma, 2) },
          { label: t("gfSharpe"), value: fmt(slope, 3), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
