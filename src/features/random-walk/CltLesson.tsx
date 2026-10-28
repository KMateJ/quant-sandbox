import CltExplore from "./CltExplore";
import CltMathematics from "./CltMathematics";
import LessonFrame from "../../components/lesson/LessonFrame";

export default function CltLesson() {
  return (
    <LessonFrame
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
