import { useState } from "react";
import { recordChallenge } from "../../lib/game/challengeScores";
import type { TournamentResult } from "./avellanedaStoikov.types";

const CHALLENGE = "avs-beat";
/// Your certainty equivalent may trail AS's by at most this many dollars.
export const CE_SLACK = 1;

export type AvsChallengeResult = { yours: number; as: number; hit: boolean };

/// Scores a full tournament: your CE (index 0) against AS's (index 1), saved to the Sandbox record.
export function useAvsChallenge() {
  const [last, setLast] = useState<AvsChallengeResult | null>(null);
  const score = (r: TournamentResult) => {
    const yours = r.stats[0].ce;
    const as = r.stats[1].ce;
    const hit = yours >= as - CE_SLACK;
    recordChallenge(CHALLENGE, hit, Date.now());
    setLast({ yours, as, hit });
  };
  return { id: CHALLENGE, last, score };
}

export type AvsChallenge = ReturnType<typeof useAvsChallenge>;
