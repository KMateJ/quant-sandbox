import { Navigate, useParams, useSearchParams } from "react-router-dom";
import GuideIndex from "./components/GuideIndex";
import GuideLessonPage from "./components/GuideLessonPage";
import { GUIDE_PATH, findGuideLesson, guidePath, isGuideId } from "./guide.meta";

export default function GuideView() {
  const { "*": lessonId } = useParams();
  const [params] = useSearchParams();
  const legacyId = params.get("topic");

  // Old `?topic=<id>` links redirect to the lesson's own path.
  if (!lessonId && isGuideId(legacyId)) return <Navigate to={guidePath(legacyId)} replace />;
  if (!lessonId) return <GuideIndex />;

  const location = findGuideLesson(lessonId);
  if (!location) return <Navigate to={GUIDE_PATH} replace />;

  return <GuideLessonPage key={location.lesson.id} location={location} />;
}
