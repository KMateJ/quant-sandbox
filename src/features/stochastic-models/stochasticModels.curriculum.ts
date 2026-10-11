import type { ComponentType } from "react";
import type { TranslationKey } from "../../i18n";
import RandomWalkLesson from "./RandomWalkLesson";
import RescaledWalkLesson from "./RescaledWalkLesson";
import WhySqrtLesson from "./WhySqrtLesson";

export type LessonStatus = "available" | "planned";

export interface StochLesson {
  id: string;
  number: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  questionKey: TranslationKey;
  objectiveKey: TranslationKey;
  intuitionSectionId?: string;
  status: LessonStatus;
  Component?: ComponentType;
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
        status: "available",
        Component: RandomWalkLesson,
      },
      {
        id: "rescaled-walk",
        number: "1.2",
        titleKey: "stochLessonRescaled",
        descKey: "stochLessonRescaledDesc",
        questionKey: "stochRescaledQuestion",
        objectiveKey: "stochRescaledObjective",
        intuitionSectionId: "rescaled-definition",
        status: "available",
        Component: RescaledWalkLesson,
      },
      {
        id: "why-sqrt-t",
        number: "1.3",
        titleKey: "stochLessonSqrt",
        descKey: "stochLessonSqrtDesc",
        questionKey: "stochSqrtQuestion",
        objectiveKey: "stochSqrtObjective",
        intuitionSectionId: "scaling-law",
        status: "available",
        Component: WhySqrtLesson,
      },
      {
        id: "clt",
        number: "1.4",
        titleKey: "stochLessonClt",
        descKey: "stochLessonCltDesc",
        questionKey: "stochLessonClt",
        objectiveKey: "stochLessonCltDesc",
        status: "planned",
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
  (lesson) => lesson.status === "available" && lesson.Component
);

export type LessonLocation = {
  lesson: StochLesson;
  chapter: StochChapter;
  previous?: StochLesson;
  next?: StochLesson;
};

/// Resolve a lesson id to its lesson, chapter and available neighbours.
export function findLesson(id: string): LessonLocation | undefined {
  const chapter = curriculum.find((c) => c.lessons.some((l) => l.id === id));
  const lesson = chapter?.lessons.find((l) => l.id === id);
  if (!chapter || !lesson || !lesson.Component) return undefined;
  const index = availableLessons.findIndex((l) => l.id === id);
  return {
    lesson,
    chapter,
    previous: index > 0 ? availableLessons[index - 1] : undefined,
    next: index < availableLessons.length - 1 ? availableLessons[index + 1] : undefined,
  };
}
