// Strings for the "immunization-shock" guide figure. Keys are prefixed ixIm to stay unique.

export const immunizationShockHu = {
  ixImTitle: "Immunizáció: hozamsokk az eszközökön és a kötelezettségen",
  ixImPortfolio: "Portfólió",
  ixImMatched: "Durációillesztett",
  ixImShortOnly: "Csak a rövid kötvény",
  ixImLongOnly: "Csak a hosszú kötvény",
  ixImHint: "Húzd a sokk jelölőjét, vagy használd a nyílbillentyűket.",
  ixImShock: "Hozamsokk",
  ixImShockAria: "Párhuzamos hozamsokk bázispontban",
  ixImShockText: "{{bp}} bázispont, hozam {{y}}",
  ixImAssets: "Eszközök jelenértéke",
  ixImLiability: "Kötelezettség jelenértéke",
  ixImSurplus: "Többlet",
  ixImDurations: "Duráció: eszközök / kötelezettség",
  ixImTrace: "Többlet a hozamsokk függvényében (a bejárt rész kiemelve)",
  ixImTraceAria: "A többlet görbéje a −300 és +300 bázispont közötti sokkokra",
};

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
