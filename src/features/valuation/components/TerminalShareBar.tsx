import { useI18n } from "../../../i18n";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// One horizontal bar split into the PV of the forecast years and the PV of the terminal value.
export default function TerminalShareBar({ share }: { share: number }) {
  const { t } = useI18n();
  const s = Math.min(1, Math.max(0, share));
  return (
    <div className="valuation-share" role="img" aria-label={`${t("valuationShareTitle")}: ${t("valuationShareForecast")} ${pct(1 - s)}, ${t("valuationShareTerminal")} ${pct(s)}`}>
      <div className="stat-title">{t("valuationShareTitle")}</div>
      <svg width="100%" height="14" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
        <rect x={0} y={0} width={100 * (1 - s)} height={14} fill="var(--primary)" />
        <rect x={100 * (1 - s)} y={0} width={100 * s} height={14} fill="var(--warning-title)" />
      </svg>
      <div className="valuation-share-legend">
        <span><i style={{ background: "var(--primary)" }} />{t("valuationShareForecast")} {pct(1 - s)}</span>
        <span><i style={{ background: "var(--warning-title)" }} />{t("valuationShareTerminal")} {pct(s)}</span>
      </div>
    </div>
  );
}
