import LessonFrame from "../../../components/lesson/LessonFrame";
import ReflectionExplore from "./ReflectionExplore";
import ReflectionMathematics from "./ReflectionMathematics";

export default function ReflectionLesson() {
  return (
    <LessonFrame
      titleKey="pgLessonReflection"
      questionKey="pgReflQuestion"
      objectiveKey="pgReflObjective"
      intuitionSectionId="pg-reflection"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <ReflectionExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <ReflectionMathematics /> },
      ]}
    />
  );
}
