import { urlEnum, urlNumber, urlString } from "../../../lib/urlState";
import { EPISODE_IDS } from "./episodes.types";

/// `ep` episode, `off` comma list of switched-off rescues, `day` model-day cursor (the end by default).
export const EPISODES_URL_SCHEMA = {
  ep: urlEnum(EPISODE_IDS, "gfc"),
  off: urlString(""),
  day: urlNumber(60, 0, 60, 0),
};
