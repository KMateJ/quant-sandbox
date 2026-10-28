import { urlEnum, urlString } from "../../lib/urlState";
import { CROSS_MODELS } from "./cross.types";

/// Query keys of the cross-section tab: the pricing model and the selected portfolio code (e.g. S1B5).
export const CROSS_URL_SCHEMA = {
  cm: urlEnum(CROSS_MODELS, "capm"),
  csel: urlString(""),
};
