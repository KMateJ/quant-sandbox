import { useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { capmExpectedReturn } from "../../../../lib/finance/capm";
import { smlRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

/// Security market line: required return rises linearly in beta from r_f through the market.
export default function SecurityMarketLineFigure() {
  const { t } = useI18n();
  const [rf, setRf] = useState(0.03);
  const [market, setMarket] = useState(0.08);
  const [beta, setBeta] = useState(1.3);
  const required = capmExpectedReturn(rf, beta, market);

  return (
    <GuideFigure title={t("gfSmlTitle")} labId="capm">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRf")} min={0} max={0.06} step={0.0025} value={rf} onChange={setRf} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldMarketReturn")} min={0.04} max={0.12} step={0.0025} value={market} onChange={setMarket} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldBeta")} min={0} max={2} step={0.05} value={beta} onChange={setBeta} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfSmlAria", { beta: beta.toFixed(2) })}>
        <ScatterChart
          series={[
            { key: "sml", label: t("gfSml"), color: SERIES_PALETTE[0], line: true, strokeWidth: 2.5, points: smlRows(rf, market).map((r) => ({ x: r.beta, y: r.sml })) },
            { key: "market", label: t("gfMarketPortfolio"), color: SERIES_PALETTE[1], radius: 6, points: [{ x: 1, y: market, label: "M" }] },
            { key: "asset", label: t("gfAsset"), color: SERIES_PALETTE[2], radius: 6, points: [{ x: beta, y: required, label: `β = ${beta.toFixed(2)}` }] },
          ]}
          xDomain={[0, 2]}
          yDomain={[0, 0.22]}
          referenceLines={[markerLine(beta)]}
          xFormat={(v) => v.toFixed(1)}
          yFormat={(v) => pct(v, 0)}
          xLabel="β"
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMarketPremium"), value: pct(market - rf, 2) },
          { label: t("gfRequiredReturn"), value: pct(required, 2), tone: "strong" },
          { label: t("gfAssetPremium"), value: pct(required - rf, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
