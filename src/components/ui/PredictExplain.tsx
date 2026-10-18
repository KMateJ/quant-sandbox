import { useState } from "react";
import { useI18n } from "../../i18n";

/// One candidate reason; wrong ones name a common misconception and say why it fails.
export type ExplainOption = { text: string; feedback: string; correct?: boolean };
export type PredictExplainSpec = { question: string; options: ExplainOption[] };

/// The "explain" step of predict–observe–explain: after the reveal, the reader picks why the answer is what it is.
export default function PredictExplain({ question, options }: PredictExplainSpec) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number | null>(null);
  const choice = picked === null ? null : options[picked];

  return (
    <fieldset className="lp-explain">
      <legend>{t("lpExplainTitle")}</legend>
      <p className="lp-explain-question">{question}</p>
      <div className="lp-explain-options">
        {options.map((o, i) => (
          <label key={i} className={picked === i ? (o.correct ? "lp-explain-option is-right" : "lp-explain-option is-wrong") : "lp-explain-option"}>
            <input type="radio" name={question} checked={picked === i} onChange={() => setPicked(i)} />
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
