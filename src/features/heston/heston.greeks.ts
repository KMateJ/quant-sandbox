import type { TranslationKey } from "../../i18n";
import type { GreekKey } from "./heston.types";

export const HESTON_GREEKS = [
  { key: "delta", symbol: "Δ", labelKey: "hestonDelta", decimals: 4 },
  { key: "gamma", symbol: "Γ", labelKey: "hestonGamma", decimals: 4 },
  { key: "vega", symbol: "𝒱", labelKey: "hestonVega", decimals: 3 },
  { key: "theta", symbol: "Θ", labelKey: "hestonTheta", decimals: 3 },
  { key: "rho", symbol: "ρ", labelKey: "hestonRho", decimals: 3 },
] satisfies { key: GreekKey; symbol: string; labelKey: TranslationKey; decimals: number }[];
