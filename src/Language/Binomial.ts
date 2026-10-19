export const binomialEn = {
    binomialModeEquity: "Equity tree",
    binomialModeRates: "Rate tree",
    binomialR0Label: "r₀ (initial short rate)",
    binomialQLabel: "q (up pricing weight)",
    binomialHLabel: "h (log step size)",
    binomialToggleControls: "Show/hide parameters",
    binomialToggleRates: "Rates",
    binomialToggleBonds: "Bond values",
    binomialRateTreeTitle: "Binomial rate tree",
    binomialBondPrice: "Zero-coupon bond price",
    intuitionBinomialSpotTitle: "Initial price, strike and option type",
    intuitionBinomialSpotSummary: "S₀ is today's stock price; K is the strike paid at expiry.",
    intuitionBinomialSpotBody: "A call pays max(S − K, 0) at expiry; a put pays max(K − S, 0). S₀ scales the whole stock tree; K changes the option payoff, not the stock path. This model prices European options: there is no early exercise. Intermediate V values are continuation prices; final V values are payoffs. Switching call/put changes only the contract's payoff.",
    intuitionBinomialFactorsTitle: "Up and down factors: u and d",
    intuitionBinomialFactorsSummary: "u and d multiply prices over one full year; they are not returns.",
    intuitionBinomialFactorsBody: "u = 1.20 means +20%; d = 0.85 means −15% over a year. The tree recombines because up then down and down then up both give S₀ud. Wider branches mean more dispersion. You choose the factors directly here: they are not derived from volatility and a shrinking time step. Changing them also changes the pricing q; check the condition d < 1 + r < u.",
    intuitionBinomialDiscountTitle: "Rates and one-period discounting",
    intuitionBinomialDiscountSummary: "The one-year discount factor is 1 / (1 + r).",
    intuitionBinomialDiscountBody: "r is an effective annual rate in decimals: 0.05 means 5%, not a continuously compounded rate. In equity mode the same rate sets discounting and the pricing weight q. In rate mode r₀ is the initial short rate, and each later node discounts using its own rate. The summary factor is therefore only the root's one-year factor, not the full-maturity bond price P(0,T).",
    intuitionBinomialHorizonTitle: "Steps and maturity",
    intuitionBinomialHorizonSummary: "Each step is one year here: N steps means N years to maturity.",
    intuitionBinomialHorizonBody: "Increasing N moves the option or zero-coupon bond's expiry further away and adds possible terminal states. It does not subdivide a fixed maturity into smaller time steps, so more steps are not merely a numerical-accuracy setting or a Black–Scholes convergence test. Node labels t indicate elapsed years. With one step, future rate branching does not yet affect the price of the unit terminal payment.",
    intuitionBinomialRateProbabilityTitle: "Rate-tree pricing probability: q",
    intuitionBinomialRateProbabilitySummary: "In rate mode you set q directly; it is not derived from u, d and r.",
    intuitionBinomialRateProbabilityBody: "q is the pricing weight of an upward rate branch; 1 − q weights the downward branch. The bond value at each node is their discounted weighted average. This is a chosen pricing model, not a forecast of rising market rates or a probability calibrated to a market yield curve. Do not apply the stock-tree formula q = (1 + r − d)/(u − d) here. At 0 or 1, only one branch receives weight.",
    intuitionBinomialRateStepTitle: "Rate-tree log step size: h",
    intuitionBinomialRateStepSummary: "Each rate move multiplies the short rate by exp(h) or exp(−h).",
    intuitionBinomialRateStepBody: "h is not a percentage-point rate change. h = 0.18 gives factors of about 1.197 and 0.835 applied to the node's short rate. Larger h spreads the rate branches further apart while q stays fixed. Bond prices respond through different discounting at later nodes. If r₀ = 0, multiplication leaves every rate at zero regardless of h. This h is not a Heston time step.",
    binomialToggleStocks: "Stock prices",
    binomialToggleValues: "Option values",

    binomialExplanationTitle: "Intuition",
    binomialExplanationSubtitle: "What does this model show?",
    binomialExplanationP1:
      "In this binomial model, at each time step the stock price can move in two ways: it is multiplied either by u or by d.",
    binomialExplanationP2:
      "Each period in the model is 1 year. The risk-neutral probability is: q = (1 + r - d) / (u - d).",
    binomialExplanationP3:
      "First, we compute the payoff at the terminal nodes of the tree, for example max(S - K, 0) for a call option. Then we move backward, and at each node we take the discounted expected value of the two possible next outcomes.",
    binomialExplanationP4:
      "In the classical no-arbitrage case, we have d < 1 + r < u, and then q indeed lies between 0 and 1.",
    binomialExplanationP5:
      "At the root node, the option value can also be replicated by a replicating portfolio: an appropriate number of shares together with a bond position produces the same payoff as the option in the two possible states of the next step.",

    binomialTreeTitle: "Binomial pricing tree",
    binomialTreeSubtitle: "A discrete model of stock prices and option values",
    binomialSteps: "Number of steps",

    binomialOptionCall: "Call",
    binomialOptionPut: "Put",
    binomialS0Label: "S₀ (initial price)",
    binomialKLabel: "K (strike)",
    binomialULabel: "u (up factor)",
    binomialDLabel: "d (down factor)",
    binomialRLabel: "r (annual rate)",
    binomialStepsLabel: "Number of steps",
    binomialStepsUnit: "steps",
    binomialPeriodLength: "Period length",
    binomialPeriodValue: "Δt = 1 year",

    binomialSummaryTitle: "Summary",
    binomialSummarySubtitle: "Key quantities of the model",
    binomialWarningTitle: "Warning",
    binomialPrice: "Option price",
    binomialReplicatingPortfolio: "Replicating portfolio at the root",
    binomialStockPosition: "Stock",
    binomialCashPosition: "Cash",
    binomialDiscountFactor: "Discount factor",

    binomialValidationInvalidParameters:
      "The model parameters do not produce meaningful numerical results.",
    binomialValidationUGreaterThanD:
      "The model requires u > d.",
    binomialValidationDPositive:
      "The down factor must satisfy d > 0.",
    binomialValidationRatePositiveOnePlusR:
      "The interest rate must satisfy 1 + r > 0.",
    binomialValidationQNotComputable:
      "q cannot be computed because u and d are not different.",
    binomialValidationQOutOfRange:
      "The risk-neutral probability is not between 0 and 1. In the classical no-arbitrage case, d < 1 + r < u.",
}