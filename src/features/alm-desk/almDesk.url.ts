import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { ALM_MISSIONS } from "./engine/missions.data";

export const ALM_SCREENS = ["desk", "missions", "debrief"] as const;
export type AlmScreen = (typeof ALM_SCREENS)[number];

export type AlmDeskUrlState = {
  /// Mission id (`A1`…); unknown ids fall back to A1.
  m: string;
  seed: number;
  screen: AlmScreen;
  /// Scripted playthrough.
  demo: boolean;
};

const DEFAULT_MISSION = "A1";

const missionField = ((): UrlField<string> => {
  const base = urlString(DEFAULT_MISSION);
  return {
    parse: (raw) => {
      const id = base.parse(raw);
      return ALM_MISSIONS.some((m) => m.id === id) ? id : DEFAULT_MISSION;
    },
    serialize: base.serialize,
  };
})();

/// Query-string schema of the ALM desk (module-level so the object stays stable).
export const ALM_DESK_URL: UrlSchema<AlmDeskUrlState> = {
  m: missionField,
  seed: urlNumber(1, 1, 9999, 0),
  screen: urlEnum(ALM_SCREENS, "desk"),
  demo: urlBool(false),
};
