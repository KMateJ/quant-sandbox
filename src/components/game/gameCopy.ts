import type { TranslationKey } from "../../i18n";
import type { ObjectiveStatus } from "../../lib/game/game.types";

/// Status word per objective status (the status is never shown by colour alone).
export const STATUS_KEY: Record<ObjectiveStatus, TranslationKey> = {
  onTrack: "gkStatusOnTrack",
  atRisk: "gkStatusAtRisk",
  pass: "gkStatusPass",
  fail: "gkStatusFail",
};
