import { Navigate, useParams, useSearchParams } from "react-router-dom";
import CurriculumPage from "./CurriculumPage";
import LessonPage from "./LessonPage";
import { STUDIO_PATH, findLesson, lessonPath } from "./stochasticModels.curriculum";

export default function StochasticModelsView() {
  const { "*": lessonId } = useParams();
  const [params] = useSearchParams();
  const legacyId = params.get("lesson");

  // Old `?lesson=<id>` links redirect to the lesson's own path.
  if (!lessonId && legacyId) return <Navigate to={lessonPath(legacyId)} replace />;
  if (!lessonId) return <CurriculumPage />;

  const location = findLesson(lessonId);
  if (!location) return <Navigate to={STUDIO_PATH} replace />;

  return <LessonPage location={location} />;
}
