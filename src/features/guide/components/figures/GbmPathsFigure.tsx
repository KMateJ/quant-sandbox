import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { gbmRows } from "../../guide.processes.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { pathSeries } from "./figureSeries";

const S0 = 100;
const PATHS = 20;
const STEPS = 250;

/// GBM sample paths with the mean S₀e^{μt} above the median S₀e^{(μ−σ²/2)t}.
export default function GbmPathsFigure() {
  const { t } = useI18n();
  const [mu, setMu] = useState(0.08);
  const [sigma, setSigma] = useState(0.3);
  const [seed, setSeed] = useState(1);
  const data = useMemo(() => gbmRows(S0, mu, sigma, PATHS, STEPS, seed), [mu, sigma, seed]);
  const end = data[data.length - 1];

  return (
    <GuideFigure title={t("gfGbmTitle")} labId="gbm">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldMuDrift")} min={-0.1} max={0.3} step={0.01} value={mu} onChange={setMu} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.8} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>
          {t("gfNewPaths")}
        </button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfGbmAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            ...pathSeries(PATHS),
            { key: "mean", label: t("gfMean"), color: SERIES_PALETTE[1], strokeWidth: 2.5 },
            { key: "median", label: t("gfMedian"), color: SERIES_PALETTE[2], strokeWidth: 2.25, dash: "6 3" },
          ]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMeanAtT"), value: fmt(end.mean), tone: "accent" },
          { label: t("gfMedianAtT"), value: fmt(end.median) },
          { label: t("gfVolDrag"), value: pct(0.5 * sigma * sigma) },
        ]}
      />
    </GuideFigure>
  );
}
