import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guideTrackPath } from "../guide.meta";
import type { GuideLessonLocation } from "../guide.types";
import { guideContent } from "../../../Language/guides";
import { useMarkReadAtEnd } from "../useGuideProgress";
import { useGuideToc } from "../useGuideToc";
import { checksAnchor, collectChecks } from "../guide.check.logic";
import GuideBlocks from "./GuideBlocks";
import GuideLessonNav from "./GuideLessonNav";
import GuideRail from "./GuideRail";

/// A single lesson: reading column with series context, plus a contents / labs rail.
export default function GuideLessonPage({ location }: { location: GuideLessonLocation }) {
  const { t, language } = useI18n();
  const { lesson, track, index, previous, next } = location;
  const bodyRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const checkCount = collectChecks([lesson.id], guideContent, language).length;
  const toc = useGuideToc(bodyRef, `${lesson.id}:${language}`);
  useMarkReadAtEnd(endRef, lesson.id);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-shell">
      <div className="page-content guide-lesson">
        <article className="guide-article">
          <header className="guide-lesson-head">
            <nav className="guide-breadcrumb" aria-label={t("guideBreadcrumbLabel")}>
              <span>{t("navGuide")}</span>
              <span aria-hidden="true">/</span>
              <Link to={guideTrackPath(track.id)}>{t(track.titleKey)}</Link>
            </nav>
            <h1 className="guide-lesson-title">{t(lesson.titleKey)}</h1>
            <p className="guide-lesson-meta">
              {t("guideLessonOf", { current: index + 1, total: track.lessons.length })}
              <span aria-hidden="true"> · </span>
              {t("guideMinRead", { min: toc.minutes })}
            </p>
          </header>

          <div ref={bodyRef} className="guide-article-body">
            <GuideBlocks blocks={guideContent[lesson.id][language]} lessonId={lesson.id} />
          </div>

          {checkCount > 0 && (
            <Link className="guide-lesson-checks-link" to={`${guideTrackPath(track.id)}#${checksAnchor(lesson.id)}`}>
              {t("guideLessonChecksLink", { n: checkCount })}
            </Link>
          )}

          <GuideLessonNav ref={endRef} track={track} previous={previous} next={next} />
        </article>

        <GuideRail lessonId={lesson.id} headings={toc.headings} activeId={toc.activeId} labs={lesson.labs} />
      </div>
    </div>
  );
}
