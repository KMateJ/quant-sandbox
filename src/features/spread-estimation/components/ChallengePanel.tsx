import { useMemo, useState } from "react";
import { ChallengeRecord } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { recordChallenge } from "../../../lib/game/challengeScores";
import { subSeed } from "../../../lib/game/seed";
import { challengeParams, CLASSIFY_TARGET, simulateTape } from "../spreadEstimation.math";
import { useClassifyGame } from "../useClassifyGame";
import ClassifyPlay from "./ClassifyPlay";

const CHALLENGE = "spe-classify";

/// Challenge: one scored classify game (σ/S = 0.25); a hit is at least 80% correct.
export default function ChallengePanel({ seed, isMobile }: { seed: number; isMobile: boolean }) {
  const { t } = useI18n();
  const [round, setRound] = useState(0);
  const gameSeed = subSeed(seed, 20 + round);
  const tape = useMemo(() => simulateTape(challengeParams(), gameSeed), [gameSeed]);
  const game = useClassifyGame(tape, gameSeed, (acc) => recordChallenge(CHALLENGE, acc >= CLASSIFY_TARGET, Date.now()));
  return (
    <div className="spe-tab">
      <p className="spe-lead">{t("speChallengeLead", { pct: Math.round(CLASSIFY_TARGET * 100) })}</p>
      <ClassifyPlay game={game} onRestart={() => setRound((r) => r + 1)} isMobile={isMobile} />
      {game.done && (
        <p className={game.accuracy >= CLASSIFY_TARGET ? "spe-verdict is-hit" : "spe-verdict is-miss"}>
          {t(game.accuracy >= CLASSIFY_TARGET ? "speChallengeHit" : "speChallengeMiss")}
        </p>
      )}
      <ChallengeRecord id={CHALLENGE} />
    </div>
  );
}
