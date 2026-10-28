import { useMemo } from "react";
import { PredictReveal, usePredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { fmtCents, predictParams, ROLL_TOLERANCE, simulateTape } from "../spreadEstimation.math";
import TapeChart from "./TapeChart";

/// Predict: a fresh tape with the spread hidden; guess S in cents, then reveal it.
export default function PredictPanel({ seed, isMobile }: { seed: number; isMobile: boolean }) {
  const { t } = useI18n();
  const params = useMemo(() => predictParams(seed), [seed]);
  const tape = useMemo(() => simulateTape(params, seed), [params, seed]);
  const pr = usePredictReveal({ truth: params.S, tolerance: ROLL_TOLERANCE, resetKey: seed, challengeId: "spe-roll" });
  return (
    <div className="spe-tab">
      <div className="chart-wrap spe-chart">
        <TapeChart prints={tape} revealed={pr.revealed} isMobile={isMobile} />
      </div>
      <PredictReveal
        state={pr}
        prompt={t("spePredictPrompt")}
        format={fmtCents}
        step={1}
        min={0}
        max={30}
        explain={{
          question: t("speExplain1Q"),
          options: (["A", "B", "C"] as const).map((k) => ({ text: t(`speExplain1${k}`), feedback: t(`speExplain1${k}Fb`), correct: k === "B" })),
        }}
      />
    </div>
  );
}
