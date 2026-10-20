import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guideTrackPath } from "../guide.meta";
import type { GuideLessonLocation } from "../guide.types";

/// Lesson header: mono breadcrumb (Guides / track / number), display title and reading meta.
export default function GuideLessonHeader({ location, minutes }: { location: GuideLessonLocation; minutes: number }) {
  const { t } = useI18n();
  const { lesson, track, index } = location;

  return (
    <header className="guide-lesson-head">
      <nav className="guide-breadcrumb" aria-label={t("guideBreadcrumbLabel")}>
        <span>{t("guideBreadcrumbRoot")}</span>
        <span aria-hidden="true">/</span>
        <Link to={guideTrackPath(track.id)}>{t(track.titleKey)}</Link>
        <span aria-hidden="true">/</span>
        <span className="guide-breadcrumb-num">{String(index + 1).padStart(2, "0")}</span>
      </nav>
      <h1 className="guide-lesson-title">{t(lesson.titleKey)}</h1>
      <p className="guide-lesson-meta">
        {t("guideLessonOf", { current: index + 1, total: track.lessons.length })}
        <span aria-hidden="true"> · </span>
        {t("guideMinRead", { min: minutes })}
      </p>
    </header>
  );
}
