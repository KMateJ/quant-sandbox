import { useMemo, useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../../i18n";
import { feynmanKacRows, type HeatPayoff } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";

const PAYOFFS: HeatPayoff[] = ["call", "digital", "square"];
const PAYOFF_KEY: Record<HeatPayoff, TranslationKey> = { call: "gsPayoffCall", digital: "gsPayoffDigital", square: "gsPayoffSquare" };
const DRAWS = 2000;

/// The PDE solution u(τ, x) = E[g(x + σW_τ)] against Monte Carlo averages: one number, two methods.
export default function FeynmanKacFigure() {
  const { t } = useI18n();
  const [g, setG] = useState<HeatPayoff>("call");
  const [tau, setTau] = useState(0.5);
  const [sigma, setSigma] = useState(1);
  const r = useMemo(() => feynmanKacRows(g, sigma, tau, DRAWS, 3), [g, sigma, tau]);
  const line = (key: "payoff" | "u") => r.exact.map((p) => ({ x: p.x, y: p[key] }));

  return (
    <GuideFigure title={t("gsFkTitle")} labId="black-scholes">
      <div className="gf-toolbar">
        <SegmentedControl<HeatPayoff> ariaLabel={t("gsPayoffLabel")} value={g} onChange={setG} options={PAYOFFS.map((v) => ({ value: v, label: t(PAYOFF_KEY[v]) }))} />
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gsTau")} min={0.05} max={2} step={0.05} value={tau} onChange={setTau} formatValue={(v) => v.toFixed(2)} />
        <SliderField label="σ" min={0.2} max={1.5} step={0.05} value={sigma} onChange={setSigma} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gsFkAria")}>
        <ScatterChart
          series={[
            { key: "g", label: t("gsPayoffG"), color: SERIES_PALETTE[2], line: true, dash: "6 3", strokeWidth: 1.5, points: line("payoff") },
            { key: "u", label: t("gsPdeSolution"), color: SERIES_PALETTE[0], line: true, strokeWidth: 2.5, points: line("u") },
            { key: "mc", label: t("gsMcDots", { n: DRAWS }), color: SERIES_PALETTE[1], radius: 5, points: r.mc.map((p) => ({ x: p.x, y: p.mean })) },
          ]}
          xDomain={[-2, 4]}
          xFormat={(v) => v.toFixed(1)}
          yFormat={(v) => v.toFixed(2)}
          xLabel="x"
          yLabel="u"
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gsExactAt1"), value: fmt(r.exactAtOne, 4), tone: "accent" },
          { label: t("gsMcAt1"), value: fmt(r.mcAtOne, 4) },
          { label: t("gfStandardError"), value: fmt(r.seAtOne, 4) },
        ]}
      />
    </GuideFigure>
  );
}
