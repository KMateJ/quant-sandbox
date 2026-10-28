import LessonFrame from "../../../components/lesson/LessonFrame";
import WienerExplore from "./WienerExplore";
import WienerMathematics from "./WienerMathematics";

export default function WienerLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonWiener"
      questionKey="wpQuestion"
      objectiveKey="wpObjective"
      intuitionSectionId="wiener-definition"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <WienerExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <WienerMathematics /> },
      ]}
    />
  );
}
