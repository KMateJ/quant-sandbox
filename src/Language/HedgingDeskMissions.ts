/// Mission copy, objective labels and status words of the hedging desk. Plans 05 and 07 append blocks
/// at the end; keep existing lines in place.
export const hedgingDeskMissionsEn = {
  hdMissionM1Title: "Hedge a short call through expiry",
  hdMissionM1Tagline: "Sold 10 × 100C. Stay delta-neutral for 63 days.",
  hdMissionM1Brief:
    "A client bought 10 at-the-money calls from you. You keep the premium and the risk. Hold net delta inside the band at every close until the options expire.",

  hdObjMaxBreaches: "Net Δ inside ±{{band}} sh at each close",
  hdObjMaxBreachesValue: "{{value}} of {{limit}} breaches allowed",
  hdObjPnlWithin: "Hedge P&L within ±${{limit}} at expiry",
  hdObjPnlValue: "P&L {{value}}",
  hdObjCostsBelow: "Spread costs below ${{limit}}",
  hdObjCostsBelowValue: "{{value}} paid",
  hdObjMaxTrades: "At most {{limit}} trades over the run",
  hdObjMaxTradesValue: "{{value}} of {{limit}} trades used",
  hdObjPnlAbove: "P&L above ${{limit}} at expiry",
  hdObjGammaLimitFrom: "|Γ| at most {{limit}} sh/$ from D{{fromDay}}",
  hdObjGammaLimitFromValue: "max |Γ| {{value}} sh/$",
  hdObjGapLoss: "Lose at most ${{limit}} on the gap day",
  hdObjGapLossValue: "Gap-day P&L {{value}}",
  hdObjVegaLimitBy: "|Vega| at most ${{limit}}/pt by D{{byDay}}",
  hdObjVegaLimitByValue: "|Vega| {{value}}/pt",
  hdObjBeatPolicy: "Beat the every-{{every}}-day auto-hedge",
  hdObjBeatPolicyValue: "{{value}} vs policy",
  hdObjFlatStock: "No stock left after settlement",
  hdObjFlatStockValue: "{{value}} sh held",

  hdStatusOnTrack: "On track",
  hdStatusAtRisk: "At risk",
  hdStatusPass: "Pass",
  hdStatusFail: "Fail",

  hdMissionM2Title: "Rebalance on a budget",
  hdMissionM2Tagline: "Same short call, $15 a ticket, 10 trades.",
  hdMissionM2Brief:
    "Every ticket now costs $15 and you have ten of them, stock only. Hedging every day is no longer an option: choose when a rebalance is worth paying for, and beat a desk that hedges every five days.",
  hdMissionM3Title: "Gamma before the gap",
  hdMissionM3Tagline: "Short 20 × 100C. A jump is coming between D25 and D35.",
  hdMissionM3Brief:
    "Delta hedging alone will not save you from a jump. Buy back gamma with options before the gap, without overpaying in theta.",
  hdMissionM4Title: "Volatility regime shift",
  hdMissionM4Tagline: "Long 105C, short 95P. Implied vol jumps to 30% on D20.",
  hdMissionM4Brief:
    "Your book is long vega and the desk expects implied vol to reprice from 22% to 30% on day 20. Bring vega inside the limit by then, keep delta in the band, and do not give back more than $500.",
  hdMissionM5Title: "Pin risk at expiry",
  hdMissionM5Tagline: "Short 10 × 100C, 10 days, spot sitting on the strike.",
  hdMissionM5Brief:
    "These calls settle physically: if they finish in the money, you deliver 1,000 shares. With spot pinned near the strike, delta flips at the last moment. End the run with no stock left on the book.",
};
