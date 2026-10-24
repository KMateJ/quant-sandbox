import { useSyncExternalStore } from "react";
import type { ChallengeStats } from "../../lib/game/game.types";
import { readChallenges, subscribeChallenges } from "../../lib/game/challengeScores";

const EMPTY: Readonly<Record<string, ChallengeStats>> = {};
const serverSnapshot = () => EMPTY;

/// Saved stats of challenge `id` (live across tabs); null when it was never played or no id is given.
export function useChallengeStats(id?: string): ChallengeStats | null {
  const all = useSyncExternalStore(subscribeChallenges, readChallenges, serverSnapshot);
  return (id && all[id]) || null;
}
