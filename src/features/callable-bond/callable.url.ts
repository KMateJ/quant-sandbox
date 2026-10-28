import { urlEnum, urlNumber } from "../../lib/urlState";

export const FREQS = ["1", "2", "4"] as const;
export const Y_MIN = 0.01;
export const Y_MAX = 0.15;

/// Bond terms and the yield handle; rates are decimals (0.06 = 6%), the call price is per 100 face.
export const CB_SCHEMA = {
  c: urlNumber(0.06, 0.005, 0.2, 4),
  m: urlNumber(10, 2, 30, 0),
  freq: urlEnum(FREQS, "2"),
  call: urlNumber(100, 90, 120, 2),
  prot: urlNumber(3, 1, 30, 0),
  y: urlNumber(0.05, Y_MIN, Y_MAX, 4),
};
