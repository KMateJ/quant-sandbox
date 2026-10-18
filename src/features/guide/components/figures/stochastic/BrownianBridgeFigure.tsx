import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { bridgeRows } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import { bandSeries, pathSeries } from "../figureSeries";

const PATHS = 8;

/// Brownian bridges from 0 to b: mean b·t and spread √(t(1−t)), widest at t = 1/2 and zero at both ends.
export default function BrownianBridgeFigure() {
  const { t } = useI18n();
  const [b, setB] = useState(0);
  const [seed, setSeed] = useState(1);
  const model = useMemo(() => bridgeRows(b, PATHS, seed), [b, seed]);

  return (
    <GuideFigure title={t("gsBridgeTitle")} labId="brownian-motion">
      <div className="gf-sliders">
        <SliderField label={t("gsEndB")} min={-1.5} max={1.5} step={0.05} value={b} onChange={setB} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((v) => v + 1)}>{t("gfNewPaths")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gsBridgeAria", { b: b.toFixed(2) })}>
        <LineChart
          data={model.rows}
          xKey="t"
          series={[
            ...pathSeries(PATHS),
            { key: "mean", label: "b·t", color: SERIES_PALETTE[2], strokeWidth: 2 },
            bandSeries("up1", "±√(t(1−t))", "5 3"), bandSeries("lo1", "", "5 3"),
            bandSeries("up2", "±2√(t(1−t))", "2 4"), bandSeries("lo2", "", "2 4"),
          ]}
          yDomain={[-3, 3]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gsMidMean"), value: `${fmt(model.midMean, 3)} (b/2 = ${fmt(b / 2, 3)})` },
          { label: t("gsMidVar"), value: `${fmt(model.midVar, 3)} (1/4)`, tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
