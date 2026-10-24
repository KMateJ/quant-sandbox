# 14 — Retirement desk route, frame and desk screen

Status: done (2026-10-24) · Depends on: 02, 13 · Suggested model: Sonnet · Est. size: M

## Why
Puts the retirement desk on screen at `/tvm/desk`: wealth path against the fixed-4% rule on the same
returns, yearly withdrawals, returns strip, success-odds history, the decision ticket, a rule comparison,
the year table and events, plus the stubs plan 15 fills.

## Current state (verified 2026-10-24, commit `349c0ca`)
- Registry `src/modules/registry.ts` L319–329: `id: "tvm"`, `path: "/tvm"`, category `corporate`, beta, no
  `subNav`, `Component: lazy(() => import("../features/tvm/TvmView"))`.
- Sub-page pattern: `src/features/delta-hedging/DeltaHedgingPages.tsx`, registry delta-hedging entry
  (`subNav` at ~L184), `src/App.tsx` mounts `${path}/*`, `src/seo.routes.ts` turns `subNav` items with
  `descKey` into pages (description 50–160 chars).
- Engine (plan 13) `src/features/retirement-desk/engine/`: `RETIREMENT_MISSIONS`, `retirementMissionById`,
  `yearShocks`, `portfolioReturn`, `portfolioStats`, `nextWithdrawal`, `withdrawalRate`, `successOdds`,
  `startRetirement`, `reduceRetirement`, `evaluateRetirement`, `replayRetirement`.
- Kit (plans 01–02): `GameFrame`, `CommandBar`, `QuoteStrip`, `ScreenTabs`, `FunctionKeyBar`, `ViewControls`,
  `DeskGrid`, `DeskPair`, `MissionPanel`, `EventLog`, `BandMeter`, `SeriesKey`, `useGameHelp`, `HelpSheet`,
  `useProgress`, `useFunctionKeys`, `gameFormat`; `createProgressStore`, `higherIsBetter`.
- Charts: `src/components/charts/LineChart`, `src/components/layout/ChartContainer.tsx`.
- Design: canvas board `RetirementDesk.dc.html`.

## Goal
1. `/tvm/desk` (and `/hu/tvm/desk`) renders the desk; `/tvm` unchanged; sidebar shows Lab and Retirement desk.
2. Panels and keys work for every mission (`?m=T1…T5`). 3. Stubs for plan 15.

## Non-goals
- Missions screen, debrief, help content, demo (plan 15). No edits to tvm lab files except the new router.

## Constraints
- README §4 recipe: folder `src/features/retirement-desk/`, prefix `retr`, ids `retr-*`, partial
  `src/styles/_retirement-desk.scss` under `.retr` (appended `@use` at the end of `main.scss`), table
  `src/Language/RetirementDesk.ts` (+ `.hu.ts`) registered at the end of `index.en.ts` / `index.hu.ts`.

## Steps
1. Router `src/features/tvm/TvmPages.tsx` (empty → `TvmView`, `"desk"` → lazy
   `../retirement-desk/RetirementDeskView`, else `<Navigate to="/tvm" replace />`), copied from the
   delta-hedging pattern.
2. Registry (tvm entry only): `Component` → `TvmPages`; `subNav: [{ id: "lab", labelKey: "navTvmLab", to: "/tvm" }, { id: "desk", labelKey: "navRetirementDesk", descKey: "seoDescRetirementDesk", seoTitle: "Retirement Desk: Withdrawal and Sequence Risk Game", to: "/tvm/desk" }]`.
3. Copy: nav labels in `Home.ts`/`.hu.ts` (after the tvm keys); `seoDescRetirementDesk` in `Seo.ts`/`.hu.ts`.
4. URL `retirementDesk.url.ts`: `m` (`urlEnum`, default `"T1"`), `seed` (`urlNumber(3, 1, 9999, 0)`),
   `screen` (`desk | missions | debrief`), `demo` (`urlBool`).
5. Progress `retirementProgress.ts`: `RETIREMENT_PROGRESS = createProgressStore("retirement", higherIsBetter)`
   (best = total amount spent over the run).
