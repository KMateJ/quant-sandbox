import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import { afterTaxCostOfDebt, waccAt, waccCurve } from "./wacc.math";

const MAX_DEBT_RATIO = 0.8;
const STEPS = 60;

export default function WaccView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [costOfEquity, setCostOfEquity] = useState(0.11);
  const [costOfDebt, setCostOfDebt] = useState(0.05);
  const [taxRate, setTaxRate] = useState(0.21);
  const [debtRatio, setDebtRatio] = useState(0.4);

  const waccValue = waccAt(costOfEquity, costOfDebt, taxRate, debtRatio);
  const afterTaxDebt = afterTaxCostOfDebt(costOfDebt, taxRate);
  const equityWeight = 1 - debtRatio;

  const data = useMemo(
    () => waccCurve(costOfEquity, costOfDebt, taxRate, MAX_DEBT_RATIO, STEPS),
    [costOfEquity, costOfDebt, taxRate]
  );

  const waccs = data.map((p) => p.wacc);
  const xDomain: [number, number] = [0, MAX_DEBT_RATIO];
  const yDomain: [number, number] = [Math.min(...waccs) * 0.95, Math.max(...waccs) * 1.05];

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  const series: ChartSeries[] = [
    { key: "wacc", label: t("waccLabel"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: debtRatio, color: "#38bdf8", dash: "4 4" },
    { axis: "y", value: waccValue, color: "#38bdf8", dash: "4 4" },
  ];

  return (
    <>
      <PageHeader title={t("waccTitle")} description={t("waccDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("waccControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("waccCostEquityLabel")} min={0.03} max={0.2} step={0.0025} value={costOfEquity} onChange={setCostOfEquity} formatValue={pct} />
            <SliderField label={t("waccCostDebtLabel")} min={0.01} max={0.15} step={0.0025} value={costOfDebt} onChange={setCostOfDebt} formatValue={pct} />
            <SliderField label={t("waccTaxLabel")} min={0} max={0.5} step={0.01} value={taxRate} onChange={setTaxRate} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
            <SliderField label={t("waccDebtRatioLabel")} min={0} max={MAX_DEBT_RATIO} step={0.02} value={debtRatio} onChange={setDebtRatio} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
          </div>

          <ControlGroup label={t("waccMetricsLabel")}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">{t("waccValue")}</div>
                <div className="stat-value">{pct(waccValue)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("waccAfterTaxDebt")}</div>
                <div className="stat-value">{pct(afterTaxDebt)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">{t("waccEquityWeight")}</div>
                <div className="stat-value">{`${(equityWeight * 100).toFixed(0)}%`}</div>
              </div>
            </div>
          </ControlGroup>
        </Panel>

        <ChartContainer title={t("waccChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="debtRatio"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `${t("waccDebtRatioLabel")} = ${(x * 100).toFixed(0)}%`}
              valueFormat={pct}
            />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
