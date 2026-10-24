import { useState } from "react";
import type { ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { ChallengeRecord, PredictExplain } from "../../../components/ui";
import { recordChallenge } from "../../../lib/game/challengeScores";
import { useI18n } from "../../../i18n";
import { formatDelta } from "../effects.math";
import { pct2, YC_COLORS } from "../curveChartUtils";
import { MATURITY_LABELS } from "../presets";
import type { YieldCurveModel } from "../useYieldCurve";
import { drawScenario, isFeasible, shockedNodes } from "../yieldCurve.math";
import type { CurveNode, FactorScenario } from "../yieldCurve.types";
import MaturityChart from "./MaturityChart";

const SCENARIOS: FactorScenario[] = ["parallel", "steepen", "flatten", "curvature"];
const CHALLENGE = "yield-shock-pick";
const record = (hit: boolean) => recordChallenge(CHALLENGE, hit, Date.now());

/// The first drawn shock from `seed` on that still bootstraps on `base` (a custom curve can rule some out).
function firstFeasibleRound(base: CurveNode[], seed: number) {
  for (let s = seed; s < seed + 50; s++) {
    const shock = drawScenario(s);
    const after = shockedNodes(base, shock);
    if (isFeasible(after)) return { shock, after };
  }
  return null;
}

/// "Which shock was it?": a hidden random shock moves the par curve; the reader names the kind, then sees
/// the size and why the other three do not match.
export default function ShockPredict({ model }: { model: YieldCurveModel }) {
  const { t } = useI18n();
  const [seed, setSeed] = useState(1);
  const base = model.nodes;
  const round = firstFeasibleRound(base, seed);
  if (!round) return null;

  const { shock, after } = round;
  const bp = formatDelta(shock.sizeBp / 10000);
  const options = SCENARIOS.map((id) => {
    const signature = t(`ycPredictFeed_${id}`);
    return { text: t(`ycShockName_${id}`), feedback: id === shock.scenario ? `${signature} ${t("ycPredictSize", { bp })}` : signature, correct: id === shock.scenario };
  });
  const rates = [...base, ...after].map((n) => n.rate);
  const series: ScatterSeries[] = [
    { key: "before", label: t("ycShockStartCurve"), color: YC_COLORS.baseline, line: true, dash: "4 4", opacity: 0.7, strokeWidth: 1.6, legend: true, points: base.map((n, i) => ({ x: i, y: n.rate })) },
    { key: "after", label: t("ycPredictAfter"), color: YC_COLORS.par, line: true, strokeWidth: 2.8, legend: true, points: after.map((n, i) => ({ x: i, y: n.rate })) },
    { key: "after-pts", label: t("ycPredictAfter"), color: YC_COLORS.par, radius: 5, legend: false, points: after.map((n, i) => ({ x: i, y: n.rate, label: MATURITY_LABELS[i] })) },
  ];

  return (
    <ChartContainer
      title={t("ycPredictTitle")}
      actions={<button type="button" className="preset-btn" onClick={() => setSeed(seed + 1)}>{t("ycPredictNext")}</button>}
    >
      <p className="yc-shock-readout">{t("ycPredictIntro")}</p>
      <div className="chart-wrap">
        <MaturityChart labels={MATURITY_LABELS} series={series} yDomain={[Math.max(0, Math.min(...rates) - 0.004), Math.max(...rates) + 0.004]} yFormat={pct2} yLabel={t("ycYieldAxis")} />
      </div>
      <PredictExplain key={seed} question={t("ycPredictQuestion")} options={options} onFirstPick={record} />
      <ChallengeRecord id={CHALLENGE} />
    </ChartContainer>
  );
}
