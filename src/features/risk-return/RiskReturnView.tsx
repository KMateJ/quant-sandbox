import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import {
  allocationReturn,
  allocationVolatility,
  capitalAllocationLine,
  riskyAssetSharpe,
} from "./riskReturn.math";

const MAX_WEIGHT = 2;
const STEPS = 60;

export default function RiskReturnView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [mu, setMu] = useState(0.09);
  const [sigma, setSigma] = useState(0.18);
  const [riskFree, setRiskFree] = useState(0.03);
  const [weight, setWeight] = useState(1);

  const sharpe = useMemo(() => riskyAssetSharpe(mu, sigma, riskFree), [mu, sigma, riskFree]);
  const portReturn = allocationReturn(mu, riskFree, weight);
  const portVol = allocationVolatility(sigma, weight);

  const data = useMemo(
    () => capitalAllocationLine(mu, sigma, riskFree, MAX_WEIGHT, STEPS),
    [mu, sigma, riskFree]
  );

  const maxVol = allocationVolatility(sigma, MAX_WEIGHT);
  const yTop = allocationReturn(mu, riskFree, MAX_WEIGHT);
  const xDomain: [number, number] = [0, (maxVol || 0.01) * 1.05];
  const yDomain: [number, number] = [Math.min(riskFree, 0), Math.max(yTop, riskFree) * 1.05];

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const series: ChartSeries[] = [
    { key: "ret", label: t("riskReturnCalLabel"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: portVol, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: portReturn, color: "#38bdf8", dash: "4 4" },
  ];

  return (
    <>
      <PageHeader title={t("riskReturnTitle")} description={t("riskReturnDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("riskReturnControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("riskReturnMuLabel")} min={0} max={0.3} step={0.005} value={mu} onChange={setMu} formatValue={pct} />
            <SliderField label={t("riskReturnSigmaLabel")} min={0.01} max={0.5} step={0.005} value={sigma} onChange={setSigma} formatValue={pct} />
            <SliderField label={t("riskReturnRiskFreeLabel")} min={0} max={0.1} step={0.0025} value={riskFree} onChange={setRiskFree} formatValue={pct} />
            <SliderField label={t("riskReturnWeightLabel")} min={0} max={MAX_WEIGHT} step={0.05} value={weight} onChange={setWeight} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
          </div>

          <ControlGroup label={t("riskReturnMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">
                  {t("riskReturnSharpe")}
                  <InfoTooltip content={t("riskReturnSharpeHelp")} />
                </div>
                <div className="stat-value">{sharpe.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("riskReturnPortReturn")}</div>
                <div className="stat-value">{pct(portReturn)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("riskReturnPortVol")}</div>
                <div className="stat-value">{pct(portVol)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("riskReturnChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="vol"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("riskReturnPortVol")} = ${pct(x)}`}
              valueFormat={pct}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
