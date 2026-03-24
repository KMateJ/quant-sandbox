import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";
import GuideAccordionHeader from "./components/GuideAccordionHeader";
import { getGuideRegistry, isGuideId } from "./GuideRegistry";
import type { GuideId } from "./guide.types";

export default function GuideView() {
  const { language } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const guides = useMemo(() => getGuideRegistry(language), [language]);
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
              ? "Narratív, intuitív bevezetők a meglévő modellekhez és eszközökhöz."
              : "Narrative, intuitive introductions to the models and tools already available on the site."
          }
        >
          <div className="guide-list">
            {guides.map((guide) => {
              const isOpen = activeGuide === guide.id;

              return (
                <div key={guide.id} className="guide-item">
                  <GuideAccordionHeader
                    title={language === "hu" ? guide.title.hu : guide.title.en}
                    description={
                      language === "hu"
                        ? guide.description.hu
                        : guide.description.en
                    }
                    isOpen={isOpen}
                    onClick={() => toggleGuide(guide.id)}
                  />

                  {isOpen && <div className="guide-body">{guide.render()}</div>}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}