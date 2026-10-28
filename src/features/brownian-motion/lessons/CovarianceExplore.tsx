import { useMemo, useState } from "react";
import { IntuitionTrigger } from "../../../components/intuition";
import { Panel } from "../../../components/layout";
import { StatCard, usePredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import BrownianControls from "./BrownianControls";
import BrownianWindowChart from "./BrownianWindowChart";
import CovarianceMatrix from "./CovarianceMatrix";
import CovariancePrediction from "./CovariancePrediction";
import GuidedExperiments from "../../../components/GuidedExperiments";
import JointScatterChart from "./JointScatterChart";
import { correlationOf, difference, empiricalCovariance, jointCovariance } from "./brownianFundamentals.math";
import { masked } from "../../../components/lesson/predictRound";
import { COVARIANCE_URL_SCHEMA } from "../../../lib/stochastic/stochStudio.url";
import { useBrownianExperiment } from "./useBrownianExperiment";

export default function CovarianceExplore() {
  const { t } = useI18n();
  const experiment = useBrownianExperiment(COVARIANCE_URL_SCHEMA);
  const { s, t: time, ws, wt } = experiment;
  const mode = experiment.url.joint;
  const [slice, setSlice] = useState(0.8);

  const ys = useMemo(() => (mode === "levels" ? wt : difference(ws, wt)), [mode, ws, wt]);
  const empirical = useMemo(() => empiricalCovariance(ws, ys), [ws, ys]);
  const theory = jointCovariance(s, time, mode);
  const yName = mode === "levels" ? "W(t)" : "ΔW";
  const round = usePredictReveal({ challengeId: "covariance", truth: jointCovariance(s, time, "levels").xy, tolerance: 0.03 });
  const hidden = mode === "levels" && !round.revealed;

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <BrownianControls experiment={experiment} />
        <CovariancePrediction state={round} s={s} t={time} />
        <Panel title={t("stochCovMatrixTitle")}>
          <CovarianceMatrix empirical={empirical} theory={theory} names={["W(s)", yName]} hideCross={hidden} />
          <div className="stoch-metric-grid">
            <StatCard label={t("stochCorrEmpirical")} value={masked(!hidden, correlationOf(empirical).toFixed(3))} />
            <StatCard label={t("stochCorrTheory")} value={masked(!hidden, correlationOf(theory).toFixed(3))} />
          </div>
          <p className="stoch-metric-note">{t(hidden ? "stochCovMaskedNote" : mode === "levels" ? "stochCovObservation" : "stochCovIncObservation")}</p>
          <IntuitionTrigger sectionId="wiener-covariance" variant="button" />
        </Panel>
        <GuidedExperiments keys={["stochCovTry1", "stochCovTry2", "stochCovTry3"]} />
      </aside>
      <div className="stoch-stage stoch-joint-stage">
        <BrownianWindowChart
          experiment={experiment}
          title={t("stochCovWindowChart")}
          caption={t("stochCovWindowCaption")}
        />
        <JointScatterChart
          xs={ws}
          ys={ys}
          s={s}
          t={time}
          mode={mode}
          setMode={(joint) => experiment.setUrl({ joint })}
          slice={slice}
          setSlice={setSlice}
        />
      </div>
    </div>
  );
}
