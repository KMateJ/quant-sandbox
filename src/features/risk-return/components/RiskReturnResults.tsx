import { useI18n } from "../../../i18n";

type RiskReturnResultsProps = {
  portReturn: number;
  portVol: number;
  sharpe: number;
  weight: number;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Compact result strip below the chart (replaces the large KPI cards).
export default function RiskReturnResults({ portReturn, portVol, sharpe, weight }: RiskReturnResultsProps) {
  const { t } = useI18n();
  const items = [
    { label: t("riskReturnResultReturn"), value: pct(portReturn) },
    { label: t("riskReturnResultVol"), value: pct(portVol) },
    { label: t("riskReturnResultSharpe"), value: sharpe.toFixed(2) },
    { label: t("riskReturnResultWeight"), value: `${(weight * 100).toFixed(0)}%` },
  ];
  return (
    <div className="result-strip">
      <div className="result-strip-title">{t("riskReturnResultTitle")}</div>
      {items.map((it) => (
        <div key={it.label} className="result-strip-item">
          <span className="result-strip-label">{it.label}</span>
          <span className="result-strip-value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
