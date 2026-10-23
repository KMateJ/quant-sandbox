import { useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, readProgress, subscribeProgress, type DeskProgress } from "./deskProgress";

/// Mission progress from localStorage; "nothing completed" during pre-render and hydration.
export function useDeskProgress(): DeskProgress {
  return useSyncExternalStore(subscribeProgress, readProgress, () => EMPTY_PROGRESS);
}