6. Hooks `useRetirementDesk.ts`: `useRetirementUrl()` (memo `yearShocks` per mission + seed) and
   `useRetirementSession(url)` (reducer via `useReducer`; ticket `amount: string`, `equity: number` (0–100,
   step 5); derived `oddsNow = successOdds(…, amount, equity)` memoised on (year, wealth, amount, equity);
   `rate`, `stats`, `guardAmount`, `objectives`; actions `setAmount`, `setEquity`, `fillPreset(id)`, `take`,
   `takeGuard(n)`, `newPath`, `restart`, `dispatch`). Export `type RetirementDeskModel`. Split into two
   files if the hook passes ~150 lines.
7. View `RetirementDeskView.tsx`: kit frame; `CommandBar` (ticker `QSRT Retirement Plan`, code `RETR <GO>`,
   clock "Year {y}/{years} · {left} years left" or "Money ran out"); `QuoteStrip` `retr-quotes` (wealth,
   last return, spent so far, average spend, cuts used / allowed, first-decade return, odds now); tabs +
   intro; `FunctionKeyBar` `retr-keys` (F2 Take the year, F3 Guardrails × 5 years, F4 Use guardrail amount,
   F8 New path, F9 Restart); Sandbox link (`gkSandboxLink` → `/sandbox`); `HelpSheet` with stub tabs.
8. Panels (`components/`):
   - Left: `MissionPanel` `retr-mission`; `RetirementRiskPanel` `retr-risk` (odds with COMFORTABLE ≥ 85% /
     STRETCHED ≥ 70% / IN DANGER as words, `BandMeter` 0–100% band 85–100, withdrawal rate, years of
     cover, equity, expected real return and vol from `portfolioStats`); `EventLog` `retr-events`.
   - Centre: `WealthChart` `retr-wealth` (your wealth vs fixed-40,000 on the same returns, future years
     shaded, withdrawals as bars below with the target line); `DeskPair` of `ReturnStrip` `retr-returns`
     (yearly return bars, ± sign in `title`) and `OddsChart` `retr-odds` (odds at each decision, 85% band);
     `YearTable` `retr-years` (last 10 years: start, withdrawal, equity, return, end, odds).
   - Right: `DecisionTicket` `retr-ticket` (amount input, presets 4% INIT / 4% NOW / GUARD / 3.5% INIT,
     equity slider with "60% equity · 40% bonds" label (disabled with a note when `equityLocked`), preview:
     rate, change vs last year (marks a cut), odds; submit `retr-submit`); `RuleCompare` `retr-rules`
     (odds from today for Fixed 40,000 / Fixed 35,000 / 4% of wealth / Guardrails, with first amount).
9. Stubs for plan 15 (first line `// Stub: filled by docs/plans/game-desks/15.`):
   `components/RetirementMissionsScreen.tsx`, `RetirementDebriefScreen.tsx` (`{ desk: RetirementDeskModel }`),
   `help/RetirementNextMove.tsx`, `RetirementWhatIf.tsx`, `RetirementGuide.tsx` (`{ desk, help: GameHelp }`),
   `demo/demo.script.ts` (`buildRetirementDemo` → `[]`).
10. Styles `_retirement-desk.scss`; copy table `RetirementDesk.ts`/`.hu.ts` (event texts, panel titles,
    quote labels, key labels, odds words); tests `scripts/retirement-desk-screen.test.mjs` (`eventText`
    exhaustive over event kinds, EN/HU key parity, HU ≠ EN).

## Acceptance criteria
- `/tvm` unchanged; `/tvm/desk?m=T1`: F3 six times reaches settlement with no console errors; typing a
  negative or empty amount disables submit; `?m=T3` disables the equity slider.
- Sidebar lists Lab and Retirement desk; build pre-renders both desk paths; `test:seo` passes; smoke and
  layout audit clean; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:retirement-desk && npm run test:game-kit
