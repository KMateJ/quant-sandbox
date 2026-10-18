import { useState } from "react";
import { RangeGuess, useRangeGuess } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { covFromCorr, portfolioPoint, quizMix, volGuessDomain } from "../portfolioLab.math";
import type { usePortfolioModel } from "../usePortfolioModel";

type Props = { m: ReturnType<typeof usePortfolioModel> };

const pctNum = (v: number) => (v * 100).toFixed(1);
const key = (xs: readonly number[]) => xs.map((x) => x.toFixed(4)).join(",");

/// "How volatile is this mix?": a 90% range for the σ of a random mix that is not on the chart, using the current
/// assets and correlations; each round draws a new mix.
export default function VolCalibration({ m }: Props) {
  const { t } = useI18n();
  const [seed, setSeed] = useState(1);
  const sigmas = m.assets.map((a) => a.sigma);
  const weights = quizMix(m.assets.length, seed);
  const truth = portfolioPoint(weights, m.assets.map((a) => a.mu), covFromCorr(sigmas, m.corr)).vol;
  const [min, max] = volGuessDomain(sigmas);
  const guess = useRangeGuess({
    truth,
    initial: [0.1, 0.2],
    bounds: [min, max],
    resetKey: `${seed}|${key(m.corr.flat())}|${key(sigmas)}`,
  });
  const state = { ...guess, next: () => { setSeed((s) => s + 1); guess.next(); } };
  const mix = m.assets
    .map((a, i) => ({ name: a.name, w: weights[i], sigma: a.sigma }))
    .filter((x) => x.w > 0)
    .map((x) => `${x.name} ${Math.round(x.w * 100)}% (σ ${pctNum(x.sigma)}%)`)
    .join(" · ");

  return (
    <RangeGuess
      state={state}
      prompt={t("portfolioRgPrompt", { mix })}
      hint={t("portfolioRgHint")}
      format={pctNum}
      unit="%"
      min={min}
      max={max}
      step={0.005}
    />
  );
}
