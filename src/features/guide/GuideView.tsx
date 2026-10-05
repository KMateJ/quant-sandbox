import { useSearchParams } from "react-router-dom";
import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";
import GuideTrackSection from "./components/GuideTrackSection";
import { guideTracks } from "./guide.meta";
import { isGuideId } from "./GuideRegistry";
import type { GuideId } from "./guide.types";

export default function GuideView() {
  const { language } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeGuide = isGuideId(searchParams.get("topic"))
    ? (searchParams.get("topic") as GuideId)
    : null;

  const toggleGuide = (guideId: GuideId) => {
    const next = new URLSearchParams(searchParams);

    if (activeGuide === guideId) {
      next.delete("topic");
    } else {
      next.set("topic", guideId);
    }

    setSearchParams(next, { replace: false });
  };

  return (
    <div className="page-shell">
      <div className="page-content guide-page">
        <SectionCard
          title={language === "hu" ? "Útmutatók" : "Guides"}
          subtitle={
            language === "hu"
              ? "Az alapoktól építkező, sorban haladó leckék. Olvasd őket fentről lefelé."
              : "Ground-up lessons meant to be read in order, from top to bottom."
          }
        >
          <div className="guide-tracks">
            {guideTracks.map((track) => (
              <GuideTrackSection
                key={track.id}
                track={track}
                activeGuide={activeGuide}
                onToggle={toggleGuide}
              />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
