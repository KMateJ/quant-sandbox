import LessonFrame from "../../components/lesson/LessonFrame";
import RescaledWalkExplore from "./RescaledWalkExplore";
import RescaledWalkMathematics from "./RescaledWalkMathematics";

export default function RescaledWalkLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonRescaled"
      questionKey="stochRescaledQuestion"
      objectiveKey="stochRescaledObjective"
      intuitionSectionId="rescaled-definition"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <RescaledWalkExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <RescaledWalkMathematics /> },
      ]}
    />
  );
}
