import { urlBool, urlEnum, urlNumber, urlString, type UrlField, type UrlSchema } from "../../lib/urlState";
import { PORTFOLIO_MISSIONS } from "./engine/missions.data";

export const PORTFOLIO_SCREENS = ["desk", "missions", "debrief"] as const;
export type PortfolioScreen = (typeof PORTFOLIO_SCREENS)[number];

export type PortfolioDeskUrlState = { m: string; seed: number; screen: PortfolioScreen; demo: boolean };

const DEFAULT_MISSION = "P1";

const missionField: UrlField<string> = {
  parse: (raw) => {
    const id = urlString(DEFAULT_MISSION).parse(raw);
    return PORTFOLIO_MISSIONS.some((m) => m.id === id) ? id : DEFAULT_MISSION;
  },
  serialize: urlString(DEFAULT_MISSION).serialize,
};

/// Query-string schema of the portfolio desk (module-level so the object stays stable).
export const PORTFOLIO_DESK_URL: UrlSchema<PortfolioDeskUrlState> = {
  m: missionField,
  seed: urlNumber(5, 1, 9999, 0),
  screen: urlEnum(PORTFOLIO_SCREENS, "desk"),
  demo: urlBool(false),
};
