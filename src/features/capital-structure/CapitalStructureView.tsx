import { useMemo, useState } from "react";
import SectionCard from "../../components/SectionCard";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries } from "../../components/charts";
import { useI18n } from "../../i18n";
import {
  capitalStructureCurve,
  leveredCostOfEquity,
  waccFromDebtEquity,
} from "./capitalStructure.math";

const MAX_DE = 3;
const STEPS = 60;

export default function CapitalStructureView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [unleveredKe, setUnleveredKe] = useState(0.1);
  const [costOfDebt, setCostOfDebt] = useState(0.05);
  const [taxRate, setTaxRate] = useState(0.21);
  const [debtEquity, setDebtEquity] = useState(1);

  const keL = leveredCostOfEquity(unleveredKe, costOfDebt, taxRate, debtEquity);
  const wacc = waccFromDebtEquity(unleveredKe, costOfDebt, taxRate, debtEquity);
  const taxShieldWeight = (debtEquity / (1 + debtEquity)) * taxRate;

  const data = useMemo(
    () => capitalStructureCurve(unleveredKe, costOfDebt, taxRate, MAX_DE, STEPS),
    [unleveredKe, costOfDebt, taxRate]
  );

  const ys = data.flatMap((p) => [p.costOfEquity, p.wacc]);
  const xDomain: [number, number] = [0, MAX_DE];
  const yDomain: [number, number] = [Math.min(...ys) * 0.9, Math.max(...ys) * 1.05];

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  const series: ChartSeries[] = [
    { key: "costOfEquity", label: t("capStructKeLabel"), color: "#f97316", strokeWidth: 2.5 },
    { key: "wacc", label: t("capStructWaccLabel"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: debtEquity, color: "#38bdf8", dash: "4 4" },
  ];

  return (
    <div className="view-layout">
      <div className="view-controls">
        <SectionCard title={t("capStructControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("capStructUnleveredKeLabel")} min={0.04} max={0.2} step={0.0025} value={unleveredKe} onChange={setUnleveredKe} formatValue={pct} />
            <SliderField label={t("capStructCostDebtLabel")} min={0.01} max={0.12} step={0.0025} value={costOfDebt} onChange={setCostOfDebt} formatValue={pct} />
            <SliderField label={t("capStructTaxLabel")} min={0} max={0.5} step={0.01} value={taxRate} onChange={setTaxRate} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
            <SliderField label={t("capStructDebtEquityLabel")} min={0} max={MAX_DE} step={0.05} value={debtEquity} onChange={setDebtEquity} formatValue={(v) => v.toFixed(2)} />
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">{t("capStructLeveredKe")}</div>
              <div className="stat-value">{pct(keL)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">{t("capStructWacc")}</div>
              <div className="stat-value">{pct(wacc)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">{t("capStructTaxShield")}</div>
              <div className="stat-value">{`${(taxShieldWeight * 100).toFixed(1)}%`}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="view-main view-main--docked">
        <SectionCard className="chart-card" title={t("capStructChartTitle")}>
          <div className="chart-wrap">
            <LineChart
              data={data}
              xKey="debtEquity"
              series={series}
              xDomain={xDomain}
              yDomain={yDomain}
              referenceLines={referenceLines}
              isMobile={isMobile}
              tooltipLabel={(x) => `D/E = ${x.toFixed(2)}`}
              valueFormat={pct}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
