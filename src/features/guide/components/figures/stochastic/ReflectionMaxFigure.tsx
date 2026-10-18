import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, SERIES_ROLE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { maxSample, reflectedPath, reflectionStats } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";

const PATHS = 20000;
const STEPS = 500;

/// A path that reaches a and its reflection after τ_a; over many paths, P(max ≥ a) ≈ 2·P(W₁ ≥ a).
export default function ReflectionMaxFigure() {
  const { t } = useI18n();
  const [a, setA] = useState(1);
  const [seed, setSeed] = useState(1);
  // The maxima are simulated once per seed; moving a only re-counts.
  const sample = useMemo(() => maxSample(PATHS, STEPS, seed + 17), [seed]);
  const stats = reflectionStats(sample, a);
  const path = useMemo(() => reflectedPath(a, seed), [a, seed]);

  return (
    <GuideFigure title={t("gsReflectionTitle")} labId="stochastic-models">
      <div className="gf-sliders">
        <SliderField label={t("gsLevelA")} min={0.2} max={2.5} step={0.05} value={a} onChange={setA} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={() => setSeed((v) => v + 1)}>{t("gsNewPath")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gsReflectionAria", { a: a.toFixed(2) })}>
        {path && (
          <LineChart
            data={path}
            xKey="t"
            series={[
              { key: "level", label: "a", color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "6 3" },
              { key: "reflected", label: t("gsReflected"), color: SERIES_PALETTE[1], strokeWidth: 1.5, dash: "4 3" },
              { key: "path", label: "W(t)", color: SERIES_ROLE.cloud, strokeWidth: 2 },
            ]}
            curve="linear"
            tooltipLabel={(x) => `t = ${x.toFixed(3)}`}
            valueFormat={(v) => v.toFixed(3)}
          />
        )}
      </div>
      <FigureReadout
        items={[
          { label: t("gsShareMax"), value: pct(stats.hit, 2), tone: "strong" },
          { label: "2·P(W₁ ≥ a)", value: pct(stats.theory, 2), tone: "accent" },
          { label: t("gsShareEnd"), value: pct(stats.above, 2) },
        ]}
      />
    </GuideFigure>
  );
}
