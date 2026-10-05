export const bondPricingHu = {
  bondPricingTitle: "Kötvénylabor",
  bondPricingDesc:
    "Állíts össze egy fix kamatozású kötvényt, és kövesd, ahogy a pénzáramok jelenértékké diszkontálódnak, árrá, durationné és konvexitássá — majd nézd meg, hogyan mozgatja az árat a hozam.",

  bondTabCashflows: "Pénzáramok",
  bondTabPriceYield: "Ár–hozam",

  bondParamsTitle: "Paraméterek",
  bondFaceLabel: "Névérték",
  bondCouponLabel: "Kamatláb",
  bondMaturityLabel: "Futamidő (év)",
  bondFrequencyLabel: "Kifizetési gyakoriság",
  bondYtmLabel: "Lejáratig számított hozam (YTM)",
  bondFreqAnnual: "Éves",
  bondFreqSemiannual: "Féléves",
  bondFreqQuarterly: "Negyedéves",

  bondTimelineTitle: "Pénzáramok → jelenértékek",
  bondTimelineCoupon: "Kamat",
  bondTimelinePrincipal: "Tőke",
  bondTimelineCashflowLegend: "Jövőbeli pénzáram",
  bondTimelinePvLegend: "Jelenérték",
  bondTimelineAxisTime: "Idő (év)",

  bondHoverTime: "Idő",
  bondHoverCashflow: "Pénzáram",
  bondHoverDf: "Diszkonttényező",
  bondHoverPv: "Jelenérték",
  bondHoverYears: "év",

  bondTableTitle: "Jelenérték-bontás",
  bondTablePayment: "Kifizetés",
  bondTableTime: "Idő",
  bondTableCashflow: "Pénzáram",
  bondTableDf: "Diszkonttényező",
  bondTablePv: "Jelenérték",
  bondTableSumLabel: "Jelenértékek összege = Kötvény ára",

  bondMetricsTitle: "Mutatók",
  bondCleanPrice: "Nettó ár",
  bondMetricYtm: "YTM",
  bondMacaulay: "Macaulay duration",
  bondModified: "Módosított duration",
  bondConvexity: "Konvexitás",
  bondConvexityHelp:
    "A duration a hozamváltozásra adott lineáris árváltozást becsli; a konvexitás a görbület másodrendű korrekciója.",

  bondPyTitle: "Ár–hozam kapcsolat",
  bondPyCurrent: "Aktuális kötvény",
  bondPyPar: "Névérték-pont",
  bondPyPremium: "Prémium (ár > névérték)",
  bondPyDiscount: "Diszkont (ár < névérték)",
  bondPyYtmAxis: "Lejáratig számított hozam",
  bondPyPriceAxis: "Ár",
  bondPyDragHint: "Húzd a pontot a hozam változtatásához",
};

export const bondPricingEn = {
  bondPricingTitle: "Bond Lab",
  bondPricingDesc:
    "Build a fixed-coupon bond and watch its cash flows discount into present values, a price, duration and convexity — then see how yield moves the price.",

  bondTabCashflows: "Cash Flows",
  bondTabPriceYield: "Price–Yield",

  bondParamsTitle: "Parameters",
  bondFaceLabel: "Face value",
  bondCouponLabel: "Coupon rate",
  bondMaturityLabel: "Maturity (years)",
  bondFrequencyLabel: "Payment frequency",
  bondYtmLabel: "Yield to maturity (YTM)",
  bondFreqAnnual: "Annual",
  bondFreqSemiannual: "Semiannual",
  bondFreqQuarterly: "Quarterly",

  bondTimelineTitle: "Cash flows → present values",
  bondTimelineCoupon: "Coupon",
  bondTimelinePrincipal: "Principal",
  bondTimelineCashflowLegend: "Future cash flow",
  bondTimelinePvLegend: "Present value",
  bondTimelineAxisTime: "Time (years)",

  bondHoverTime: "Time",
  bondHoverCashflow: "Cash flow",
  bondHoverDf: "Discount factor",
  bondHoverPv: "Present value",
  bondHoverYears: "years",

  bondTableTitle: "Present value breakdown",
  bondTablePayment: "Payment",
  bondTableTime: "Time",
  bondTableCashflow: "Cash flow",
  bondTableDf: "Discount factor",
  bondTablePv: "Present value",
  bondTableSumLabel: "Sum of present values = Bond price",

  bondMetricsTitle: "Metrics",
  bondCleanPrice: "Clean price",
  bondMetricYtm: "YTM",
  bondMacaulay: "Macaulay duration",
  bondModified: "Modified duration",
  bondConvexity: "Convexity",
  bondConvexityHelp:
    "Duration gives the linear price change for a yield move; convexity is the second-order correction for curvature.",

  bondPyTitle: "Price–yield relationship",
  bondPyCurrent: "Current bond",
  bondPyPar: "Par point",
  bondPyPremium: "Premium (price > face)",
  bondPyDiscount: "Discount (price < face)",
  bondPyYtmAxis: "Yield to maturity",
  bondPyPriceAxis: "Price",
  bondPyDragHint: "Drag the point to change yield",
};
