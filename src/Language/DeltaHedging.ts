export const deltaHedgingHu = {
  deltaHedgingTitle: "Delta-fedezés",
  deltaHedgingDesc:
    "Long call diszkrét delta-fedezése egy részvénypályán; a replikáló portfólió követi az opció értékét, a maradék a fedezési hiba.",
  deltaHedgingControlsTitle: "Paraméterek",
  deltaHedgingS0Label: "Részvényár (S₀)",
  deltaHedgingStrikeLabel: "Kötési ár (K)",
  deltaHedgingMaturityLabel: "Lejárat (T, év)",
  deltaHedgingRateLabel: "Kockázatmentes kamat (r)",
  deltaHedgingVolLabel: "Volatilitás (σ)",
  deltaHedgingStepsLabel: "Újrasúlyozások száma",
  deltaHedgingSeedLabel: "Mag (seed)",
  deltaHedgingMetricsLabel: "Mutatók",
  deltaHedgingPayoff: "Lejáratkori kifizetés",
  deltaHedgingTerminalValue: "Replikáló portfólió",
  deltaHedgingHedgeError: "Fedezési hiba",
  deltaHedgingHedgeErrorHelp:
    "A replikáló portfólió és a kifizetés különbsége lejáratkor; gyakoribb újrasúlyozással nullához tart.",
  deltaHedgingChartTitle: "Opcióérték vs. replikáló portfólió",
  deltaHedgingOptionLabel: "Opcióérték",
  deltaHedgingReplicatingLabel: "Replikáló portfólió",
};

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
