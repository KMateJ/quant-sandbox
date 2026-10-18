import { useI18n } from "../../../../../i18n";
import { CAPITAL_SPLIT, type CapitalSplit } from "../../../guide.interactive.capitalSplit.math";
import { pct } from "../figureFormat";

/// Rates drawn on a 0–30% scale.
const RATE_MAX = 0.3;
const at = (rate: number) => `${(Math.min(rate, RATE_MAX) / RATE_MAX) * 100}%`;

/// The three costs of capital as horizontal bars against the unlevered cost r_U.
export default function CapitalSplitCosts({ split }: { split: CapitalSplit }) {
  const { t } = useI18n();
  const rows = [
    { key: "equity", label: t("ixCsCostEquity"), value: split.rE },
    { key: "debt", label: t("ixCsCostDebt"), value: split.rDAfterTax },
    { key: "wacc", label: "WACC", value: split.wacc },
  ];

  return (
    <div className="cs-costs">
      {rows.map((row) => (
        <div key={row.key} className="cs-cost">
          <span className="cs-cost-label">{row.label}</span>
          <div className="cs-cost-track">
            <div className={`cs-cost-bar cs-cost-bar--${row.key}`} style={{ width: at(row.value) }} />
            <span className="cs-ru-mark" style={{ left: at(CAPITAL_SPLIT.rU) }} title={t("ixCsRuMark")} />
          </div>
          <span className="cs-cost-value">{pct(row.value, 2)}</span>
        </div>
      ))}
    </div>
  );
}
