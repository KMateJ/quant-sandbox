import type { TranslationKey } from "../../i18n";
import type { SpendRule } from "./engine/retirement.types";
import type { OddsWord } from "./retirementFormat";
import type { RetirementScreen } from "./retirementDesk.url";
import type { PresetId } from "./ticket.math";

const MISSION_KEYS: Record<string, { title: TranslationKey; brief: TranslationKey }> = {
  T1: { title: "retrMs_T1_title", brief: "retrMs_T1_brief" },
  T2: { title: "retrMs_T2_title", brief: "retrMs_T2_brief" },
  T3: { title: "retrMs_T3_title", brief: "retrMs_T3_brief" },
  T4: { title: "retrMs_T4_title", brief: "retrMs_T4_brief" },
  T5: { title: "retrMs_T5_title", brief: "retrMs_T5_brief" },
};

/// Title and brief keys of a mission (T1 for an unknown id).
export const missionKeys = (id: string) => MISSION_KEYS[id] ?? MISSION_KEYS.T1;

export const SCREEN_KEY: Record<RetirementScreen, TranslationKey> = {
  desk: "retrScreen_desk",
  missions: "retrScreen_missions",
  debrief: "retrScreen_debrief",
};

export const ODDS_KEY: Record<OddsWord, TranslationKey> = {
  comfortable: "retrOdds_comfortable",
  stretched: "retrOdds_stretched",
  danger: "retrOdds_danger",
};

export const PRESET_KEY: Record<PresetId, TranslationKey> = {
  initial: "retrPreset_initial",
  now: "retrPreset_now",
  guard: "retrPreset_guard",
  low: "retrPreset_low",
};

export const RULE_KEY: Record<SpendRule, TranslationKey> = {
  fixed: "retrRule_fixed",
  fixedLow: "retrRule_fixedLow",
  pctWealth: "retrRule_pctWealth",
  guardrails: "retrRule_guardrails",
};
