import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../../i18n";
import { guideContent } from "../../../Language/guides";
import { checksAnchor, collectChecks } from "../guide.check.logic";
import { guideLessons, guidePath } from "../guide.meta";
import type { GuideTrackMeta } from "../guide.types";
import { useReviewQueue } from "../useGuideReview";
import GuideCheck from "./GuideCheck";

/// "Check yourself" at the end of a track: every lesson's questions, folded per lesson so the page stays calm.
/// Questions due for spaced review are marked; a link to `#checks-<lesson>` opens that lesson's group.
export default function GuideTrackChecks({ track }: { track: GuideTrackMeta }) {
  const { t, language } = useI18n();
  const due = new Set(useReviewQueue().map((c) => c.block.id));
  const checks = collectChecks(track.lessons, guideContent, language);
  const openId = useLocation().hash.slice(1);

  // Arriving from a lesson's link (`#checks-<lesson>`): bring its open group into view.
  useEffect(() => {
    if (openId.startsWith("checks-")) document.getElementById(openId)?.scrollIntoView({ block: "start" });
  }, [openId]);

  if (checks.length === 0) return null;
  const lessons = track.lessons.filter((id) => checks.some((c) => c.lessonId === id));

  return (
    <section className="guide-track-checks" aria-labelledby="track-checks-title">
      <h2 id="track-checks-title" className="guide-track-checks-title">{t("guideCheckLabel")}</h2>
      <p className="guide-track-checks-intro">{t("guideTrackChecksIntro")}</p>
      {lessons.map((lessonId) => {
        const lesson = guideLessons.find((l) => l.id === lessonId)!;
        const own = checks.filter((c) => c.lessonId === lessonId);
        const dueHere = own.filter((c) => due.has(c.block.id)).length;
        return (
          <details key={lessonId} id={checksAnchor(lessonId)} className="guide-track-checks-group" open={openId === checksAnchor(lessonId)}>
            <summary>
              <span className="guide-track-checks-lesson">{t(lesson.titleKey)}</span>
              <span className="guide-track-checks-count">
                {t("guideTrackChecksCount", { n: own.length })}
                {dueHere > 0 && ` · ${t("guideTrackChecksDue", { n: dueHere })}`}
              </span>
            </summary>
            <Link className="guide-track-checks-reread" to={guidePath(lessonId)}>{t("guideTrackChecksReread")}</Link>
            {own.map(({ block }) => (
              <GuideCheck key={block.id} block={block} context={due.has(block.id) ? <span className="guide-check-due">{t("guideReviewTitle")}</span> : undefined} />
            ))}
          </details>
        );
      })}
    </section>
  );
}
