import { useState } from "react";
import { lineCoefficients, type SketchPoint } from "../../../components/charts";
import { PredictReveal, usePredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { BETA_TOLERANCE } from "../capm.math";
import type { CapmLab } from "../useCapmLab";
import BetaChart from "./BetaChart";
import BetaStats from "./BetaStats";

type Props = { lab: CapmLab; isMobile: boolean };

const fmtBeta = (v: number) => v.toFixed(2);

/// Beta explorer: estimate β by drawing a line through the scatter, then reveal the OLS slope.
export default function BetaTab({ lab, isMobile }: Props) {
  const { t } = useI18n();
  const [line, setLine] = useState<SketchPoint[]>([]);
  const sample = `${lab.seed}|${lab.dispersion}|${lab.beta}|${lab.marketReturn}|${lab.riskFree}`;
  const pr = usePredictReveal({ truth: lab.regression.slope, tolerance: BETA_TOLERANCE, resetKey: sample });

  // A new round (a new sample, or "Try again" after a reveal) clears the drawn line.
  const [prev, setPrev] = useState({ sample, revealed: pr.revealed });
  if (prev.sample !== sample || prev.revealed !== pr.revealed) {
    if (prev.sample !== sample || prev.revealed) setLine([]);
    setPrev({ sample, revealed: pr.revealed });
  }

  const onLine = (next: SketchPoint[]) => {
    setLine(next);
    pr.setGuess(lineCoefficients(next)?.slope ?? null);
  };

  return (
    <div className="capm-beta-tab">
      <div className="chart-wrap">
        <BetaChart
          observations={lab.observations}
          regression={lab.regression}
          revealed={pr.revealed}
          line={line}
          onLine={onLine}
          isMobile={isMobile}
        />
      </div>
      <PredictReveal state={pr} prompt={t("capmPredictPrompt")} format={fmtBeta} input="plot" explain={{
        question: t("capmExplainQuestion"),
        options: (["B", "A", "D", "C"] as const).map((k) => ({
          text: t(`capmExplain${k}`),
          feedback: t(`capmExplain${k}Feedback`),
          correct: k === "A",
        })),
      }} />
      <BetaStats
        regression={lab.regression}
        correlation={lab.corr}
        revealed={pr.revealed}
        dispersion={lab.dispersion}
        onDispersion={lab.setDispersion}
        seed={lab.seed}
        onSeed={lab.setSeed}
      />
    </div>
  );
}
