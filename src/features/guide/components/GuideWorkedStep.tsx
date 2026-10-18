import { InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import { formatResult } from "../guide.check.logic";
import type { GuideWorkedStep as Step } from "../guide.content.types";
import type { CitationFinder } from "../guide.inline";
import GuideInline from "./GuideInline";

type GuideWorkedStepProps = {
  step: Step;
  index: number;
  /// The result is a blank the reader fills in.
  blank: boolean;
  /// Show the correct value next to a blank.
  revealed: boolean;
  value: string;
  verdict: boolean | undefined;
  cite?: CitationFinder;
  onChange: (value: string) => void;
};

/// One numbered step of a worked example: explanation, formula and its result (given or blank).
export default function GuideWorkedStep({ step, index, blank, revealed, value, verdict, cite, onChange }: GuideWorkedStepProps) {
  const { t, language } = useI18n();
  const { result } = step;
  const state = verdict === undefined ? undefined : verdict ? "correct" : "wrong";

  return (
    <li className="guide-worked-step" data-state={blank ? state : undefined}>
      <p className="guide-worked-text"><GuideInline text={step.text} cite={cite} /></p>
      {(step.tex || result) && (
        <div className="guide-worked-calc">
          {step.tex && <InlineMath math={`\\displaystyle ${step.tex}`} />}
          {result && (step.tex ? <span className="guide-worked-eq" aria-hidden="true">=</span> : null)}
          {result && !blank && <span className="guide-worked-result">{formatResult(result.value, result.unit, language)}</span>}
          {result && blank && (
            <label className="guide-worked-blank">
              <span className="guide-visually-hidden">{t("guideWorkedStepInput", { n: index + 1 })}</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                className="guide-answer-input"
                data-blank
                value={value}
                readOnly={revealed}
                aria-invalid={state === "wrong" || undefined}
                onChange={(e) => onChange(e.target.value)}
              />
              {result.unit && <span className="guide-check-unit">{result.unit}</span>}
              {revealed && <span className="guide-worked-solution">{formatResult(result.value, result.unit, language)}</span>}
            </label>
          )}
        </div>
      )}
    </li>
  );
}
