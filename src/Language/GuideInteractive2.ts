// Guide strings for the second, hands-on figures of the diversification, duration, random-walk and delta-hedging lessons.
import type { guideInteractive2Hu } from "./GuideInteractive2.hu";

export const guideInteractive2En: Record<keyof typeof guideInteractive2Hu, string> = {
  gi2Reset: "Reset",
  gi2Play: "Play",
  gi2Pause: "Pause",

  gi2DragTitle: "Drag the assets around the risk–return plane",
  gi2DragHint: "Grab A or B and drag it: the curve of their mixes and the minimum-variance point follow.",
  gi2DragAria: "Two draggable assets in risk–return space with the curve of their mixes and the minimum-variance portfolio",

  gi2BalanceTitle: "Duration as a balance point",
  gi2BalanceAria: "A bond's cash flows on a seesaw; the fulcrum is the Macaulay duration, {{d}} years",
  gi2DurationAt: "D = {{d}} years",
  gi2CashFlow: "Cash flow",
  gi2PresentValue: "Present value",
  gi2LastWeight: "Weight of the final payment",

  gi2GaltonTitle: "Where random walkers end up",
  gi2GaltonAria: "Histogram of the endpoints of {{count}} walks of {{n}} steps with the normal density",
  gi2Walkers: "Walkers",
  gi2SampleMean: "Sample mean",
  gi2SampleVariance: "Sample variance",

  gi2HedgeTitle: "Delta hedging day by day",
  gi2HedgeAria: "P&L of a short call, hedged (rebalanced every {{k}} days) and unhedged",
  gi2Rebalance: "Rebalancing",
  gi2EveryDays: "every {{k}} d",
  gi2Naked: "Unhedged short call",
  gi2Hedged: "Delta-hedged",
  gi2Day: "Day {{d}}",
  gi2DayLabel: "Day",
  gi2PathPnl: "This path: hedged P&L",
  gi2SdHedged: "Hedging error sd (every {{k}} d, 200 paths)",
  gi2SdNaked: "Unhedged P&L sd",
};
