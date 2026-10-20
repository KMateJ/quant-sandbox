import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, markerLine } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { DDM_DEFAULTS, gordonPrice, payoutSeries, pvgo } from "../../../guide.wave4.corporate.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";

const EPS = DDM_DEFAULTS.eps;
/// Prices above this multiple of EPS/k are left off the chart (g close to k).
const CAP = 4;

/// Gordon growth price against the payout ratio, with growth funded by retained earnings at the chosen ROE.
export default function PayoutDdmFigure() {
  const { t } = useI18n();
  const [roe, setRoe] = useState(DDM_DEFAULTS.roe);
  const [k, setK] = useState(DDM_DEFAULTS.k);
  const [payout, setPayout] = useState(DDM_DEFAULTS.payout);
  const rows = useMemo(
    () => payoutSeries(EPS, roe, k).filter((r) => r.price <= (CAP * EPS) / k).map((r) => ({ payout: r.payout, price: r.price, flat: EPS / k })),
    [roe, k],
  );
  const now = gordonPrice(EPS, payout, roe, k);

  return (
    <GuideFigure title={t("gfW4PayoutDdmTitle")} labId="valuation">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldRoe")} min={0.04} max={0.2} step={0.005} value={roe} onChange={setRoe} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfW4FieldK")} min={0.06} max={0.14} step={0.005} value={k} onChange={setK} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfW4FieldPayout")} min={0.05} max={1} step={0.05} value={payout} onChange={setPayout} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4DdmAria")}>
        <LineChart
          data={rows}
          xKey="payout"
          series={[
            { key: "price", label: t("gfW4DdmPrice"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "flat", label: t("gfW4NoGrowth"), color: SERIES_PALETTE[1], strokeWidth: 1.5 },
          ]}
          referenceLines={[markerLine(payout)]}
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `${t("gfW4FieldPayout")} = ${pct(x, 0)}`}
          valueFormat={(v) => fmt(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4Growth"), value: pct(now.g, 2) },
          { label: t("gfW4D1"), value: fmt(now.d1) },
          { label: t("gfW4Price"), value: fmt(now.price), tone: "strong" },
          { label: t("gfW4Pvgo"), value: fmt(pvgo(now.price, EPS, k)), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
