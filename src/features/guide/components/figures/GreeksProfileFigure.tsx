import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { greeksAt, greeksRows } from "../../guide.wave2.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const K = 100;
const R = 0.05;
type Greek = "delta" | "gamma" | "vega" | "theta";
const LABEL = { delta: "gfW2Delta", gamma: "gfW2Gamma", vega: "gfW2Vega", theta: "gfW2Theta" } as const;

/// One Greek of a call across spot prices; readouts at S = 100 include the Black–Scholes PDE check.
export default function GreeksProfileFigure() {
  const { t } = useI18n();
  const [greek, setGreek] = useState<Greek>("gamma");
  const [T, setT] = useState(0.5);
  const [sigma, setSigma] = useState(0.25);
  const rows = useMemo(() => greeksRows(K, T, R, sigma), [T, sigma]);
  const at = useMemo(() => greeksAt(K, K, T, R, sigma), [T, sigma]);

  return (
    <GuideFigure title={t("gfW2GreeksTitle")} labId="black-scholes">
      <div className="gf-toolbar">
        <SegmentedControl<Greek>
          ariaLabel={t("gfW2Greek")}
          value={greek}
          onChange={setGreek}
          options={(Object.keys(LABEL) as Greek[]).map((g) => ({ value: g, label: t(LABEL[g]) }))}
        />
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfFieldMaturity")} min={0.05} max={2} step={0.05} value={T} onChange={setT} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW2GreeksAria", { greek: t(LABEL[greek]), t: T.toFixed(2) })}>
        <LineChart
          data={rows}
          xKey="S"
          series={[{ key: greek, label: t(LABEL[greek]), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
          referenceLines={[{ axis: "x", value: K, color: "var(--muted)", dash: "4 4" }, { axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          legend={false}
          tooltipLabel={(x) => `S = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
      <FigureReadout
        items={[
          { label: `${t("gfW2Delta")} ${t("gfW2AtSpot")}`, value: fmt(at.delta, 3) },
          { label: t("gfW2Gamma"), value: fmt(at.gamma, 4) },
          { label: t("gfW2Vega"), value: fmt(at.vega, 2) },
          { label: t("gfW2Theta"), value: fmt(at.theta, 2) },
          { label: "Θ + ½σ²S²Γ + rSΔ − rV", value: fmt(Math.abs(at.pde) < 1e-9 ? 0 : at.pde, 4), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
