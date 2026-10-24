# 08 — Rates desk route, frame and desk screen

Status: done (2026-10-24) · Depends on: 02, 07 · Suggested model: Sonnet · Est. size: M

## Why
Puts the rates desk on screen at `/yield-curve/desk`: kit frame, curve and yield-move charts, P&L,
positions with key-rate DV01, futures ticket, CTD monitor, curve scenarios, risk panel and events, plus
the stub files plan 09 fills.

## Current state (verified 2026-10-23, commit `73f67d7`)
- Registry `src/modules/registry.ts` L202–214: `id: "yield-curve"`, `path: "/yield-curve"`, `homeFeatured: true`,
  `intuition: yieldCurveIntuition`, beta, no `subNav`, `Component: lazy(() => import("../features/yield-curve/YieldCurveView"))`.
  `docs/plans/fixed-income-labs` plan 03 (todo) may edit `YieldCurveView.tsx`; you only add a new file and
  edit the registry entry.
- Sub-page pattern: `src/features/delta-hedging/DeltaHedgingPages.tsx` and the delta-hedging registry entry
  (L174–189). `src/App.tsx` routes `${path}/*` for modules with `subNav`; `src/seo.routes.ts` pre-renders
  `subNav` items with `descKey` (description 50–160 chars).
- Engine (plan 07) `src/features/rates-desk/engine/`: `RATES_MISSIONS`, `ratesMissionById`, `factorPath`,
  `zeroRate`, `zeroGrid`, `futureQuote`, `ratesRisk`, `dv01HedgeQty`, `krdHedgeQty`, `curveScenarios`,
  `ctdSwitchBp`, `startRates`, `reduceRates`, `evaluateRates`, `replayRates`; types `RatesState`,
  `RatesAction`, `RatesMission`, `RatesEvent`, `FutureSpec`.
- Kit (plans 01–02): `src/components/game/*` (frame, `QuoteStrip`, `ScreenTabs`, `FunctionKeyBar`,
  `ViewControls`, `DeskGrid`, `MissionPanel`, `EventLog`, `BandMeter`, `SeriesKey`, `useGameHelp`,
  `HelpSheet`, `useProgress`, `gameFormat`), `src/lib/game/progress.ts`, `seed.ts`.
- Charts: `LineChart`, `ChartContainer`; terminal example `src/features/hedging-desk/components/PriceSharesChart.tsx`.
- Design: canvas board `RatesDesk.dc.html`.

## Goal
1. `/yield-curve/desk` (and `/hu/…`) renders the desk; `/yield-curve` unchanged; sidebar shows Lab and Rates desk.
2. Panels and keys work for every mission (`?m=R1…R5`).
3. Stubs for plan 09 exist.

## Non-goals
- Missions screen, debrief, help content, demo script (plan 09). No edits to yield-curve view or components.

## Constraints
- README §4 recipe: folder `src/features/rates-desk/`, prefix `ratd`, ids `ratd-*`, partial
  `src/styles/_rates-desk.scss` under `.ratd`, table `src/Language/RatesDesk.ts` (+ `.hu.ts`).

## Steps
1. Router `src/features/yield-curve/YieldCurvePages.tsx` (empty → `YieldCurveView`, `"desk"` → lazy
   `../rates-desk/RatesDeskView`, else `<Navigate to="/yield-curve" replace />`).
2. Registry (yield-curve entry only): `Component` → `YieldCurvePages`; `subNav: [{ id: "lab", labelKey: "navYieldCurveLab", to: "/yield-curve" }, { id: "desk", labelKey: "navRatesDesk", descKey: "seoDescRatesDesk", seoTitle: "Rates Desk: Hedge a Bond Book with Futures", to: "/yield-curve/desk" }]`.
3. Copy: `navYieldCurveLab`, `navRatesDesk` in `Home.ts`/`.hu.ts` after `navYieldCurve`; `seoDescRatesDesk`
   in `Seo.ts`/`.hu.ts`.
