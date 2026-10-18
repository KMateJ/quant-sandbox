import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { blDensityRows, blReadout } from "../../guide.wave2.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const S0 = 100;
const R = 0.05;
const T = 1;

/// Breeden–Litzenberger: the density read off call prices, and a butterfly that approximates it.
export default function BlDensityFigure() {
  const { t } = useI18n();
  const [sigma, setSigma] = useState(0.2);
  const [skew, setSkew] = useState(0);
  const [K, setK] = useState(100);
  const [h, setH] = useState(5);
  const rows = useMemo(() => blDensityRows(S0, R, sigma, T, skew), [sigma, skew]);
  const read = useMemo(() => blReadout(S0, R, sigma, T, skew, K, h), [sigma, skew, K, h]);

  const series: ChartSeries[] = [{ key: "density", label: t("gfW2Density"), color: SERIES_PALETTE[0], strokeWidth: 2.5, area: true }];
  if (skew !== 0) series.push({ key: "flat", label: t("gfW2Lognormal"), color: SERIES_PALETTE[1], strokeWidth: 1.75, dash: "6 3" });

  return (
    <GuideFigure title={t("gfW2BlTitle")} labId="payoff">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfW2FieldSkew")} min={-0.4} max={0.2} step={0.01} value={skew} onChange={setSkew} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfW2FieldCentre")} min={50} max={160} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfW2FieldWidth")} min={0.5} max={20} step={0.5} value={h} onChange={setH} formatValue={(v) => v.toFixed(1)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW2BlAria")}>
        <LineChart
          data={rows}
          xKey="K"
          series={series}
          referenceLines={[{ axis: "x", value: K, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => `K = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(5)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW2Butterfly"), value: fmt(read.butterfly, 5), tone: "accent" },
          { label: t("gfW2ExactDensity"), value: fmt(read.exact, 5) },
          { label: t("gfW2Mass"), value: fmt(read.mass, 4) },
        ]}
      />
    </GuideFigure>
  );
}
