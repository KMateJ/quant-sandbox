export const deltaHedgingEn = {
  deltaHedgingTitle: "Delta Hedging",
  deltaHedgingDesc:
    "Discretely delta-hedge a long call along a price path; the replicating portfolio tracks the option value, the residual is the hedge error.",
  deltaHedgingControlsTitle: "Parameters",
  deltaHedgingS0Label: "Spot price (S₀)",
  deltaHedgingStrikeLabel: "Strike (K)",
  deltaHedgingMaturityLabel: "Maturity (T, years)",
  deltaHedgingRateLabel: "Risk-free rate (r)",
  deltaHedgingVolLabel: "Volatility (σ)",
  deltaHedgingStepsLabel: "Number of rebalances",
  deltaHedgingSeedLabel: "Seed",
  deltaHedgingMetricsLabel: "Metrics",
  deltaHedgingPayoff: "Terminal payoff",
  deltaHedgingTerminalValue: "Replicating portfolio",
  deltaHedgingHedgeError: "Hedge error",
  deltaHedgingHedgeErrorHelp:
    "Replicating portfolio minus payoff at maturity; it tends to zero as rebalancing becomes more frequent.",
  deltaHedgingChartTitle: "Option value vs. replicating portfolio",
  deltaHedgingOptionLabel: "Option value",
  deltaHedgingReplicatingLabel: "Replicating portfolio",
};
