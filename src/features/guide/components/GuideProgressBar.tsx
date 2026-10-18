import { useI18n } from "../../../i18n";

/// Thin read-progress line with its "n of N read" caption.
export default function GuideProgressBar({ done, total }: { done: number; total: number }) {
  const { t } = useI18n();
  const label = t("guideProgress", { done, total });

  return (
    <div className="guide-progress">
      <div
        className="guide-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label}
      >
        <div className="guide-progress-fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
      <span className="guide-progress-label">{label}</span>
    </div>
  );
}
