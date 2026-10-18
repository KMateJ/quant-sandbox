import SliderField from "../../components/SliderField";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { MAX_DE, type CapitalStructureLab } from "./useCapitalStructureLab";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

/// The MM II inputs and headline numbers (unchanged from the original lab).
export default function CapitalStructureControls({ lab }: { lab: CapitalStructureLab }) {
  const { t } = useI18n();
  return (
    <Panel title={t("capStructControlsTitle")}>
      <div className="controls-grid">
        <SliderField label={t("capStructUnleveredKeLabel")} min={0.04} max={0.2} step={0.0025} value={lab.unleveredKe} onChange={lab.setUnleveredKe} formatValue={pct} />
        <SliderField label={t("capStructCostDebtLabel")} min={0.01} max={0.12} step={0.0025} value={lab.costOfDebt} onChange={lab.setCostOfDebt} formatValue={pct} />
        <SliderField label={t("capStructTaxLabel")} min={0} max={0.5} step={0.01} value={lab.taxRate} onChange={lab.setTaxRate} formatValue={(v) => `${(v * 100).toFixed(0)}%`} />
        <SliderField label={t("capStructDebtEquityLabel")} min={0} max={MAX_DE} step={0.05} value={lab.debtEquity} onChange={lab.setDebtEquity} formatValue={(v) => v.toFixed(2)} />
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-title">{t("capStructLeveredKe")}</div>
          <div className="stat-value">{pct(lab.keL)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("capStructWacc")}</div>
          <div className="stat-value">{pct(lab.wacc)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">{t("capStructTaxShield")}</div>
          <div className="stat-value">{`${(lab.taxShieldWeight * 100).toFixed(1)}%`}</div>
        </div>
      </div>
    </Panel>
  );
}
