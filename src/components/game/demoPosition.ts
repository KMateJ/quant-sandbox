import { useSyncExternalStore } from "react";

/// Where a desk's playthrough is. Kept outside React state because the desk mounts a separate demo bar
/// under each screen, and the position must survive that switch. `ended` is set by take-over / exit.
export type DemoPosition = { index: number; playing: boolean; started: boolean; ended: boolean };

const START: DemoPosition = { index: 0, playing: false, started: false, ended: false };
const positions = new Map<string, DemoPosition>();
const listeners = new Map<string, Set<() => void>>();
const focusRequests = new Set<string>();

const get = (deskId: string) => positions.get(deskId) ?? START;
const same = (a: DemoPosition, b: DemoPosition) =>
  a.index === b.index && a.playing === b.playing && a.started === b.started && a.ended === b.ended;

/// Replaces a desk's demo position (or derives it from the current one) and notifies subscribers.
export function setDemoPosition(deskId: string, next: DemoPosition | ((p: DemoPosition) => DemoPosition)): void {
  const cur = get(deskId);
  const value = typeof next === "function" ? next(cur) : next;
  if (same(value, cur)) return;
  positions.set(deskId, value);
  listeners.get(deskId)?.forEach((l) => l());
}

/// Ends the run without moving the index; the next demo bar to mount starts again from step 1.
export function endDemo(deskId: string): void {
  setDemoPosition(deskId, (p) => ({ ...p, playing: false, ended: true }));
}

/// Asks the desk's demo button to take focus when it next mounts (exit unmounts the bar that had it).
export function requestDemoButtonFocus(deskId: string): void {
  focusRequests.add(deskId);
}

/// True once after `requestDemoButtonFocus(deskId)`.
export function takeDemoButtonFocus(deskId: string): boolean {
  return focusRequests.delete(deskId);
}

/// The desk's shared demo position; the server snapshot is step 1, paused.
export function useDemoPosition(deskId: string): DemoPosition {
  return useSyncExternalStore(
    (listener) => {
      const set = listeners.get(deskId) ?? new Set();
      listeners.set(deskId, set);
      set.add(listener);
      return () => set.delete(listener);
    },
    () => get(deskId),
    () => START,
  );
}
