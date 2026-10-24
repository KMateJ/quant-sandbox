import type { TranslationKey } from "../../i18n";
import type { AssetId } from "./engine/portfolio.types";
import type { PortfolioScreen } from "./portfolioDesk.url";

/// Copy key of each asset class name.
export const ASSET_KEY: Record<AssetId, TranslationKey> = {
  EQ: "pmgrAsset_EQ",
  EM: "pmgrAsset_EM",
  GOV: "pmgrAsset_GOV",
  CRD: "pmgrAsset_CRD",
  GOLD: "pmgrAsset_GOLD",
};

const MISSION_KEYS: Record<string, { title: TranslationKey; brief: TranslationKey }> = {
  P1: { title: "pmgrMs_P1_title", brief: "pmgrMs_P1_brief" },
  P2: { title: "pmgrMs_P2_title", brief: "pmgrMs_P2_brief" },
  P3: { title: "pmgrMs_P3_title", brief: "pmgrMs_P3_brief" },
  P4: { title: "pmgrMs_P4_title", brief: "pmgrMs_P4_brief" },
  P5: { title: "pmgrMs_P5_title", brief: "pmgrMs_P5_brief" },
};

/// Title and brief keys of a mission (P1 for an unknown id).
export const missionKeys = (id: string) => MISSION_KEYS[id] ?? MISSION_KEYS.P1;

export const SCREEN_KEY: Record<PortfolioScreen, TranslationKey> = {
  desk: "pmgrScreen_desk",
  missions: "pmgrScreen_missions",
  debrief: "pmgrScreen_debrief",
};
