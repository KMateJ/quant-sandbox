import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TranslationKey } from "../../i18n";

type LessonComponent = LazyExoticComponent<ComponentType>;

/// Route of the studio; each lesson lives at `${STUDIO_PATH}/<lesson id>`.
export const STUDIO_PATH = "/stochastic-models";

export const lessonPath = (id: string) => `${STUDIO_PATH}/${id}`;

export interface StochLesson {
  id: string;
  number: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  questionKey?: TranslationKey;
  objectiveKey?: TranslationKey;
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
        questionKey: "stochCltQuestion",
        objectiveKey: "stochCltObjective",
        intuitionSectionId: "clt-statement",
        Component: lazy(() => import("./CltLesson")),
      },
    ],
  },
  {
    number: 2,
    titleKey: "stochChapter2",
    descKey: "stochChapter2Desc",
    lessons: [
      {
        id: "wiener-process",
        number: "2.1",
        titleKey: "stochLessonWiener",
        descKey: "stochLessonWienerDesc",
        questionKey: "wpQuestion",
        objectiveKey: "wpObjective",
        intuitionSectionId: "wiener-definition",
        Component: lazy(() => import("./WienerLesson")),
      },
      {
        id: "increments",
        number: "2.2",
        titleKey: "stochLessonIncrements",
        descKey: "stochLessonIncrementsDesc",
        questionKey: "stochIncQuestion",
        objectiveKey: "stochIncObjective",
        intuitionSectionId: "wiener-increments",
        Component: lazy(() => import("./IncrementLesson")),
      },
      {
        id: "covariance",
        number: "2.3",
        titleKey: "stochLessonCovariance",
        descKey: "stochLessonCovarianceDesc",
        questionKey: "stochCovQuestion",
        objectiveKey: "stochCovObjective",
        intuitionSectionId: "wiener-covariance",
        Component: lazy(() => import("./CovarianceLesson")),
      },
      {
        id: "transformations",
        number: "2.4",
        titleKey: "stochLessonTransforms",
        descKey: "stochLessonTransformsDesc",
      },
      {
        id: "quadratic-variation",
        number: "2.5",
        titleKey: "stochLessonQuadVar",
        descKey: "stochLessonQuadVarDesc",
      },
      {
        id: "brownian-bridge",
        number: "2.6",
        titleKey: "stochLessonBridge",
        descKey: "stochLessonBridgeDesc",
      },
    ],
    standalone: { route: "/brownian-motion", labelKey: "stochBrownianStandalone" },
  },
  {
    number: 3,
    titleKey: "stochChapter3",
    descKey: "stochChapter3Desc",
    lessons: [
      {
        id: "running-max",
        number: "3.1",
        titleKey: "pgLessonRunningMax",
        descKey: "pgLessonRunningMaxDesc",
        questionKey: "pgMaxQuestion",
        objectiveKey: "pgMaxObjective",
        intuitionSectionId: "pg-running-max",
        Component: lazy(() => import("./RunningMaxLesson")),
      },
      {
        id: "reflection",
        number: "3.2",
        titleKey: "pgLessonReflection",
        descKey: "pgLessonReflectionDesc",
        questionKey: "pgReflQuestion",
        objectiveKey: "pgReflObjective",
        intuitionSectionId: "pg-reflection",
        Component: lazy(() => import("./ReflectionLesson")),
      },
      {
        id: "first-passage",
        number: "3.3",
        titleKey: "pgLessonFirstPassage",
        descKey: "pgLessonFirstPassageDesc",
        questionKey: "pgFpQuestion",
        objectiveKey: "pgFpObjective",
        intuitionSectionId: "pg-first-passage",
        Component: lazy(() => import("./FirstPassageLesson")),
      },
      {
        id: "hitting",
        number: "3.4",
        titleKey: "pgLessonHitting",
        descKey: "pgLessonHittingDesc",
        questionKey: "pgHitQuestion",
        objectiveKey: "pgHitObjective",
        intuitionSectionId: "pg-hitting-drift",
        Component: lazy(() => import("./HittingLesson")),
      },
    ],
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

/// Lesson links for registry sub-navigation; the description doubles as the page's SEO text.
export const lessonNavItems = () =>
  availableLessons.map((lesson) => ({
    id: lesson.id,
    labelKey: lesson.titleKey,
    descKey: lesson.descKey,
    prefix: lesson.number,
    to: lessonPath(lesson.id),
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
