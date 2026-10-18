import { useMemo } from "react";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard } from "../../components/ui";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import CltControls from "./CltControls";
import CltKsChart from "./CltKsChart";
import CltPrediction from "./CltPrediction";
import DensityComparisonChart from "./DensityComparisonChart";
import { cltLevelSamples, ksCurve, ksNoiseFloor, sampleMoments, sumSkewness } from "./clt.math";
import { CLT_LEVELS, CLT_PREDICT_N, DISTRIBUTION_KEYS, KS_LEVELS } from "./clt.types";
import { densityComparison } from "./rescaledWalk.math";
import { CLT_URL_SCHEMA, nearestOf } from "./stochStudio.url";

export default function CltExplore() {
  const { t } = useI18n();
  const [url, setUrl] = useUrlState(CLT_URL_SCHEMA);
  const { dist: distribution, samples, seed } = url;
  const n = nearestOf(CLT_LEVELS, url.n);

  const levelSamples = useMemo(
    () => cltLevelSamples(seed, distribution, KS_LEVELS, samples),
    [seed, distribution, samples]
  );
  const ks = useMemo(() => ksCurve(levelSamples, KS_LEVELS, distribution), [levelSamples, distribution]);
  const current = levelSamples[KS_LEVELS.indexOf(n)];
  const density = useMemo(() => densityComparison(current), [current]);
  const moments = useMemo(() => sampleMoments(current), [current]);
  const currentKs = ks.find((p) => p.n === n);

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <CltControls
          distribution={distribution}
          setDistribution={(dist) => setUrl({ dist })}
          n={n}
          setN={(value) => setUrl({ n: value })}
          samples={samples}
          setSamples={(value) => setUrl({ samples: value })}
          seed={seed}
          setSeed={(value) => setUrl({ seed: value })}
          onResample={() => setUrl({ seed: seed >= 9999 ? 1 : seed + 1 })}
        />
        <CltPrediction onReveal={() => setUrl({ dist: "exponential", n: CLT_PREDICT_N })} />
        <Panel title={t("stochCltMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("stochEmpiricalVariance")} value={moments.variance.toFixed(3)} />
            <StatCard label={t("stochTheoreticalVariance")} value="1.000" />
            <StatCard label={t("stochCltEmpiricalSkew")} value={moments.skewness.toFixed(3)} />
            <StatCard label={t("stochCltTheoreticalSkew")} value={sumSkewness(distribution, n).toFixed(3)} />
            <StatCard label={t("stochCltKs")} value={currentKs ? currentKs.ks.toFixed(4) : "—"} />
            <StatCard label={t("stochCltBoundSeries")} value={currentKs ? currentKs.bound.toFixed(4) : "—"} />
          </div>
          <p className="stoch-metric-note">{t("stochCltObservation")}</p>
          <IntuitionTrigger sectionId="clt-universality" variant="button" />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <DensityComparisonChart
          data={density}
          title={t("stochCltDensityTitle")}
          actions={<span className="stoch-chart-readout">{t("stochCltLevelReadout", { n })}</span>}
          caption={t("stochCltDensityCaption")}
          pinLabel={`${t(DISTRIBUTION_KEYS[distribution])}, n = ${n}`}
        />
        <CltKsChart points={ks} floor={ksNoiseFloor(samples)} activeN={n} />
      </div>
    </div>
  );
}