4. URL `ratesDesk.url.ts`: `m` (default `"R1"`, validated), `seed` (`urlNumber(21, 1, 9999, 0)`), `screen`, `demo`.
5. Progress `ratesProgress.ts`: `RATES_PROGRESS = createProgressStore("rates", higherIsBetter)` (best = final hedged P&L).
6. Hooks `useRatesDesk.ts`: `useRatesUrl()` (as in the ALM desk: run counter, mission, path via
   `factorPath` memo, screen/mission/newPath/restart/demo setters) and `useRatesSession(url)` (reducer over
   `reduceRates`; derived `zeros = zeroGrid(path[day])`, `risk`, `objectives`, `scenarios`, quotes per
   future; ticket state `{ future, side, qty: string }` with setters, `submit`, `hedgeDv01`, `hedgeKrd`,
   `step(n)`, `dispatch`). Export `type RatesDeskModel`.
7. View `RatesDeskView.tsx`: kit frame; `CommandBar` (ticker `QSRB Bond Book`, code `RATD <GO>`, clock
   "Sim D{day}/{days} · {left} days left"); `QuoteStrip` `ratd-quotes` (2Y, 5Y, 10Y, 30Y zero with change
   since D0, 2s10s, each future's price, hedged P&L); tabs + intro; `FunctionKeyBar` `ratd-keys` (F2 Next day,
   F3 +5 days, F4 DV01 hedge with the selected contract, F6 Key-rate hedge, F8 New path, F9 Restart);
   Sandbox link; `HelpSheet` with stub tabs.
