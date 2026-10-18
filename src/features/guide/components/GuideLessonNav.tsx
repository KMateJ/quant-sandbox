import type { Ref } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { GUIDE_PATH, guidePath } from "../guide.meta";
import type { GuideLessonMeta } from "../guide.types";

type GuideLessonNavProps = {
  ref?: Ref<HTMLElement>;
  previous?: GuideLessonMeta;
  next?: GuideLessonMeta;
};

/// Previous / next lesson links at the end of a lesson; the last one leads back to the index.
export default function GuideLessonNav({ ref, previous, next }: GuideLessonNavProps) {
  const { t } = useI18n();

  return (
    <nav ref={ref} className="guide-lesson-nav" aria-label={t("guideLessonNavLabel")}>
      {previous ? (
        <Link className="guide-lesson-nav-link prev" to={guidePath(previous.id)}>
          <span className="guide-lesson-nav-dir">← {t("guidePrevLesson")}</span>
          <span className="guide-lesson-nav-title">{t(previous.titleKey)}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="guide-lesson-nav-link next" to={guidePath(next.id)}>
          <span className="guide-lesson-nav-dir">{t("guideNextLesson")} →</span>
          <span className="guide-lesson-nav-title">{t(next.titleKey)}</span>
        </Link>
      ) : (
        <Link className="guide-lesson-nav-link next" to={GUIDE_PATH}>
          <span className="guide-lesson-nav-dir">{t("guideBackToIndex")} →</span>
          <span className="guide-lesson-nav-title">{t("navGuide")}</span>
        </Link>
      )}
    </nav>
  );
}
