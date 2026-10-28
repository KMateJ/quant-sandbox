import LessonFrame from "../../../components/lesson/LessonFrame";
import FirstPassageExplore from "./FirstPassageExplore";
import FirstPassageMathematics from "./FirstPassageMathematics";

export default function FirstPassageLesson() {
  return (
    <LessonFrame
      titleKey="pgLessonFirstPassage"
      questionKey="pgFpQuestion"
      objectiveKey="pgFpObjective"
      intuitionSectionId="pg-first-passage"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <FirstPassageExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <FirstPassageMathematics /> },
      ]}
    />
  );
}
