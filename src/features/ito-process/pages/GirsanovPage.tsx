import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { driftedPaths, girsanovSample } from "../girsanov.math";
import { GIRSANOV_URL_SCHEMA } from "../itoPages.url";
import GirsanovHistograms from "../components/GirsanovHistograms";

const SAMPLES = 4000;
const SHOWN = 24;
const SERIES: ChartSeries[] = Array.from({ length: SHOWN }, (_, i) => ({ key: `p${i}`, label: `p${i}`, color: "#60a5fa", strokeWidth: 1, legend: false }));

/// Brownian paths with drift θ, reweighted by dQ/dP so the terminal law becomes driftless, with the ESS cost.
export default function GirsanovPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [{ theta, T, seed }, setUrl] = useUrlState(GIRSANOV_URL_SCHEMA);
  const sample = useMemo(() => girsanovSample(theta, T, SAMPLES, seed), [theta, T, seed]);
  const paths = useMemo(() => driftedPaths(theta, T, 100, SHOWN, seed + 1), [theta, T, seed]);

  return (
    <>
      <PageHeader title={t("girTitle")} description={t("girDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("girControls")}>
          <div className="controls-grid">
            <SliderField label={t("girTheta")} min={0} max={3} step={0.1} value={theta} onChange={(v) => setUrl({ theta: v })} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("girHorizon")} min={0.25} max={5} step={0.25} value={T} onChange={(v) => setUrl({ T: v })} formatValue={(v) => v.toFixed(2)} />
            <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
          </div>
          <dl className="lp-ensemble-readout" aria-live="polite">
            <div><dt>{t("girMeanW")}</dt><dd>{sample.meanWeight.toFixed(3)}</dd></div>
            <div><dt>{t("girEss")}</dt><dd>{sample.ess.toFixed(0)} / {SAMPLES}</dd></div>
            <div><dt>{t("girEssShare")}</dt><dd>{(100 * sample.essShare).toFixed(1)}%</dd></div>
            <div><dt>{t("girReMean")}</dt><dd>{sample.weightedMean.toFixed(3)}</dd></div>
          </dl>
          <p className="lp-ensemble-hint">{t("girHint")}</p>
        </Panel>
        <ChartContainer title={t("girPathsTitle")}>
          <div className="chart-wrap" role="img" aria-label={t("girPathsAria")}>
            <LineChart data={paths} xKey="t" series={SERIES} xDomain={[0, T]} curve="linear" isMobile={isMobile} legend={false}
              tooltipLabel={(x) => `t = ${x.toFixed(2)}`} valueFormat={(v) => v.toFixed(2)} />
          </div>
        </ChartContainer>
      </Workspace>
      <GirsanovHistograms sample={sample} theta={theta} horizon={T} isMobile={isMobile} />
    </>
  );
}
