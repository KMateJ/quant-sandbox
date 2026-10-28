import type { ComponentType, LazyExoticComponent } from "react";
import type { TranslationKey } from "../../i18n";

/// A lesson page that lives under a lab at `<base>/<id>`.
export interface LabLesson {
  id: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  Component: LazyExoticComponent<ComponentType>;
}

/// Registry sub-nav for a lab with lessons: the lab itself first (`rootLabelKey`), then one item per lesson.
export function lessonSubNav(base: string, rootLabelKey: TranslationKey, lessons: LabLesson[]) {
  return [
    { id: "lab", labelKey: rootLabelKey, to: base },
    ...lessons.map((l) => ({ id: l.id, labelKey: l.titleKey, descKey: l.descKey, to: `${base}/${l.id}` })),
  ];
}
