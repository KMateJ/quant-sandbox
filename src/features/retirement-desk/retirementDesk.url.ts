import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { RETIREMENT_MISSIONS } from "./engine/missions.data";

export const RETIREMENT_SCREENS = ["desk", "missions", "debrief"] as const;
export type RetirementScreen = (typeof RETIREMENT_SCREENS)[number];

export type RetirementDeskUrlState = { m: string; seed: number; screen: RetirementScreen; demo: boolean };

const DEFAULT_MISSION = "T1";

const missionField: UrlField<string> = {
  parse: (raw) => {
    const id = urlString(DEFAULT_MISSION).parse(raw);
    return RETIREMENT_MISSIONS.some((m) => m.id === id) ? id : DEFAULT_MISSION;
  },
  serialize: urlString(DEFAULT_MISSION).serialize,
};

/// Query-string schema of the retirement desk (module-level so the object stays stable).
export const RETIREMENT_DESK_URL: UrlSchema<RetirementDeskUrlState> = {
  m: missionField,
  seed: urlNumber(3, 1, 9999, 0),
  screen: urlEnum(RETIREMENT_SCREENS, "desk"),
  demo: urlBool(false),
};
