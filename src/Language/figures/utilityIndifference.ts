// Strings for the "utility-indifference" guide figure. Keys are prefixed ixUi to stay unique.
import type { utilityIndifferenceHu } from "./utilityIndifference.hu";

export const utilityIndifferenceEn: Record<keyof typeof utilityIndifferenceHu, string> = {
  ixUiTitle: "Indifference curves on the capital allocation line",
  ixUiAria: "The capital allocation line in the volatility–expected return plane, with a draggable portfolio and the indifference curve through it",
  ixUiRiskAversion: "Risk aversion A",
  ixUiHint: "Drag the point along the line (or use the arrow keys).",
  ixUiHandle: "Weight in the risky portfolio P",
  ixUiHandleText: "y = {{y}}, expected return {{mu}}, volatility {{sigma}}",
  ixUiWeight: "Weight in P, y",
  ixUiMu: "Expected return",
  ixUiSigma: "Volatility",
  ixUiUtility: "Utility U",
  ixUiCe: "Certainty equivalent",
  ixUiOptimal: "Optimal weight y*",
  ixUiAtOptimum: "optimum",
  ixUiRiskFree: "risk-free",
  ixUiRisky: "P",
  ixUiLegendCal: "capital allocation line",
  ixUiLegendCurrent: "indifference curve at the chosen point",
  ixUiLegendOptimal: "indifference curve at the optimum",
  ixUiAxisSigma: "volatility σ",
  ixUiAxisMu: "expected return μ",
};
