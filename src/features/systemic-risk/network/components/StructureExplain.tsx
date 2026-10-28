import { Panel } from "../../../../components/layout";
import { PredictExplain } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";

/// "Ring or complete?": which network is more fragile to one default, with a reason for each answer.
export default function StructureExplain() {
  const { t } = useI18n();
  const options = [
    { text: t("syrExplainRing"), feedback: t("syrExplainRingFeed"), correct: true },
    { text: t("syrExplainComplete"), feedback: t("syrExplainCompleteFeed") },
  ];
  return (
    <Panel title={t("syrExplainTitle")}>
      <PredictExplain question={t("syrExplainQuestion")} options={options} />
    </Panel>
  );
}
