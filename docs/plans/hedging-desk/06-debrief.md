# 06 — Debrief: attribution, theta vs gamma, policy replay

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
The lesson lands after expiry: why the hedge made or lost money. The debrief splits the P&L into its
parts, shows theta collected against gamma paid and the realized-vs-implied vol gap, and replays the
same path with simple auto-hedge policies so the learner can compare their own run.

## Current state (verified 2026-10-23, after plans 01–02)
- Stub: `src/features/hedging-desk/components/DebriefScreen.tsx` (`({ desk }: { desk: HedgingDeskModel })`),
  shown when `?screen=debrief`.
- Model: `mission`, `market`, `state` (`settled`, `day`, `fills`, `history`, `cash`, `costsPaid`,
  `breaches`, `positions`), `pnl`, `objectives`, `setScreen`, `newPath`, `restart`.
- Engine: `startBook`, `reduceDesk`, `advanceDays`, `autoHedgeOrder`, `applyOrder`, `markToMarket`,
  `quoteInstrument`, `tauAt`, `realizedVol`, `evaluateObjectives`, `CONTRACT_MULT`, `TRADING_DAYS`.
  Accounting from plan 01: cash accrues at `exp(rate/252)` per day; options cash-settle at intrinsic on
  the expiry day; the book starts at 0, so final `markToMarket` is the run's P&L.
- Plan 05 exports `recordResult(missionId, passedAll, pnl)` from `src/features/hedging-desk/deskProgress.ts`.
  If plan 05 is not done yet, skip the call and note it in Findings.
- Design reference: canvas board `Debrief.dc.html`: verdict banner (MISSION PASSED / FAILED, final P&L,
  realized vol, implied vol), objectives with final status, P&L attribution bars, cumulative + daily P&L
  chart, "Why the hedge made or lost money" (theta collected, gamma paid ½Γ(ΔS)², vol gap), "Same path,
  other policies" table, next-step buttons.

## Goal
1. `src/features/hedging-desk/engine/debrief.math.ts` (new, owned here, pure):
   - `attribution(mission, market, state) → { premium, optionSettlement, stockPnl, financing, costs, net }`
     where `net === markToMarket(state, market)` within 1e-6. Premium = opening option trades at **mid**;
     costs = `costsPaid`; financing = accrued interest on cash; stockPnl from stock fills at mid plus the
     final stock value; optionSettlement = intrinsic paid/received at expiry plus any option trades the
     user made, at mid.
   - `thetaGamma(mission, market, state) → { thetaCollected, gammaPaid }`: over each recorded day, θ of the
     book at the open (per trading day: `θ_calendar · 365/252`) and `½·Γ·(ΔS)²`.
   - Policy replays come from plan 01's `engine/policy.math.ts`
     (`replayPolicy(mission, market, seed, every): PolicyResult`). Reuse it; do not write another.
   - `dailyPnl(history, finalPnl) → number[]`.
   Tests in `scripts/hedging-desk-debrief.test.mjs`: attribution sums to `net` for (a) the daily policy,
   (b) a run with option trades, (c) the no-hedge policy; `thetaGamma` signs (short calls: theta
   collected > 0, gamma paid > 0).
2. `DebriefScreen` composed of `DebriefBanner.tsx`, `DebriefObjectives.tsx`, `PnlAttribution.tsx`
   (horizontal bars centred on zero, value labels), `PnlHistoryChart.tsx` (cumulative line + daily bars;
   use `LineChart` for the line and draw bars in its `layer`), `ThetaGammaPanel.tsx`,
   `PolicyCompare.tsx` (rows: Daily, Weekly (5), Monthly (21), No hedge, **Your run** highlighted).
