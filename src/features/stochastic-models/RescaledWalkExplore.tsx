import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import DensityComparisonChart from "./DensityComparisonChart";
import RescaledControls from "./RescaledControls";
import RescaledPathChart from "./RescaledPathChart";
import {
  densityComparison,
  rescaledPaths,
  rescaledTerminalSamples,
  terminalSummary,
} from "./rescaledWalk.math";

const TERMINAL_SAMPLES = 1500;

export default function RescaledWalkExplore() {
  const { t } = useI18n();
  const [level, setLevel] = useState(100);
  const [paths, setPaths] = useState(4);
  const [seed, setSeed] = useState(7);

  const pathData = useMemo(() => rescaledPaths(seed, level, paths), [seed, level, paths]);
  const terminal = useMemo(
    () => rescaledTerminalSamples(seed, level, TERMINAL_SAMPLES),
    [seed, level]
  );
  const density = useMemo(() => densityComparison(terminal), [terminal]);
  const summary = useMemo(() => terminalSummary(terminal), [terminal]);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <RescaledControls
          level={level}
          setLevel={setLevel}
          paths={paths}
          setPaths={setPaths}
          seed={seed}
          setSeed={setSeed}
          onResample={() => setSeed((value) => (value >= 9999 ? 1 : value + 1))}
        />
        <section className="stoch-metrics" aria-label={t("stochRescaledMetrics")}>
          <h3>{t("stochRescaledMetrics")}</h3>
          <div className="stoch-metric-grid">
            <Metric label={t("stochEmpiricalMean")} value={summary.mean.toFixed(3)} />
            <Metric label={t("stochTheoreticalMean")} value="0.000" />
            <Metric label={t("stochEmpiricalVariance")} value={summary.variance.toFixed(3)} />
            <Metric label={t("stochTheoreticalVariance")} value="1.000" />
          </div>
          <p className="stoch-metric-note">{t("stochRescaledObservation")}</p>
          <IntuitionTrigger sectionId="convergence-types" variant="button" />
        </section>
      </aside>
      <div className="stoch-stage">
        <RescaledPathChart paths={pathData} level={level} />
        <DensityComparisonChart data={density} />
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
