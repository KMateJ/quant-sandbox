# 15 — Retirement missions screen, help, demo, debrief

Status: done (2026-10-24) · Depends on: 14 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Makes the retirement desk teach: briefings for T1–T5, advice when the odds drop or the withdrawal rate
runs hot, what-if decisions side by side, a guide, a playthrough and a debrief that compares your run with
simple spending rules on the same returns.

## Current state (verified 2026-10-24, after plans 01–14)
- Stubs (plan 14): `src/features/retirement-desk/components/RetirementMissionsScreen.tsx`,
  `RetirementDebriefScreen.tsx` (`{ desk: RetirementDeskModel }`), `help/RetirementNextMove.tsx`,
  `RetirementWhatIf.tsx`, `RetirementGuide.tsx` (`{ desk, help: GameHelp }`), `demo/demo.script.ts`
  (`buildRetirementDemo(mission, seed)` → `[]`).
- Model `RetirementDeskModel`: `mission`, `shocks`, `state: RetirementState`, `amount`, `equity`, `oddsNow`,
  `rate`, `guardAmount`, `objectives`, setters `setAmount`, `setEquity`, `fillPreset`, actions `take`,
  `takeGuard`, `newPath`, `restart`, `dispatch`, screen/mission/demo setters, `demo`.
- Engine (plan 13): `reduceRetirement` (`take`, `auto`, `restore`), `successOdds`, `nextWithdrawal`,
  `withdrawalRate`, `portfolioStats`, `evaluateRetirement`, `replayRetirement(mission, seed, "fixed" |
  "fixedLow" | "pctWealth" | "guardrails")`, `RETIREMENT_MISSIONS`.
- Kit (plans 01–02): `rankAdvice`, `foldStates`, `stepIndexById`, `AdviceList`, `WhatIfCard`,
  `GuideAccordion`, `GuidePlaybook`, `GuideList`, `DemoBar`, `DemoButton`, `useDemoPlayer`,
  `MissionList`, `MissionBriefing`, `DeskRules`, `DebriefBanner`, `DebriefPending`, `AttributionBars`,
  `PolicyTable`. Progress store `RETIREMENT_PROGRESS`.
- Reference: the canvas board `RetirementDesk.dc.html` contains drafted advice, what-if cards, guide text
  and a five-step demo (`rtAdvice`, `rtCards`, `rtGuide`, `rtSteps`). Reuse its **wording** as the EN draft;
  re-implement the logic on the engine.

## Goal
Missions screen, debrief (progress recording), three help tabs and a six-step demo.

## Non-goals
- No engine edits (append a BLOCKED line to LOG.md if one is needed).

## Constraints
- Pure logic in `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`, `demo/demo.script.ts`.
- Copy in `src/Language/RetirementDeskMissions.ts`, `RetirementDeskHelp.ts` (+ `.hu.ts`), prefix `retr`;
  styles in `src/styles/_retirement-desk-help.scss`.

## Steps

### Phase 1 — pure logic + tests (stop when green)
1. `retirementAdvice(mission, state, ticket: { amount; equity }, oddsNow)`; actions
   `{ kind: "fill"; amount: number } | { kind: "equity"; equity: number } | { kind: "key"; code: "F2" | "F3" | "F4" } | { kind: "screen"; screen: "debrief" } | { kind: "tab"; tab: "whatIf" | "guide" } | { kind: "point"; anchor: string }`.
   Rules (ids): `ended` (done; debrief), `oddsLow` (urgent < 70%; vars odds and guardrail odds; fill guard),
   `noCutsLeft` (urgent when cuts = allowed), `rateHot` (suggest > 5%; fill guard), `weakStart` (info, year
   < 10 and first-decade geometric return < 0), `canSpendMore` (info, odds > 95% and year ≥ 3; vars odds at
   +10%; fill +10%), `legacyGap` (T5 suggest when year > 20 and `wealth < 1.5 × legacy`; fill 10% less),
   `onTrack` (info; key F2). Ranked by `rankAdvice`.
2. `retirementWhatIf(mission, state, ticket)`: cards `thisDecision`, `spendTarget`, `guardrail`,
   `spendLess10`, `equity40`, `equity80` (skip equity cards when `equityLocked`); each: amount, equity, rate,
   odds via `successOdds`; verdicts `comfortable (≥ 85%) | stretched | likelyOut`, plus `countsAsCut`.
3. `guide.data.ts`: playbooks T1–T5 (steps + traps ids), panels (`mission, risk, events, wealth, returns,
   odds, years, ticket, rules`), keys, mistakes (6), terms (`withdrawalRate`, `sequenceRisk`, `guardrails`,
   `successOdds`, `realReturn`, `yearsOfCover`).
4. `buildRetirementDemo` for T1 (`RETIREMENT_DEMO_SEED`, choose one where the first decade is mixed):
   `welcome` → `firstYear` (take 40,000 at 60%) → `guardFive` (`auto` 5 years guardrails) → `oddsChart`
   (point `odds`) → `whatIf` (tab) → `yourTurn`. Fold with `foldStates`.
