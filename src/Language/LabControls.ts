// Shared lab controls: random seed, resample, "try this" prompts.

export const labControlsHu = {
  labSeed: "Véletlenmag",
  labResample: "Újramintázás",
  labTryTitle: "Próbáld ki",
};

export const labControlsEn: Record<keyof typeof labControlsHu, string> = {
  labSeed: "Random seed",
  labResample: "Resample",
  labTryTitle: "Try this",
};
