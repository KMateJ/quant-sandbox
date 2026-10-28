import type { CSSProperties } from "react";
import { useI18n } from "../../i18n";
import ChallengeRecord from "./ChallengeRecord";
import { MIN_VERDICT_ROUNDS, trackFraction } from "./rangeGuess.logic";
import type { RangeGuessState } from "./useRangeGuess";

type Props = {
  state: RangeGuessState;
  /// The question, e.g. "Set a 90% range for next year's return."
  prompt: string;
  format: (v: number) => string;
  min: number;
  max: number;
  step: number;
  /// Appended to every formatted value (e.g. "%").
  unit?: string;
  /// One short line under the prompt (how the truth is produced, what starts a new round).
  hint?: string;
  /// A comparison interval shown on the track after the reveal (e.g. the model's own 90% interval).
  reference?: { lo: number; hi: number; label: string };
};

const share = (v: number) => `${Math.round(v * 100)}%`;
const at = (name: string, f: number) => ({ [name]: f }) as CSSProperties;
const VERDICT_KEY = { pending: "rgVerdictPending", tooNarrow: "rgTooNarrow", tooWide: "rgTooWide", calibrated: "rgCalibrated" } as const;
const SHOWN_ROUNDS = 24;

/// Calibration panel: drag two thumbs to a `nominal` interval, reveal the outcome, and track the hit rate over rounds.
export default function RangeGuess({ state, prompt, format, min, max, step, unit = "", hint, reference }: Props) {
  const { t } = useI18n();
  const { lo, hi, revealed, outcome, history } = state;
  const fmt = (v: number) => `${format(v)}${unit}`;
  const f = (v: number) => trackFraction(v, min, max);
  const pct = share(state.nominal);
  const n = history.length;

  return (
    <section className="lp-predict rg">
      <div className="lp-predict-head">
        <span className="lp-predict-title">{t("rgTitle", { pct })}</span>
      </div>
      <p className="lp-predict-prompt">{prompt}</p>
      {hint && <p className="rg-hint">{hint}</p>}

      <div className={f(lo) > 0.5 ? "rg-track is-lo-top" : "rg-track"} style={{ ...at("--rg-lo", f(lo)), ...at("--rg-hi", f(hi)) }}>
        <div className="rg-rail" aria-hidden="true" />
        {revealed && reference && (
          <div className="rg-ref" style={{ ...at("--rg-lo", f(reference.lo)), ...at("--rg-hi", f(reference.hi)) }} title={reference.label} aria-hidden="true" />
        )}
        <div className="rg-fill" aria-hidden="true" />
        {revealed && outcome !== null && (
          <div className={state.hit ? "rg-outcome is-hit" : "rg-outcome is-miss"} style={at("--rg-at", f(outcome))} aria-hidden="true" />
        )}
        <input type="range" className="rg-thumb" data-layout-allow="dual-thumb range: both inputs share one track" min={min} max={max} step={step} value={lo} disabled={revealed}
          aria-label={t("rgLower")} aria-valuetext={fmt(lo)} onChange={(e) => state.setRange(Math.min(Number(e.target.value), hi), hi)} />
        <input type="range" className="rg-thumb" data-layout-allow="dual-thumb range: both inputs share one track" min={min} max={max} step={step} value={hi} disabled={revealed}
          aria-label={t("rgUpper")} aria-valuetext={fmt(hi)} onChange={(e) => state.setRange(lo, Math.max(Number(e.target.value), lo))} />
      </div>
      <div className="rg-scale" aria-hidden="true"><span>{fmt(min)}</span><span>{fmt(max)}</span></div>

      <div className="lp-predict-row rg-row">
        <span className="rg-interval">
          {t("rgInterval", { pct })}: <strong>{fmt(lo)} … {fmt(hi)}</strong>
        </span>
        {revealed ? (
          <button type="button" className="lp-btn" onClick={state.next}>{t("rgNext")}</button>
        ) : (
          <button type="button" className="lp-btn lp-btn--primary" onClick={state.reveal}>{t("lpReveal")}</button>
        )}
      </div>

      <div aria-live="polite">
        {revealed && outcome !== null && (
          <div className={state.hit ? "lp-predict-result is-hit" : "lp-predict-result is-miss"}>
            <dl>
              <div><dt>{t("rgOutcome")}</dt><dd>{fmt(outcome)}</dd></div>
              <div><dt>{t("rgScore")}</dt><dd>{state.score !== null ? fmt(state.score) : "—"}</dd></div>
              {reference && <div><dt>{reference.label}</dt><dd>{fmt(reference.lo)} … {fmt(reference.hi)}</dd></div>}
            </dl>
            <p>{t(state.hit ? "rgInside" : "rgOutside")} {t("rgScoreHint")}</p>
          </div>
        )}
        {n > 0 && (
          <div className={`rg-calibration is-${state.verdict}`}>
            <p>
              {t("rgTally", { k: state.hits, n, rate: share(state.hitRate), pct })} · {t("rgMeanScore")}: {fmt(state.meanScore)}
            </p>
            <p className="rg-verdict">{t(VERDICT_KEY[state.verdict], { n: MIN_VERDICT_ROUNDS })}</p>
            <ol className="rg-rounds" aria-label={t("rgRoundsAria")}>
              {history.slice(-SHOWN_ROUNDS).map((r, i) => (
                <li key={n - Math.min(n, SHOWN_ROUNDS) + i} className={r.hit ? "is-hit" : "is-miss"}
                  title={`${fmt(r.lo)} … ${fmt(r.hi)} → ${fmt(r.outcome)}`} />
              ))}
            </ol>
          </div>
        )}
        {state.challengeId && <ChallengeRecord id={state.challengeId} />}
      </div>
    </section>
  );
}
