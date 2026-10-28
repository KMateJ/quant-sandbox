import { useState } from "react";
import { Panel } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { rallyOutcome } from "../callable.math";
import { pct, signed, signedPct } from "../callableFormat";
import type { CallableModel } from "../useCallable";

const RALLY = 0.015;
const CHOICES = ["more", "less"] as const;
type Choice = (typeof CHOICES)[number];

/// Predict round: yields fall 150 bp from the handle; does the callable gain more or less than the straight bond?
export default function CallablePredict({ lab }: { lab: CallableModel }) {
  const { spec, y } = lab;
  const key = JSON.stringify(spec);
  // A new bond starts a fresh round; moving the handle does not.
  const [round, setRound] = useState<{ key: string; choice: Choice | null; revealed: { from: number; to: number } | null }>({ key, choice: null, revealed: null });
  const current = round.key === key ? round : { key, choice: null, revealed: null };
  const { t } = useI18n();
  const to = Math.max(0.0005, y - RALLY);
  const live = rallyOutcome(spec, y, to);
  const out = current.revealed ? rallyOutcome(spec, current.revealed.from, current.revealed.to) : null;
  const right = out ? (out.callable.points > out.straight.points) === (current.choice === "more") : false;
  const set = (patch: Partial<typeof current>) => setRound({ ...current, ...patch });

  return (
    <Panel title={t("cbPredictTitle")}>
      {!lab.callable ? <p className="cb-hint">{t("cbNotCallable")}</p> : (
      <section className="lp-predict" aria-live="polite">
        <p className="lp-predict-prompt">{t("cbPredictPrompt", { bp: Math.round((y - to) * 10_000), from: pct(y), to: pct(to) })}</p>
        <div className="lp-explain-options">
          {CHOICES.map((c) => (
            <label key={c} className={current.choice === c ? "lp-explain-option is-selected" : "lp-explain-option"}>
              <input type="radio" data-layout-allow="radio inside a full-width label: the label row is the tap target" name="cb-predict" checked={current.choice === c} disabled={!!out} onChange={() => set({ choice: c })} />
              <span>{t(c === "more" ? "cbChoiceMore" : "cbChoiceLess")}</span>
            </label>
          ))}
        </div>
        {out ? (
          <>
            <dl className={right ? "lp-predict-result is-hit" : "lp-predict-result is-miss"}>
              <div><dt>{t("cbStraight")}</dt><dd>{signed(out.straight.points)} ({signedPct(out.straight.pct)})</dd></div>
              <div><dt>{t("cbCallable")}</dt><dd>{signed(out.callable.points)} ({signedPct(out.callable.pct)})</dd></div>
            </dl>
            <p className="cb-hint">{t(right ? "cbPredictRight" : "cbPredictWrong")}</p>
            <button type="button" className="lp-btn" onClick={() => set({ choice: null, revealed: null })}>{t("lpTryAgain")}</button>
          </>
        ) : (
          <button type="button" className="lp-btn lp-btn--primary" disabled={current.choice === null || !Number.isFinite(live.callable.points)}
            onClick={() => set({ revealed: { from: y, to } })}>{t("lpReveal")}</button>
        )}
      </section>
      )}
    </Panel>
  );
}
