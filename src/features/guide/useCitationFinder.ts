import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { findLessonCitations, titleIndex } from "./guide.graph";
import type { CitationFinder } from "./guide.inline";
import { guideLessons } from "./guide.meta";
import type { GuideId } from "./guide.types";

/// Finder for exact quoted lesson titles in the current language, never matching the lesson itself.
export function useCitationFinder(selfId: GuideId): CitationFinder {
  const { t, language } = useI18n();
  return useMemo(() => {
    const titles = titleIndex({ lessons: guideLessons, titleOf: (lesson) => t(lesson.titleKey) }, language);
    return (text: string) => findLessonCitations(text, language, titles, selfId);
  }, [t, language, selfId]);
}
