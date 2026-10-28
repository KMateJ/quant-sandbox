import LessonFrame from "../../../components/lesson/LessonFrame";
import RunningMaxExplore from "./RunningMaxExplore";
import RunningMaxMathematics from "./RunningMaxMathematics";

export default function RunningMaxLesson() {
  return (
    <LessonFrame
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
