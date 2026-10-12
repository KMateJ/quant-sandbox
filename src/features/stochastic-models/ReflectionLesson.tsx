import LessonFrame from "./LessonFrame";
import ReflectionExplore from "./ReflectionExplore";
import ReflectionMathematics from "./ReflectionMathematics";

export default function ReflectionLesson() {
  return (
    <LessonFrame
      numberLabel="3.2"
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
