import type { ChallengeArea, ChallengeDef } from "../../lib/game/challenges.data";
import type { ChallengeStats } from "../../lib/game/game.types";

export const AREA_ORDER: readonly ChallengeArea[] = ["stochastic", "portfolio", "rates", "corporate", "microstructure"];

/// Stored progress of any shape we wrote: `{ completed }` per mission id.
type StoredProgress = Readonly<Record<string, { completed?: boolean }>>;

/// Completed mission ids (sorted) of one desk.
export function deskSummary(progress: StoredProgress): { completed: string[] } {
  return { completed: Object.keys(progress).filter((id) => progress[id]?.completed).sort() };
}

/// Plays, hit rate (NaN before the first play) and best streak of one challenge.
export function challengeSummary(stats?: ChallengeStats): { played: number; hitRate: number; bestStreak: number } {
  if (!stats || stats.played === 0) return { played: 0, hitRate: NaN, bestStreak: 0 };
  return { played: stats.played, hitRate: stats.hits / stats.played, bestStreak: stats.bestStreak };
}

/// Totals over every challenge: rounds played and the overall hit rate (NaN when nothing was played).
export function challengeTotals(all: Readonly<Record<string, ChallengeStats>>): { played: number; hitRate: number } {
  const list = Object.values(all);
  const played = list.reduce((n, s) => n + s.played, 0);
  const hits = list.reduce((n, s) => n + s.hits, 0);
  return { played, hitRate: played ? hits / played : NaN };
}

/// Challenges grouped by area, in `AREA_ORDER`, keeping the data order inside an area.
export function groupChallenges(list: readonly ChallengeDef[]): { area: ChallengeArea; items: ChallengeDef[] }[] {
  return AREA_ORDER.map((area) => ({ area, items: list.filter((c) => c.area === area) })).filter((g) => g.items.length);
}
