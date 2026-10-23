/// Per-mission result kept in this browser.
export type MissionProgress = { completed: boolean; bestPnl: number };
/// Progress for every mission played, by id.
export type DeskProgress = Readonly<Record<string, MissionProgress>>;

const STORAGE_KEY = "qs.hedgingDesk.progress.v1";
export const EMPTY_PROGRESS: DeskProgress = {};
const listeners = new Set<() => void>();
let cache: DeskProgress | null = null;

/// Adds one run's result; the best P&L is the smallest |P&L| among passed runs.
export function mergeResult(progress: DeskProgress, missionId: string, passedAll: boolean, pnl: number): DeskProgress {
  if (!passedAll) return progress;
  const prev = progress[missionId];
  const bestPnl = prev?.completed && Math.abs(prev.bestPnl) <= Math.abs(pnl) ? prev.bestPnl : pnl;
  return { ...progress, [missionId]: { completed: true, bestPnl } };
}

/// Stored progress (cached); empty when storage is missing or unreadable.
export function readProgress(): DeskProgress {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    cache = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as DeskProgress) : {};
  } catch {
    cache = {};
  }
  return cache;
}

/// Saves progress and notifies subscribers; storage failures keep it for this session only.
export function writeProgress(progress: DeskProgress): void {
  cache = progress;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode).
  }
  listeners.forEach((l) => l());
}

/// Records a finished run of `missionId`.
export function recordResult(missionId: string, passedAll: boolean, pnl: number): void {
  const next = mergeResult(readProgress(), missionId, passedAll, pnl);
  if (next !== readProgress()) writeProgress(next);
}

/// Subscribes to progress changes in this tab and in other tabs.
export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
