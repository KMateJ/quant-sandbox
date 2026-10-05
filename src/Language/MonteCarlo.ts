export const monteCarloHu = {
  monteCarloTitle: "Monte Carlo árazás",
  monteCarloDesc:
    "Európai call opció árazása szimulációval; a futó becslés konvergál a Black–Scholes analitikus árhoz.",
  monteCarloControlsTitle: "Paraméterek",
  monteCarloS0Label: "Részvényár (S₀)",
  monteCarloStrikeLabel: "Kötési ár (K)",
  monteCarloMaturityLabel: "Lejárat (T, év)",
  monteCarloRateLabel: "Kockázatmentes kamat (r)",
  monteCarloVolLabel: "Volatilitás (σ)",
  monteCarloSimsLabel: "Szimulációk száma",
  monteCarloSeedLabel: "Mag (seed)",
  monteCarloMetricsLabel: "Mutatók",
  monteCarloEstimate: "MC becslés",
  monteCarloAnalytic: "Black–Scholes ár",
  monteCarloStdError: "Standard hiba",
  monteCarloStdErrorHelp:
    "A becslés szórása; a Monte Carlo hiba 1/√N szerint csökken a szimulációk számával.",
  monteCarloChartTitle: "Konvergencia a Black–Scholes árhoz",
  monteCarloEstimateLabel: "MC becslés",
  monteCarloAnalyticLabel: "Black–Scholes",
};

export const monteCarloEn = {
  monteCarloTitle: "Monte Carlo Pricing",
  monteCarloDesc:
    "Price a European call by simulation; the running estimate converges to the analytic Black–Scholes price.",
  monteCarloControlsTitle: "Parameters",
  monteCarloS0Label: "Spot price (S₀)",
  monteCarloStrikeLabel: "Strike (K)",
  monteCarloMaturityLabel: "Maturity (T, years)",
  monteCarloRateLabel: "Risk-free rate (r)",
  monteCarloVolLabel: "Volatility (σ)",
  monteCarloSimsLabel: "Number of simulations",
  monteCarloSeedLabel: "Seed",
  monteCarloMetricsLabel: "Metrics",
  monteCarloEstimate: "MC estimate",
  monteCarloAnalytic: "Black–Scholes price",
  monteCarloStdError: "Standard error",
  monteCarloStdErrorHelp:
    "Dispersion of the estimate; Monte Carlo error shrinks like 1/√N with the number of simulations.",
  monteCarloChartTitle: "Convergence to the Black–Scholes price",
  monteCarloEstimateLabel: "MC estimate",
  monteCarloAnalyticLabel: "Black–Scholes",
};
