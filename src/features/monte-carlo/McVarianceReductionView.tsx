import { useUrlState } from "../../components/useUrlState";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import McConvergenceChart from "./McConvergenceChart";
import McTermsSliders from "./McTermsSliders";
import McVrTable from "./McVrTable";
import { VR_URL_SCHEMA } from "./monteCarloPages.url";
import { VR_METHODS, varianceReductionRun } from "./monteCarloPages.math";
import { useMcJob } from "./useMcJob";

/// Plain vs antithetic vs control variate vs both on one European call, from the same normal draws.
export default function McVarianceReductionView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(VR_URL_SCHEMA);
  const { s0, K, T, r, sigma, n, seed } = url;
  const params = { s0, strike: K, maturity: T, rate: r, vol: sigma, sims: n, seed };
  const { result, params: shown, pending } = useMcJob("vr", params, varianceReductionRun);

  return (
    <>
      <PageHeader title={t("monteCarloVrTitle")} description={t("monteCarloVrDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("monteCarloControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("monteCarloS0Label")} min={10} max={300} step={5} value={s0} onChange={(v) => setUrl({ s0: v })} formatValue={(v) => v.toFixed(0)} />
            <McTermsSliders terms={url} onChange={setUrl} />
          </div>
          <ControlGroup label={t("monteCarloMetricsLabel")}>
            <div className="stats-grid" aria-busy={pending}>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloAnalytic")}</div>
                <div className="stat-value">{result.analytic.toFixed(4)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <div className="module-main">
          <ChartContainer title={t("monteCarloVrChartTitle")}>
            <p className="control-hint">{pending ? t("monteCarloUpdating") : t("monteCarloBandLabel")}</p>
            <div className="chart-wrap">
              <McConvergenceChart race={result.race} shown={VR_METHODS} sims={shown.sims} isMobile={isMobile} />
            </div>
          </ChartContainer>
          <ChartContainer title={t("monteCarloVrTableTitle")}>
            <McVrTable summary={result.summary} sims={shown.sims} />
            <p className="control-hint">{t("monteCarloVrBothHelp")}</p>
          </ChartContainer>
        </div>
      </Workspace>
    </>
  );
}
