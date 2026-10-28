import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { ChartContainer } from "../../../components/layout";
import { shareBelow, terminalValues } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { DEFINITION_URL_SCHEMA } from "../gbm.sde.url";
import { abmLaw, gbmLaw, medianPath, simulateAbmGbmPair } from "../gbm.definition.math";
import SdeLayout from "../sde/SdeLayout";
import DefinitionTable from "./DefinitionTable";
import PairClouds from "./PairClouds";
import PairHistograms from "./PairHistograms";
import StepScatter from "./StepScatter";
import { pairDomain, type PairView } from "./pairView";

const S0 = 100;
const STEPS = 150;
const PATHS = 400;

const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;

/// What GBM is, shown against arithmetic Brownian motion driven by the very same shocks.
export default function DefinitionPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(DEFINITION_URL_SCHEMA);
  const { mu, sigma, horizon, seed } = url;

  const view: PairView = useMemo(() => {
    const pair = simulateAbmGbmPair(S0, mu, sigma, horizon, STEPS, PATHS, seed);
    return {
    pair,
    hero: medianPath(pair.gbm, PATHS, STEPS),
    paths: PATHS,
    steps: STEPS,
    dt: horizon / STEPS,
    horizon,
    yDomain: pairDomain(S0, mu, sigma, horizon),
    laws: { abm: abmLaw(S0, mu, sigma, horizon), gbm: gbmLaw(S0, mu, sigma, horizon) },
    };
  }, [mu, sigma, horizon, seed]);
  const { abm, gbm } = view.laws;
  const median = S0 * Math.exp((mu - 0.5 * sigma * sigma) * horizon);
  const negSim = shareBelow(terminalValues(view.pair.abm, PATHS, STEPS + 1), 0);

  return (
    <SdeLayout
      titleKey="gdefTitle"
      descKey="gdefDesc"
      controls={
        <>
          <SliderField label={t("gdefMu")} min={-0.3} max={0.3} step={0.01} value={mu} onChange={(v) => setUrl({ mu: v })} formatValue={(v) => pct(v, 0)} />
          <SliderField label={t("gdefSigma")} min={0.05} max={0.8} step={0.05} value={sigma} onChange={(v) => setUrl({ sigma: v })} formatValue={(v) => pct(v, 0)} />
          <SliderField label={t("gdefHorizon")} min={0.5} max={10} step={0.5} value={horizon} onChange={(v) => setUrl({ horizon: v })} formatValue={(v) => v.toFixed(1)} />
          <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
        </>
      }
      stats={[
        { label: t("gdefStatNeg"), value: pct(abm.cdf(0)) },
        { label: t("gdefStatNegSim"), value: pct(negSim) },
        { label: t("gdefStatSdAbm"), value: abm.sd.toFixed(1) },
        { label: t("gdefStatSdGbm"), value: gbm.sd.toFixed(1) },
        { label: t("gdefStatMedian"), value: `${median.toFixed(1)} / ${gbm.mean.toFixed(1)}` },
      ]}
    >
      <ChartContainer title={t("gdefTableTitle")}>
        <DefinitionTable />
      </ChartContainer>
      <ChartContainer title={t("gdefPathsTitle", { n: PATHS })}>
        <PairClouds view={view} isMobile={isMobile} />
        <p className="gdef-caption">{t("gdefPathsCaption")}</p>
      </ChartContainer>
      <ChartContainer title={t("gdefHistTitle", { t: horizon })}>
        <PairHistograms view={view} isMobile={isMobile} />
        <p className="gdef-caption">{t("gdefHistCaption")}</p>
      </ChartContainer>
      <ChartContainer title={t("gdefStepTitle")}>
        <StepScatter view={view} isMobile={isMobile} />
        <p className="gdef-caption">{t("gdefStepCaption")}</p>
      </ChartContainer>
    </SdeLayout>
  );
}
