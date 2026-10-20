import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { moduleById, type ModuleDef } from "../../../modules/registry";
import { guidePath } from "../guide.meta";
import type { GuideLessonMeta } from "../guide.types";

type Props = { lessons: GuideLessonMeta[]; read: boolean[]; next: number };

/// The track's lessons as a ruled, ordered table; each whole row links to its lesson.
export default function GuideLessonTable({ lessons, read, next }: Props) {
  const { t } = useI18n();

  return (
    <section className="guide-lessons" aria-labelledby="guide-lessons-title">
      <div className="guide-section-head">
        <h2 id="guide-lessons-title" className="guide-section-title">{t("guideLessonsHeading", { n: lessons.length })}</h2>
        <p className="guide-section-note">{t("guideLessonsNote")}</p>
      </div>
      <ol className="guide-list">
        {lessons.map((lesson, i) => {
          const isNext = i === next;
          const labs = lesson.labs.map(moduleById).filter((m): m is ModuleDef => Boolean(m));
          return (
            <li key={lesson.id}>
              <Link className="guide-row" to={guidePath(lesson.id)} data-next={isNext || undefined}>
                <span className="guide-row-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="guide-row-text">
                  <span className="guide-row-title">{t(lesson.titleKey)}</span>
                  <span className="guide-row-desc">{t(lesson.descKey)}</span>
                </span>
                <span className="guide-row-labs">{labs.map((m) => t(m.navKey)).join(" · ")}</span>
                <span className="guide-row-status">
                  {isNext ? t("guideUpNextShort") : read[i] ? t("guideLessonRead") : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
