import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup, InfoTooltip } from "../../components/ui";
import { useI18n } from "../../i18n";
import { alpha, expectedReturn, marketRiskPremium, securityMarketLine } from "./capm.math";

const MAX_BETA = 2;
const STEPS = 60;

export default function CapmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [riskFree, setRiskFree] = useState(0.03);
  const [marketReturn, setMarketReturn] = useState(0.09);
  const [beta, setBeta] = useState(1.1);
  const [actualReturn, setActualReturn] = useState(0.1);

  const required = expectedReturn(riskFree, beta, marketReturn);
  const premium = marketRiskPremium(riskFree, marketReturn);
  const jensenAlpha = alpha(actualReturn, riskFree, beta, marketReturn);

  const data = useMemo(
    () => securityMarketLine(riskFree, marketReturn, MAX_BETA, STEPS),
    [riskFree, marketReturn]
  );

  const yTop = expectedReturn(riskFree, MAX_BETA, marketReturn);
  const xDomain: [number, number] = [0, MAX_BETA];
  const yDomain: [number, number] = [Math.min(riskFree, 0), Math.max(yTop, actualReturn) * 1.05];

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const series: ChartSeries[] = [
    { key: "ret", label: t("capmSmlLabel"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: beta, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: required, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: actualReturn, color: "#f97316", dash: "2 4" },
  ];

  return (
    <>
      <PageHeader title={t("capmTitle")} description={t("capmDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("capmControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("capmRiskFreeLabel")} min={0} max={0.1} step={0.0025} value={riskFree} onChange={setRiskFree} formatValue={pct} />
            <SliderField label={t("capmMarketLabel")} min={0} max={0.2} step={0.005} value={marketReturn} onChange={setMarketReturn} formatValue={pct} />
            <SliderField label={t("capmBetaLabel")} min={0} max={MAX_BETA} step={0.05} value={beta} onChange={setBeta} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("capmActualLabel")} min={0} max={0.25} step={0.005} value={actualReturn} onChange={setActualReturn} formatValue={pct} />
          </div>

          <ControlGroup label={t("capmMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("capmExpectedReturn")}</div>
                <div className="stat-value">{pct(required)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("capmPremium")}</div>
                <div className="stat-value">{pct(premium)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">
                  {t("capmAlpha")}
                  <InfoTooltip content={t("capmAlphaHelp")} />
                </div>
                <div className="stat-value">{pct(jensenAlpha)}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("capmChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="beta"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("capmBetaLabel")} = ${x.toFixed(2)}`}
              valueFormat={pct}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
