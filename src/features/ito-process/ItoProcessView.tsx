import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { simulateLogGbm } from "./itoProcess.math";

const STEPS = 200;
const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#22d3ee"];

export default function ItoProcessView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [s0, setS0] = useState(100);
  const [drift, setDrift] = useState(0.1);
  const [vol, setVol] = useState(0.3);
  const [horizon, setHorizon] = useState(1);
  const [paths, setPaths] = useState(4);
  const [seed, setSeed] = useState(7);

  const { keys, data } = useMemo(
    () => simulateLogGbm(s0, drift, vol, horizon, STEPS, paths, seed),
    [s0, drift, vol, horizon, paths, seed]
  );

  const correction = -0.5 * vol * vol;
  const correctedDrift = drift + correction;

  const series: ChartSeries[] = [
    ...keys.map((key, i) => ({
      key,
      label: key,
      color: COLORS[i % COLORS.length],
      strokeWidth: 1.25,
      legend: false,
    })),
    { key: "correct", label: t("itoProcessCorrectLabel"), color: "#22c55e", strokeWidth: 2.5 },
    { key: "naive", label: t("itoProcessNaiveLabel"), color: "#f59e0b", strokeWidth: 2, dash: "6 4" },
  ];

  const num = (v: number) => v.toFixed(3);

  return (
    <>
      <PageHeader title={t("itoProcessTitle")} description={t("itoProcessDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("itoProcessControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("itoProcessS0Label")} min={10} max={500} step={5} value={s0} onChange={setS0} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("itoProcessDriftLabel")} min={-0.3} max={0.4} step={0.01} value={drift} onChange={setDrift} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("itoProcessVolLabel")} min={0.05} max={0.8} step={0.05} value={vol} onChange={setVol} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("itoProcessHorizonLabel")} min={0.25} max={5} step={0.25} value={horizon} onChange={setHorizon} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("itoProcessPathsLabel")} min={1} max={6} step={1} value={paths} onChange={setPaths} formatValue={(v) => `${v.toFixed(0)}`} />
            <SliderField label={t("itoProcessSeedLabel")} min={1} max={100} step={1} value={seed} onChange={setSeed} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("itoProcessMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("itoProcessNaiveDrift")}</div>
                <div className="stat-value">{num(drift)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("itoProcessCorrectedDrift")}</div>
                <div className="stat-value">{num(correctedDrift)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("itoProcessCorrection")}
                  <InfoTooltip content={t("itoProcessCorrectionHelp")} />
                </div>
                <div className="stat-value">{num(correction)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("itoProcessChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="t"
              series={series}
              xDomain={[0, horizon]}
              isMobile={isMobile}
              tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
              valueFormat={num}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
