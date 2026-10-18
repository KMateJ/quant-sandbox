// Guide strings for the second, hands-on figures of the diversification, duration, random-walk and delta-hedging lessons.

export const guideInteractive2Hu = {
  gi2Reset: "Alaphelyzet",
  gi2Play: "Lejátszás",
  gi2Pause: "Szünet",

  gi2DragTitle: "Húzd az eszközöket a kockázat–hozam síkon",
  gi2DragHint: "Fogd meg az A vagy a B pontot, és húzd el: a keverékek görbéje és a minimális varianciájú pont követi.",
  gi2DragAria: "Két húzható eszköz a kockázat–hozam síkon, a keverékeik görbéjével és a minimális varianciájú portfólióval",

  gi2BalanceTitle: "A duráció mint egyensúlyi pont",
  gi2BalanceAria: "A kötvény pénzáramai egy mérlegen; az alátámasztási pont a Macaulay-duráció, {{d}} év",
  gi2DurationAt: "D = {{d}} év",
  gi2CashFlow: "Pénzáram",
  gi2PresentValue: "Jelenérték",
  gi2LastWeight: "Az utolsó kifizetés súlya",

  gi2GaltonTitle: "Bolyongók végpontjai",
  gi2GaltonAria: "{{count}} darab {{n}} lépéses bolyongás végpontjainak hisztogramja a normális sűrűséggel",
  gi2Walkers: "Bolyongók",
  gi2SampleMean: "Mintaátlag",
  gi2SampleVariance: "Mintavariancia",

  gi2HedgeTitle: "Delta-fedezés napról napra",
  gi2HedgeAria: "Egy eladott call eredménye fedezve ({{k}} naponkénti újrasúlyozással) és fedezetlenül",
  gi2Rebalance: "Újrasúlyozás",
  gi2EveryDays: "{{k}} naponta",
  gi2Naked: "Fedezetlen eladott call",
  gi2Hedged: "Delta-fedezett",
  gi2Day: "{{d}}. nap",
  gi2DayLabel: "Nap",
  gi2PathPnl: "Ezen a pályán: fedezett eredmény",
  gi2SdHedged: "Fedezési hiba szórása ({{k}} naponta, 200 pálya)",
  gi2SdNaked: "Fedezetlen eredmény szórása",
};

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
