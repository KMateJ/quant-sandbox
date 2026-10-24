import type { ProgressMap } from "./game.types";
import { onStorageKey, readJsonObject, writeJsonObject } from "./storage";

/// localStorage key for a desk's mission progress.
export const progressKey = (deskId: string) => `qs.game.${deskId}.progress.v1`;
/// True when `candidate` beats `current`.
export type Better = (candidate: number, current: number) => boolean;
export const higherIsBetter: Better = (c, cur) => c > cur;
export const closerToZero: Better = (c, cur) => Math.abs(c) < Math.abs(cur);
export const EMPTY_PROGRESS: ProgressMap = {};

/// Adds one run: a pass marks the mission completed and keeps the better score; a fail changes nothing.
export function mergeProgress(p: ProgressMap, missionId: string, passed: boolean, score: number, better: Better): ProgressMap {
  if (!passed) return p;
  const prev = p[missionId];
  const best = prev?.best == null || better(score, prev.best) ? score : prev.best;
  if (prev?.completed && prev.best === best) return p;
  return { ...p, [missionId]: { completed: true, best } };
}

export type ProgressStore = {
  key: string;
  read(): ProgressMap;
  write(p: ProgressMap): void;
  record(missionId: string, passed: boolean, score: number): void;
  subscribe(listener: () => void): () => void;
};

/// Stored progress under `key`, read fresh (no cache); for pages that list several desks.
export function readProgressKey(key: string): ProgressMap {
  return readJsonObject<ProgressMap>(key);
}

/// Progress store for one desk with its own cache, listeners and cross-tab sync.
export function createProgressStore(deskId: string, better: Better): ProgressStore {
  const key = progressKey(deskId);
  const listeners = new Set<() => void>();
  let cache: ProgressMap | null = null;
  const read = () => (cache ??= readProgressKey(key));
  const write = (p: ProgressMap) => {
    cache = p;
    writeJsonObject(key, p);
    listeners.forEach((l) => l());
  };
  return {
    key,
    read,
    write,
    record(missionId, passed, score) {
      const current = read();
      const next = mergeProgress(current, missionId, passed, score, better);
      if (next !== current) write(next);
    },
    subscribe(listener) {
      listeners.add(listener);
      const off = onStorageKey(key, () => {
        cache = null;
        listener();
      });
      return () => {
        listeners.delete(listener);
        off();
      };
    },
  };
}
