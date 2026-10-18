// Shared playback controls (play / pause / step / speed) used by labs and guide figures.

export const playbackHu = {
  pbPlay: "▶ Lejátszás",
  pbPause: "❚❚ Szünet",
  pbStepBack: "Egy lépés vissza",
  pbStepForward: "Egy lépés előre",
  pbSpeed: "Sebesség",
};

export const playbackEn: Record<keyof typeof playbackHu, string> = {
  pbPlay: "▶ Play",
  pbPause: "❚❚ Pause",
  pbStepBack: "One step back",
  pbStepForward: "One step forward",
  pbSpeed: "Speed",
};
