import LessonFrame from "../../../components/lesson/LessonFrame";
import HittingExplore from "./HittingExplore";
import HittingMathematics from "./HittingMathematics";

export default function HittingLesson() {
  return (
    <LessonFrame
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
