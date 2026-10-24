import type { ChallengeStats } from "./game.types";
import { onStorageKey, readJsonObject, writeJsonObject } from "./storage";

export const CHALLENGES_KEY = "qs.game.challenges.v1";
type ChallengeMap = Readonly<Record<string, ChallengeStats>>;

const listeners = new Set<() => void>();
let cache: ChallengeMap | null = null;

/// Stats after one more round; `now` is the play time in ms.
export function mergeChallenge(stats: ChallengeStats | undefined, hit: boolean, now: number): ChallengeStats {
  const s = stats ?? { played: 0, hits: 0, streak: 0, bestStreak: 0, lastAt: 0 };
  const streak = hit ? s.streak + 1 : 0;
  return { played: s.played + 1, hits: s.hits + (hit ? 1 : 0), streak, bestStreak: Math.max(s.bestStreak, streak), lastAt: now };
}

/// Saved stats for every challenge played in this browser (cached).
export function readChallenges(): ChallengeMap {
  return (cache ??= readJsonObject<ChallengeMap>(CHALLENGES_KEY));
}

/// Records one round of challenge `id` and notifies subscribers.
export function recordChallenge(id: string, hit: boolean, now: number): void {
  const all = readChallenges();
  cache = { ...all, [id]: mergeChallenge(all[id], hit, now) };
  writeJsonObject(CHALLENGES_KEY, cache);
  listeners.forEach((l) => l());
}

/// Subscribes to challenge score changes in this tab and in other tabs.
export function subscribeChallenges(listener: () => void): () => void {
  listeners.add(listener);
  const off = onStorageKey(CHALLENGES_KEY, () => {
    cache = null;
    listener();
  });
  return () => {
    listeners.delete(listener);
    off();
  };
}
