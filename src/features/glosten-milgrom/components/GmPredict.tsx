import { useMemo, useState } from "react";
import { ChartContainer } from "../../../components/layout";
import { PredictExplain, PredictReveal, usePredictReveal } from "../../../components/ui";
import { subSeed } from "../../../lib/game/seed";
import { useI18n } from "../../../i18n";
import { drawTrades, gmPath } from "../glostenMilgrom.math";
import type { GmParams } from "../glostenMilgrom.types";

const PREDICT_TRADES = 12;

/// "What does the maker believe now?": 12 trades, no chart; guess P(V = 1), then reveal the Bayes belief.
export default function GmPredict({ params, seed }: { params: GmParams; seed: number }) {
  const { t } = useI18n();
  const [round, setRound] = useState(0);
  const { pi, prior, trueV } = params;
  const trades = useMemo(() => drawTrades({ pi, prior, trueV, n: PREDICT_TRADES }, subSeed(seed, 11 + round)), [pi, prior, trueV, seed, round]);
  const truth = gmPath(trades, params.pi, params.prior)[PREDICT_TRADES - 1].next;
  const state = usePredictReveal({ truth, tolerance: 0.05, resetKey: `${round}|${seed}`, challengeId: "glm-belief" });
  const quarter = [
    { text: t("glmExplainSame"), feedback: t("glmExplainSameFb") },
    { text: t("glmExplainHalf"), feedback: t("glmExplainHalfFb") },
    { text: t("glmExplainQuarter"), feedback: t("glmExplainQuarterFb"), correct: true },
  ];
  const zero = [
    { text: t("glmExplainZero"), feedback: t("glmExplainZeroFb"), correct: true },
    { text: t("glmExplainWider"), feedback: t("glmExplainWiderFb") },
    { text: t("glmExplainUnchanged"), feedback: t("glmExplainUnchangedFb") },
  ];
  return (
    <ChartContainer
      title={t("glmPredictTitle")}
      actions={<button type="button" className="preset-btn" onClick={() => setRound(round + 1)}>{t("glmPredictNext")}</button>}
    >
      <p className="glm-caption">{t("glmPredictSetup", { pi: Math.round(params.pi * 100), prior: params.prior.toFixed(2) })}</p>
      <div className="glm-strip glm-strip--static" aria-label={t("glmStripLabel")}>
        {trades.map((tr, i) => (
          <span key={i} className={`glm-tile glm-tile--${tr === "B" ? "buy" : "sell"}`}>{tr}</span>
        ))}
      </div>
      <PredictReveal
        state={state}
        prompt={t("glmPredictPrompt")}
        format={(v) => v.toFixed(3)}
        step={0.01}
        min={0}
        max={1}
        explain={{ question: t("glmExplainQuarterQ"), options: quarter }}
      />
      <PredictExplain question={t("glmExplainZeroQ")} options={zero} />
    </ChartContainer>
  );
}
