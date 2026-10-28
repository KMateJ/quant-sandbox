import { PredictExplain, PredictReveal, type PredictExplainSpec } from "../../../components/ui";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { MarketMakingLab } from "../useMarketMakingLab";
import { cents } from "./mkmFormat";

/// Predict: place the income-maximising half-spread on the rounds chart, then two "why" questions.
export default function MkmPredict({ lab }: { lab: MarketMakingLab }) {
  const { t } = useI18n();
  const spec = (n: 1 | 2, right: number): PredictExplainSpec => ({
    question: t(`mkmExplain${n}Q` as TranslationKey),
    options: [0, 1, 2].map((i) => ({
      text: t(`mkmExplain${n}O${i}` as TranslationKey),
      feedback: t(`mkmExplain${n}F${i}` as TranslationKey),
      correct: i === right,
    })),
  });
  return (
    <>
      <PredictReveal state={lab.predict} prompt={t("mkmPredictPrompt")} format={cents} input="plot" explain={spec(1, 1)} />
      {lab.predict.revealed && <PredictExplain {...spec(2, 2)} />}
    </>
  );
}
