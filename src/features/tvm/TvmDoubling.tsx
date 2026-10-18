import { PredictReveal, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import { doublingTime, ruleOf72 } from "./tvm.math";

const years = (v: number) => v.toFixed(2);

/// "How long to double?" — guess the doubling time at the current rate, then compare with the rule of 72.
export default function TvmDoubling({ rate }: { rate: number }) {
  const { t } = useI18n();
  const truth = doublingTime(rate);
  const state = usePredictReveal({ truth, tolerance: 0.5 });

  if (!Number.isFinite(truth)) return <p className="tvm-double-note">{t("tvmDoubleNoRate")}</p>;
  const rule = ruleOf72(rate);

  return (
    <div className="tvm-double">
      <PredictReveal state={state} prompt={t("tvmDoublePrompt")} format={years} input="number" step={0.5} min={0}
        explain={{
          question: t("tvmDoubleExplainQ"),
          options: [
            { text: t("tvmDoubleExplain100"), feedback: t("tvmDoubleExplain100Fb") },
            { text: t("tvmDoubleExplainRight"), feedback: t("tvmDoubleExplainRightFb"), correct: true },
            { text: t("tvmDoubleExplainLinear"), feedback: t("tvmDoubleExplainLinearFb") },
          ],
        }} />
      {state.revealed && (
        <p className="tvm-double-note">{t("tvmDoubleRule72", { rule: years(rule), diff: years(Math.abs(rule - truth)) })}</p>
      )}
    </div>
  );
}
