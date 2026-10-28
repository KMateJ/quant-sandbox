# 11 — Desk route, frame and desk screen

Status: done (2026-10-28, opus-02) · Depends on: 01, 10 · Suggested model: Sonnet · Est. size: L

## Why
Turn the engine into the playable terminal at `/market-making/desk`: a live amber order book with your
quotes in it, a quote ticket, inventory and P&L-attribution panels, a price/inventory chart and a tape,
running in real time with play/pause/speed and function keys. Plan 12 then adds the missions screen,
debrief, help and demo into stub files this plan creates.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: registry entry `market-making` (`Component: lazy(() => import("../features/market-making/
  MarketMakingPages"))`, no `subNav`); `src/features/market-making/MarketMakingPages.tsx` renders the lab at
  the root and redirects anything else. Plan 05 owns `MarketMakingView.tsx` (don't edit it).
- After plan 10: `src/features/market-making-desk/engine/` — `mm.types.ts` (`MmMission`, `MmState`,
  `MmAction`, `MmQuote`, `MmEvent`, `MmHist`, `MmMarket`, `MmPolicyId`), `market.math.ts` (`mmMarket`),
  `book.math.ts` (`startMm`, `reduceMm`), `objectives.math.ts` (`evaluateMm`), `policy.math.ts`
  (`policyActions`, `replayMm`), `missions.data.ts` (`MM_MISSIONS`, `mmMissionById`). Read plan 10's
  Findings for final names and limits.
- Ladder helpers: `src/lib/market/ladder.ts` (`ladderRows(book, depth, centre, preview?)` → `LadderEntry[]`
  with `mine` shares, `windowCentre(prev, mid, band)`) is created by plan 03. **If it does not exist yet,
  create it with the signature written in `03-order-book-ladder.md` step 1** and append a `CONTRACT` line.
- Kit: `src/components/game` (`GameFrame`, `CommandBar`, `QuoteStrip`/`QuoteCell`, `DeskGrid`, `DeskPair`,
  `ScreenTabs`, `FunctionKeyBar`/`GameKey`, `ViewControls`, `HelpSheet`, `useGameHelp`, `MissionPanel`,
  `EventLog`/`EventRow`, `BandMeter`, `SeriesKey`, `ObjectiveList`, `useProgress`, `useFunctionKeys`),
  `src/styles/_game-kit.scss` (`.gdesk` tokens). Reference: `src/features/portfolio-desk/PortfolioDeskView.tsx`
  (frame, session keyed on mission/seed/run, ViewControls, HelpSheet) and
  `docs/plans/game-desks/11-portfolio-desk-screen.md` (same plan for another desk).
- Desk copy is lazy: tables registered in `src/Language/desks.en.ts`/`desks.hu.ts` (`satisfies
  Record<DeskKey, string>`), routes wrapped in `withDeskCopy` (`src/languageLoader.ts`).
- Sandbox: `src/features/sandbox/sandbox.data.ts` `DESK_IDS` maps module id → desk id; desks are listed from
  registry `subNav` items with `id: "desk"`.
- `useTicker(running, ms, tick, onStop)`, `prefersReducedMotion()` in `src/components/playback/useTicker.ts`.

## Goal
1. `/market-making/desk` (+ `/hu/…`) renders the desk; `/market-making` unchanged; sidebar shows Lab and Desk.
2. Real-time play (1× = one simulated second per 100 ms; 2×, 5×), pause, step 10 s; every panel live.
3. Stubs for plan 12; progress store; Sandbox entry.

## Non-goals
- Missions screen content, debrief, help tabs, demo (plan 12). No edits to `MarketMakingView.tsx` or the lab.

## Constraints
- README §2 (desk recipe): folder `src/features/market-making-desk/`, desk id `mm`, class `mmd`, DOM ids
  `mmd-*`, i18n prefix `mmd`, tables `src/Language/MarketMakingDesk.ts`/`.hu.ts`, partial
  `src/styles/_market-making-desk.scss` scoped under `.mmd` (amber only inside `.gdesk`). `.tsx` ≤ 150 lines.

## Steps
1. **Router**: `MarketMakingPages.tsx` gains `if (page === "desk") return <MarketMakingDeskView />;` with
   `const MarketMakingDeskView = lazy(withDeskCopy(() => import("../market-making-desk/MarketMakingDeskView")));`
   (copy `ImmunizationPages.tsx`).
2. **Registry** (`market-making` entry only): `subNav: [{ id: "lab", labelKey: "navMarketMakingLab", to:
   "/market-making" }, { id: "desk", labelKey: "navMarketMakingDesk", descKey: "seoDescMarketMakingDesk",
   seoTitle: "Market Making Desk: Quote, Hedge and Survive Toxic Flow", to: "/market-making/desk" }]`.
   Copy: the two nav labels in `Home.ts`/`.hu.ts`, `seoDescMarketMakingDesk` in `Seo.ts`/`.hu.ts` (append).
3. **Sandbox**: append `"market-making": "mm",` to `DESK_IDS`.
4. **URL** `marketMakingDesk.url.ts`: `m` (default `"MM1"`), `seed` (`urlNumber(7, 1, 9999, 0)`), `screen`
   (`desk | missions | debrief`), `demo` (bool). Export `MM_SCREENS`.
5. **Progress** `mmProgress.ts`: `MM_PROGRESS = createProgressStore("mm", higherIsBetter)` (best = final P&L).
6. **Hooks** `useMarketMakingDesk.ts`: `useMmUrl()` (memo `mmMarket` per mission + seed) and
   `useMmSession(url)` (reducer over `reduceMm`; `running`, `speed`, `play/pause/step10`; `useTicker(running,
   100, () => dispatch({ type: "step", ticks: speed }))`, stops at settlement and records progress once per
   settled run (not in demo); derived: mid, spread, inventory, `decompose` parts, objectives, ladder rows with
   `windowCentre`, queue ahead for your bid/ask; ticket helpers `setOffsets`, `widen`, `tighten`,
   `skewToSell` (both quotes down 1 tick), `skewToBuy`, `toggleAuto`, `pull`, `restore`, `hedgeFlat`). Export
   `type MmDeskModel`. Keep the hook ≤ ~150 lines by moving pure helpers to `deskModel.math.ts`.
7. **View** `MarketMakingDeskView.tsx`: kit frame like `PortfolioDeskView`; `CommandBar` (ticker `QSMM Market
   Maker`, code `MMKR <GO>`, clock "10:{mm}:{ss} · {left} s left", Sandbox link); `QuoteStrip` `mmd-quotes`
   (mid, spread, your bid/ask, inventory, P&L, spread capture, adverse, fees); `ScreenTabs`; desk screen;
   `FunctionKeyBar` `mmd-keys`: F2 Play/Pause, F3 Step 10 s, F4 Join the touch, F5 Widen, F6 Tighten, F7 Skew
   to sell, F8 Skew to buy, F9 Pull/Restore, F10 Hedge to flat (each `GameKey` with `enabled`); `HelpSheet`
   with stub tabs. Speed control (1× / 2× / 5×) next to the clock.
8. **Panels** (`components/`):
   - Left: `MissionPanel` `mmd-mission`; `QuoteTicket` `mmd-ticket` (bid/ask offset steppers in ticks, size,
     auto re-quote toggle, live prices preview, queue ahead per side "bid 99.99 · 1,260 ahead", Place /
     Pull); `MmRiskPanel` `mmd-risk` (inventory `BandMeter` −1.5×limit…+1.5×limit with the limit band,
     inventory value, drawdown vs limit, breaches).
   - Centre: `MmBookLadder` `mmd-book` (10 levels a side from `ladderRows`, depth bars, your shares as an amber
     segment with "YOU 200"; the spread row); `MmPriceChart` `mmd-price` (mid with your bid/ask as step lines
     over the last 120 s, inventory strip below, news time marker when announced); `MmTape` `mmd-tape` (last
     14 trades: time, side, price, size, a "YOU" flag on your fills — **never** reveal informed flags during
     play).
   - Right: `PnlAttribution` `mmd-pnl` (live bars: spread capture, adverse selection, inventory, fees, total;
     signs and words, amber for total only); `ObjectiveList`; `EventLog` `mmd-events` (from `eventText.ts`).
9. **Stubs for plan 12** (first line `// Stub: filled by docs/plans/market-making/12.`):
   `components/MmMissionsScreen.tsx`, `MmDebriefScreen.tsx`, `help/MmNextMove.tsx`, `MmWhatIf.tsx`,
   `MmGuide.tsx`, `demo/demo.script.ts` (`buildMmDemo` → `[]`; "Watch the playthrough" hidden while empty).
10. **Copy and styles**: `MarketMakingDesk.ts`/`.hu.ts` (append to `desks.en.ts`/`desks.hu.ts` at the end);
    `_market-making-desk.scss` (append `@use "market-making-desk";` at the end of `main.scss`); ladder rows
    use tabular mono numerals; bids `var(--gdesk-up)`-style tokens as the other desks do (check
    `_game-kit.scss` for the token names; blue up, red down).
11. **Tests** `scripts/micro-desk-screen.test.mjs`: `eventText` exhaustive over `MmEvent` kinds; EN/HU parity
    and HU ≠ EN for the desk table; `deskModel.math.ts` helpers (skew moves both offsets, clamps ≥ 0.5).

## Acceptance criteria
- `/market-making/desk?m=MM1`: F2 plays to settlement at 5× with no console errors; quotes in the ladder
  match the ticket; re-quoting shows "ahead" jump up (back of the queue); pull stops fills; hedge flattens.
- Sidebar lists Lab and Desk; build pre-renders desk paths; `test:seo`, `test:sandbox` pass; smoke and layout
  audit clean at 360/768/1280/1536; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:micro-desk && npm run test:microstructure && npm run test:game-kit && npm run test:sandbox
npm run build && npm run test:seo && ls dist/market-making/desk dist/hu/market-making/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/market-making,/market-making/desk,/market-making/desk?m=MM4,/market-making/nope,/hu/market-making/desk,/sandbox"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/market-making/desk"
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Render rate:** at 5× the reducer advances 5 ticks per 100 ms; render once per interval, not per tick;
  memoise the ladder on `state.book`.
- **Ticker + tab hidden:** `setInterval` throttles in background tabs; that's fine (time just slows), but
  never compute ticks from `Date.now()` deltas (breaks determinism).
- **Reduced motion:** start paused and keep F3 (step) as the main control; no flashing rows.
- **Informed flags** are only for the debrief; leaking them into the tape turns the game into a lookup.

## Findings (fill in during execution)
- Files and largest `.tsx`: `src/features/market-making-desk/` — `MarketMakingDeskView.tsx` (72 lines, the largest), `useMarketMakingDesk.ts` (`useMmUrl`, `useMmSession`, `MmDeskModel`, `MM_SPEEDS`), `useMmKeys.ts`, `deskModel.math.ts`, `eventText.ts`, `objectiveViews.ts`, `quoteCells.ts`, `mmCopy.ts`, `mmProgress.ts`, `marketMakingDesk.url.ts`; `components/` `MmDeskScreen`, `QuoteTicket`, `MmRiskPanel`, `MmBookLadder`, `MmPriceChart`, `MmTape`, `PnlAttribution` (kit `AttributionBars`), `MmSpeedControl`; stubs `components/MmMissionsScreen`, `MmDebriefScreen`, `help/MmNextMove`, `MmWhatIf`, `MmGuide`, `demo/demo.script.ts`. Also `src/lib/market/ladder.ts` (created here per plan 03 step 1), `src/Language/MarketMakingDesk.ts`/`.hu.ts`, `src/styles/_market-making-desk.scss`, `scripts/micro-desk-screen.test.mjs` (5 tests).
- Notes for plan 12: stubs take `{ desk }: { desk: MmDeskModel }` (the help stubs too; `HelpSheet` receives `<MmNextMove desk={desk} />` etc. — add `help` if you need it). `useMmUrl` has `hasDemo` (true once `buildMmDemo()` returns steps) and `startDemo/exitDemo/newSeed/restart/selectMission`; no `takeOver` yet. In demo mode the key bar is still shown (no `DemoBar` / `useDemoPlayer` wiring yet) and progress is not recorded. The engine state now carries `tape: MmTrade[]` (last 30 trades, `you` flag, no informed flag) and `informedFills` for the debrief. For `beatPolicy`, the session replays the robot once (`policyPnl`, ~35 ms). Desk copy keys for missions are `mmdMs_<id>_title/brief`; robot names are `mmdPolicy_<id>` (`POLICY_KEY`).
- New HU keys for owner review: the whole `src/Language/MarketMakingDesk.hu.ts` table (draft), `navMarketMakingLab` "Labor", `navMarketMakingDesk` "Árjegyzési desk", `seoDescMarketMakingDesk`. "Adverse selection" → "adverz szelekció" (matching plan 01's copy); the title reads "Market making desk (árjegyzés)".
- Deviations: (1) objectives are shown in the left `MissionPanel` (kit pattern) rather than a second `ObjectiveList` on the right, since the kit has no separate objectives title. (2) The engine gained `MmTrade`/`state.tape` and exports `quotePrices` and `crowdMid` (shared by the ticket preview and the reducer). (3) The chart uses `curve="linear"` at 1 s resolution (LineChart has no step curve); x ticks are seconds elapsed and inventory ticks use "k". (4) The ticket edits a draft (offsets, size, auto) that "Place quotes" commits; F4–F9 act on the live quote directly. (5) The ladder centre is a pure fold of `windowCentre` over the mid history (`ladderCentre`), not render state. (6) The **Hedge** event and tape entry use the hedge side. Verification: the shared tree's `tsc -b`/`npm run build` was red from other plans' in-progress files, and shared `dist/` builds collided with other sessions. So the build was checked with `SEO_ALLOW_EMPTY=1 vite build --outDir node_modules/.mmdist*` (desk pages pre-rendered EN/HU with content, desk in the sitemap); `test:seo` (fixed to `dist/`) was not run. CDP smoke clean on `/market-making`, `/market-making/desk`, `?m=MM4`, `/hu/market-making/desk`, `/sandbox`, `/hu/sandbox`; `/market-making/nope` shows the same React #418 redirect warning as `/immunization/nope` (pre-existing). Interaction check: join → ladder YOU rows match the ticket; re-quote moves "ahead" 0 → 201; pull empties your rows; hedge flattens +1,876 → 0; 5× play reaches 10:10:00 with the end event and keys disabled, no console errors. Layout audit 360/768/1280/1536 EN/HU: only the kit's sticky-footer overlaps (same on `/portfolio-lab/desk`) and the header brand tap target remain.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/11-desk-screen.md`; confirm plans 01 and 10 are
> done and read plan 10's Findings. Implement plan 11: the `/market-making/desk` route and `subNav`, the
> kit-framed real-time desk (ladder with your quotes, ticket, risk, price/inventory chart, tape, live P&L
> attribution, function keys, speed), progress store, Sandbox entry, stubs for plan 12, copy, styles and
> tests. Run the verification block, fill in Findings, append DONE to LOG.md, set plan 11 to `done`, and
> summarise.
