// Shared lab controls: random seed, resample, "try this" prompts.
import type { labControlsHu } from "./LabControls.hu";

export const labControlsEn: Record<keyof typeof labControlsHu, string> = {
  labSeed: "Random seed",
  labResample: "Resample",
  labTryTitle: "Try this",
};
