import LessonFrame from "../../../components/lesson/LessonFrame";
import TransformationsExplore from "./TransformationsExplore";
import TransformationsMathematics from "./TransformationsMathematics";

export default function TransformationsLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonTransforms"
      questionKey="stochTrQuestion"
      objectiveKey="stochTrObjective"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <TransformationsExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <TransformationsMathematics /> },
      ]}
    />
  );
}
