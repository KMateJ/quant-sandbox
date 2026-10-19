// Strings for the "cashflow-builder" guide figure. Keys are prefixed ixCf to stay unique.
import type { cashflowBuilderHu } from "./cashflowBuilder.hu";

export const cashflowBuilderEn: Record<keyof typeof cashflowBuilderHu, string> = {
  ixCfTitle: "Drag the cash flows",
  ixCfAria: "Cash flows of a project in years 0 to 6 as bars; the lighter bars show their present values",
  ixCfHint: "Drag a bar up or down (or focus it and use the arrow keys).",
  ixCfRate: "Discount rate r",
  ixCfReset: "Reset",
  ixCfYear: "Year {{year}}",
  ixCfBarAria: "Cash flow in year {{year}}",
  ixCfLegendFlow: "Cash flow",
  ixCfLegendPv: "Present value at r",
  ixCfNpv: "NPV at r",
  ixCfIrr: "IRR",
  ixCfSeveral: "several IRRs possible",
  ixCfSum: "Undiscounted sum",
};
