import { usePlayback } from "../../../components/playback";

/// A grid-step cursor on 0…steps that can be scrubbed or played forward over ~4 s,
/// restarting from 0 when played at the end (the studio's name for the shared playback cursor).
export function useTimeCursor(steps: number, initial = steps) {
  return usePlayback({ steps, initial });
}

export type TimeCursor = ReturnType<typeof useTimeCursor>;
