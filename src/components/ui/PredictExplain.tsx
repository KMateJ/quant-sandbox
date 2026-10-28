import { useState } from "react";
import { useI18n } from "../../i18n";

/// One candidate reason; wrong ones name a common misconception and say why it fails.
export type ExplainOption = { text: string; feedback: string; correct?: boolean };
export type PredictExplainSpec = {
  question: string;
  options: ExplainOption[];
  /// Called once, with whether the first pick of this round was right (later re-picks are not scored).
  onFirstPick?: (correct: boolean) => void;
};

/// The "explain" step of predict–observe–explain: after the reveal, the reader picks why the answer is what it is.
export default function PredictExplain({ question, options, onFirstPick }: PredictExplainSpec) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const choice = picked === null ? null : options[picked];
  const pick = (i: number) => {
    if (picked === null) onFirstPick?.(Boolean(options[i].correct));
    setPicked(i);
  };

  return (
    <fieldset className="lp-explain">
      <legend>{t("lpExplainTitle")}</legend>
      <p className="lp-explain-question">{question}</p>
      <div className="lp-explain-options">
        {options.map((o, i) => (
          <label key={i} className={picked === i ? (o.correct ? "lp-explain-option is-right" : "lp-explain-option is-wrong") : "lp-explain-option"}>
            <input type="radio" data-layout-allow="radio inside a full-width label: the label row is the tap target" name={question} checked={picked === i} onChange={() => pick(i)} />
            <span>{o.text}</span>
          </label>
        ))}
      </div>
      {choice && (
        <p className="lp-explain-feedback" role="status">
          <strong>{t(choice.correct ? "lpExplainRight" : "lpExplainWrong")}</strong> {choice.feedback}
        </p>
      )}
    </fieldset>
  );
}
