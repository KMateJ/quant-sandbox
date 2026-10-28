import { lazy } from "react";
import type { LabLesson } from "../../components/lesson/labLessons";

export const RANDOM_WALK_PATH = "/random-walk";

/// Sub-pages of the Random Walk lab; the lab itself (Galton board) is the root page.
export const randomWalkLessons: LabLesson[] = [
  { id: "symmetric", titleKey: "stochLessonRandomWalk", descKey: "stochLessonRandomWalkDesc", Component: lazy(() => import("./RandomWalkLesson")) },
  { id: "rescaled-walk", titleKey: "stochLessonRescaled", descKey: "stochLessonRescaledDesc", Component: lazy(() => import("./RescaledWalkLesson")) },
  { id: "why-sqrt-t", titleKey: "stochLessonSqrt", descKey: "stochLessonSqrtDesc", Component: lazy(() => import("./WhySqrtLesson")) },
  { id: "clt", titleKey: "stochLessonClt", descKey: "stochLessonCltDesc", Component: lazy(() => import("./CltLesson")) },
];
