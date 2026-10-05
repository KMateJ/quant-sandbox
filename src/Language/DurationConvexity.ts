export const durationConvexityHu = {
  durationConvexityTitle: "Duration és konvexitás",
  durationConvexityDesc:
    "Hogyan változik a kötvény ára Δy hozamsokkra, és mennyire pontosan jelzi előre ezt a duration (érintő) és a konvexitás (görbület).",

  dcParamsTitle: "Kötvény paraméterei",
  dcFaceLabel: "Névérték",
  dcCouponLabel: "Kamatláb",
  dcMaturityLabel: "Futamidő",
  dcYtmLabel: "Jelenlegi YTM",
  dcYearsSuffix: "év",
  dcFrequencyLabel: "Fizetési gyakoriság",
  dcFreqAnnual: "Éves",
  dcFreqSemi: "Féléves",
  dcFreqQuarterly: "Negyedéves",

  dcMeasuresLabel: "Kockázati mutatók",
  dcPrice: "Ár",
  dcMacaulay: "Macaulay duration",
  dcModified: "Módosított duration",
  dcConvexity: "Konvexitás",
  dcDv01: "DV01",
  dcModifiedHelp:
    "Elsőrendű (lineáris) érzékenység: a módosított duration a Δy-ra adott árváltozás meredeksége.",
  dcConvexityHelp:
    "Másodrendű (görbületi) korrekció: a konvexitás azt fogja meg, amit a lineáris duration kihagy.",
  dcDv01Help: "Az ár változása 1 bázispontnyi hozamváltozásra.",

  dcShockTitle: "Hozamsokk",
  dcShockCaption: "Hozamváltozás Δy",
  dcShockPrecise: "Pontos érték",
  dcShockHint: "Húzd a csúszkát −200 és +200 bp között.",

  dcChartTitle: "Árváltozás vs. közelítések",
  dcChartXLabel: "Hozamváltozás Δy (bp)",
  dcChartYLabel: "Árváltozás (%)",
  dcExactLabel: "Pontos újraárazás",
  dcDurationLabel: "Duration becslés",
  dcDurConvexLabel: "Duration + konvexitás",
  dcTangentNote: "Duration = helyi meredekség",

  dcFormulasLabel: "Képletek",
  dcFormulaDuration: "Duration-közelítés",
  dcFormulaDurConvex: "Duration + konvexitás",

  dcResultTitle: "Kiválasztott sokk",
  dcResultShock: "Hozamsokk",
  dcResultExact: "Pontos újraárazás",
  dcResultPriceChange: "Árváltozás",
  dcResultNewPrice: "Új ár",
  dcResultDuration: "Duration",
  dcResultDurConvex: "Duration + konvexitás",
  dcResultEstimate: "Becsült változás",
  dcResultError: "Hiba",
  dcResultErrorBp: "Hiba (ár bp-ben)",

  dcInsightFall:
    "A hozamok estek → az ár jobban emelkedett, mint amit a duration jelzett (pozitív konvexitás).",
  dcInsightRise:
    "A hozamok emelkedtek → az ár kevésbé esett, mint amit a duration jelzett (pozitív konvexitás).",
  dcInsightFlat: "Δy = 0 környékén mindhárom becslés gyakorlatilag egybeesik.",

  dcErrorTitle: "Közelítési hiba",
  dcErrorXLabel: "Hozamsokk Δy (bp)",
  dcErrorYLabel: "Hiba (%)",
  dcDurationErrLabel: "Duration hiba",
  dcDurConvexErrLabel: "Duration + konvexitás hiba",
};

export const durationConvexityEn = {
  durationConvexityTitle: "Duration & Convexity",
  durationConvexityDesc:
    "See how a bond's price responds to a yield shock Δy, and how accurately duration (the tangent) and convexity (the curvature) predict that change.",

  dcParamsTitle: "Bond parameters",
  dcFaceLabel: "Face value",
  dcCouponLabel: "Coupon rate",
  dcMaturityLabel: "Maturity",
  dcYtmLabel: "Current YTM",
  dcYearsSuffix: "yr",
  dcFrequencyLabel: "Payment frequency",
  dcFreqAnnual: "Annual",
  dcFreqSemi: "Semi-annual",
  dcFreqQuarterly: "Quarterly",

  dcMeasuresLabel: "Risk measures",
  dcPrice: "Price",
  dcMacaulay: "Macaulay duration",
  dcModified: "Modified duration",
  dcConvexity: "Convexity",
  dcDv01: "DV01",
  dcModifiedHelp:
    "First-order (linear) sensitivity: modified duration is the slope of the price response to Δy.",
  dcConvexityHelp:
    "Second-order (curvature) correction: convexity captures what the linear duration term misses.",
  dcDv01Help: "The price change for a 1 basis point move in yield.",

  dcShockTitle: "Yield shock",
  dcShockCaption: "Yield change Δy",
  dcShockPrecise: "Precise value",
  dcShockHint: "Drag the slider between −200 and +200 bp.",

  dcChartTitle: "Price change vs. approximations",
  dcChartXLabel: "Yield change Δy (bp)",
  dcChartYLabel: "Price change (%)",
  dcExactLabel: "Exact repricing",
  dcDurationLabel: "Duration estimate",
  dcDurConvexLabel: "Duration + convexity",
  dcTangentNote: "Duration = local slope",

  dcFormulasLabel: "Formulas",
  dcFormulaDuration: "Duration approximation",
  dcFormulaDurConvex: "Duration + convexity",

  dcResultTitle: "Selected shock",
  dcResultShock: "Yield shock",
  dcResultExact: "Exact repricing",
  dcResultPriceChange: "Price change",
  dcResultNewPrice: "New price",
  dcResultDuration: "Duration",
  dcResultDurConvex: "Duration + convexity",
  dcResultEstimate: "Estimated change",
  dcResultError: "Error",
  dcResultErrorBp: "Error (bp of price)",

  dcInsightFall:
    "Yields fell → price rose more than duration predicted (positive convexity).",
  dcInsightRise:
    "Yields rose → price fell less than duration predicted (positive convexity).",
  dcInsightFlat: "Near Δy = 0 all three estimates nearly coincide.",

  dcErrorTitle: "Approximation error",
  dcErrorXLabel: "Yield shock Δy (bp)",
  dcErrorYLabel: "Error (%)",
  dcDurationErrLabel: "Duration error",
  dcDurConvexErrLabel: "Duration + convexity error",
};
