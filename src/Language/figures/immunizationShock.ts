// Strings for the "immunization-shock" guide figure. Keys are prefixed ixIm to stay unique.
import type { immunizationShockHu } from "./immunizationShock.hu";

export const immunizationShockEn: Record<keyof typeof immunizationShockHu, string> = {
  ixImTitle: "Immunization: a yield shock on assets and liability",
  ixImPortfolio: "Portfolio",
  ixImMatched: "Duration-matched",
  ixImShortOnly: "All in the short bond",
  ixImLongOnly: "All in the long bond",
  ixImHint: "Drag the shock marker, or use the arrow keys.",
  ixImShock: "Yield shock",
  ixImShockAria: "Parallel yield shock in basis points",
  ixImShockText: "{{bp}} basis points, yield {{y}}",
  ixImAssets: "PV of assets",
  ixImLiability: "PV of liability",
  ixImSurplus: "Surplus",
  ixImDurations: "Duration: assets / liability",
  ixImTrace: "Surplus against the shock (the part you have visited is highlighted)",
  ixImTraceAria: "Surplus curve for shocks between −300 and +300 basis points",
};
