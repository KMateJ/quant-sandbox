// Strings for the "cashflow-builder" guide figure. Keys are prefixed ixCf to stay unique.

export const cashflowBuilderHu = {
  ixCfTitle: "Pénzáramok húzással",
  ixCfAria: "Egy projekt 0–6. évi pénzáramai oszlopokként; a halványabb oszlopok a jelenértékeket mutatják",
  ixCfHint: "Húzd az oszlopokat fel vagy le (vagy jelöld ki, és használd a nyílbillentyűket).",
  ixCfRate: "Diszkontráta r",
  ixCfReset: "Visszaállítás",
  ixCfYear: "{{year}}. év",
  ixCfBarAria: "Pénzáram a(z) {{year}}. évben",
  ixCfLegendFlow: "Pénzáram",
  ixCfLegendPv: "Jelenérték r mellett",
  ixCfNpv: "NPV r mellett",
  ixCfIrr: "IRR",
  ixCfSeveral: "több IRR lehetséges",
  ixCfSum: "Diszkontálatlan összeg",
};

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
