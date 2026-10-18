import SliderField from "../../components/SliderField";
import { Panel } from "../../components/layout";
import { ControlGroup, SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import { MAX_DEBT_RATIO, type WaccLab, type WaccMode } from "./useWaccLab";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;

/// Inputs and headline numbers of the WACC lab.
export default function WaccControls({ lab }: { lab: WaccLab }) {
  const { t } = useI18n();
  const { realistic } = lab;
  const stats = [
    { title: t("waccValue"), value: pct(lab.waccValue) },
    { title: t("waccAfterTaxDebt"), value: pct(lab.afterTaxDebt) },
    { title: t("waccEquityWeight"), value: pct0(lab.equityWeight) },
    ...(realistic ? [{ title: t("waccCostEquitySeries"), value: pct(lab.ke) }] : []),
  ];

  return (
    <Panel title={t("waccControlsTitle")}>
      <ControlGroup label={t("waccModeLabel")}>
        <SegmentedControl<WaccMode>
          ariaLabel={t("waccModeLabel")}
          value={lab.mode}
          onChange={lab.setMode}
          options={[{ value: "constant", label: t("waccModeConstant") }, { value: "realistic", label: t("waccModeRealistic") }]}
        />
        {realistic && <p className="control-hint">{t("waccRealisticNote")}</p>}
      </ControlGroup>
      <div className="controls-grid">
        <SliderField label={t(realistic ? "waccRuLabel" : "waccCostEquityLabel")} min={0.03} max={0.2} step={0.0025} value={lab.costOfEquity} onChange={lab.setCostOfEquity} formatValue={pct} />
        <SliderField label={t(realistic ? "waccBaseRateLabel" : "waccCostDebtLabel")} min={0.01} max={0.15} step={0.0025} value={lab.costOfDebt} onChange={lab.setCostOfDebt} formatValue={pct} />
        <SliderField label={t("waccTaxLabel")} min={0} max={0.5} step={0.01} value={lab.taxRate} onChange={lab.setTaxRate} formatValue={pct0} />
        <SliderField label={t("waccDebtRatioLabel")} min={0} max={MAX_DEBT_RATIO} step={0.01} value={lab.debtRatio} onChange={lab.setDebtRatio} formatValue={pct0} />
      </div>

      <ControlGroup label={t("waccMetricsLabel")}>
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.title} className="stat-card">
              <div className="stat-title">{s.title}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      </ControlGroup>
    </Panel>
  );
}