5. Tests `scripts/retirement-desk-help.test.mjs`: T1 at 70,000 → `oddsLow` first; at 40,000 year 0 →
   `onTrack`; after three cuts → `noCutsLeft`; ≤ 6 items in tone order; what-if does not mutate state and
   `spendLess10` odds ≥ `thisDecision` odds; T3 has no equity cards; demo folds deterministically; every
   advice / what-if / guide id has EN and HU copy, HU ≠ EN.

### Phase 2 — components, copy, styles
6. `RetirementMissionsScreen`: `MissionList` with progress, `MissionBriefing` (setup: start wealth, target
   spend, years, equity start, locked or free, return model μ/σ per leg, odds paths), `DeskRules` (one year
   per step; you withdraw at the start of the year, the return arrives at the end; a cut = less than 90% of
   last year; all amounts in today's money; odds re-run futures from today).
7. `RetirementDebriefScreen`: `DebriefPending` until settled; `DebriefBanner` (passed, total spent, average,
   wealth left, cuts); objectives; `AttributionBars` (start wealth, total withdrawn as negative, investment
   growth = end − start + withdrawn, ending wealth); wealth chart (reuse `WealthChart`); `PolicyTable`
   (Fixed 40,000, Fixed 35,000, 4% of wealth, Guardrails, **Your run**: money lasts, average spend, cuts,
   wealth left); record progress once (`RETIREMENT_PROGRESS.record(id, allPassed, totalSpent)`), skip in
   demo, ref guard against double recording.
8. Help tabs and demo wiring (`deskId: "retirement"`); "Put in decision" fills amount (and equity).
9. Copy tables for missions, setup, rules, objectives, advice, what-if, guide, demo, debrief.

## Acceptance criteria
- Missions T1–T5 startable; attribution sums to the ending wealth exactly; policy table matches
  `replayRetirement` for the seed.
- Help actions, "Show me" and the demo (with take-over) work; `npm run test:retirement-desk` green; smoke clean.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:retirement-desk && npm run test:game-kit
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/tvm/desk?screen=missions,/tvm/desk?screen=debrief,/tvm/desk?demo=1,/hu/tvm/desk?screen=missions"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/tvm/desk?screen=missions,/tvm/desk?screen=debrief"
```
Stop the server; confirm the port is free.

## Pitfalls
- **What-if cost:** six `successOdds` calls per render; memoise on (year, wealth, amount, equity) and only
  compute while the What-if tab is open.
- **T2 forced returns** are hidden from the odds by design; advice must not hint at the script.
- **Record once**, skip in demo.

## Findings (fill in during execution)
- Demo seed: `RETIREMENT_DEMO_SEED = 4` on T1 (`demo/demo.script.ts`); the first six years return +5%, −9%, −1%, +9%, −9%, +2%. `useRetirementUrl` now pins mission and seed while `demo` is on and exposes `takeOver` and `demoSteps`.
- Verification (temporary worktree snapshot, deleted files removed): `tsc -b` clean (the whole shared tree was clean too), eslint clean on every file of this plan, `test:retirement-desk` 23/23 (6 new help tests), build green. Smoke clean on missions, debrief and demo in EN and HU. Click-throughs: T1 "Run to the end" shows the wealth bridge 1,000,000 − 720,921 withdrawn − 105,802 growth = 173,277 left (exact), and five policy rows (Guardrails matches Your run, since the run-to-end plays guardrails); a failed run saves nothing. Demo → → then Take the desk keeps year 6 on seed 4, restores the keys and removes the demo bar. T1 at 70,000 advises "money may not last" then "rate running hot"; What-if shows six cards. Layout audit (`--wait 4000`) clean at every width and theme except the site-wide `a.brand` tap target.
- Deviations:
  - The `whatIf` demo step narrates the What if… tab with the ticket lifted instead of opening it: `useGameHelp` keeps the drawer closed while the demo runs.
  - Progress is already recorded by plan 14's session hook (`useRetirementSession`), so the debrief does not record a second time.
  - "Run to the end" on the pending debrief plays the remaining years with the guardrail rule (`takeGuard(years left)`).
  - Copy keys follow plan 14's naming (`retrX_<id>_title|_body`, `retrMs_<id>_tagline`). The canvas board's drafted wording was not imported; the EN text is written fresh from the engine's rules.
  - No `_retirement-desk-help.scss`: the kit styles cover every class used.
  - Extra helpers: `help/adviceView.ts`, `missionSetup.ts`, `useRetirementDebrief.ts` (`runSummary`, `DEBRIEF_RULES`), `demo/useRetirementDemo.ts`.
- Items awaiting owner approval: HU strings added: all of `src/Language/RetirementDeskMissions.hu.ts` and `RetirementDeskHelp.hu.ts` (new drafts). Reuses plan 14's terms: "korlátos szabály" (guardrails), "kivételi ráta" (withdrawal rate); new: "sorrendi kockázat" (sequence risk), "sikeresély", "fedezett évek", "reálhozam".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/15-retirement-missions-help-demo.md`; confirm plan 14 is done.
> Implement plan 15: pure advice/what-if/guide/demo logic with tests, then missions screen, debrief with
> progress recording, help tabs, demo wiring, copy and styles. Run the verification block, fill in Findings,
> append DONE to LOG.md, set plan 15 to `done`, and summarise. Do not stash or check out.
