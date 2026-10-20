import { useMemo } from "react";
import { useI18n } from "../../i18n";
import { CATEGORY_LABEL_KEYS, CATEGORY_ORDER, modulesInCategory } from "../../modules/registry";
import { guideLessons, guidePath, guideTrackById } from "../../features/guide/guide.meta";
import type { SearchItem } from "./search.logic";

/// Every lab and lesson as a searchable item in the current language.
export function useSearchItems(): SearchItem[] {
  const { t } = useI18n();
  return useMemo(() => {
    const labs = CATEGORY_ORDER.filter((c) => c !== "guides").flatMap((category) =>
      modulesInCategory(category).map((m): SearchItem => ({
        id: m.id,
        kind: "lab",
        title: t(m.navKey),
        context: t(CATEGORY_LABEL_KEYS[category]),
        href: m.path,
      })),
    );
    const lessons = guideLessons.map((l): SearchItem => ({
      id: l.id,
      kind: "lesson",
      title: t(l.titleKey),
      context: t(guideTrackById(l.track).titleKey),
      extra: t(l.descKey),
      href: guidePath(l.id),
    }));
    return [...labs, ...lessons];
  }, [t]);
}