npm run build && npm run test:seo && ls dist/tvm/desk dist/hu/tvm/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/tvm,/tvm/desk,/tvm/desk?m=T3,/tvm/nope,/hu/tvm/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/tvm/desk"
```
Stop the server; confirm the port is free (`netstat -ano | grep :4173`).

## Pitfalls
- **Odds on every keystroke:** memoise `successOdds` on its inputs and parse the amount once; typing
  "40000" must not run five 400-path simulations per character in a way that freezes input (debounce the
  preview by one animation frame if it measures over ~16 ms).
- **Pre-render:** nothing may run Monte Carlo at module load; compute inside hooks only.
- **Equity locked (T3):** keep the slider visible but disabled, so layout does not jump between missions.

## Findings (fill in during execution)
- Files: `src/features/tvm/TvmPages.tsx`; registry tvm `subNav` + `Component`; `navTvmLab`, `navRetirementDesk`
  (Home), `seoDescRetirementDesk` (Seo); `src/features/retirement-desk/` — `retirementDesk.url.ts`,
  `retirementProgress.ts`, `retirementCopy.ts`, `retirementFormat.ts`, `ticket.math.ts` (parse, presets, preview,
  first-decade return, fixed-rule path), `eventText.ts`, `objectiveViews.ts`, `quoteCells.ts`, `useRetirementDesk.ts`
  (`useRetirementUrl`, `useRetirementSession`, `RetirementDeskModel`), `useRetirementKeys.ts`, `RetirementDeskView.tsx`,
  `components/` (DeskScreen, RiskPanel, WealthChart, ReturnStrip, OddsChart, YearTable, DecisionTicket, RuleCompare),
  stubs for plan 15; `src/styles/_retirement-desk.scss`; `src/Language/RetirementDesk*.ts`;
  `scripts/retirement-desk-screen.test.mjs`. Largest .tsx 85 lines.
- Model for plan 15: `RetirementDeskModel` = URL model (`mission`, `shocks`, `seed`, `demo`, `setScreen`,
  `selectMission`, `newPath`, `restart`, `startDemo`, `exitDemo`) + `state`, `dispatch`, `amountText`, `amount`
  (parsed or null), `equity`, `oddsNow`, `preview`, `guardAmount`, `objectives`, `valid`, `setAmount(text|null)`,
  `setEquity`, `fillPreset(id)`, `take()`, `takeGuard(years=5)`, `useGuard()`. Progress is recorded in the session
  hook on settle (skipped in the demo), not in the debrief screen. `buildRetirementDemo()` takes no arguments (like
  the portfolio desk); an empty list hides the demo button.
- Deviations:
  - Odds use the engine default rule "same" (plan 13 DEVIATION), so the risk panel shows the odds of repeating this
    year's amount; `RuleCompare` passes each rule explicitly.
  - Yearly returns are a strip of tinted cells with the signed value written in (the chart kit has no bar chart);
    withdrawals are a line under the wealth chart with the target as a reference line.
  - The ticket starts filled with the guardrail amount; F4 refills it.
- Verification: tsc clean (once plan 03's half-moved files settled); eslint clean on new files;
  `test:retirement-desk` 17/17; `test:game-kit` 14/14; build pre-renders `dist/tvm/desk.html` and
  `dist/hu/tvm/desk.html` (h1 "Retirement desk" / "Nyugdíjdesk"); `test:seo` 24/25, the one failure being the
  pack-wide initial-JS budget (see LOG). cdp-smoke clean on `/tvm`, `/tvm/desk`, `/tvm/desk?m=T3`, `/tvm/nope`
  (redirects to `/tvm`), `/hu/tvm/desk`; one run showed React #418 on `/tvm/nope` that did not reproduce in two
  re-runs (another session was rebuilding `dist/`). layout-audit (preview port 4183, DevTools 9416, `--wait 4000`)
  clean at all widths and themes apart from the harness-wide `theme` check; with the default 2.5 s wait the charts
  are still settling and the sticky key bar is reported as overlapping. The "F3 × 6 reaches settlement" check is
  covered by the engine/screen tests, not clicked in a browser.
- Items awaiting owner approval: HU strings added: all of `src/Language/RetirementDesk.hu.ts`; `navTvmLab`
  "Labor", `navRetirementDesk` "Nyugdíjdesk", `seoDescRetirementDesk`. Term choices to review: "guardrails" →
  "korlátos szabály", "withdrawal rate" → "kivételi ráta", odds words KÉNYELMES / FESZÍTETT / VESZÉLYBEN.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/14-retirement-desk-screen.md`; confirm plans 02 and 13 are
> done. Implement plan 14: `/tvm/desk` route and registry `subNav`, URL/progress/hooks, kit view, panels,
> stubs for plan 15, styles, copy and tests. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 14 to `done`, and summarise. Do not touch the tvm lab views. Do not stash or check out.
