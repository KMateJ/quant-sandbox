import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { mean, stdDev } from "../../lib/stats/moments";
import { useI18n } from "../../i18n";
import { simulateGbm } from "./gbm.math";

const STEPS = 200;
const COLORS = ["#1d4ed8", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

export default function GbmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [s0, setS0] = useState(100);
  const [drift, setDrift] = useState(0.08);
  const [vol, setVol] = useState(0.25);
  const [horizon, setHorizon] = useState(1);
  const [paths, setPaths] = useState(6);
  const [seed, setSeed] = useState(7);

  const { keys, data } = useMemo(
    () => simulateGbm(s0, drift, vol, horizon, STEPS, paths, seed),
    [s0, drift, vol, horizon, paths, seed]
  );

  const terminal = useMemo(() => keys.map((k) => data[data.length - 1][k]), [keys, data]);
  const terminalMean = terminal.length ? mean(terminal) : 0;
  const terminalSd = terminal.length > 1 ? stdDev(terminal) : 0;
  const theoreticalMean = s0 * Math.exp(drift * horizon);

  const series: ChartSeries[] = [
    ...keys.map((key, i) => ({
      key,
      label: key,
      color: COLORS[i % COLORS.length],
      strokeWidth: 1.5,
    })),
    { key: "mean", label: t("gbmMeanLabel"), color: "#e2e8f0", strokeWidth: 2.5, dash: "6 4" },
  ];

  const num = (v: number) => v.toFixed(2);

  return (
    <>
      <PageHeader title={t("gbmTitle")} description={t("gbmDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("gbmControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("gbmS0Label")} min={10} max={500} step={5} value={s0} onChange={setS0} formatValue={num} />
            <SliderField label={t("gbmDriftLabel")} min={-0.3} max={0.3} step={0.01} value={drift} onChange={setDrift} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("gbmVolLabel")} min={0.05} max={0.8} step={0.05} value={vol} onChange={setVol} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("gbmHorizonLabel")} min={0.25} max={5} step={0.25} value={horizon} onChange={setHorizon} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("gbmPathsLabel")} min={1} max={8} step={1} value={paths} onChange={setPaths} formatValue={(v) => `${v.toFixed(0)}`} />
            <SliderField label={t("gbmSeedLabel")} min={1} max={100} step={1} value={seed} onChange={setSeed} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("gbmMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("gbmTerminalMean")}</div>
                <div className="stat-value">{num(terminalMean)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("gbmTheoreticalMean")}</div>
                <div className="stat-value">{num(theoreticalMean)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("gbmTerminalSd")}
                  <InfoTooltip content={t("gbmTerminalSdHelp")} />
                </div>
                <div className="stat-value">{num(terminalSd)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("gbmChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="t"
              series={series}
              xDomain={[0, horizon]}
              isMobile={isMobile}
              legend={false}
              tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
