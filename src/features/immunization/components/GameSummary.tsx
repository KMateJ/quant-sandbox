import { useI18n } from "../../../i18n";
import { bpOf, signedBp } from "../immunization.math";
import type { ImmunizationModel } from "../useImmunizationGame";

/// The end screen: the final surplus in bp of the liability next to the two benchmarks.
export default function GameSummary({ model }: { model: ImmunizationModel }) {
  const { t } = useI18n();
  const { game, bench } = model;
  const last = bench.buyHold.length - 1;
  return (
    <section className="im-summary" aria-live="polite">
      <h4 className="im-subtitle">{t("imSummary")}</h4>
      <p className="im-score">{t("imScore", { bp: signedBp(bpOf(game.history[game.history.length - 1].surplus)) })}</p>
      <p>{t("imScoreVs", { hold: signedBp(bpOf(bench.buyHold[last])), auto: signedBp(bpOf(bench.autoImmunised[last])) })}</p>
      <p className="im-hint">{t("imScoreHint")}</p>
    </section>
  );
}
