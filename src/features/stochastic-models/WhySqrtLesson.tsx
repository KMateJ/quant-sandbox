import LessonFrame from "./LessonFrame";
import WhySqrtExplore from "./WhySqrtExplore";
import WhySqrtMathematics from "./WhySqrtMathematics";

export default function WhySqrtLesson() {
  return (
    <LessonFrame
      numberLabel="1.3"
      titleKey="stochLessonSqrt"
      questionKey="stochSqrtQuestion"
      objectiveKey="stochSqrtObjective"
      intuitionSectionId="scaling-law"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <WhySqrtExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <WhySqrtMathematics /> },
      ]}
    />
  );
}
