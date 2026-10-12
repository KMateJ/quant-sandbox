import CltExplore from "./CltExplore";
import CltMathematics from "./CltMathematics";
import LessonFrame from "./LessonFrame";

export default function CltLesson() {
  return (
    <LessonFrame
      numberLabel="1.4"
      titleKey="stochLessonClt"
      questionKey="stochCltQuestion"
      objectiveKey="stochCltObjective"
      intuitionSectionId="clt-statement"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <CltExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <CltMathematics /> },
      ]}
    />
  );
}
