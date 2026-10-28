import LessonFrame from "../../components/lesson/LessonFrame";
import RandomWalkExperiment from "./RandomWalkExperiment";
import RandomWalkMathematics from "./RandomWalkMathematics";

export default function RandomWalkLesson() {
  return (
    <LessonFrame
      titleKey="stochLessonRandomWalk"
      questionKey="stochWalkQuestion"
      objectiveKey="stochWalkObjective"
      intuitionSectionId="walk-randomness"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <RandomWalkExperiment /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <RandomWalkMathematics /> },
      ]}
    />
  );
}
