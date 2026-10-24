# 09 — Rates missions screen, help, demo, debrief

Status: done (2026-10-24) · Depends on: 08 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Turns the rates desk into a lesson: briefings for R1–R5, live advice (DV01 band, curve risk, CTD switch,
roll deadline), what-if hedges compared side by side, a guide, a playthrough and a debrief that compares
your hedging with simple policies on the same curve path.

## Current state (verified 2026-10-23, after plans 01–08)
- Stubs (plan 08): `src/features/rates-desk/components/RatesMissionsScreen.tsx`, `RatesDebriefScreen.tsx`
  (`{ desk: RatesDeskModel }`), `help/RatesNextMove.tsx`, `RatesWhatIf.tsx`, `RatesGuide.tsx`
  (`{ desk, help: GameHelp }`), `demo/demo.script.ts` (`buildRatesDemo(mission, seed)` → `[]`).
- Model `RatesDeskModel` (`useRatesDesk.ts`): `mission`, `path`, `state: RatesState`, `zeros`, `risk`,
  `objectives`, `scenarios`, ticket `{ future, side, qty }` + setters, `submit`, `hedgeDv01`, `hedgeKrd`,
  `step`, `dispatch`, `setScreen`, `selectMission`, `startDemo`, `takeOver`, `exitDemo`, `demo`.
- Engine (plan 07): `reduceRates` (`trade`, `dv01Hedge`, `krdHedge`, `step`, `restore`), `ratesRisk`,
  `dv01HedgeQty`, `krdHedgeQty`, `curveScenarios`, `ctdSwitchBp`, `evaluateRates`,
  `replayRates(mission, seed, "dv01Daily10Y" | "dv01Weekly10Y" | "krdDaily" | "none")`, `RATES_MISSIONS`.
- Kit and lib as in plan 06 (`AdviceList`, `WhatIfCard`, `GuideAccordion`, `GuidePlaybook`, `DemoBar`,
  `useDemoPlayer`, `MissionList`, `MissionBriefing`, `DeskRules`, `DebriefBanner`, `DebriefPending`,
  `AttributionBars`, `PolicyTable`, `ObjectiveList`; `rankAdvice`, `foldStates`, `allPassed`).
- Progress store `RATES_PROGRESS` (`ratesProgress.ts`). Design: canvas board `RatesDesk.dc.html`.

## Goal
Missions screen, debrief (with progress recording), three help tabs and a six-step demo for the rates desk.

## Non-goals
- No engine edits (append BLOCKED to LOG.md if one is needed). No changes to plan 08's panels beyond wiring.

## Constraints
- Pure logic in `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`, `demo/demo.script.ts`.
- Copy in `src/Language/RatesDeskMissions.ts`, `RatesDeskHelp.ts` (+ `.hu.ts`), prefix `ratd`; styles in
  `src/styles/_rates-desk-help.scss`.

## Steps

### Phase 1 — pure logic + tests
1. `ratesAdvice(mission, state, path)` ranked with `rankAdvice`. Actions: `{ kind: "ticket"; future: number; side: "BUY" | "SELL"; qty: number } | { kind: "krdHedge" } | { kind: "key"; code: "F2" | "F3" | "F4" | "F6" } | { kind: "screen"; screen: "debrief" } | { kind: "tab"; tab: "whatIf" | "guide" } | { kind: "point"; anchor: string }`.
   Rules: `ended` (done), `dv01Outside` (urgent: net, band; ticket action sized by `dv01HedgeQty` on the 10Y
   or the live front contract), `noMissesLeft` (urgent), `curveRisk` (suggest: largest bucket > 1,500 while
   DV01 is in band; action krdHedge), `rollDeadline` (R5: urgent from 2 days before expiry while front
   contracts are open; ticket action to sell the back contract), `ctdNear` (info: contract, bp when
   `ctdSwitchBp` ≤ 25), `costsHigh` (suggest), `pnlTarget` (R4: info, gap to target), `inBand` (info; key F2).
2. `ratesWhatIf(mission, state, path)`: candidates `doNothing`, `dv01With10Y` (F4), `dv01With5Y`,
   `dv01With2Y`, `keyRate` (F6), and for R5 `rollToBack`. Each: contracts traded, cost, net DV01 after,
   largest key-rate bucket after, worst `curveScenarios` hedged P&L; verdicts `inBand | outsideBand |
   curveRiskLeft | curveRiskSmall | costly | blocked`. Apply on copies through `reduceRates`.
3. `guide.data.ts`: playbooks R1–R5 (steps/traps counts), panels (`mission, risk, events, curve, moves,
   pnl, positions, ticket, ctd, scen`), keys (F1–F4, F6, F8, F9), mistakes (6), terms (`dv01`, `keyRateDv01`,
   `ctd`, `conversionFactor`, `basis`, `steepener`, `roll`, `calendarSpread`).
4. `buildRatesDemo(mission, seed)` for R1 (constant `RATES_DEMO_SEED`, a seed where the scripted run passes):
   `welcome` → `dv01Hedge` (10Y) → `fiveDays` → `keyRate` → `fiveMore` → `yourTurn`.
5. Tests `scripts/rates-desk-help.test.mjs`: R1 start → `dv01Outside` first; after the key-rate hedge no
   `curveRisk`; R5 shows `rollDeadline` on day 8; ≤ 6 items in tone order; what-if no mutation and
   `keyRate` leaves every bucket under the limit; demo folds to a passed R1; copy for every id in EN and HU,
   HU ≠ EN.

