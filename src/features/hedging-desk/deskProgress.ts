import type { ProgressMap } from "../../lib/game/game.types";
import { closerToZero, createProgressStore, mergeProgress } from "../../lib/game/progress";
import { readJsonObject, writeJsonObject } from "../../lib/game/storage";

const LEGACY_KEY = "qs.hedgingDesk.progress.v1";
const base = createProgressStore("hedging", closerToZero);
let migrated = false;

/// Maps the pre-kit record `{ completed, bestPnl }` per mission onto the kit's `{ completed, best }`.
export function legacyToProgress(legacy: Record<string, { completed?: boolean; bestPnl?: number }>): ProgressMap {
  const out: Record<string, { completed: boolean; best: number | null }> = {};
  for (const [id, m] of Object.entries(legacy)) {
    if (m && typeof m === "object" && m.completed) out[id] = { completed: true, best: typeof m.bestPnl === "number" ? m.bestPnl : null };
  }
  return out;
}

/// Imports old `qs.hedgingDesk.progress.v1` data once, when the new key is still empty; the old key stays.
function migrateLegacy(): void {
  if (migrated || typeof localStorage === "undefined") return;
  migrated = true;
  try {
    if (localStorage.getItem(base.key) !== null) return;
    const imported = legacyToProgress(readJsonObject(LEGACY_KEY));
    if (Object.keys(imported).length > 0) writeJsonObject(base.key, imported);
  } catch {
    // Storage unavailable: nothing to import.
  }
}

/// The Hedging Desk's saved mission progress (best result = smallest |P&L| among passes).
export const HEDGING_PROGRESS = {
  ...base,
  read: () => (migrateLegacy(), base.read()),
  record: (missionId: string, passed: boolean, score: number) => (migrateLegacy(), base.record(missionId, passed, score)),
};

/// Adds one run's result; the best P&L is the smallest |P&L| among passed runs.
export const mergeResult = (progress: ProgressMap, missionId: string, passed: boolean, pnl: number) =>
  mergeProgress(progress, missionId, passed, pnl, closerToZero);

/// Stored progress (cached); empty when storage is missing or unreadable.
export const readProgress = () => HEDGING_PROGRESS.read();

/// Records a finished run of `missionId`.
export const recordResult = (missionId: string, passed: boolean, pnl: number) =>
  HEDGING_PROGRESS.record(missionId, passed, pnl);
