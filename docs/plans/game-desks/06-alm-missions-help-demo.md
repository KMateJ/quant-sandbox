# 06 — ALM missions screen, help, demo, debrief

Status: done (2026-10-24, session alm-help) · Depends on: 05 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
The desk screen lets you play; this plan makes it teach: a missions screen with briefings for A1–A5, live
advice, what-if cards, a guide, a scripted playthrough and a debrief that explains where the surplus went
and how simple policies would have done on the same shocks.

## Current state (verified 2026-10-23, after plans 01–05)
- Stubs to fill (plan 05, each starts with `// Stub: filled by docs/plans/game-desks/06.`):
  `src/features/alm-desk/components/AlmMissionsScreen.tsx`, `AlmDebriefScreen.tsx` (`{ desk: AlmDeskModel }`),
  `src/features/alm-desk/help/AlmNextMove.tsx`, `AlmWhatIf.tsx`, `AlmGuide.tsx` (`{ desk, help: GameHelp }`),
  `src/features/alm-desk/demo/demo.script.ts` (`buildAlmDemo(mission, seed): AlmDemoStep[]` returning `[]`).
- Model `AlmDeskModel` (`useAlmDesk.ts`): `mission`, `state: AlmState`, `risk`, `objectives`, `grid`,
  `targets`, `setTarget`, `fillMatch`, `submit`, `matchNow`, `step`, `dispatch`, `setScreen`,
  `selectMission`, `startDemo`, `takeOver`, `exitDemo`, `demo`, `url`.
- Engine (plan 04): `ALM_MISSIONS` (A1–A5), `reduceAlm` (actions `rebalance`, `match`, `step`, `restore`),
  `almRisk`, `surplusGrid`, `evaluateAlm`, `replayAlm(mission, seed, "matchYearly" | "buyHold" | "matchOnce" | "none")`,
  `attributionTotals`, `benchmarkSeries`; `immunisedWeights`, `TENORS` from `immunization.math.ts`.
- Kit: `MissionList`, `MissionBriefing`, `DeskRules`, `DebriefBanner`, `DebriefPending`,
  `AttributionBars`, `PolicyTable`, `ObjectiveList`, `AdviceList` (`AdviceView`), `WhatIfCard`,
  `GuideAccordion`, `GuideList`, `GuidePlaybook`, `useDemoPlayer`, `DemoBar`, `useProgress`;
  `src/lib/game` `rankAdvice`, `foldStates`, `allPassed`, `AdviceItem`, `DemoStepBase`.
- Progress store `ALM_PROGRESS` in `src/features/alm-desk/almProgress.ts`.
- Reference implementation: Hedging Desk `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`,
  `demo/demo.script.ts`, `useDebrief.ts` (records progress once, skips demo mode, ref guard for StrictMode).
- Design: canvas board `AlmDesk.dc.html` (help drawer content and demo captions).

## Goal
1. Missions screen with briefing (setup rows from mission data) and saved status per mission.
2. Debrief: verdict, objectives, attribution totals, surplus history, policy comparison incl. "Your run",
   progress recorded once.
3. Help: Next move (live advice), What if (five cards), Guide (this mission's playbook, panels, keys,
   mistakes, terms, other missions).
4. Playthrough demo (7 steps) that can be taken over.

## Non-goals
- No engine changes (if needed, append a BLOCKED line to LOG.md and stop). No changes to plan 05's panels
  beyond wiring the stubs.

## Constraints
- Pure logic in `.ts` (`help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`,
  `demo/demo.script.ts`); components only render.
- Copy in new tables `src/Language/AlmDeskMissions.ts` and `AlmDeskHelp.ts` (+ `.hu.ts`), prefix `almd`;
  styles in `src/styles/_alm-desk-help.scss`. Append registrations; do not touch other plans' lines.

## Steps

