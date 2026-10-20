import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guidePath } from "../guide.meta";
import type { GuideLessonMeta } from "../guide.types";

type Props = { lessons: GuideLessonMeta[]; done: number; next: number };

/// Two ruled cells: reading progress, and a solid block linking to the next unread lesson (or the checks when done).
export default function GuideTrackProgress({ lessons, done, next }: Props) {
  const { t } = useI18n();
  const total = lessons.length;
  const up = lessons[next];

  return (
    <div className="guide-track-progress ruled-grid">
      <div className="guide-track-progress-cell">
        <div className="guide-track-progress-label">
          <span>{t("guideYourProgress")}</span>
          <span className="guide-mono">{t("guideProgress", { done, total })}</span>
        </div>
        <div
          className="rule-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label={t("guideYourProgress")}
        >
          <div className="rule-progress-fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </div>
      </div>
      {up ? (
        <Link className="guide-track-next" to={guidePath(up.id)}>
          <span className="eyebrow">{t("guideUpNext", { n: String(next + 1).padStart(2, "0") })}</span>
          <span className="guide-track-next-title">{t(up.titleKey)}</span>
        </Link>
      ) : (
        <a className="guide-track-next" href="#checks">
          <span className="eyebrow">{t("guideTrackComplete")}</span>
          <span className="guide-track-next-title">{t("guideReviewChecks")}</span>
        </a>
      )}
    </div>
  );
}