3. Before expiry the screen shows "The debrief opens at expiry" with "Run to expiry" (steps the remaining
   days) and "Back to desk" buttons, plus the policy table (policies do not need the user's run).
4. On reaching a settled state, call `recordResult(mission.id, allPassed, pnl)` **once per run** (an
   effect guarded by a ref keyed on the session).

## Non-goals
- No new chart library; no engine edits outside the new `debrief.math.ts`.
- Missions screen (05), desk panels (03/04).

## Constraints
- `.tsx` ≤ ~150 lines each.
- Strings: new table `src/Language/HedgingDeskDebrief.ts` (`hedgingDeskDebriefEn`) + `.hu.ts`, keys
  `hdDebrief*`, registered additively.
- Styles: `src/styles/_hedging-desk-debrief.scss`, `@use` appended after the other `hedging-desk*` lines.
- Explanatory text is short and factual (one sentence per card). The owner prefers plain descriptive
  wording; no jokes, no "movie-title" headings.

## Steps
1. Write `debrief.math.ts` and its tests first; make the attribution identity hold before any UI.
2. Memoise the four policy replays with `useMemo([mission, market])` (each replays ≤ 63 days; cheap).
3. Build the components; verdict colour blue for pass, red for fail, with the word always shown.

## Acceptance criteria
- After playing M1 to expiry, `PnlAttribution`'s net equals the desk's P&L to the cent, and the "Your
  run" row matches it.
- `Run to expiry` from day 10 settles the book and the screen switches to the full debrief.
- Breaking the financing term on purpose (drop it) fails the attribution test.
- Smoke and layout audit clean on `?screen=debrief`.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk?screen=debrief,/hu/delta-hedging/desk?screen=debrief"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk?screen=debrief"
```
Use `cdp-smoke.mjs --after` to click "Run to expiry" and confirm no console errors. Stop the server and
confirm port 4173 is free.

## Pitfalls
- **Premium at mid vs fill price.** The client trade fills at the bid; the half-spread is already in
  `costsPaid`. Counting the premium at the fill price *and* subtracting costs double-counts it.
- **Financing is large.** The hedge borrows roughly 550 × $100 for a quarter, so financing is a few
  hundred dollars on M1. The interest part of theta offsets it, so the net stays small. Leaving
  financing out breaks the identity and makes every hedge look several hundred dollars better than it
  is.
- **Do not duplicate accounting.** `attribution` and `thetaGamma` read the run's `fills`/`history`;
  policies come from `replayPolicy`, which drives `reduceDesk`, so plan 07 mechanics (ticket fees,
  physical settlement) are included automatically. With physical settlement, assigned shares count as
  stock P&L, and the strike cash counts as option settlement.
- **recordResult must not fire during render or twice** under StrictMode; guard with a ref.

## Findings (fill in during execution)
- Baseline / measurements: M1 seed 7 P&L: daily −$893.41 / weekly (5) −$141.13 / monthly (21) −$1,233.91 / none −$18,547.86. Smoke: "Run to expiry" from day 0 settles; attribution net = "Your run" row = −$18,548 (no-hedge run). Layout audit 360–1536 px EN/HU clean (36 pages, 0 failing).
- Deviations and why: `attribution` derives financing by replaying the fills' cash flows with daily accrual, and option settlement as the remaining cash change at expiry (so plan 07's physical settlement and ticket fees are included without engine edits). `thetaGamma` uses the book carried overnight (fills up to and including that day). `dailyPnl` returns history.length + 1 values (into each close, then into expiry) and sums to the final P&L. The policy rows come from `useDebrief.ts` (hook, not .tsx). Components live in `components/debrief/`. Extra key `hdDebriefVolPts`. The lint run still shows 11 errors, all in files outside the desk (AppShell, heston, diffusion, payoff-lab, i18n, theme).
- Notes for 02 owner: layout audit flags tap targets below 44px on the screen tabs (28px tall) at 360/390 px (`ScreenTabs`, plan 02).
- Items awaiting owner approval: HU strings added (`HedgingDeskDebrief.hu.ts`, all draft): hdDebriefPassed … hdDebriefMissions, hdDebriefVolPts (44 keys).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/06-debrief.md`, and confirm plans 01 and 02 are marked done
> (stop and report if not). Implement plan 06: `engine/debrief.math.ts` with its tests (attribution
> identity first), then the Debrief screen components, i18n table and SCSS partial, and the one-time
> `recordResult` call if plan 05 is done. Run the verification block and make it pass. Fill in Findings
> (record the seed 7 policy numbers, list HU strings), set plan 06 to `done` in the README table, and
> summarise.
