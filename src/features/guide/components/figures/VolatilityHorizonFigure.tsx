import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { volatilityBands } from "../../guide.processes.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";
import { bandSeries } from "./figureSeries";

const YEARS = 10;

/// Expected cumulative log return grows like μT while its ±σ√T band widens like √T.
export default function VolatilityHorizonFigure() {
  const { t } = useI18n();
  const [mu, setMu] = useState(0.06);
  const [sigma, setSigma] = useState(0.2);
  const data = useMemo(() => volatilityBands(mu, sigma, YEARS), [mu, sigma]);

  return (
    <GuideFigure title={t("gfVolHorizonTitle")} labId="risk-return">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldMu")} min={-0.1} max={0.2} step={0.005} value={mu} onChange={setMu} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfVolHorizonAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            { key: "mean", label: t("gfMeanLogReturn"), color: SERIES_PALETTE[0], strokeWidth: 2.25 },
            bandSeries("up1", t("gfBand1"), "5 3"),
            bandSeries("lo1", "", "5 3"),
            bandSeries("up2", t("gfBand2"), "2 4"),
            bandSeries("lo2", "", "2 4"),
          ]}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border)" }]}
          yFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `T = ${x.toFixed(1)}`}
          valueFormat={(v) => pct(v)}
        />
      </div>
      <FigureReadout
        items={[1, 4, 9].map((T) => ({
          label: t("gfBandAt", { years: T }),
          value: `${pct(mu * T)} ± ${pct(sigma * Math.sqrt(T))}`,
        }))}
      />
    </GuideFigure>
  );
}
