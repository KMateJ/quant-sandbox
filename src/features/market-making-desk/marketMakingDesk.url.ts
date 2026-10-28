import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { MM_MISSIONS } from "./engine/missions.data";

export const MM_SCREENS = ["desk", "missions", "debrief"] as const;
export type MmScreen = (typeof MM_SCREENS)[number];

export type MmDeskUrlState = { m: string; seed: number; screen: MmScreen; demo: boolean };

const DEFAULT_MISSION = "MM1";

const missionField: UrlField<string> = {
  parse: (raw) => {
    const id = urlString(DEFAULT_MISSION).parse(raw);
    return MM_MISSIONS.some((m) => m.id === id) ? id : DEFAULT_MISSION;
  },
  serialize: urlString(DEFAULT_MISSION).serialize,
};

/// Query-string schema of the market making desk (module-level so the object stays stable).
export const MM_DESK_URL: UrlSchema<MmDeskUrlState> = {
  m: missionField,
  seed: urlNumber(7, 1, 9999, 0),
  screen: urlEnum(MM_SCREENS, "desk"),
  demo: urlBool(false),
};
