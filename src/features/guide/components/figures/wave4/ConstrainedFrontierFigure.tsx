import { useMemo, useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { CONSTRAINT_ASSETS as A, tangency, threeAssetFrontier } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import { curveSeries } from "../figureSeries";

const toPoints = (f: { sigma: number; mu: number }[]) => f.filter((p) => p.mu <= 0.14 && p.sigma <= 0.34);

/// The three-asset frontier with and without short sales, and what the ban costs in Sharpe ratio.
export default function ConstrainedFrontierFigure() {
  const { t } = useI18n();
  const [rf, setRf] = useState(0.02);
  const free = useMemo(() => threeAssetFrontier(A.mu, A.sigma, A.rho, true), []);
  const banned = useMemo(() => threeAssetFrontier(A.mu, A.sigma, A.rho, false), []);
  const tf = tangency(free, rf);
  const tb = tangency(banned, rf);

  return (
    <GuideFigure title={t("gfW4ConstrainedFrontierTitle")} labId="efficient-frontier">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldRiskFree")} min={0} max={0.05} step={0.0025} value={rf} onChange={setRf} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4ConstrainedAria")}>
        <ScatterChart
          series={[
            curveSeries("free", t("gfW4ShortAllowed"), toPoints(free), SERIES_PALETTE[1], "6 4"),
            curveSeries("banned", t("gfW4ShortBanned"), toPoints(banned), SERIES_PALETTE[0]),
            { key: "assets", label: t("gfAssets"), color: "var(--text)", radius: 5, points: A.mu.map((mu, i) => ({ x: A.sigma[i], y: mu, label: String(i + 1) })) },
          ]}
          xDomain={[0, 0.34]}
          yDomain={[0.03, 0.14]}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          xLabel={t("gfAxisVolatility")}
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4SharpeFree"), value: fmt(tf.sharpe, 3) },
          { label: t("gfW4SharpeBanned"), value: fmt(tb.sharpe, 3), tone: "accent" },
          { label: t("gfW4SharpeCost"), value: fmt(tf.sharpe - tb.sharpe, 3), tone: "strong" },
          { label: t("gfW4ShortWeight"), value: pct(Math.min(...tf.w), 0) },
        ]}
      />
    </GuideFigure>
  );
}
