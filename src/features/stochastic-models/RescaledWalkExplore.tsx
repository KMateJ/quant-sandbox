import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import DensityComparisonChart from "./DensityComparisonChart";
import RescaledControls from "./RescaledControls";
import RescaledPathChart from "./RescaledPathChart";
import {
  densityComparison,
  fineWalks,
  rescaledPaths,
  rescaledTerminalSamples,
  terminalSummary,
  walksExtent,
} from "./rescaledWalk.math";

const TERMINAL_SAMPLES = 1500;

export default function RescaledWalkExplore() {
  const { t } = useI18n();
  const [exponent, setExponent] = useState(0);
  const [paths, setPaths] = useState(4);
  const [seed, setSeed] = useState(7);

  const level = 2 ** exponent;

  const walks = useMemo(() => fineWalks(seed, paths), [seed, paths]);
  const yDomain = useMemo(() => walksExtent(walks), [walks]);
  const pathData = useMemo(() => rescaledPaths(walks, level), [walks, level]);
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
          exponent={exponent}
          setExponent={setExponent}
          paths={paths}
          setPaths={setPaths}
          seed={seed}
          setSeed={setSeed}
          onResample={() => setSeed((value) => (value >= 9999 ? 1 : value + 1))}
        />
        <Panel title={t("stochRescaledMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochEmpiricalMean")} value={summary.mean.toFixed(3)} />
            <StatCard label={t("stochTheoreticalMean")} value="0.000" />
            <StatCard label={t("stochEmpiricalVariance")} value={summary.variance.toFixed(3)} />
            <StatCard label={t("stochTheoreticalVariance")} value="1.000" />
          </div>
          <p className="stoch-metric-note">{t("stochRescaledObservation")}</p>
          <IntuitionTrigger sectionId="convergence-types" variant="button" />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <RescaledPathChart paths={pathData} level={level} yDomain={yDomain} />
        <DensityComparisonChart data={density} title={t("stochRescaledDensity")} />
      </div>
    </div>
  );
}