### Phase 1 — pure logic + tests
1. `help/advice.math.ts`: `almAdvice(mission, state): AdviceItem<AlmAdviceAction>[]` ranked with `rankAdvice`.
   Action union: `{ kind: "fillMatch" } | { kind: "key"; code: "F2" | "F4" } | { kind: "screen"; screen: "debrief" } | { kind: "tab"; tab: "whatIf" | "guide" } | { kind: "point"; anchor: string }`.
   Rules (ids, tone, vars): `ended` (done: final surplus), `gapOutside` (urgent: gap, band; action fillMatch),
   `surplusNegative` (urgent: surplus), `maturedThisYear` (suggest: tenor, amount; action fillMatch),
   `liabilitySoon` (info, A4: amount, year, from; one round before `from`), `costsHigh` (suggest, > 80% of
   limit), `tradesLow` (suggest: left), `convexityGap` (A5: urgent when outside band, else info),
   `convexityNote` (info: barbell vs bullet depending on sign), `matched` (info; action key F2).
2. `help/whatIf.math.ts`: `almWhatIf(mission, state): AlmWhatIfCard[]` with candidates `doNothing`,
   `barbell` (= `immunisedWeights`), `bullet` (alive slot nearest the liability, 100%), `cashLong`
   (cash + longest alive slot sized to the duration target), `allCash`. For each, apply through
   `reduceAlm` on a copy and report `{ id, weights, cost, gapAfter, convAfter, convLiab, worstShock }`
   (worst of `surplusGrid` over parallel ±100 and twist ±50) and verdicts `matched | gapStays | moreConvex | lessConvex | costly | tradeLimit`.
   Block `ended` / `tradeLimit` cases.
3. `help/guide.data.ts`: playbook step and trap counts per mission (A1 5/3, A2–A5 4/3), panels
   (`mission, risk, events, curve, surplus, attr, holdings, ticket, grid`), keys (F1, F2, F4, F8, F9),
   mistakes (6), terms (`duration`, `modifiedDuration`, `convexity`, `dv01`, `rollDown`, `twist`,
   `surplus`, `fundedRatio`).
4. `demo/demo.script.ts`: `buildAlmDemo(mission, seed)` for A1 (seed fixed in a `ALM_DEMO_SEED` constant,
   choose one where the run passes): steps `welcome` (desk), `match` (match, anchor ticket), `firstYear`
   (step, anchor curve), `rematch` (match, anchor risk), `secondYear` (step, anchor attr), `matured`
   (match after the 2y bond matures, anchor holdings), `yourTurn` (anchor keys). `holdMs` 7000 (10000 for
   the first). Use `foldStates` with `reduceAlm`.
5. Tests `scripts/alm-desk-help.test.mjs`: advice for A1 start includes `gapOutside` first; after match it
   does not; A4 shows `liabilitySoon` at round 2; at the end only `ended`; ≤ 6 items with non-decreasing
   tone order; what-if does not mutate state and `barbell` gives |gap| ≤ 0.05; demo states fold to a passed
   A1 at the seed; every advice/what-if/guide id has EN and HU copy and HU ≠ EN.

### Phase 2 — components, copy, styles
6. `AlmMissionsScreen`: kit `MissionList` (status from `useProgress(ALM_PROGRESS)`, best as signed money),
   `MissionBriefing` (setup rows: liability and date, start mix, shock ranges, cost bp, trade limit, extra
   liability), `DeskRules` (one year per step, costs on value traded, shocks drawn each year, gap checked at
   year end); Start = `selectMission`, Watch = `startDemo` for A1.
