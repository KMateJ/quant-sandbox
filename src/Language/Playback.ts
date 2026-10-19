// Shared playback controls (play / pause / step / speed) used by labs and guide figures.
import type { playbackHu } from "./Playback.hu";

export const playbackEn: Record<keyof typeof playbackHu, string> = {
  pbPlay: "▶ Play",
  pbPause: "❚❚ Pause",
  pbStepBack: "One step back",
  pbStepForward: "One step forward",
  pbSpeed: "Speed",
};
