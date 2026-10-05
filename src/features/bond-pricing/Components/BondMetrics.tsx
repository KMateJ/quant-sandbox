import { InfoTooltip } from "../../../components/ui";
import { useI18n } from "../../../i18n";

type BondMetricsProps = {
  cleanPrice: number;
  ytm: number;
  macaulay: number;
  modified: number;
  convexity: number;
};

/// Compact metrics strip — typography and alignment instead of one card per metric.
export default function BondMetrics({
  cleanPrice,
  ytm,
  macaulay,
  modified,
  convexity,
}: BondMetricsProps) {
  const { t } = useI18n();
  const num = (v: number) => v.toFixed(2);
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  const items = [
    { label: t("bondCleanPrice"), value: num(cleanPrice) },
    { label: t("bondMetricYtm"), value: pct(ytm) },
    { label: t("bondMacaulay"), value: `${num(macaulay)}y` },
    { label: t("bondModified"), value: num(modified) },
    { label: t("bondConvexity"), value: num(convexity), help: t("bondConvexityHelp") },
  ];

  return (
    <div className="result-strip bond-metrics">
      <span className="result-strip-title">{t("bondMetricsTitle")}</span>
      {items.map((m) => (
        <div className="result-strip-item" key={m.label}>
          <span className="result-strip-label">
            {m.label}
            {m.help && <InfoTooltip content={m.help} />}
          </span>
          <span className="result-strip-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
}
