import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TranslationKey } from "../../i18n";

type LessonComponent = LazyExoticComponent<ComponentType>;

export interface StochLesson {
  id: string;
  number: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  questionKey: TranslationKey;
  objectiveKey: TranslationKey;
  intuitionSectionId?: string;
  /// Lazily loaded interactive body; a lesson without one is planned.
  Component?: LessonComponent;
}

export interface StochChapter {
  number: number;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  lessons: StochLesson[];
  /// Chapters already realised as a standalone lab link to it.
  standalone?: { route: string; labelKey: TranslationKey };
  planned?: boolean;
}

export const curriculum: StochChapter[] = [
  {
    number: 1,
    titleKey: "stochChapter1",
    descKey: "stochChapter1Desc",
    lessons: [
      {
        id: "random-walk",
        number: "1.1",
        titleKey: "stochLessonRandomWalk",
        descKey: "stochLessonRandomWalkDesc",
        questionKey: "stochWalkQuestion",
        objectiveKey: "stochWalkObjective",
        intuitionSectionId: "walk-randomness",
        Component: lazy(() => import("./RandomWalkLesson")),
      },
      {
        id: "rescaled-walk",
        number: "1.2",
        titleKey: "stochLessonRescaled",
        descKey: "stochLessonRescaledDesc",
        questionKey: "stochRescaledQuestion",
        objectiveKey: "stochRescaledObjective",
        intuitionSectionId: "rescaled-definition",
        Component: lazy(() => import("./RescaledWalkLesson")),
      },
      {
        id: "why-sqrt-t",
        number: "1.3",
        titleKey: "stochLessonSqrt",
        descKey: "stochLessonSqrtDesc",
        questionKey: "stochSqrtQuestion",
        objectiveKey: "stochSqrtObjective",
        intuitionSectionId: "scaling-law",
        Component: lazy(() => import("./WhySqrtLesson")),
      },
      {
        id: "clt",
        number: "1.4",
        titleKey: "stochLessonClt",
        descKey: "stochLessonCltDesc",
        questionKey: "stochLessonClt",
        objectiveKey: "stochLessonCltDesc",
      },
    ],
  },
  {
    number: 2,
    titleKey: "stochChapter2",
    descKey: "stochChapter2Desc",
    lessons: [],
    standalone: { route: "/brownian-motion", labelKey: "stochBrownianStandalone" },
  },
  {
    number: 3,
    titleKey: "stochChapter3",
    descKey: "stochChapter3Desc",
    lessons: [],
    planned: true,
  },
  {
    number: 4,
    titleKey: "stochChapter4",
    descKey: "stochChapter4Desc",
    lessons: [],
    standalone: { route: "/ito-process", labelKey: "stochItoStandalone" },
  },
  {
    number: 5,
    titleKey: "stochChapter5",
    descKey: "stochChapter5Desc",
    lessons: [],
    standalone: { route: "/gbm", labelKey: "stochGbmStandalone" },
  },
  {
    number: 6,
    titleKey: "stochChapter6",
    descKey: "stochChapter6Desc",
    lessons: [],
    planned: true,
  },
  {
    number: 7,
    titleKey: "stochChapter7",
    descKey: "stochChapter7Desc",
    lessons: [],
    standalone: { route: "/monte-carlo", labelKey: "stochMonteCarloStandalone" },
  },
];

/// Every lesson across chapters, in reading order.
export const allLessons: StochLesson[] = curriculum.flatMap((chapter) => chapter.lessons);

/// Lessons that have a working interactive component.
export const availableLessons: StochLesson[] = allLessons.filter(
  (lesson) => lesson.Component !== undefined
);

/// Lesson ids as query-string links into the studio, for registry sub-navigation.
export const lessonNavItems = (basePath: string) =>
  availableLessons.map((lesson) => ({
    id: lesson.id,
    labelKey: lesson.titleKey,
    prefix: lesson.number,
    to: `${basePath}?lesson=${lesson.id}`,
  }));

export type LessonLocation = {
  lesson: StochLesson;
  Lesson: LessonComponent;
  chapter: StochChapter;
  previous?: StochLesson;
  next?: StochLesson;
};

/// Resolve a lesson id to its lesson, chapter and available neighbours.
export function findLesson(id: string): LessonLocation | undefined {
  const chapter = curriculum.find((c) => c.lessons.some((l) => l.id === id));
  const lesson = chapter?.lessons.find((l) => l.id === id);
  if (!chapter || !lesson?.Component) return undefined;
  const index = availableLessons.findIndex((l) => l.id === id);
  return {
    lesson,
    Lesson: lesson.Component,
    chapter,
    previous: index > 0 ? availableLessons[index - 1] : undefined,
    next: index < availableLessons.length - 1 ? availableLessons[index + 1] : undefined,
  };
}
