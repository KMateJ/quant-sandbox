import LabLessonPages from "../../components/lesson/LabLessonPages";
import BrownianMotionView from "./BrownianMotionView";
import { BROWNIAN_PATH, brownianLessons } from "./lessons/lessons";

export default function BrownianMotionPages() {
  return <LabLessonPages base={BROWNIAN_PATH} Root={BrownianMotionView} lessons={brownianLessons} />;
}
