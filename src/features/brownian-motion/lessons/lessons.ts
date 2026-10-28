import { lazy } from "react";
import type { LabLesson } from "../../../components/lesson/labLessons";

export const BROWNIAN_PATH = "/brownian-motion";

/// Sub-pages of the Brownian Motion lab, in reading order.
export const brownianLessons: LabLesson[] = [
  { id: "wiener-process", titleKey: "stochLessonWiener", descKey: "stochLessonWienerDesc", Component: lazy(() => import("./WienerLesson")) },
  { id: "increments", titleKey: "stochLessonIncrements", descKey: "stochLessonIncrementsDesc", Component: lazy(() => import("./IncrementLesson")) },
  { id: "covariance", titleKey: "stochLessonCovariance", descKey: "stochLessonCovarianceDesc", Component: lazy(() => import("./CovarianceLesson")) },
  { id: "transformations", titleKey: "stochLessonTransforms", descKey: "stochLessonTransformsDesc", Component: lazy(() => import("./TransformationsLesson")) },
  { id: "quadratic-variation", titleKey: "stochLessonQuadVar", descKey: "stochLessonQuadVarDesc", Component: lazy(() => import("./QuadraticVariationLesson")) },
  { id: "brownian-bridge", titleKey: "stochLessonBridge", descKey: "stochLessonBridgeDesc", Component: lazy(() => import("./BridgeLesson")) },
  { id: "running-max", titleKey: "pgLessonRunningMax", descKey: "pgLessonRunningMaxDesc", Component: lazy(() => import("./RunningMaxLesson")) },
  { id: "reflection", titleKey: "pgLessonReflection", descKey: "pgLessonReflectionDesc", Component: lazy(() => import("./ReflectionLesson")) },
  { id: "first-passage", titleKey: "pgLessonFirstPassage", descKey: "pgLessonFirstPassageDesc", Component: lazy(() => import("./FirstPassageLesson")) },
  { id: "hitting", titleKey: "pgLessonHitting", descKey: "pgLessonHittingDesc", Component: lazy(() => import("./HittingLesson")) },
];
