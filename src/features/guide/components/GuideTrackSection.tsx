import { useI18n } from "../../../i18n";
import type { GuideId, GuideTrackMeta, LocalizedText } from "../guide.types";
import { getGuideRegistry } from "../GuideRegistry";
import GuideAccordionHeader from "./GuideAccordionHeader";

type GuideTrackSectionProps = {
  track: GuideTrackMeta;
  activeGuide: string | null;
  onToggle: (id: GuideId) => void;
};

/// Renders one track header and its ordered lessons as an accordion.
export default function GuideTrackSection({
  track,
  activeGuide,
  onToggle,
}: GuideTrackSectionProps) {
  const { language } = useI18n();
  const pick = (text: LocalizedText) => (language === "hu" ? text.hu : text.en);
  const lessons = getGuideRegistry().filter((l) => l.track === track.id);
  const ordered = track.lessons
    .map((id) => lessons.find((l) => l.id === id))
    .filter((l): l is (typeof lessons)[number] => Boolean(l));

  return (
    <section className="guide-track">
      <header className="guide-track-head">
        <h2 className="guide-track-title">{pick(track.title)}</h2>
        <p className="guide-track-desc">{pick(track.description)}</p>
      </header>

      <div className="guide-list">
        {ordered.map((lesson, i) => {
          const isOpen = activeGuide === lesson.id;
          return (
            <div key={lesson.id} className="guide-item">
              <GuideAccordionHeader
                index={i + 1}
                title={pick(lesson.title)}
                description={pick(lesson.description)}
                isOpen={isOpen}
                onClick={() => onToggle(lesson.id)}
              />
              {isOpen && <div className="guide-body">{lesson.render()}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
