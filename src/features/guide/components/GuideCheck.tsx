import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useI18n, type TranslationKey } from "../../../i18n";
import { judgeCheck, type CheckVerdict } from "../guide.check.logic";
import type { GuideCheckBlock } from "../guide.content.types";
import type { CitationFinder } from "../guide.inline";
import { recordCheck } from "../useGuideReview";
import GuideCheckInput from "./GuideCheckInput";
import GuideInline from "./GuideInline";

const FEEDBACK: Record<CheckVerdict, TranslationKey> = {
  correct: "guideCheckCorrect",
  high: "guideCheckTooHigh",
  low: "guideCheckTooLow",
  wrong: "guideCheckWrong",
  invalid: "guideCheckInvalid",
};

type GuideCheckProps = {
  block: GuideCheckBlock;
  cite?: CitationFinder;
  /// Shown above the prompt, e.g. the lesson a review question comes from.
  context?: ReactNode;
};

/// A "Check yourself" card: answer, check, and get feedback with the explanation; every answer is recorded for review.
export default function GuideCheck({ block, cite, context }: GuideCheckProps) {
  const { t, language } = useI18n();
  const name = useId();
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<CheckVerdict | null>(null);
  const [explained, setExplained] = useState(false);
  const { answer } = block;
  const correct = verdict === "correct";
  const locked = verdict !== null && verdict !== "invalid";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (locked) return;
    const v = judgeCheck(answer, answer.type === "number" ? text : choice, language === "hu");
    setVerdict(v);
    if (v !== "invalid") recordCheck(block.id, v === "correct");
  };

  const retry = () => {
    setVerdict(null);
    setExplained(false);
  };

  return (
    <form className="guide-check" onSubmit={submit} aria-labelledby={`${name}-prompt`} data-verdict={verdict ?? undefined}>
      <div className="guide-practice-head">
        <span className="guide-practice-label">{t("guideCheckLabel")}</span>
        {context}
      </div>
      <p id={`${name}-prompt`} className="guide-check-prompt"><GuideInline text={block.prompt} cite={cite} /></p>
      <div className="guide-check-answer">
        <GuideCheckInput
          answer={answer}
          name={name}
          text={text}
          choice={choice}
          locked={locked}
          onText={setText}
          onChoice={setChoice}
        />
        <div className="guide-practice-actions">
          {!locked && (
            <button type="submit" className="lp-btn lp-btn--primary" disabled={answer.type === "number" ? !text.trim() : choice === null}>
              {t("guideCheckSubmit")}
            </button>
          )}
          {locked && !correct && <button type="button" className="lp-btn" onClick={retry}>{t("guideCheckRetry")}</button>}
          {locked && !correct && !explained && (
            <button type="button" className="lp-btn" onClick={() => setExplained(true)}>{t("guideCheckShowExplain")}</button>
          )}
        </div>
      </div>
      <div className="guide-check-feedback" role="status" aria-live="polite">
        {verdict && <p className="guide-check-verdict">{t(FEEDBACK[verdict])}</p>}
        {(correct || explained) && <p className="guide-check-explain"><GuideInline text={block.explain} cite={cite} /></p>}
      </div>
    </form>
  );
}
