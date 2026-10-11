import LessonFrame from "./LessonFrame";
import RandomWalkExperiment from "./RandomWalkExperiment";
import RandomWalkMathematics from "./RandomWalkMathematics";

export default function RandomWalkLesson() {
  return (
    <LessonFrame
      numberLabel="1.1"
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