8. Panels (`components/`):
   - Left: `MissionPanel` `ratd-mission`; `RatesRiskPanel` `ratd-risk` (net DV01 big with in/out band tag,
     `BandMeter` ±5,000 with band ±1,000, book vs futures DV01, key-rate bars 2y/5y/10y/30y for the net,
     contracts traded, costs, misses); `EventLog` `ratd-events` (pure `eventText.ts`, exhaustive).
   - Centre: `CurveChart` `ratd-curve` (zero curve today vs D0 on 0–30y, squares at held bonds, diamonds at
     each future's CTD); `DeskPair` of `YieldMovesChart` `ratd-moves` (cumulative bp change of 2y, 10y, 30y
     since D0) and `RatesPnlChart` `ratd-pnl` (hedged vs bonds alone); `PositionsTable` `ratd-positions`
     (bonds and futures: size, price, value, DV01, key-rate columns; NET row).
   - Right: `FuturesTicket` `ratd-ticket` (contract segmented buttons, expired contracts disabled, Buy/Sell,
     contracts input with label, preview: price, DV01 per contract, DV01 impact, net DV01 after, cost;
     submit `ratd-submit`; two quick buttons DV01 hedge / Key-rate hedge); `CtdMonitor` `ratd-ctd` (selected
     contract's basket: price, CF, P/CF, basis, CTD row highlighted, switch-point text from `ctdSwitchBp`);
     `CurveScenarios` `ratd-scen` (bonds alone vs hedged P&L for the five reshapes).
9. Stubs for plan 09 (first line `// Stub: filled by docs/plans/game-desks/09.`): `components/RatesMissionsScreen.tsx`,
   `RatesDebriefScreen.tsx` (`{ desk: RatesDeskModel }`), `help/RatesNextMove.tsx`, `RatesWhatIf.tsx`,
   `RatesGuide.tsx` (`{ desk, help: GameHelp }`), `demo/demo.script.ts` (`buildRatesDemo(mission, seed)` → `[]`).
10. Styles `_rates-desk.scss` (append `@use "rates-desk";`), copy table `RatesDesk.ts`/`.hu.ts`, tests
    `scripts/rates-desk-screen.test.mjs` (`eventText` covers every kind; EN/HU parity and HU ≠ EN).

## Acceptance criteria
- `/yield-curve` unchanged; `/yield-curve/desk?m=R1`: F4 then F3 × 4 reaches settlement with no console
  errors; `?m=R5` shows the front contract disabled after day 10 and an expired event.
- Sidebar lists Lab and Rates desk; build pre-renders the desk paths; `test:seo` passes; smoke and layout
  audit clean; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:rates-desk && npm run test:yield-curve && npm run test:game-kit
npm run build && npm run test:seo && ls dist/yield-curve/desk dist/hu/yield-curve/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/yield-curve,/yield-curve/desk,/yield-curve/desk?m=R5,/yield-curve/nope,/hu/yield-curve/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/yield-curve/desk"
```
Stop the server; confirm the port is free.

## Pitfalls
- **`homeFeatured` / `intuition`** stay on the module entry; only `Component` and `subNav` change.
- **Path memo:** compute `factorPath` once per mission + seed in `useRatesUrl`, not per render.
- **Expensive bumps:** key-rate DV01 re-prices baskets; memoise per day and contracts.
- Registry is shared: re-read before editing.

## Findings (fill in during execution)
- Verification (in a temporary worktree snapshot, because other sessions were rebuilding `dist` in the shared tree): `tsc -b` clean; eslint clean on every file of this plan; `test:rates-desk` 18/18, `test:yield-curve` 13/13, `test:game-kit` 14/14; build green; `dist/yield-curve/desk.html` and `dist/hu/yield-curve/desk.html` pre-rendered and in the sitemap. Smoke clean on `/yield-curve`, `/yield-curve/desk`, `?m=R5`, `/hu/yield-curve/desk`. `/yield-curve/nope` redirects but logs React #418, the same as `/delta-hedging/nope` (existing baseline). Acceptance: R1 F4 + F3×4 settles (+$18,305, all objectives pass, no errors); R5 after day 10 shows `10Y-F · expired` disabled, an EXPIRY event, and the ticket/CTD monitor switch to `10Y-B`.
- `test:seo`: 3 failures, none from this plan. Titles over 70 characters are `/hu/sandbox` (plan 16). **Initial JS 991,763 B vs budget 955,000 B**: every desk's EN table ships in the initial bundle (this plan adds about 8 KB of `RatesDesk.ts`), so the overrun comes from the whole pack (gameKit, challenges, sandbox, alm, portfolio, rates). Plan 18 or the owner should either raise the budget or lazy-load desk copy.
- Layout audit (run on its own DevTools port; the shared default 9339 gave mixed-up results while other sessions audited): only overlaps with the sticky function-key footer (17–87 per width, same pattern as `/delta-hedging/desk` 28–79) and the site-wide `a.brand` tap target; no overflow, clipping or theme failures.
- Deviations:
  - Mission titles and briefs (`ratdM_<id>Title|Brief`) and objective labels (`ratdObj_<kind>`) live in `RatesDesk.ts` because the mission panel needs them now; plan 09 should reuse them rather than duplicate them in `RatesDeskMissions.ts`.
  - The ticket follows the live contract: when the selected contract expires, the ticket (and F4, the CTD monitor) switches to the live 10Y contract (`tenYearContract`).
  - Pure view helpers in `deskView.math.ts` (`positionRows`, `ticketPreview`, `yieldMoves`, `curveRows`, `basketRows`) and copy/format helpers in `ratesCopy.ts` (`missionText`, `objectiveViews`, `quoteCells`, `deskKeys`, `statusLine`). `compactTick` and the day axis are copied from the hedging desk into `components/ratesChart.ts`; candidates for the kit (plan 03).
  - Demo URL fields and `startDemo`/`takeOver`/`exitDemo` exist, but the Watch button is not shown until plan 09 provides the script (`ViewControls` gets no `onDemo`).
  - `RATES_DEMO_SEED = 21` and `RATES_DEMO_MISSION = "R1"` are exported from `useRatesDesk.ts`.
- Items awaiting owner approval: HU strings added: every key of `src/Language/RatesDesk.hu.ts` (new draft), plus `navYieldCurveLab` "Labor", `navRatesDesk` "Rates desk" (same as the hedging-desk pattern) and `seoDescRatesDesk`. Loanword-only labels got qualifiers: `ratdTitle` "Rates desk (kamatdesk)", `ratdQFuture` "{{id}} futures ár", `ratdQ2s10s` "2s10s meredekség", `ratdCtdTag` "CTD kötvény", `ratdColDv01` "DV01 ($)", `ratdFutDv01` "Futures DV01 összesen", `ratdCode` "RATD <GO> funkció".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/08-rates-desk-screen.md`; confirm plans 02 and 07 are done.
> Implement plan 08: `/yield-curve/desk` route and registry `subNav`, URL/progress/hooks, kit view, panels,
> stubs for plan 09, styles, copy and tests. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 08 to `done`, and summarise. Do not edit the yield-curve lab files.
