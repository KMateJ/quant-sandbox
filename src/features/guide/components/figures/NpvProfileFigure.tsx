import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { npv } from "../../../../lib/finance/annuity";
import { npvProfile } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

/// NPV of −100 now and C a year for N years against the discount rate; the IRR is where it crosses zero.
export default function NpvProfileFigure() {
  const { t } = useI18n();
  const [C, setC] = useState(25);
  const [N, setN] = useState(5);
  const [r, setR] = useState(0.1);
  const profile = useMemo(() => npvProfile(C, N), [C, N]);
  const atR = npv(r, profile.flows);

  return (
    <GuideFigure title={t("gfNpvTitle")} labId="npv-irr">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldCashflow")} min={5} max={40} step={1} value={C} onChange={setC} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldYears")} min={1} max={15} step={1} value={N} onChange={setN} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldDiscountRate")} min={0} max={0.3} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfNpvAria")}>
        <LineChart
          data={profile.rows}
          xKey="r"
          series={[{ key: "npv", label: "NPV", color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
          referenceLines={[
            markerLine(r),
            { axis: "y", value: 0, color: "var(--border-hover)", dash: "0" },
          ]}
          legend={false}
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `r = ${pct(x)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfNpvAtR"), value: fmt(atR), tone: "strong" },
          { label: "IRR", value: Number.isFinite(profile.irr) ? pct(profile.irr, 2) : "–", tone: "accent" },
          { label: t("gfUndiscountedSum"), value: fmt(profile.flows.reduce((a, b) => a + b, 0), 0) },
        ]}
      />
    </GuideFigure>
  );
}
