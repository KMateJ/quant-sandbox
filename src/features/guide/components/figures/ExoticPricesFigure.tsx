import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { blackScholesCall } from "../../../black-scholes/blackScholes.math";
import { barrierRows, exoticPrices, simulatePathStats } from "../../guide.wave3.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const S0 = 100;
const K = 100;
const R = 0.05;
const T = 1;
const PATHS = 20000;
const DATES = 100;

/// Up-and-out call price against the barrier, from one seeded set of monitored ℚ-paths.
export default function ExoticPricesFigure() {
  const { t } = useI18n();
  const [sigma, setSigma] = useState(0.2);
  const [B, setB] = useState(130);
  const [seed, setSeed] = useState(1);
  const stats = useMemo(() => simulatePathStats(S0, R, sigma, T, PATHS, DATES, seed), [sigma, seed]);
  const rows = useMemo(() => barrierRows(stats, S0, K, R, sigma, T), [stats, sigma]);
  const prices = useMemo(() => exoticPrices(stats, K, B, R, T), [stats, B]);

  return (
    <GuideFigure title={t("gfW3ExTitle")} labId="monte-carlo">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldSigma")} min={0.1} max={0.5} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfW3FieldBarrier")} min={105} max={250} step={1} value={B} onChange={setB} formatValue={(v) => v.toFixed(0)} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>
          {t("gfNewSample")}
        </button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW3ExAria")}>
        <LineChart
          data={rows}
          xKey="B"
          series={[
            { key: "upOut", label: t("gfW3UpOut"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "vanilla", label: t("gfW3VanillaBs"), color: SERIES_PALETTE[1], strokeWidth: 1.75, dash: "6 3" },
          ]}
          yDomain={[0, Math.ceil(blackScholesCall(S0, K, T, R, sigma) * 1.15)]}
          referenceLines={[{ axis: "x", value: B, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => `B = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW3VanillaMc"), value: fmt(prices.vanilla) },
          { label: t("gfW3Asian"), value: fmt(prices.asian) },
          { label: t("gfW3UpOutAtB"), value: fmt(prices.upOut), tone: "accent" },
          { label: t("gfW3Digital"), value: fmt(prices.digital, 3) },
        ]}
      />
    </GuideFigure>
  );
}
