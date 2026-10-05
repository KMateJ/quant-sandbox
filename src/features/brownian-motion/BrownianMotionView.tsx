import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { mean, stdDev } from "../../lib/stats/moments";
import { useI18n } from "../../i18n";
import { simulateBrownian } from "./brownianMotion.math";

const STEPS = 200;
const COLORS = ["#1d4ed8", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

export default function BrownianMotionView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [drift, setDrift] = useState(0.05);
  const [vol, setVol] = useState(0.3);
  const [horizon, setHorizon] = useState(1);
  const [paths, setPaths] = useState(6);
  const [seed, setSeed] = useState(7);

  const { keys, data } = useMemo(
    () => simulateBrownian(drift, vol, horizon, STEPS, paths, seed),
    [drift, vol, horizon, paths, seed]
  );

  const terminal = useMemo(() => keys.map((k) => data[data.length - 1][k]), [keys, data]);
  const terminalMean = terminal.length ? mean(terminal) : 0;
  const terminalSd = terminal.length > 1 ? stdDev(terminal) : 0;

  const series: ChartSeries[] = keys.map((key, i) => ({
    key,
    label: key,
    color: COLORS[i % COLORS.length],
    strokeWidth: 1.75,
  }));

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
            <SliderField label={t("brownianMotionSeedLabel")} min={1} max={100} step={1} value={seed} onChange={setSeed} formatValue={(v) => `${v.toFixed(0)}`} />
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
