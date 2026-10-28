import { useId, useState, type ReactNode } from "react";
import { IntuitionTrigger } from "../intuition";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";

export type LessonTab = {
  id: string;
  labelKey: TranslationKey;
  content: ReactNode;
};

type Props = {
  titleKey: TranslationKey;
  questionKey: TranslationKey;
  objectiveKey: TranslationKey;
  intuitionSectionId?: string;
  tabs: LessonTab[];
};

/// Shared scaffold for a lab lesson page: title, motivating question,
/// learning objective and a tab strip. Lesson content lives in each tab.
export default function LessonFrame({
  titleKey,
  questionKey,
  objectiveKey,
  intuitionSectionId,
  tabs,
}: Props) {
  const { t } = useI18n();
  const base = useId();
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <article className="stoch-lesson">
      <header className="stoch-lesson-heading">
        <div>
          <h1>{t(titleKey)}</h1>
          <p>{t(questionKey)}</p>
        </div>
        {intuitionSectionId && <IntuitionTrigger sectionId={intuitionSectionId} variant="question" />}
      </header>
      <p className="stoch-learning-objective">{t(objectiveKey)}</p>

      {tabs.length > 1 && (
        <div className="stoch-tabs" role="tablist" aria-label={t("stochLessonTabs")}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${base}-tab-${tab.id}`}
              role="tab"
              aria-selected={current.id === tab.id}
              aria-controls={`${base}-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      )}

      <section
        id={`${base}-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${current.id}`}
      >
        {current.content}
      </section>
    </article>
  );
}
