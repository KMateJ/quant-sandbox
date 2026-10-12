import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { lessonPath, type StochChapter } from "./stochasticModels.curriculum";

export default function ChapterCard({ chapter }: { chapter: StochChapter }) {
  const { t } = useI18n();
  const index = String(chapter.number).padStart(2, "0");
  const dimmed = chapter.planned && chapter.lessons.length === 0 && !chapter.standalone;
  const classes = ["stoch-chapter-card"];
  if (dimmed) classes.push("is-planned");
  if (chapter.lessons.length > 0) classes.push("has-lessons");

  return (
    <section className={classes.join(" ")}>
      <header className="stoch-chapter-card-head">
        <span className="stoch-chapter-index">{index}</span>
        <div>
          <h3>{t(chapter.titleKey)}</h3>
          <p>{t(chapter.descKey)}</p>
        </div>
        {chapter.planned && chapter.lessons.length === 0 && (
          <span className="stoch-tag">{t("stochPlanned")}</span>
        )}
      </header>

      {chapter.lessons.length > 0 && (
        <ul className="stoch-lesson-list">
          {chapter.lessons.map((lesson) => {
            const available = lesson.Component !== undefined;
            const inner = (
              <>
                <span className="stoch-lesson-number">{lesson.number}</span>
                <span className="stoch-lesson-body">
                  <span className="stoch-lesson-title">{t(lesson.titleKey)}</span>
                  <span className="stoch-lesson-desc">{t(lesson.descKey)}</span>
                </span>
                {available ? (
                  <span className="stoch-lesson-cta">{t("stochStartLesson")}</span>
                ) : (
                  <span className="stoch-tag">{t("stochPlanned")}</span>
                )}
              </>
            );
            return available ? (
              <li key={lesson.id}>
                <Link className="stoch-lesson-item is-available" to={lessonPath(lesson.id)}>
                  {inner}
                </Link>
              </li>
            ) : (
              <li key={lesson.id}>
                <div className="stoch-lesson-item is-planned">{inner}</div>
              </li>
            );
          })}
        </ul>
      )}

      {chapter.standalone && (
        <Link className="stoch-standalone-link" to={chapter.standalone.route}>
          {t(chapter.standalone.labelKey)}
          <span aria-hidden="true">→</span>
        </Link>
      )}

      {chapter.lessons.length === 0 && (
        <p className="stoch-chapter-foot">
          {chapter.standalone ? t("stochStructuredPlanned") : t("stochChapterPlannedNote")}
        </p>
      )}
    </section>
  );
}
