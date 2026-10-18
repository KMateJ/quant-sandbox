import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { GUIDE_PATH } from "../guide.meta";
import type { GuideLessonLocation } from "../guide.types";
import { guideRenderers } from "../GuideRegistry";
import { useMarkReadAtEnd } from "../useGuideProgress";
import { useGuideToc } from "../useGuideToc";
import GuideLessonNav from "./GuideLessonNav";
import GuideRail from "./GuideRail";

/// A single lesson: reading column with series context, plus a contents / labs rail.
export default function GuideLessonPage({ location }: { location: GuideLessonLocation }) {
  const { t, language } = useI18n();
  const { lesson, track, index, previous, next } = location;
  const bodyRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLElement>(null);
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
              <Link to={GUIDE_PATH}>{t("navGuide")}</Link>
              <span aria-hidden="true">/</span>
              <span>{t(track.titleKey)}</span>
            </nav>
            <h1 className="guide-lesson-title">{t(lesson.titleKey)}</h1>
            <p className="guide-lesson-meta">
              {t("guideLessonOf", { current: index + 1, total: track.lessons.length })}
              <span aria-hidden="true"> · </span>
              {t("guideMinRead", { min: toc.minutes })}
            </p>
          </header>

          <div ref={bodyRef} className="guide-article-body">
            {guideRenderers[lesson.id]()}
          </div>

          <GuideLessonNav ref={endRef} previous={previous} next={next} />
        </article>

        <GuideRail headings={toc.headings} activeId={toc.activeId} labs={lesson.labs} />
      </div>
    </div>
  );
}
