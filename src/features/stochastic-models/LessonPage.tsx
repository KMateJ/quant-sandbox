import { Suspense } from "react";
import { Link } from "react-router-dom";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";
import type { LessonLocation } from "./stochasticModels.curriculum";

export default function LessonPage({ location }: { location: LessonLocation }) {
  const { t } = useI18n();
  const { lesson, Lesson, chapter, previous, next } = location;

  return (
    <div className="stoch-lesson-page">
      <div className="stoch-lesson-topbar">
        <nav className="stoch-breadcrumb" aria-label={t("stochBreadcrumbLabel")}>
          <Link to="/stochastic-models">{t("stochCurriculum")}</Link>
          <span aria-hidden="true">/</span>
          <span>{t(chapter.titleKey)}</span>
          <span aria-hidden="true">/</span>
          <span className="stoch-breadcrumb-current">{lesson.number}</span>
        </nav>
        <IntuitionTrigger variant="button" />
      </div>

      <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
        <Lesson />
      </Suspense>

      <footer className="stoch-lesson-nav">
        {previous ? (
          <Link className="stoch-lesson-nav-link prev" to={`?lesson=${previous.id}`}>
            <span className="stoch-lesson-nav-dir">← {t("stochPrevLesson")}</span>
            <span className="stoch-lesson-nav-title">{t(previous.titleKey)}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="stoch-lesson-nav-link next" to={`?lesson=${next.id}`}>
            <span className="stoch-lesson-nav-dir">{t("stochNextLessonNav")} →</span>
            <span className="stoch-lesson-nav-title">{t(next.titleKey)}</span>
          </Link>
        ) : (
          <Link className="stoch-lesson-nav-link next" to="/stochastic-models">
            <span className="stoch-lesson-nav-dir">{t("stochBackToCurriculum")} →</span>
            <span className="stoch-lesson-nav-title">{t("stochCurriculum")}</span>
          </Link>
        )}
      </footer>
    </div>
  );
}
