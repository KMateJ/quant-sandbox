import { urlEnum, urlNumber, urlString } from "../../lib/urlState";
import { FUND_IDS, EXPLORE_FUND_IDS } from "./fund.math";

const MODELS = ["capm", "ff3", "carhart", "ff5"] as const;

/// Mystery-fund tab: chosen fund, model and seed of the synthetic funds.
export const FUND_URL_SCHEMA = {
  fund: urlEnum(FUND_IDS as readonly string[], "small-value"),
  fm: urlEnum(MODELS, "ff3"),
  fseed: urlNumber(1, 1, 9999, 0),
};

/// Alpha-hunt tab: chosen fund and the factors in the model (comma list).
export const ALPHA_URL_SCHEMA = {
  afund: urlEnum(EXPLORE_FUND_IDS as readonly string[], "small-value"),
  am: urlString("mkt"),
};
