import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guidePath, trackLessons } from "../guide.meta";
import type { GuideTrackMeta } from "../guide.types";
import { useGuideProgress } from "../useGuideProgress";
import GuideProgressBar from "./GuideProgressBar";

/// One track: header with progress, then its lessons as a numbered list of links.
export default function GuideTrackSection({ track }: { track: GuideTrackMeta }) {
  const { t } = useI18n();
  const { isRead } = useGuideProgress();
  const lessons = trackLessons(track);
  const done = lessons.filter((l) => isRead(l.id)).length;
  const nextUp = lessons.find((l) => !isRead(l.id)) ?? lessons[0];

  return (
    <section className="guide-track" aria-labelledby={`track-${track.id}`}>
      <header className="guide-track-head">
        <div className="guide-track-text">
          <h2 id={`track-${track.id}`} className="guide-track-title">{t(track.titleKey)}</h2>
          <p className="guide-track-desc">{t(track.descKey)}</p>
        </div>
        {nextUp && (
          <Link className="guide-track-cta" to={guidePath(nextUp.id)}>
            {t(done > 0 ? "guideContinue" : "guideStart")}
          </Link>
        )}
      </header>
      <GuideProgressBar done={done} total={lessons.length} />

      <ol className="guide-list">
        {lessons.map((lesson, i) => {
          const read = isRead(lesson.id);
          return (
            <li key={lesson.id}>
              <Link className="guide-row" to={guidePath(lesson.id)}>
                <span className={read ? "guide-row-num read" : "guide-row-num"} aria-hidden="true">
                  {read ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <span className="guide-row-text">
                  <span className="guide-row-title">{t(lesson.titleKey)}</span>
                  <span className="guide-row-desc">{t(lesson.descKey)}</span>
                </span>
                {read && <span className="guide-row-status">{t("guideLessonRead")}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
