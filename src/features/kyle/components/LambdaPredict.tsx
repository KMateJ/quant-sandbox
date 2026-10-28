import { ScatterChart, type ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import SliderField from "../../../components/SliderField";
import { PredictExplain, PredictReveal, usePredictReveal } from "../../../components/ui";
import { linearRegression } from "../../../lib/stats/regression";
import { useI18n } from "../../../i18n";
import { lambdaSample, lambdaStar } from "../kyle.math";
import type { KyleParams } from "../kyle.types";

/// "Estimate λ": Δp against total flow over 200 auctions; click the plot (or use the slider) to set a line through 0.
export default function LambdaPredict({ params, seed }: { params: KyleParams; seed: number }) {
  const { t } = useI18n();
  const truth = lambdaStar(params) * 1e4;
  const pts = lambdaSample(params, seed);
  const state = usePredictReveal({ truth, tolerance: 0.15 * truth, resetKey: `${seed}|${params.n}|${params.s}`, challengeId: "kyl-lambda" });
  const fx = Math.max(...pts.map((p) => Math.abs(p.flow)));
  const line = (slope: number) => [-fx, fx].map((x) => ({ x, y: (slope / 1e4) * x }));
  const ols = linearRegression(pts.map((p) => p.flow), pts.map((p) => p.dp)).slope * 1e4;
  const series: ScatterSeries[] = [{ key: "pts", label: t("kylAuctionsLabel"), color: "var(--chart-cloud)", radius: 3, opacity: 0.7, outline: false, points: pts.map((p) => ({ x: p.flow, y: p.dp })) }];
  if (state.guess !== null) series.push({ key: "you", label: t("kylYourLine"), color: "var(--primary)", line: true, strokeWidth: 2.4, points: line(state.guess) });
  if (state.revealed) series.push({ key: "ols", label: t("kylOlsLine"), color: "var(--negative)", line: true, dash: "5 4", strokeWidth: 2, points: line(ols) });
  const quiet = [
    { text: t("kylExplainMore"), feedback: t("kylExplainMoreFb"), correct: true },
    { text: t("kylExplainLess"), feedback: t("kylExplainLessFb") },
    { text: t("kylExplainSame"), feedback: t("kylExplainSameFb") },
  ];
  const allIn = [
    { text: t("kylExplainYes"), feedback: t("kylExplainYesFb") },
    { text: t("kylExplainNo"), feedback: t("kylExplainNoFb"), correct: true },
  ];
  return (
    <ChartContainer title={t("kylPredictTitle")}>
      <p className="kyl-caption">{t("kylPredictIntro")}</p>
      <div className="chart-wrap kyl-scatter">
        <ScatterChart
          series={series}
          xFormat={(v) => `${Math.round(v / 100) / 10}k`}
          yFormat={(v) => v.toFixed(2)}
          xLabel={t("kylFlowAxis")}
          yLabel={t("kylDpAxis")}
          onPlotClick={(x, y) => !state.revealed && x !== 0 && state.setGuess(Math.max(0, Math.round((y / x) * 1e5) / 10))}
        />
      </div>
      <SliderField label={t("kylYourLambda")} min={0} max={Math.ceil(truth * 3)} step={0.1} value={state.guess ?? 0} onChange={state.setGuess} formatValue={(v) => v.toFixed(1)} />
      <PredictReveal state={state} input="plot" prompt={t("kylPredictPrompt")} format={(v) => `${v.toFixed(1)} ${t("kylLambdaUnit")}`} explain={{ question: t("kylExplainQuietQ"), options: quiet }} />
      <PredictExplain question={t("kylExplainAllInQ")} options={allIn} />
    </ChartContainer>
  );
}
