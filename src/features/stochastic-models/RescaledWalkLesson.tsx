import LessonFrame from "./LessonFrame";
import RescaledWalkExplore from "./RescaledWalkExplore";
import RescaledWalkMathematics from "./RescaledWalkMathematics";

export default function RescaledWalkLesson() {
  return (
    <LessonFrame
      numberLabel="1.2"
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
