import { useState } from "react";
import { useI18n } from "../../i18n";
import ChallengeRecord from "./ChallengeRecord";
import PredictExplain, { type PredictExplainSpec } from "./PredictExplain";
import type { PredictRevealState } from "./usePredictReveal";

type Props = {
  state: PredictRevealState;
  /// The question, e.g. "Where does the NPV profile cross zero?"
  prompt: string;
  format: (v: number) => string;
  /// "number": the reader types the guess here; "plot": the lab sets it from a click on its chart.
  input?: "number" | "plot";
  step?: number;
  min?: number;
  max?: number;
  /// Optional "why?" question shown after the reveal (predict–observe–explain).
  explain?: PredictExplainSpec;
};

/// Predict-then-reveal panel: commit a guess, reveal the true value and the error, try again.
export default function PredictReveal({ state, prompt, format, input = "number", step = 0.01, min, max, explain }: Props) {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const { guess, revealed, error, hit, history } = state;
  const hits = history.filter((h) => h.hit).length;

  const onDraft = (text: string) => {
    setDraft(text);
    const v = Number(text);
    state.setGuess(text.trim() !== "" && Number.isFinite(v) ? v : null);
  };
  const retry = () => {
    setDraft("");
    state.retry();
  };

  return (
    <section className="lp-predict" aria-live="polite">
      <div className="lp-predict-head">
        <span className="lp-predict-title">{t("lpPredictTitle")}</span>
        {history.length > 0 && <span className="lp-predict-score">{t("lpAttempts", { hits, n: history.length })}</span>}
      </div>
      <p className="lp-predict-prompt">{prompt}</p>
      <div className="lp-predict-row">
        {input === "number" ? (
          <label className="lp-predict-input">
            <span>{t("lpYourGuess")}</span>
            <input type="number" inputMode="decimal" value={revealed && guess !== null ? String(guess) : draft} step={step} min={min} max={max}
              disabled={revealed} onChange={(e) => onDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && state.reveal()} />
          </label>
        ) : (
          <span className="lp-predict-guess">{guess === null ? t("lpGuessHere") : `${t("lpYourGuess")}: ${format(guess)}`}</span>
        )}
        {revealed ? (
          <button type="button" className="lp-btn" onClick={retry}>{t("lpTryAgain")}</button>
        ) : (
          <button type="button" className="lp-btn lp-btn--primary" disabled={guess === null} onClick={state.reveal}>{t("lpReveal")}</button>
        )}
      </div>
      {revealed && error !== null && (
        <div className={hit ? "lp-predict-result is-hit" : "lp-predict-result is-miss"}>
          <dl>
            <div><dt>{t("lpTruth")}</dt><dd>{format(state.truth)}</dd></div>
            <div><dt>{t("lpError")}</dt><dd>{error >= 0 ? "+" : "−"}{format(Math.abs(error))}</dd></div>
          </dl>
          <p>{t(hit ? "lpHit" : "lpMiss", { tol: format(state.tolerance) })}</p>
        </div>
      )}
      {state.challengeId && <ChallengeRecord id={state.challengeId} />}
      {revealed && explain && <PredictExplain key={history.length} {...explain} />}
    </section>
  );
}
