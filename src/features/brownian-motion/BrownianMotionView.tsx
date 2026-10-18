import { useCallback, useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { BROWNIAN_URL_SCHEMA } from "./brownianMotion.url";
import SliderField from "../../components/SliderField";
import SeedControl from "../../components/SeedControl";
import PathEnsemble from "../../components/simulation/PathEnsemble";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { mean, stdDev } from "../../lib/stats/moments";
import { useI18n } from "../../i18n";
import { brownianTerminalLaw, simulateBrownian, simulateBrownianCloud } from "./brownianMotion.math";
import BarrierPanel from "./components/BarrierPanel";

const STEPS = 200;
const CLOUD = 400;
const COLORS = ["#1d4ed8", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

export default function BrownianMotionView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [url, setUrl] = useUrlState(BROWNIAN_URL_SCHEMA);
  const { mu: drift, sigma: vol, T: horizon, paths, seed, b: barrier } = url;
  const setDrift = (mu: number) => setUrl({ mu });
  const setVol = (sigma: number) => setUrl({ sigma });
  const setHorizon = (T: number) => setUrl({ T });
  const setPaths = (n: number) => setUrl({ paths: n });
  const setSeed = (s: number) => setUrl({ seed: s });

  const { keys, data: pathRows } = useMemo(
    () => simulateBrownian(drift, vol, horizon, STEPS, paths, seed),
    [drift, vol, horizon, paths, seed]
  );
  // The expected value μt next to the paths, so the legend can name both.
  const data = useMemo(() => pathRows.map((row) => ({ ...row, mean: drift * row.t })), [pathRows, drift]);

  const cloud = useMemo(() => simulateBrownianCloud(drift, vol, horizon, STEPS, CLOUD, seed), [drift, vol, horizon, seed]);
  const law = useMemo(() => brownianTerminalLaw(drift, vol, horizon), [drift, vol, horizon]);
  const lawAt = useCallback((t: number) => brownianTerminalLaw(drift, vol, t), [drift, vol]);
  const domain = useMemo((): [number, number] => [law.mean - 4 * law.sd, law.mean + 4 * law.sd], [law]);

  const terminal = useMemo(() => keys.map((k) => data[data.length - 1][k]), [keys, data]);
  const terminalMean = terminal.length ? mean(terminal) : 0;
  const terminalSd = terminal.length > 1 ? stdDev(terminal) : 0;

  const series: ChartSeries[] = [
    ...keys.map((key, i) => ({
      key,
      label: t("brownianMotionPathLabel", { n: i + 1 }),
      color: COLORS[i % COLORS.length],
      strokeWidth: 1.75,
    })),
    { key: "mean", label: t("brownianMotionMeanLine"), color: "var(--text)", strokeWidth: 2, dash: "6 4" },
  ];

  const num = (v: number) => v.toFixed(3);

  return (
    <>
      <PageHeader title={t("brownianMotionTitle")} description={t("brownianMotionDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("brownianMotionControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("brownianMotionDriftLabel")} min={-0.5} max={0.5} step={0.01} value={drift} onChange={setDrift} formatValue={num} />
            <SliderField label={t("brownianMotionVolLabel")} min={0.05} max={1} step={0.05} value={vol} onChange={setVol} formatValue={num} />
            <SliderField label={t("brownianMotionHorizonLabel")} min={0.25} max={5} step={0.25} value={horizon} onChange={setHorizon} formatValue={(v) => `${v.toFixed(2)}`} />
            <SliderField label={t("brownianMotionPathsLabel")} min={1} max={8} step={1} value={paths} onChange={setPaths} formatValue={(v) => `${v.toFixed(0)}`} />
            <SeedControl seed={seed} setSeed={setSeed} compact />
          </div>

          <ControlGroup label={t("brownianMotionMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("brownianMotionTerminalMean")}</div>
                <div className="stat-value">{num(terminalMean)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("brownianMotionTerminalSd")}
                  <InfoTooltip content={t("brownianMotionTerminalSdHelp")} />
                </div>
                <div className="stat-value">{num(terminalSd)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("brownianMotionChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="t"
              series={series}
              xDomain={[0, horizon]}
              isMobile={isMobile}
              legend
              tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>

      <Workspace className="lp-section">
        <ChartContainer title={t("lpEnsembleTitle", { n: CLOUD })}>
          <PathEnsemble values={cloud} pathCount={CLOUD} stepCount={STEPS + 1} horizon={horizon} law={law} lawAt={lawAt} domain={domain}
            initialLevel={law.mean} format={num} isMobile={isMobile} />
        </ChartContainer>
      </Workspace>

      <Workspace className="lp-section">
        <ChartContainer title={t("bmBarrierTitle")}>
          <BarrierPanel values={cloud} pathCount={CLOUD} steps={STEPS} horizon={horizon} drift={drift} vol={vol}
            barrier={barrier} onBarrier={(b) => setUrl({ b })} onZeroDrift={() => setDrift(0)} isMobile={isMobile} />
        </ChartContainer>
      </Workspace>
    </>
  );
}
