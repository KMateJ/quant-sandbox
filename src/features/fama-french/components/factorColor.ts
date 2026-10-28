import { SERIES_PALETTE } from "../../../components/charts";
import { FACTOR_IDS } from "../famaFrench.math";
import type { FactorId } from "../famaFrench.types";

/// Colour of a factor: fixed order mkt, smb, hml, rmw, cma, mom.
export const factorColor = (id: FactorId): string => SERIES_PALETTE[FACTOR_IDS.indexOf(id)];