7. `AlmDebriefScreen`: if not settled, `DebriefPending` (Run to the end = step until settled; Back to desk);
   else `DebriefBanner` (final surplus, funded %, costs, trades), `ObjectiveList`, `AttributionBars`
   (carry, rate, convexity, cost totals), the surplus history (reuse plan 05's `SurplusChart`),
   `PolicyTable` (Match every year, Match once, Buy & hold, No trading, **Your run** highlighted: final
   surplus, worst year-end surplus, costs, trades). Record progress once per session with
   `ALM_PROGRESS.record(mission.id, allPassed(objectives), finalSurplus)`, skipped in demo mode, guarded by a ref.
8. `AlmNextMove` (→ `AdviceList`), `AlmWhatIf` (→ `WhatIfCard` list; action "Put in ticket" fills the
   targets), `AlmGuide` (→ `GuideAccordion` with `GuidePlaybook`, panels with "Show me" via `help.point`,
   keys, mistakes, terms, other missions).
9. Demo wiring in `AlmDeskView` (only the lines plan 05 left for it: `useDemoPlayer({ deskId: "alm", … })`,
   `DemoBar` in place of the keys when `demo` is on, Watch button when the script is non-empty). If plan 05
   placed this wiring already, only supply the script.
10. Copy tables (EN + HU drafts): mission titles, taglines, briefs, setup labels, rules, objective labels and
    values per kind, advice titles/bodies, what-if titles/bodies/verdicts, guide steps/traps/panels/keys/
    mistakes/terms, demo captions, debrief labels, policy names.

## Acceptance criteria
- Missions screen lists A1–A5; Start opens the desk with that mission; completed missions show their best.
- Debrief after A1 shows attribution totals that sum to the change in surplus (within 1) and a policy table.
- Help: "Put in ticket" on the gap advice fills the targets; "Show me" outlines the panel (`gdesk-pointed`).
- Demo plays seven steps, Back/Next work, Take the desk keeps the book.
- `npm run test:alm-desk` green; smoke clean on all three screens and in demo mode.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:alm-desk && npm run test:game-kit
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/immunization/desk?screen=missions,/immunization/desk?screen=debrief,/immunization/desk?demo=1,/hu/immunization/desk?screen=missions"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/immunization/desk?screen=missions,/immunization/desk?screen=debrief"
```
Stop the server; confirm the port is free.

## Pitfalls
- **Attribution sign:** Immunization's `cost` attribution is already negative; do not subtract it twice.
- **Record once:** StrictMode runs effects twice; guard with a ref keyed on the session.
- **Demo seed:** pick a seed where A1 passes with the scripted moves, and test it.
- **HU ≠ EN** test: labels like "DV01" need a qualifier in HU.

## Findings (fill in during execution)
- Demo seed chosen: **1** (`ALM_DEMO_SEED`). After the 7 steps (book at round 2) matching every year passes A1; tested in `scripts/alm-desk-help.test.mjs`. Seeds 1, 3–10, 12, 13, 15–18, 20 also pass.
- Deviations:
  - No `_alm-desk-help.scss`: the kit's help, missions and debrief styles cover everything.
  - Policy "buyHold" in the engine means "back to the start mix every year" (plan 04), so it is labelled that way, not "Buy & hold".
  - The "matured" demo step re-matches (A1 matching never holds the 2y bond, so nothing matures by round 2); its caption explains roll-down and maturity.
  - Extra files: `missionSetup.ts` (briefing rows), `useAlmDebrief.ts` (replays + record-once), `demo/useAlmDemo.ts` (player, restores folded states). Demo wiring added to `AlmDeskView` (DemoBar in place of the keys).
  - Advice `convexityGap` appears as urgent outside the band and as info inside it (A5 only); `convexityNote` only for missions without a convexity objective.
- Verification: `test:alm-desk` 25/25 (6 new help/demo tests), `test:game-kit` green, tsc and eslint clean for the desk. Debrief after A1 (F4+F2 ×8): passed, attribution 339 + 2,418 + 690 − 1,218 = 2,229 = final surplus; policy table with "Your run". Help: "Put in ticket" fills 0/27.4/72.6 and outlines the ticket (`gdesk-pointed`). Demo: 7 steps, Next works, Take the desk keeps the book. Smoke clean on desk/missions/debrief/demo EN+HU; layout audit 360–1536 clean except the site brand tap target.
  - Build note for everyone: parallel builds share the SEO pre-render cache (`node_modules/.vite-seo`). With several sessions building at once, pages pre-rendered empty ("useI18n must be used inside LanguageProvider") or with the wrong route (binomial.html held the home page), which then shows as React #418 on every page. A rebuild without a concurrent build was clean. Not a code bug; check the HTML before believing a site-wide #418.
- Items awaiting owner approval: HU strings added: all of `src/Language/AlmDeskMissions.hu.ts` (~45 keys) and `src/Language/AlmDeskHelp.hu.ts` (~150 keys: advice, what-if, guide, terms, demo captions).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/06-alm-missions-help-demo.md`; confirm plan 05 is done.
> Implement plan 06: pure advice/what-if/guide/demo logic with tests, then fill the stubs (missions screen,
> debrief with progress recording, help tabs, demo), copy tables and styles. Run the verification block, fill
> in Findings, append DONE to LOG.md, set plan 06 to `done`, and summarise.
