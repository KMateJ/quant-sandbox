import { useSyncExternalStore } from "react";

/// Where the playthrough is. Kept outside React state because the view mounts a separate DemoBar
/// under the desk and under the debrief screen, and the position must survive that switch.
/// `ended` is set by Take the desk / Exit, so the bar stops restoring while the URL leaves demo mode.
export type DemoPosition = { index: number; playing: boolean; started: boolean; ended: boolean };

const START: DemoPosition = { index: 0, playing: false, started: false, ended: false };
let position: DemoPosition = START;
const listeners = new Set<() => void>();

/// Replaces the position (or derives it from the current one) and notifies subscribers.
export function setDemoPosition(next: DemoPosition | ((p: DemoPosition) => DemoPosition)): void {
  const value = typeof next === "function" ? next(position) : next;
  if (value.index === position.index && value.playing === position.playing && value.started === position.started && value.ended === position.ended) return;
  position = value;
  listeners.forEach((l) => l());
}

/// Ends the run without moving the index (moving it would restore an earlier book before the URL
/// leaves demo mode); the next demo bar to mount starts again from step 1.
export function endDemo(): void {
  setDemoPosition((p) => ({ ...p, playing: false, ended: true }));
}

let returnFocus = false;

/// Asks the command-bar demo button to take focus when it next mounts (Exit unmounts the bar that had it).
export function requestDemoButtonFocus(): void {
  returnFocus = true;
}

/// True once after `requestDemoButtonFocus`.
export function takeDemoButtonFocus(): boolean {
  const value = returnFocus;
  returnFocus = false;
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/// The shared demo position; the server snapshot is step 1, paused.
export function useDemoPosition(): DemoPosition {
  return useSyncExternalStore(subscribe, () => position, () => START);
}
