import LessonFrame from "../../../components/lesson/LessonFrame";
import IncrementExplore from "./IncrementExplore";
import IncrementMathematics from "./IncrementMathematics";

export default function IncrementLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonIncrements"
      questionKey="stochIncQuestion"
      objectiveKey="stochIncObjective"
      intuitionSectionId="wiener-increments"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <IncrementExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <IncrementMathematics /> },
      ]}
    />
  );
}
