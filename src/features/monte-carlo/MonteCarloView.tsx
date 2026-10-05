import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { monteCarloCall } from "./monteCarlo.math";

const SAMPLE_POINTS = 150;

export default function MonteCarloView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [s0, setS0] = useState(100);
  const [strike, setStrike] = useState(100);
  const [maturity, setMaturity] = useState(1);
  const [rate, setRate] = useState(0.03);
  const [vol, setVol] = useState(0.2);
  const [sims, setSims] = useState(5000);
  const [seed, setSeed] = useState(7);

  const result = useMemo(
    () => monteCarloCall(s0, strike, maturity, rate, vol, sims, seed, SAMPLE_POINTS),
    [s0, strike, maturity, rate, vol, sims, seed]
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const num = (v: number) => v.toFixed(3);

  const series: ChartSeries[] = [
    { key: "estimate", label: t("monteCarloEstimateLabel"), color: "#38bdf8", strokeWidth: 2 },
    { key: "analytic", label: t("monteCarloAnalyticLabel"), color: "#22c55e", strokeWidth: 2, dash: "6 4" },
  ];

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
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("monteCarloEstimate")}</div>
                <div className="stat-value">{num(result.estimate)}</div>
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
                <div className="stat-value">{num(result.standardError)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("monteCarloChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={result.data}
              xKey="n"
              series={series}
              xDomain={[0, sims]}
              isMobile={isMobile}
              tooltipLabel={(x) => `N = ${x.toFixed(0)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
