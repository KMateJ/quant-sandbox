import { urlNumber } from "../../lib/urlState";

/// The seed of the game lives in the URL, so a run can be replayed or shared.
export const IM_SCHEMA = { seed: urlNumber(1, 1, 9999, 0) };
