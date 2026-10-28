import { PredictExplain } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";
import ConvergenceChart from "./ConvergenceChart";
import SpreadSplit from "./SpreadSplit";

/// Split tab: guess the adverse-selection share, then watch the estimators converge with sample size.
export default function SplitTab({ lab, isMobile }: { lab: SpreadEstimationLab; isMobile: boolean }) {
  const { t } = useI18n();
  return (
    <div className="spe-tab">
      <p className="spe-lead">{t("speSplitLead")}</p>
      <SpreadSplit key={`${lab.seed}|${lab.S}|${lab.sigma}|${lab.alpha}|${lab.n}`} lab={lab} />
      <h3 className="spe-subhead">{t("speConvergenceTitle")}</h3>
      <div className="chart-wrap spe-chart spe-chart--short">
        <ConvergenceChart points={lab.conv} S={lab.S} isMobile={isMobile} />
      </div>
      <PredictExplain
        key={lab.seed}
        question={t("speExplain2Q")}
        options={(["A", "B", "C"] as const).map((k) => ({ text: t(`speExplain2${k}`), feedback: t(`speExplain2${k}Fb`), correct: k === "B" }))}
      />
    </div>
  );
}
