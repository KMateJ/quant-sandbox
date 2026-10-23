export const hedgingDeskDemoStepsEn = {
  hdDemoWelcomeTitle: "You are the market maker",
  hdDemoWelcomeBody:
    "A client just bought ten at-the-money calls from you. You keep the premium and the risk. The clock top right counts the trading days until they expire.",
  hdDemoClientFillTitle: "The opening trade",
  hdDemoClientFillBody:
    "The blotter records every event. The first line is the client's fill: you sold ten calls at the bid.",
  hdDemoPositionsTitle: "What you hold",
  hdDemoPositionsBody:
    "Ten short calls behave like being short about five hundred shares. That exposure is the delta, measured in shares.",
  hdDemoRiskBandTitle: "The delta band",
  hdDemoRiskBandBody:
    "The mission allows net delta to drift only inside the band at each close. Right now you are far outside it.",
  hdDemoObjectivesTitle: "Three objectives",
  hdDemoObjectivesBody:
    "Few breaches, a hedge P&L close to zero at expiry, and limited spread costs. Every close is judged against them.",
  hdDemoTicketTitle: "Fill the ticket",
  hdDemoTicketBody:
    "To neutralise delta you buy shares: the ticket shows the estimated fill, the spread you will pay and the net delta after the trade.",
  hdDemoFirstFillTitle: "The first hedge",
  hdDemoFirstFillBody:
    "The buy crosses the ask, so the cost appears at once. A square marks the fill on the price chart; net delta is now near zero.",
  hdDemoDayStepTitle: "One day later",
  hdDemoDayStepBody:
    "Each step moves the simulated price one day. Delta drifts with the price and with time, so the hedge decays.",
  hdDemoDriftTitle: "Five days unhedged",
  hdDemoDriftBody:
    "Left alone for a week, net delta crossed the band at a close: that is a breach, and it counts against the first objective.",
  hdDemoAutoHedgeTitle: "Auto-hedge",
  hdDemoAutoHedgeBody:
    "F4 trades the exact number of shares that brings net delta back to zero. The blotter tags the fill as automatic.",
  hdDemoScenariosTitle: "What if",
  hdDemoScenariosBody:
    "The matrix revalues the book for spot and volatility shocks; the profile shows P&L across spot today and at expiry.",
  hdDemoChainTitle: "Hedging with options",
  hdDemoChainBody:
    "You can also trade listed options. Picking a strike loads it into the ticket; options change gamma and vega, not only delta.",
  hdDemoToExpiryTitle: "Through expiry",
  hdDemoToExpiryBody:
    "Hedged every day to the end, the book's P&L stays close to zero while the unhedged line swings. Fills accumulate along the path.",
  hdDemoAttributionTitle: "Where the money came from",
  hdDemoAttributionBody:
    "Premium received, settlement paid, stock P&L, financing and costs add up to the final number.",
  hdDemoPoliciesTitle: "Rules compared",
  hdDemoPoliciesBody:
    "The same path replayed with daily, weekly, monthly and no hedging. Fewer rebalances cost less but breach more.",
  hdDemoYourTurnTitle: "Your turn",
  hdDemoYourTurnBody:
    "Take the desk to continue this book by hand, open Missions to start fresh, or exit to your own path.",
};
