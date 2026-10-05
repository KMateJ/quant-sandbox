import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { simulateDeltaHedge } from "./deltaHedging.math";

export default function DeltaHedgingView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [s0, setS0] = useState(100);
  const [strike, setStrike] = useState(100);
  const [maturity, setMaturity] = useState(1);
  const [rate, setRate] = useState(0.03);
  const [vol, setVol] = useState(0.2);
  const [steps, setSteps] = useState(52);
  const [seed, setSeed] = useState(7);

  const result = useMemo(
    () => simulateDeltaHedge(s0, strike, maturity, rate, vol, steps, seed),
    [s0, strike, maturity, rate, vol, steps, seed]
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const num = (v: number) => v.toFixed(3);

  const series: ChartSeries[] = [
    { key: "option", label: t("deltaHedgingOptionLabel"), color: "#22c55e", strokeWidth: 2.5 },
    { key: "replicating", label: t("deltaHedgingReplicatingLabel"), color: "#38bdf8", strokeWidth: 2, dash: "6 4" },
  ];

  return (
    <>
      <PageHeader title={t("deltaHedgingTitle")} description={t("deltaHedgingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("deltaHedgingControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("deltaHedgingS0Label")} min={10} max={300} step={5} value={s0} onChange={setS0} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("deltaHedgingStrikeLabel")} min={10} max={300} step={5} value={strike} onChange={setStrike} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("deltaHedgingMaturityLabel")} min={0.25} max={3} step={0.25} value={maturity} onChange={setMaturity} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("deltaHedgingRateLabel")} min={0} max={0.1} step={0.0025} value={rate} onChange={setRate} formatValue={pct} />
            <SliderField label={t("deltaHedgingVolLabel")} min={0.05} max={0.6} step={0.01} value={vol} onChange={setVol} formatValue={pct} />
            <SliderField label={t("deltaHedgingStepsLabel")} min={4} max={252} step={1} value={steps} onChange={setSteps} formatValue={(v) => v.toFixed(0)} />
            <SliderField label={t("deltaHedgingSeedLabel")} min={1} max={100} step={1} value={seed} onChange={setSeed} formatValue={(v) => `${v.toFixed(0)}`} />
          </div>

          <ControlGroup label={t("deltaHedgingMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("deltaHedgingPayoff")}</div>
                <div className="stat-value">{num(result.payoff)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("deltaHedgingTerminalValue")}</div>
                <div className="stat-value">{num(result.terminalValue)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("deltaHedgingHedgeError")}
                  <InfoTooltip content={t("deltaHedgingHedgeErrorHelp")} />
                </div>
                <div className="stat-value">{num(result.hedgeError)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("deltaHedgingChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={result.data}
              xKey="t"
              series={series}
              xDomain={[0, maturity]}
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
