import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { expectedStockReturn, realVsRiskNeutral } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const S0 = 100;
const U = 1.2;
const D = 0.9;
const K = 100;

/// One-step call: the discounted real-world expectation moves with p, the replication price does not.
export default function RealVsRiskNeutralFigure() {
  const { t } = useI18n();
  const [r, setR] = useState(0.02);
  const [p, setP] = useState(0.6);
  const model = useMemo(() => realVsRiskNeutral(S0, U, D, r, K), [r]);

  return (
    <GuideFigure title={t("gfRealVsQTitle")} labId="binomial">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRealP")} min={0} max={1} step={0.01} value={p} onChange={setP} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("guideFieldRate")} min={0} max={0.15} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfRealVsQAria")}>
        <LineChart
          data={model.rows}
          xKey="p"
          series={[
            { key: "naive", label: t("gfNaivePrice"), color: SERIES_PALETTE[2], strokeWidth: 2, dash: "6 4" },
            { key: "fair", label: t("gfArbitrageFreePrice"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[
            markerLine(p),
            { axis: "x", value: model.q, color: "var(--muted)", dash: "2 3" },
          ]}
          curve="linear"
          tooltipLabel={(x) => `p = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("guideReadQ"), value: model.valid ? fmt(model.q, 3) : "–", tone: "accent" },
          { label: t("gfReturnUnderP"), value: pct(expectedStockReturn(p, U, D)) },
          { label: t("gfReturnUnderQ"), value: pct(r) },
          { label: t("gfArbitrageFreePrice"), value: model.valid ? fmt(model.fair) : "–", tone: "strong" },
        ]}
      />
      {!model.valid && <p className="gf-warning" role="status">{t("guideFigureTreeInvalid")}</p>}
    </GuideFigure>
  );
}
