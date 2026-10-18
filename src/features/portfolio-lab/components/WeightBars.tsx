import { useI18n } from "../../../i18n";
import { CASH_COLOR } from "../portfolioLab.colors";
import type { Asset } from "../portfolioLab.types";
import WeightBar from "./WeightBar";

type Props = {
  assets: Asset[];
  /// Asset shares then cash, summing to 1.
  allocation: number[];
  onChange: (index: number, value: number) => void;
};

/// The whole allocation as draggable bars (assets + cash). Setting one share rescales the others
/// proportionally, so the stacked strip on top always fills exactly 100%.
export default function WeightBars({ assets, allocation, onChange }: Props) {
  const { t } = useI18n();
  const rows = [
    ...assets.map((a) => ({ key: a.id, label: a.name, color: a.color })),
    { key: "cash", label: t("portfolioCashLabel"), color: CASH_COLOR },
  ];
  const total = allocation.reduce((a, b) => a + b, 0);

  return (
    <div className="weight-rows">
      <div className="pl-weight-stack" aria-hidden="true">
        {rows.map((r, i) => (
          <span key={r.key} style={{ width: `${(allocation[i] ?? 0) * 100}%`, background: r.color }} />
        ))}
      </div>
      {rows.map((r, i) => (
        <WeightBar
          key={r.key}
          label={r.label}
          color={r.color}
          value={allocation[i] ?? 0}
          ariaLabel={t("portfolioWeightBarAria", { name: r.label })}
          onChange={(v) => onChange(i, v)}
        />
      ))}
      <div className="weight-row weight-row--total">
        <span className="weight-row-name">{t("portfolioTotalLabel")}</span>
        <span className="weight-row-pct">{`${(total * 100).toFixed(1)}%`}</span>
      </div>
      <p className="pl-weight-hint">{t("portfolioWeightBarsHint")}</p>
    </div>
  );
}
