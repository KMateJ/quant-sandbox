import { useMemo } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import BrownianControls from "./BrownianControls";
import BrownianWindowChart from "./BrownianWindowChart";
import GuidedExperiments from "../../components/GuidedExperiments";
import IncrementFanChart from "./IncrementFanChart";
import { difference } from "./brownianFundamentals.math";
import { terminalSummary } from "./rescaledWalk.math";
import { useBrownianExperiment } from "./useBrownianExperiment";
import { useWindowSweep } from "./useWindowSweep";

export default function IncrementExplore() {
  const { t } = useI18n();
  const experiment = useBrownianExperiment(400);
  const { s, t: time, ws, wt } = experiment;
  const width = time - s;
  const sweep = useWindowSweep(s, time, experiment.setWindow);

  const summary = useMemo(() => terminalSummary(difference(ws, wt)), [ws, wt]);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <BrownianControls experiment={experiment} />
        <Panel title={t("stochIncMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochEmpiricalMean")} value={summary.mean.toFixed(3)} />
            <StatCard label={t("stochTheoreticalMean")} value="0.000" />
            <StatCard label={t("stochEmpiricalVariance")} value={summary.variance.toFixed(3)} />
            <StatCard label={t("stochIncTheoreticalVariance")} value={width.toFixed(3)} />
          </div>
          <IntuitionTrigger sectionId="wiener-increments" variant="button" />
        </Panel>
        <GuidedExperiments keys={["stochIncTry1", "stochIncTry2", "stochIncTry3"]} />
      </aside>
      <div className="stoch-stage">
        <BrownianWindowChart
          experiment={{
            ...experiment,
            setWindow: (from, to) => {
              sweep.stop();
              experiment.setWindow(from, to);
            },
          }}
          title={t("stochIncWindowChart")}
          caption={t("stochIncWindowCaption")}
          actions={
            <button className="preset-btn" type="button" aria-pressed={sweep.playing} onClick={sweep.toggle}>
              {sweep.playing ? t("stochPauseSweep") : t("stochPlaySweep")}
            </button>
          }
        />
        <IncrementFanChart experiment={experiment} />
      </div>
    </div>
  );
}
