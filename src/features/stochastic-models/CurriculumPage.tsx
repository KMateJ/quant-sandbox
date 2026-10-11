import { PageHeader } from "../../components/layout";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import ChapterCard from "./ChapterCard";
import { availableLessons, allLessons, curriculum } from "./stochasticModels.curriculum";

const JOURNEY: TranslationKey[] = [
  "stochJourneyWalk",
  "stochJourneyLimit",
  "stochJourneyWiener",
  "stochJourneyIto",
  "stochJourneySde",
  "stochJourneyApplications",
];

export default function CurriculumPage() {
  const { t } = useI18n();
  const done = availableLessons.length;
  const total = allLessons.length;

  return (
    <>
      <PageHeader title={t("stochStudioTitle")} description={t("stochStudioDescription")} />

      <div className="stoch-journey" aria-label={t("stochJourneyLabel")}>
        <ol className="stoch-journey-flow">
          {JOURNEY.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ol>
        <div className="stoch-journey-progress">
          <span>{t("stochChapterProgress", { done, total })}</span>
          <progress value={done} max={total} />
        </div>
      </div>

      <div className="stoch-chapter-grid">
        {curriculum.map((chapter) => (
          <ChapterCard key={chapter.number} chapter={chapter} />
        ))}
      </div>
    </>
  );
}
