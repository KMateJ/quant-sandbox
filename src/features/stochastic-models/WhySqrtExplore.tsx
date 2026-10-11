import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import ScalingChart from "./ScalingChart";
import ScalingControls from "./ScalingControls";
import { scalingData } from "./scalingLaws.math";
import type { ScaleMode } from "./scalingLaws.types";

export default function WhySqrtExplore() {
  const { t } = useI18n();
  const [paths, setPaths] = useState(2000);
  const [alpha, setAlpha] = useState(1);
  const [seed, setSeed] = useState(7);
  const [mode, setMode] = useState<ScaleMode>("loglog");

  const result = useMemo(() => scalingData(seed, paths), [seed, paths]);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <ScalingControls
          paths={paths}
          setPaths={setPaths}
          alpha={alpha}
          setAlpha={setAlpha}
          seed={seed}
          setSeed={setSeed}
          mode={mode}
          setMode={setMode}
          onResample={() => setSeed((value) => (value >= 9999 ? 1 : value + 1))}
        />
        <section className="stoch-metrics" aria-label={t("stochSqrtMetrics")}>
          <h3>{t("stochSqrtMetrics")}</h3>
          <div className="stoch-metric-grid">
            <Metric label={t("stochSqrtFittedSlope")} value={result.slope.toFixed(3)} />
            <Metric label={t("stochSqrtTheoreticalSlope")} value="0.500" />
            <Metric label={t("stochSqrtCandidateAlpha")} value={alpha.toFixed(2)} />
          </div>
          <p className="stoch-metric-note">{t("stochSqrtObservation")}</p>
          <IntuitionTrigger sectionId="scaling-exponents" variant="button" />
        </section>
      </aside>
      <div className="stoch-stage">
        <ScalingChart points={result.points} alpha={alpha} mode={mode} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="stoch-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
