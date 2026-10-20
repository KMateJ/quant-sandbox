import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { GUIDE_PATH, guidePath, guideTrackPath, guideTracks, trackLessons } from "../guide/guide.meta";
import { useGuideProgress } from "../guide/useGuideProgress";
import { LESSON_COUNT } from "./home.data";
import { categoryNumber, trackProgress } from "./home.model";

/// Ruled table of the guide tracks with read progress (empty until the browser storage is read).
export default function HomeTracks() {
  const { t } = useI18n();
  const { isRead } = useGuideProgress();

  return (
    <section className="home-tracks">
      <header className="home-section-head">
        <div>
          <p className="home-eyebrow">{t("homeGuidesEyebrow")}</p>
          <h2 className="home-h2">{t("homeGuidesTitle", { n: LESSON_COUNT })}</h2>
        </div>
        <Link to={GUIDE_PATH} className="home-link">{t("homeAllGuides")}</Link>
      </header>
      <div className="home-track-table ruled-grid">
        {guideTracks.map((track, i) => {
          const lessons = trackLessons(track);
          const read = lessons.filter((l) => isRead(l.id)).length;
          const { label, pct } = trackProgress(read, lessons.length);
          const next = lessons.find((l) => !isRead(l.id));
          return (
            <div key={track.id} className="home-track">
              <span className="home-category-num">{categoryNumber(i)}</span>
              <span className="home-track-title">{t(track.titleKey)}</span>
              <span className="home-progress" aria-hidden="true">
                <span className="home-progress-fill" style={{ width: `${pct * 100}%` }} />
              </span>
              <span className="home-track-count">{label}</span>
              <Link to={next && read > 0 ? guidePath(next.id) : guideTrackPath(track.id)} className="home-link">
                {t(read > 0 ? "homeContinue" : "homeBegin")}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
