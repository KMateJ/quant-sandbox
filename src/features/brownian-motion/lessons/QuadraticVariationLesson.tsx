import LessonFrame from "../../../components/lesson/LessonFrame";
import QuadraticVariationExplore from "./QuadraticVariationExplore";
import QuadraticVariationMathematics from "./QuadraticVariationMathematics";

export default function QuadraticVariationLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonQuadVar"
      questionKey="stochQvQuestion"
      objectiveKey="stochQvObjective"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <QuadraticVariationExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <QuadraticVariationMathematics /> },
      ]}
    />
  );
}
