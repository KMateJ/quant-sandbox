import type { TranslationKey } from "../../i18n";
import type { MmPolicyId } from "./engine/mm.types";
import type { MmScreen } from "./marketMakingDesk.url";

const MISSION_KEYS: Record<string, { title: TranslationKey; brief: TranslationKey }> = {
  MM1: { title: "mmdMs_MM1_title", brief: "mmdMs_MM1_brief" },
  MM2: { title: "mmdMs_MM2_title", brief: "mmdMs_MM2_brief" },
  MM3: { title: "mmdMs_MM3_title", brief: "mmdMs_MM3_brief" },
  MM4: { title: "mmdMs_MM4_title", brief: "mmdMs_MM4_brief" },
  MM5: { title: "mmdMs_MM5_title", brief: "mmdMs_MM5_brief" },
};

/// Title and brief keys of a mission (MM1 for an unknown id).
export const missionKeys = (id: string) => MISSION_KEYS[id] ?? MISSION_KEYS.MM1;

export const SCREEN_KEY: Record<MmScreen, TranslationKey> = {
  desk: "mmdScreen_desk",
  missions: "mmdScreen_missions",
  debrief: "mmdScreen_debrief",
};

export const POLICY_KEY: Record<MmPolicyId, TranslationKey> = {
  join: "mmdPolicy_join",
  wide: "mmdPolicy_wide",
  as: "mmdPolicy_as",
  flatten: "mmdPolicy_flatten",
};
