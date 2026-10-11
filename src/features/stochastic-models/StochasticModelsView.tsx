import { Navigate, useSearchParams } from "react-router-dom";
import CurriculumPage from "./CurriculumPage";
import LessonPage from "./LessonPage";
import { findLesson } from "./stochasticModels.curriculum";

export default function StochasticModelsView() {
  const [params] = useSearchParams();
  const lessonId = params.get("lesson");

  if (!lessonId) return <CurriculumPage />;

  const location = findLesson(lessonId);
  if (!location) return <Navigate to="/stochastic-models" replace />;

  return <LessonPage location={location} />;
}
