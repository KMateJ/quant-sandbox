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
  dcShockHint: "Drag the slider, or click or drag the markers on the chart (−200 to +200 bp).",

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

  dcErrorTitle: "Approximation error",
  dcErrorXLabel: "Yield shock Δy (bp)",
  dcErrorYLabel: "Error (%)",
  dcDurationErrLabel: "Duration error",
  dcDurConvexErrLabel: "Duration + convexity error",
};
