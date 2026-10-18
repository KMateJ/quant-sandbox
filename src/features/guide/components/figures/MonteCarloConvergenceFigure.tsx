import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { blackScholesCall } from "../../../black-scholes/blackScholes.math";
import { monteCarloRows } from "../../guide.simulation.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { bandSeries } from "./figureSeries";

const S0 = 100;
const K = 100;
const R = 0.05;
const T = 1;
const SIMS = 5000;

/// Running Monte Carlo call price with its 95% band, closing in on the Black–Scholes price.
export default function MonteCarloConvergenceFigure() {
  const { t } = useI18n();
  const [sigma, setSigma] = useState(0.2);
  const [seed, setSeed] = useState(1);
  const bs = blackScholesCall(S0, K, T, R, sigma);
  const mc = useMemo(() => monteCarloRows(S0, K, R, sigma, T, SIMS, seed), [sigma, seed]);
  const data = useMemo(() => mc.rows.map((row) => ({ ...row, bs })), [mc, bs]);

  return (
    <GuideFigure title={t("gfMcTitle")} labId="monte-carlo">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldSigma")} min={0.1} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>
          {t("gfNewSample")}
        </button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMcAria")}>
        <LineChart
          data={data}
          xKey="n"
          series={[
            bandSeries("upper", t("gfBand95"), "4 3"),
            bandSeries("lower", "", "4 3"),
            { key: "estimate", label: t("gfMcEstimate"), color: SERIES_PALETTE[0], strokeWidth: 2 },
            { key: "bs", label: t("gfBlackScholesPrice"), color: SERIES_PALETTE[2], strokeWidth: 1.75, dash: "8 4" },
          ]}
          yDomain={[bs * 0.7, bs * 1.3]}
          curve="linear"
          tooltipLabel={(x) => `n = ${x}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMcEstimateAt", { n: SIMS }), value: fmt(mc.estimate, 3), tone: "strong" },
          { label: t("gfStandardError"), value: fmt(mc.se, 3) },
          { label: t("gfBlackScholesPrice"), value: fmt(bs, 3), tone: "accent" },
          { label: t("gfError"), value: fmt(mc.estimate - bs, 3) },
        ]}
      />
    </GuideFigure>
  );
}
