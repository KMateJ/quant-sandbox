import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { RATES_MISSIONS } from "./engine/missions.data";

export const RATES_SCREENS = ["desk", "missions", "debrief"] as const;
export type RatesScreen = (typeof RATES_SCREENS)[number];
export const DEFAULT_RATES_SEED = 21;

export type RatesDeskUrlState = { m: string; seed: number; screen: RatesScreen; demo: boolean };

const missionField = ((): UrlField<string> => {
  const base = urlString("R1");
  return {
    parse: (raw) => {
      const id = base.parse(raw);
      return RATES_MISSIONS.some((m) => m.id === id) ? id : "R1";
    },
    serialize: base.serialize,
  };
})();

/// Query-string schema of the rates desk.
export const RATES_DESK_URL: UrlSchema<RatesDeskUrlState> = {
  m: missionField,
  seed: urlNumber(DEFAULT_RATES_SEED, 1, 9999, 0),
  screen: urlEnum(RATES_SCREENS, "desk"),
  demo: urlBool(false),
};
