import { Panel } from "../../../../components/layout";
import { PredictExplain, type PredictExplainSpec } from "../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../i18n";

/// Two "can that be?" questions that the channel switches answer.
export default function ShockSurprises() {
  const { t } = useI18n();
  const spec = (n: 1 | 2, right: number): PredictExplainSpec => ({
    question: t(`syrShockS${n}Q` as TranslationKey),
    options: [0, 1, 2].map((i) => ({
      text: t(`syrShockS${n}O${i}` as TranslationKey),
      feedback: t(`syrShockS${n}F${i}` as TranslationKey),
      correct: i === right,
    })),
  });
  return (
    <Panel title={t("syrShockSurprises")}>
      <PredictExplain {...spec(1, 1)} />
      <PredictExplain {...spec(2, 2)} />
    </Panel>
  );
}
