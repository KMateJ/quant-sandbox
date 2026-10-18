import { useEffect, useRef, type FormEvent } from "react";
import { useI18n } from "../../../i18n";
import type { GuideWorkedBlock } from "../guide.content.types";
import type { CitationFinder } from "../guide.inline";
import { useWorkedFade } from "../useWorkedFade";
import GuideInline from "./GuideInline";
import GuideWorkedStep from "./GuideWorkedStep";

/// A worked example shown in full; "Try it yourself" blanks the last result, and each solved round blanks one more.
export default function GuideWorked({ block, cite }: { block: GuideWorkedBlock; cite?: CitationFinder }) {
  const { t, language } = useI18n();
  const fade = useWorkedFade(block.steps, language === "hu");
  const ref = useRef<HTMLFormElement>(null);
  const { level, max, blanks, verdicts, revealed, allCorrect } = fade;

  // A new round starts at the first blank, so keyboard readers can type straight away.
  useEffect(() => {
    if (level > 0) ref.current?.querySelector<HTMLInputElement>("input[data-blank]")?.focus();
  }, [level]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (level > 0 && !revealed && !allCorrect) fade.check();
  };

  const status = !verdicts ? null : allCorrect ? (level === max ? "guideWorkedSolved" : "guideWorkedAllCorrect") : "guideWorkedSomeWrong";

  return (
    <form ref={ref} className="guide-worked" onSubmit={submit} data-level={level}>
      <div className="guide-practice-head">
        <span className="guide-practice-label">{t("guideWorkedLabel")}</span>
        {level > 0 && <span className="guide-worked-progress">{t("guideWorkedBlanks", { count: blanks.length, total: max })}</span>}
      </div>
      <h3 className="guide-worked-title"><GuideInline text={block.title} /></h3>
      {level > 0 && <p className="guide-worked-hint">{t("guideWorkedHint")}</p>}
      <ol className="guide-worked-steps">
        {block.steps.map((step, i) => (
          <GuideWorkedStep
            key={i}
            step={step}
            index={i}
            blank={blanks.includes(i)}
            revealed={revealed}
            value={fade.inputs[i] ?? ""}
            verdict={verdicts?.[i]}
            cite={cite}
            onChange={(v) => fade.setInput(i, v)}
          />
        ))}
      </ol>
      <p className="guide-check-verdict" role="status" aria-live="polite" data-ok={allCorrect || undefined}>{status && t(status)}</p>
      <div className="guide-practice-actions">
        {level === 0 && (
          <button type="button" className="lp-btn lp-btn--primary" onClick={fade.fadeMore}>{t("guideWorkedTry")}</button>
        )}
        {level > 0 && !revealed && !allCorrect && (
          <button type="submit" className="lp-btn lp-btn--primary">{t("guideCheckSubmit")}</button>
        )}
        {level > 0 && allCorrect && level < max && (
          <button type="button" className="lp-btn lp-btn--primary" onClick={fade.fadeMore}>{t("guideWorkedFadeMore")}</button>
        )}
        {level > 0 && !revealed && !allCorrect && (
          <button type="button" className="lp-btn" onClick={fade.reveal}>{t("guideWorkedShowSolution")}</button>
        )}
        {level > 0 && <button type="button" className="lp-btn" onClick={fade.showFull}>{t("guideWorkedShowFull")}</button>}
      </div>
    </form>
  );
}
