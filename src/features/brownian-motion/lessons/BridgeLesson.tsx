import LessonFrame from "../../../components/lesson/LessonFrame";
import BridgeExplore from "./BridgeExplore";
import BridgeMathematics from "./BridgeMathematics";

export default function BridgeLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonBridge"
      questionKey="stochBrQuestion"
      objectiveKey="stochBrObjective"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <BridgeExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <BridgeMathematics /> },
      ]}
    />
  );
}
