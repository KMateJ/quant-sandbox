import PredictExplain, { type PredictExplainSpec } from "../../../components/ui/PredictExplain";
import SegmentedControl from "../../../components/ui/SegmentedControl";
import type { PredictRevealState } from "../../../components/ui/usePredictReveal";
import { useI18n } from "../../../i18n";
import { formatBp, type CtdTraits } from "../ctdSwitch.math";
import type { DeliverableBond } from "../treasuryFutures.math";

const OPTIONS = [
  ["duration", "highestDuration"], ["coupon", "highestCoupon"], ["factor", "lowestFactor"], ["maturity", "shortestMaturity"],
] as const;

/// Predict-the-CTD round: pick a bond for a given yield rise; the explorer stays hidden until the reveal.
export default function CtdPredict({ state, bonds, traits, shiftBp }: {
  state: PredictRevealState;
  bonds: DeliverableBond[];
  traits: CtdTraits;
  shiftBp: number;
}) {
  const { t } = useI18n();
  const { guess, revealed, hit, history } = state;
  const truthId = bonds[state.truth]?.id ?? "";
  const none = !OPTIONS.some(([, trait]) => traits[trait]);
  const explain: PredictExplainSpec = {
    question: t("tfExplainQuestion"),
    options: [
      ...OPTIONS.map(([key, trait]) => ({
        text: t(`tfExplainOpt_${key}`), correct: traits[trait],
        feedback: traits[trait] ? t(`tfExplainRight_${key}`) : t("tfExplainNot"),
      })),
      { text: t("tfExplainOpt_none"), correct: none, feedback: none ? t("tfExplainRight_none") : t("tfExplainNoneWrong") },
    ],
  };
  return <section className="lp-predict" aria-live="polite">
    <div className="lp-predict-head">
      <span className="lp-predict-title">{t("lpPredictTitle")}</span>
      {history.length > 0 && <span className="lp-predict-score">{t("lpAttempts", { hits: history.filter((h) => h.hit).length, n: history.length })}</span>}
    </div>
    <p className="lp-predict-prompt">{t("tfPredictPrompt", { bp: formatBp(shiftBp) })}</p>
    <div className="lp-predict-row">
      <SegmentedControl ariaLabel={t("tfPredictPick")} value={guess ?? -1} onChange={state.setGuess}
        options={bonds.map((bond, i) => ({ value: i, label: bond.id }))} />
      {revealed
        ? <button type="button" className="lp-btn" onClick={state.retry}>{t("lpTryAgain")}</button>
        : <button type="button" className="lp-btn lp-btn--primary" disabled={guess === null} onClick={state.reveal}>{t("lpReveal")}</button>}
    </div>
    {revealed && <div className={hit ? "lp-predict-result is-hit" : "lp-predict-result is-miss"}>
      <p>{t(hit ? "tfPredictHit" : "tfPredictMiss", { bond: t("tfBondId", { id: truthId }), bp: formatBp(shiftBp) })}</p>
    </div>}
    {revealed && <PredictExplain key={history.length} {...explain} />}
  </section>;
}
