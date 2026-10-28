import { PredictExplain, PredictReveal, type PredictExplainSpec } from "../../../components/ui";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { AvsLab } from "../useAvellanedaStoikovLab";
import QuoteColumn from "./QuoteColumn";

/// Predict: click the price column where the reservation price sits for the drawn inventory and time.
export default function AsPredict({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const { predict, params } = lab;
  const { state } = predict;
  const spec = (n: 1 | 2, right: number): PredictExplainSpec => ({
    question: t(`avsExplain${n}Q` as TranslationKey),
    options: [0, 1, 2].map((i) => ({ text: t(`avsExplain${n}O${i}` as TranslationKey), feedback: t(`avsExplain${n}F${i}` as TranslationKey), correct: i === right })),
  });
  const pos = predict.q > 0 ? t("avsLongN", { n: predict.q }) : t("avsShortN", { n: -predict.q });
  return (
    <div className="avs-skew">
      <div className="avs-skew-controls">
        <PredictReveal
          state={state}
          prompt={t("avsPredictPrompt", { pos, t: predict.t, gamma: params.gamma, sigma: params.sigma })}
          format={(v) => `$${v.toFixed(2)}`}
          input="plot"
          explain={spec(1, 1)}
        />
        {state.revealed && <PredictExplain {...spec(2, 0)} />}
        {state.revealed && <button type="button" className="lp-btn" onClick={predict.next}>{t("avsNextQuestion")}</button>}
      </div>
      <QuoteColumn params={params} q={predict.q} t={predict.t} hide={!state.revealed} guess={state.guess} onPick={state.revealed ? undefined : state.setGuess} />
    </div>
  );
}
