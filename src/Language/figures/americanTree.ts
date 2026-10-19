// Strings for the "american-tree" guide figure. Keys are prefixed ixAt to stay unique.
import type { americanTreeHu } from "./americanTree.hu";

export const americanTreeEn: Record<keyof typeof americanTreeHu, string> = {
  ixAtTitle: "American put on a binomial tree, node by node",
  ixAtSteps: "Number of steps",
  ixAtRule: "Exercise rule",
  ixAtAmerican: "American",
  ixAtEuropean: "European",
  ixAtTreeAria: "Binomial tree with {{steps}} steps; every node shows the stock price and the put value",
  ixAtNodeAria: "Step {{step}}, S = {{s}}, put value {{v}}, {{decision}}. Open details",
  ixAtExercise: "exercise",
  ixAtContinue: "continue",
  ixAtTerminal: "maturity",
  ixAtLegendExercise: "Exercise now (intrinsic > continuation)",
  ixAtLegendContinue: "Continue",
  ixAtLegendTerminal: "Maturity",
  ixAtDetails: "Selected node: step {{step}}",
  ixAtPrice: "Stock price S",
  ixAtIntrinsic: "Intrinsic value K − S",
  ixAtContinuation: "Continuation value",
  ixAtNodeValue: "Node value",
  ixAtTerminalNote: "At maturity there is nothing to wait for: the value is the payoff.",
  ixAtEuropeanNote: "European rule: no early exercise, so the value is the continuation value.",
  ixAtRootAmerican: "American put (root)",
  ixAtRootEuropean: "European put (root)",
  ixAtPremium: "Early-exercise premium",
};
