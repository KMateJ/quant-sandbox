import LessonFrame from "./LessonFrame";
import CovarianceExplore from "./CovarianceExplore";
import CovarianceMathematics from "./CovarianceMathematics";

export default function CovarianceLesson() {
  return (
    <LessonFrame
      numberLabel="2.3"
      titleKey="stochLessonCovariance"
      questionKey="stochCovQuestion"
      objectiveKey="stochCovObjective"
      intuitionSectionId="wiener-covariance"
      tabs={[
        { id: "explore", labelKey: "stochExplore", content: <CovarianceExplore /> },
        { id: "mathematics", labelKey: "stochMathematics", content: <CovarianceMathematics /> },
      ]}
    />
  );
}