### Phase 2 — components, copy, styles
6. `RatesMissionsScreen`: list, briefing (setup: book (face per bond), futures and contract sizes, days,
   daily vol per factor, drifts described in words, cost per contract, expiries), rules (one day per step,
   costs per contract, futures track their cheapest-to-deliver bond, limits checked at the close).
7. `RatesDebriefScreen`: pending state with Run to the end; banner (hedged P&L, bonds alone, costs, misses),
   objectives, `AttributionBars` (bond P&L, futures P&L, costs), P&L history (reuse `RatesPnlChart`),
   `PolicyTable` (DV01 daily with 10Y, DV01 weekly, Key-rate daily, No hedge, **Your run**: P&L, misses,
   contracts, costs); record progress once (`RATES_PROGRESS.record`), skip demo, ref guard.
8. Help tabs and demo wiring (as in the ALM desk: `useDemoPlayer({ deskId: "rates", … })`, `DemoBar`,
   Watch button when the script is non-empty; "Put in ticket" fills the ticket; multi-contract cards trade
   directly with label "Trade it").
9. Copy tables with every mission, setup, rule, objective, advice, what-if, guide, demo and debrief string.

## Acceptance criteria
- Missions R1–R5 startable from the missions screen; debrief policy table and attribution correct (bond +
  futures − costs = hedged P&L within 1).
- Help actions and "Show me" work; demo six steps with take-over.
- `npm run test:rates-desk` green; smoke clean on all screens and demo.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:rates-desk && npm run test:game-kit
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/yield-curve/desk?screen=missions,/yield-curve/desk?screen=debrief,/yield-curve/desk?demo=1,/hu/yield-curve/desk?screen=missions"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/yield-curve/desk?screen=missions,/yield-curve/desk?screen=debrief"
```
Stop the server; confirm the port is free.

## Pitfalls
- **What-if cost:** each card re-prices baskets under bumps; compute only while the What-if tab is open.
- **R4 has no bonds:** advice and attribution must not divide by book DV01.
- **Record once** under StrictMode; skip in demo.

## Findings (fill in during execution)
- Demo seed: `RATES_DEMO_SEED = 21` on R1 (`demo/demo.script.ts`; `useRatesDesk.ts` imports it). Daily DV01 hedging with the 10Y passes R1 on this path (+$18k, costs about $7.4k).
- Verification (temporary worktree snapshot of the shared tree; the snapshot must also drop files deleted in the tree, `git ls-files -d`, or plan 03's removed hedging files come back): `tsc -b` clean, eslint clean on every file of this plan, `test:rates-desk` 25/25 (7 new help tests), `test:game-kit` 14/14, build green. Smoke clean on missions, debrief and demo in EN and HU. Click-throughs: R1 F4 + F3×4, then Debrief shows Mission passed and the result is saved under `qs.game.rates.progress.v1`; R2 "Run to the end" with no trades shows Mission failed, attribution bonds + futures − costs equals hedged P&L, 5 policy rows, nothing saved; demo → → then Take the desk keeps day 5, removes the demo bar and restores the function keys; R5 on day 15 advises DV01 outside band and lists the six what-if cards (roll blocked after expiry). Layout audit on missions and debrief: clean at every width and theme except the site-wide `a.brand` tap target.
- Deviations:
  - Demo steps are `welcome → dv01Hedge → fiveDays → keyRate → toEnd → yourTurn`. A real key-rate hedge costs about $46k, over R1's $12k cost limit, so the `keyRate` step explains the key-rate bars without trading, and `toEnd` (instead of `fiveMore`) runs daily DV01 hedging to settlement, which is what makes the demo end in a passed R1 (the plan's own test).
  - `rollDeadline` advice opens the What-if tab, where the `rollToBack` card closes the front and DV01-hedges in the back on the same day ("Trade it"). Selling the back while the front is still open would double the hedge at the next close.
  - Multi-leg what-if cards (key-rate, roll) trade directly with "Trade it"; single-leg cards fill the ticket.
  - No `_rates-desk-help.scss`: the kit's help/missions/debrief styles cover every class used, so an empty partial would add nothing.
  - Extra pure/view helpers: `help/adviceView.ts` (copy vars and action wiring), `missionSetup.ts` (`setupRows`, `deskRules`), `useRatesDebrief.ts`, `demo/useRatesDemo.ts`; `objectiveLabel` added to `ratesCopy.ts`. `ADVICE_IDS` and `WHAT_IF_IDS` are exported for copy-coverage tests.
- Items awaiting owner approval: HU strings added: all of `src/Language/RatesDeskMissions.hu.ts` and `RatesDeskHelp.hu.ts` (new drafts; glossary followed: futures, short, spread, desk, P&L kept English; konverziós faktor, bázis, meredekedés, görgetés, kulcskamat in Hungarian). Loanword-only labels got qualifiers, e.g. `ratdDbAttrFutures` "Futures eredménye", `ratdGdTerm_dv01` "DV01 (dollárérték)".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/09-rates-missions-help-demo.md`; confirm plan 08 is done.
> Implement plan 09: pure advice/what-if/guide/demo logic with tests, then the missions screen, debrief with
> progress recording, help tabs, demo wiring, copy and styles. Run the verification block, fill in Findings,
> append DONE to LOG.md, set plan 09 to `done`, and summarise.
