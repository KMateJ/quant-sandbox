import LessonFrame from "./LessonFrame";
import RunningMaxExplore from "./RunningMaxExplore";
import RunningMaxMathematics from "./RunningMaxMathematics";

export default function RunningMaxLesson() {
  return (
    <LessonFrame
      numberLabel="3.1"
      titleKey="pgLessonRunningMax"
      questionKey="pgMaxQuestion"
      objectiveKey="pgMaxObjective"
      intuitionSectionId="pg-running-max"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <RunningMaxExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <RunningMaxMathematics /> },
      ]}
    />
  );
}
