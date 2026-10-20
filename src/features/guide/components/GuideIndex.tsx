import { useI18n } from "../../../i18n";
import { guideTracks, trackLessons } from "../guide.meta";
import type { GuideTrackMeta } from "../guide.types";
import { useGuideProgress } from "../useGuideProgress";
import GuideLessonTable from "./GuideLessonTable";
import GuideTrackChecks from "./GuideTrackChecks";
import GuideTrackProgress from "./GuideTrackProgress";

/// Landing page of one guide track: header, progress with the next lesson, the ordered lessons, and "Check yourself".
export default function GuideIndex({ track }: { track: GuideTrackMeta }) {
  const { t } = useI18n();
  const { isRead } = useGuideProgress();
  const lessons = trackLessons(track);
  const read = lessons.map((l) => isRead(l.id));
  const done = read.filter(Boolean).length;
  const next = read.indexOf(false);
  const number = String(guideTracks.indexOf(track) + 1).padStart(2, "0");

  return (
    <div className="page-shell">
      <div className="page-content guide-page">
        <header className="guide-track-head">
          <p className="eyebrow">{t("guideTrackEyebrow", { n: number })}</p>
          <h1 className="guide-track-title">{t(track.titleKey)}</h1>
          <p className="guide-track-desc">{t(track.descKey)}</p>
        </header>
        {lessons.length === 0 ? (
          <p className="guide-track-empty">{t("guideTrackEmpty")}</p>
        ) : (
          <>
            <GuideTrackProgress lessons={lessons} done={done} next={next} />
            <GuideLessonTable lessons={lessons} read={read} next={next} />
          </>
        )}
        <GuideTrackChecks track={track} />
      </div>
    </div>
  );
}
