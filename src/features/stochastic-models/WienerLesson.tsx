import LessonFrame from "./LessonFrame";
import WienerExplore from "./WienerExplore";
import WienerMathematics from "./WienerMathematics";

export default function WienerLesson() {
  return (
    <LessonFrame
      numberLabel="2.1"
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
