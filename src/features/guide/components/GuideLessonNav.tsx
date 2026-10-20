import type { Ref } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guidePath, guideTrackPath } from "../guide.meta";
import { lessonCode } from "../guide.ui";
import type { GuideLessonMeta, GuideTrackMeta } from "../guide.types";

type GuideLessonNavProps = {
  ref?: Ref<HTMLElement>;
  track: GuideTrackMeta;
  previous?: GuideLessonMeta;
  next?: GuideLessonMeta;
};

/// Previous / next lesson links at the end of a lesson; the last one leads back to its track.
export default function GuideLessonNav({ ref, track, previous, next }: GuideLessonNavProps) {
  const { t } = useI18n();

  return (
    <nav ref={ref} className="guide-lesson-nav ruled-grid" aria-label={t("guideLessonNavLabel")}>
      {previous ? (
        <Link className="guide-lesson-nav-link prev" to={guidePath(previous.id)}>
          <span className="guide-lesson-nav-dir">{t("guidePrevNum", { n: lessonCode(previous.id)?.slice(3) })}</span>
          <span className="guide-lesson-nav-title">{t(previous.titleKey)}</span>
        </Link>
      ) : (
        <span className="guide-lesson-nav-empty" />
      )}
      {next ? (
        <Link className="guide-lesson-nav-link next" to={guidePath(next.id)}>
          <span className="guide-lesson-nav-dir">{t("guideNextNum", { n: lessonCode(next.id)?.slice(3) })}</span>
          <span className="guide-lesson-nav-title">{t(next.titleKey)}</span>
        </Link>
      ) : (
        <Link className="guide-lesson-nav-link next" to={guideTrackPath(track.id)}>
          <span className="guide-lesson-nav-dir">{t("guideNextLesson")}</span>
          <span className="guide-lesson-nav-title">{t("guideBackToTrack", { track: t(track.titleKey) })}</span>
        </Link>
      )}
    </nav>
  );
}
