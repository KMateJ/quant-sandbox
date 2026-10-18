import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { ouHalfLife, ouMoments, ouRows, vasicekBondPrice } from "../../guide.wave2.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { bandSeries, pathSeries } from "./figureSeries";

const THETA = 0.04;
const SIGMA = 0.01;
const HORIZON = 5;
const PATHS = 8;

/// Ornstein–Uhlenbeck paths pulled toward θ, with the expected path, ±2 sd bands and the Vasicek 5-year yield.
export default function OuPathsFigure() {
  const { t } = useI18n();
  const [kappa, setKappa] = useState(0.5);
  const [x0Pct, setX0Pct] = useState(8);
  const x0 = x0Pct / 100;
  const [seed, setSeed] = useState(1);
  // Rates are plotted in percent.
  const data = useMemo(
    () => ouRows(x0, kappa, THETA, SIGMA, HORIZON, PATHS, 250, seed).map((row) =>
      Object.fromEntries(Object.entries(row).map(([k, v]) => [k, k === "t" ? v : v * 100]))),
    [x0, kappa, seed]
  );
  const end = ouMoments(x0, kappa, THETA, SIGMA, HORIZON);
  const zeroYield = -Math.log(vasicekBondPrice(x0, kappa, THETA, SIGMA, HORIZON)) / HORIZON;

  return (
    <GuideFigure title={t("gfW2OuTitle")} labId="ito-process">
      <div className="gf-sliders">
        <SliderField label={t("gfW2FieldKappa")} min={0.1} max={5} step={0.1} value={kappa} onChange={setKappa} formatValue={(v) => v.toFixed(1)} />
        <SliderField label={t("gfW2FieldX0")} min={0} max={10} step={0.25} value={x0Pct} onChange={setX0Pct} formatValue={(v) => `${v.toFixed(2)}%`} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>
          {t("gfNewPaths")}
        </button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW2OuAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            ...pathSeries(PATHS),
            bandSeries("upper", t("gfW2Band"), "5 4"),
            bandSeries("lower", "", "5 4"),
            { key: "mean", label: t("gfW2ExpectedPath"), color: SERIES_PALETTE[3], strokeWidth: 2.75 },
          ]}
          referenceLines={[{ axis: "y", value: THETA * 100, color: "var(--muted)", dash: "2 4" }]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => `${v.toFixed(2)}%`}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW2HalfLife"), value: fmt(ouHalfLife(kappa), 2) },
          { label: t("gfW2StationarySd"), value: pct(SIGMA / Math.sqrt(2 * kappa), 2) },
          { label: t("gfW2MeanAt5"), value: pct(end.mean, 2) },
          { label: t("gfW2VasicekYield"), value: pct(zeroYield, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
