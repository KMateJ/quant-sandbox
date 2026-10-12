import LessonFrame from "./LessonFrame";
import HittingExplore from "./HittingExplore";
import HittingMathematics from "./HittingMathematics";

export default function HittingLesson() {
  return (
    <LessonFrame
      numberLabel="3.4"
      titleKey="pgLessonHitting"
      questionKey="pgHitQuestion"
      objectiveKey="pgHitObjective"
      intuitionSectionId="pg-hitting-drift"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <HittingExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <HittingMathematics /> },
      ]}
    />
  );
}
