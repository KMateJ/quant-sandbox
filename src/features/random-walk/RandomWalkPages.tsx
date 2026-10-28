import LabLessonPages from "../../components/lesson/LabLessonPages";
import RandomWalkView from "./RandomWalkView";
import { RANDOM_WALK_PATH, randomWalkLessons } from "./lessons";

export default function RandomWalkPages() {
  return <LabLessonPages base={RANDOM_WALK_PATH} Root={RandomWalkView} lessons={randomWalkLessons} />;
}
