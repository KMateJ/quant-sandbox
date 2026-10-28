import { useI18n } from "../../../../i18n";

/// Monthly residual (fund minus replica) as thin bars, tinted by sign.
export default function ResidualStrip({ residuals }: { residuals: number[] }) {
  const { t } = useI18n();
  const max = Math.max(1e-9, ...residuals.map(Math.abs));
  return (
    <svg className="ffm-residuals" viewBox={`0 -50 ${residuals.length} 100`} preserveAspectRatio="none" role="img" aria-label={t("ffmResidualsAria")}>
      <line x1={0} x2={residuals.length} y1={0} y2={0} className="ffm-residuals-zero" vectorEffect="non-scaling-stroke" />
      {residuals.map((r, i) => (
        <rect key={i} x={i} width={1} y={r >= 0 ? (-r / max) * 48 : 0} height={(Math.abs(r) / max) * 48} className={r >= 0 ? "is-pos" : "is-neg"} />
      ))}
    </svg>
  );
}
