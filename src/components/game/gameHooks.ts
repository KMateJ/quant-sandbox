import { useEffect, useRef, useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, type ProgressStore } from "../../lib/game/progress";
import type { ProgressMap } from "../../lib/game/game.types";

/// One terminal-style function key: keyboard key, label, action and whether it can run now.
export type GameKey = { code: string; label: string; run: () => void; enabled: boolean };

/// A desk's saved mission progress, live across tabs; empty on the server.
export function useProgress(store: ProgressStore): ProgressMap {
  return useSyncExternalStore(store.subscribe, store.read, () => EMPTY_PROGRESS);
}

/// Binds the keys' codes (e.g. "F2") to their actions while `active`, also while an input has focus.
/// Keys with a modifier keep their browser meaning; auto-repeat is ignored.
export function useFunctionKeys(keys: GameKey[], active: boolean) {
  const latest = useRef({ keys, active });
  useEffect(() => {
    latest.current = { keys, active };
  });
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!latest.current.active) return;
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const key = latest.current.keys.find((k) => k.code === e.key);
      if (!key) return;
      e.preventDefault();
      if (key.enabled) key.run();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
