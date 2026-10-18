import { Navigate, useLocation, useParams } from "react-router-dom";
import GuideIndex from "./components/GuideIndex";
import GuideLessonPage from "./components/GuideLessonPage";
import { GUIDE_PATH, findGuideLesson, guidePath, guideTrackFromPath, guideTrackPath } from "./guide.meta";

export default function GuideView() {
  const { "*": lessonId } = useParams();
  const { pathname } = useLocation();
  const track = guideTrackFromPath(pathname);

  if (!track) return <Navigate to={GUIDE_PATH} replace />;
  if (!lessonId) return <GuideIndex track={track} />;

  const location = findGuideLesson(lessonId);
  if (!location) return <Navigate to={guideTrackPath(track.id)} replace />;
  // A lesson opened under the wrong track moves to its own.
  if (location.track.id !== track.id) return <Navigate to={guidePath(location.lesson.id)} replace />;

  return <GuideLessonPage key={location.lesson.id} location={location} />;
}
