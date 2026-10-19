// Strings for the "swap-timeline" guide figure. Keys are prefixed ixSw to stay unique.
import type { swapTimelineHu } from "./swapTimeline.hu";

export const swapTimelineEn: Record<keyof typeof swapTimelineHu, string> = {
  ixSwTitle: "Cash flows of a three-year payer swap",
  ixSwCurve: "Curve",
  ixSwToday: "Today",
  ixSwShifted: "+50 bp",
  ixSwFixed: "Fixed (paid)",
  ixSwFloating: "Floating (received)",
  ixSwPvLegend: "Solid part: present value, faded part: the discount",
  ixSwChartAria: "Timeline from 0 to 3 years: each year a fixed payment paid and a floating payment received, each with its present value",
  ixSwArrowAria: "{{leg}}, year {{t}}: {{amount}}, present value {{pv}}",
  ixSwYear: "Year {{t}}",
  ixSwYearShort: "{{t}}y",
  ixSwHint: "Hover, focus or tap a payment to see how it is discounted.",
  ixSwAmount: "Amount",
  ixSwDf: "Discount factor",
  ixSwPv: "Present value",
  ixSwFixedFormula: "Fixed amount = N · s = {{notional}} · {{rate}} = {{amount}}",
  ixSwFloatingFormula: "Expected floating amount = N · f = {{notional}} · {{rate}} = {{amount}}",
  ixSwPvFormula: "Present value = {{amount}} · {{df}} = {{pv}}",
  ixSwPvFixed: "PV of fixed leg",
  ixSwPvFloating: "PV of floating leg",
  ixSwValue: "Value to the payer",
  ixSwDv01: "DV01",
};
