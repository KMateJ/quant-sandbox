import { useMemo, useState } from "react";
import { ChartContainer } from "../../../../components/layout";
import { ChallengeRecord, PredictExplain } from "../../../../components/ui";
import { recordChallenge } from "../../../../lib/game/challengeScores";
import { nextSeed } from "../../../../lib/game/seed";
import { useI18n } from "../../../../i18n";
import { alphaLadder, challengeFundIndex, challengeWindow, firstInsignificant, isSignificant, LADDER_MODELS } from "../../alpha.math";
import { FUND_SPECS, syntheticFund } from "../../famaFrench.math";
import type { FfData, ModelId } from "../../famaFrench.types";
import AlphaLadder from "./AlphaLadder";

const CHALLENGE = "ffm-alpha";
const OPTIONS = [...LADDER_MODELS, "none"] as const;

/// First seed from `seed` on whose fund has a significant CAPM alpha on its random 20-year window.
function round(data: FfData, seed: number) {
  for (let s = seed; s < seed + 60; s++) {
    const w = challengeWindow(s, data.months.length);
    const series = syntheticFund(FUND_SPECS[challengeFundIndex(s)], data, s);
    const ladder = alphaLadder(series, data, w);
    if (isSignificant(ladder[0].fit.alphaT)) return { seed: s, ladder, truth: firstInsignificant(ladder) };
  }
  return null;
}

/// "Where did the alpha go?": name the first model in which the CAPM alpha stops being significant.
export default function AlphaChallenge({ data }: { data: FfData }) {
  const { t } = useI18n();
  const [seed, setSeed] = useState(1);
  const [answered, setAnswered] = useState<number | null>(null);
  const r = useMemo(() => round(data, seed), [data, seed]);
  if (!r) return null;
  const name = (o: ModelId | "none") => t(o === "none" ? "ffmNever" : `ffmModel_${o}`);
  const options = OPTIONS.map((o) => ({
    text: name(o),
    feedback: t("ffmAlphaFeedback", { truth: name(r.truth) }),
    correct: o === r.truth,
  }));
  return (
    <ChartContainer
      title={t("ffmAlphaChallengeTitle")}
      actions={<button type="button" className="preset-btn" onClick={() => { setSeed(nextSeed(r.seed)); setAnswered(null); }}>{t("ffmNextRound")}</button>}
    >
      <p className="control-hint">{t("ffmAlphaChallengeQ", { a: (r.ladder[0].fit.alphaAnnual * 100).toFixed(1) })}</p>
      <PredictExplain
        key={r.seed}
        question={t("ffmAlphaChallengePick")}
        options={options}
        onFirstPick={(ok) => {
          recordChallenge(CHALLENGE, ok, Date.now());
          setAnswered(r.seed);
        }}
      />
      {answered === r.seed && <AlphaLadder rungs={r.ladder} current={null} />}
      <ChallengeRecord id={CHALLENGE} />
    </ChartContainer>
  );
}
