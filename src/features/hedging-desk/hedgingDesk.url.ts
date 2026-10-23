import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { DEFAULT_SEED } from "./engine/desk.config";
import { missionById } from "./engine/missions.data";

export const DESK_SCREENS = ["desk", "missions", "debrief"] as const;
export type DeskScreen = (typeof DESK_SCREENS)[number];

export type HedgingDeskUrlState = {
  /// Mission id (`M1`…); unknown ids fall back to M1.
  m: string;
  seed: number;
  screen: DeskScreen;
  /// Scripted playthrough of M1 on the demo path.
  demo: boolean;
};

const DEFAULT_MISSION = "M1";

const missionField = ((): UrlField<string> => {
  const base = urlString(DEFAULT_MISSION);
  return {
    parse: (raw) => {
      const id = base.parse(raw);
      return missionById(id) ? id : DEFAULT_MISSION;
    },
    serialize: base.serialize,
  };
})();

/// Query-string schema of the hedging desk (module-level so the object stays stable).
export const HEDGING_DESK_URL: UrlSchema<HedgingDeskUrlState> = {
  m: missionField,
  seed: urlNumber(DEFAULT_SEED, 1, 9999, 0),
  screen: urlEnum(DESK_SCREENS, "desk"),
  demo: urlBool(false),
};
