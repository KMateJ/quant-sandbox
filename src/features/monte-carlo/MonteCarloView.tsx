import { useUrlState } from "../../components/useUrlState";
import { MC_URL_SCHEMA, MC_VIEWS } from "./monteCarlo.url";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip, SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import McConvergenceChart from "./McConvergenceChart";
import McDistribution from "./McDistribution";
import McExotic from "./McExotic";
import McRaceReadout from "./McRaceReadout";
import { MC_ESTIMATORS } from "./monteCarloLab.math";
import { useMonteCarloLab } from "./useMonteCarloLab";

type Show = (typeof MC_VIEWS)[number];

export default function MonteCarloView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [url, setUrl] = useUrlState(MC_URL_SCHEMA);
  const { s0, K: strike, T: maturity, r: rate, sigma: vol, n: sims, seed, view: show, exotic, B: barrier } = url;
  const setS0 = (v: number) => setUrl({ s0: v });
  const setStrike = (K: number) => setUrl({ K });
  const setMaturity = (T: number) => setUrl({ T });
  const setRate = (r: number) => setUrl({ r });
  const setVol = (sigma: number) => setUrl({ sigma });
  const setSims = (n: number) => setUrl({ n });
  const setSeed = (s: number) => setUrl({ seed: s });
  const setShow = (view: Show) => setUrl({ view });

  const inputs = { s0, strike, maturity, rate, vol, sims, seed };
  const { result, params, pending } = useMonteCarloLab(inputs);
  const plain = result.summary.plain;

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const num = (v: number) => v.toFixed(3);

  return (
    <>
      <PageHeader title={t("monteCarloTitle")} description={t("monteCarloDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("monteCarloControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("monteCarloS0Label")} min={10} max={300} step={5} value={s0} onChange={setS0} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("monteCarloStrikeLabel")} min={10} max={300} step={5} value={strike} onChange={setStrike} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("monteCarloMaturityLabel")} min={0.25} max={3} step={0.25} value={maturity} onChange={setMaturity} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("monteCarloRateLabel")} min={0} max={0.1} step={0.0025} value={rate} onChange={setRate} formatValue={pct} />
            <SliderField label={t("monteCarloVolLabel")} min={0.05} max={0.6} step={0.01} value={vol} onChange={setVol} formatValue={pct} />
            <SliderField label={t("monteCarloSimsLabel")} min={200} max={20000} step={200} value={sims} onChange={setSims} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("monteCarloSeedLabel")} min={1} max={100} step={1} value={seed} onChange={setSeed} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("monteCarloMetricsLabel")}>
            <div className="stats-grid" aria-busy={pending}>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloEstimate")}</div>
                <div className="stat-value">{num(plain.estimate)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloAnalytic")}</div>
                <div className="stat-value">{num(result.analytic)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("monteCarloStdError")}
                  <InfoTooltip content={t("monteCarloStdErrorHelp")} />
                </div>
                <div className="stat-value">{num(plain.standardError)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("monteCarloChartTitle")}
            actions={
              <SegmentedControl<Show>
                ariaLabel={t("monteCarloShowLabel")}
                value={show}
                onChange={setShow}
                options={[{ value: "plain", label: t("monteCarloShowPlain") }, { value: "race", label: t("monteCarloShowRace") }]}
              />
            }
          >
            <p className="control-hint">{pending ? t("monteCarloUpdating") : t("monteCarloBandLabel")}</p>
            <div className="chart-wrap">
              <McConvergenceChart race={result.race} shown={show === "race" ? MC_ESTIMATORS : ["plain"]} sims={params.sims} isMobile={isMobile} />
            </div>
            {show === "race" && (
              <>
                <McRaceReadout summary={result.summary} />
                <p className="control-hint">{t("monteCarloRaceHelp")}</p>
              </>
            )}
          </ChartContainer>

          <ChartContainer title={t("monteCarloDistTitle")}>
            <McDistribution result={result} params={params} isMobile={isMobile} />
          </ChartContainer>

          <McExotic
            params={inputs}
            analytic={result.analytic}
            payoff={exotic}
            onPayoff={(p) => setUrl({ exotic: p })}
            barrier={barrier}
            onBarrier={(b) => setUrl({ B: Math.round(b) })}
            isMobile={isMobile}
          />
        </div>
      </Workspace>
    </>
  );
}
