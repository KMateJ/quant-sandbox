import { useState } from "react";
import { PredictExplain } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { DurationPredict } from "../useDurationPredict";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel; predict: DurationPredict };

const signed = (v: number, digits = 2) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`;

/// Predict mode: the lab draws a yield shock, the reader commits a ΔP/P guess (number or chart), then reveals,
/// sees the error and answers why duration alone undershot. The explain slot keeps its height before the reveal.
export default function PredictPanel({ model, predict }: Props) {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const { revealed, guess, error, rounds, meanAbsError } = predict;
  const shown = guess === null ? draft : Number(draft) === guess ? draft : String(guess);
  const sign = model.shockBp > 0 ? "+" : "";

  const onInput = (text: string) => {
    setDraft(text);
    const v = Number(text);
    predict.setGuess(text.trim() !== "" && Number.isFinite(v) ? v : null);
  };
  const next = () => {
    setDraft("");
    model.nextRound();
  };

  const options = (["convexity", "coupon", "maturity"] as const).map((id) => ({
    text: t(`dcExplainOpt_${id}`),
    feedback: t(`dcExplainFeed_${id}`),
    correct: id === "convexity",
  }));

  return (
    <div className="dc-predict">
      <div className="dc-predict-main">
        <p className="dc-predict-prompt">{t("dcPredictPrompt", { bp: `${sign}${model.shockBp}` })}</p>
        <div className="lp-predict-row">
          <label className="lp-predict-input">
            <span>{t("dcPredictGuess")}</span>
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              value={shown}
              disabled={revealed}
              onChange={(e) => onInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && predict.reveal()}
            />
          </label>
          {revealed ? (
            <button type="button" className="lp-btn lp-btn--primary" onClick={next}>{t("dcPredictNext")}</button>
          ) : (
            <button type="button" className="lp-btn lp-btn--primary" disabled={guess === null} onClick={predict.reveal}>{t("lpReveal")}</button>
          )}
        </div>
        <p className="dc-shock-hint" role="status">
          {revealed && error !== null
            ? t("dcPredictResult", { truth: signed(predict.truth), err: Math.abs(error * 100).toFixed(0) })
            : t("dcPredictHint")}
        </p>
        <p className="dc-predict-tally">
          {rounds === 0 || meanAbsError === null ? t("dcPredictTallyNone") : t("dcPredictTally", { n: rounds, err: (meanAbsError * 100).toFixed(0) })}
        </p>
      </div>
      <div className="dc-predict-explain">
        {revealed ? (
          <PredictExplain key={model.round} question={t("dcExplainQuestion")} options={options} />
        ) : (
          <p className="dc-shock-hint">{t("dcExplainLater")}</p>
        )}
      </div>
    </div>
  );
}
