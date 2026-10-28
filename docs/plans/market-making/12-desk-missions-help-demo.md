# 12 — Desk missions screen, help, demo, debrief

Status: done (2026-10-28, opus-glm) · Depends on: 11 · Suggested model: Sonnet · Est. size: L

## Why
A desk game teaches through the briefing, the live help and the debrief. This plan fills the stubs plan 11
left: a missions screen with briefings, a debrief that finally reveals who was informed and splits the P&L,
three help tabs (next move, what if, guide) and a playthrough demo you can take over.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 11, `src/features/market-making-desk/` has the view, `useMarketMakingDesk.ts` (`useMmUrl`,
  `useMmSession`, `MmDeskModel`), `mmProgress.ts` (`MM_PROGRESS`), `eventText.ts`, components, and stubs
  (first line `// Stub: filled by docs/plans/market-making/12.`): `components/MmMissionsScreen.tsx`,
  `components/MmDebriefScreen.tsx`, `help/MmNextMove.tsx`, `help/MmWhatIf.tsx`, `help/MmGuide.tsx`,
  `demo/demo.script.ts` (`buildMmDemo` → `[]`). Read plan 11's Findings.
- Engine (plan 10): `reduceMm`, `evaluateMm`, `replayMm(mission, seed, policy)`, `MM_POLICIES`,
  `MM_MISSIONS`; `decompose` from `src/lib/market/maker.ts`; `MmState.informedFills`.
- Kit: `MissionList`, `MissionBriefing`, `DeskRules`, `DebriefBanner`, `DebriefPending`, `AttributionBars`,
  `PolicyTable`, `DebriefObjectives`, `HelpContent`/`GuideContent` parts, `useDemoPlayer`, `DemoBar`,
  `rankAdvice` (`src/lib/game/advice.ts`), `foldStates`/`stepIndexById` (`src/lib/game/demo.ts`),
  `AdviceItem`, `DemoStepBase`. Reference implementation: `src/features/portfolio-desk/` (`help/advice.math.ts`,
  `help/whatIf.math.ts`, `help/guide.data.ts`, `demo/demo.script.ts`, `components/PortfolioMissionsScreen.tsx`,
  `PortfolioDebriefScreen.tsx`, `usePortfolioDemo.ts`) and `docs/plans/game-desks/12-portfolio-missions-help-demo.md`.

## Goal
Missions screen, debrief with progress recording, three help tabs and a six-step MM1 demo.

## Non-goals
- No engine edits (append a `BLOCKED` line to LOG.md if one is needed). No lab changes.

## Constraints
- Pure logic in `help/advice.math.ts`, `help/whatIf.math.ts`, `help/guide.data.ts`, `demo/demo.script.ts`.
- Copy in `src/Language/MarketMakingDeskMissions.ts`, `MarketMakingDeskHelp.ts` (+ `.hu.ts`), prefix `mmd`,
  registered at the end of `desks.en.ts`/`desks.hu.ts`; styles in `src/styles/_market-making-desk-help.scss`
  (append `@use` at the end of `main.scss`).

## Steps

### Phase 1 — pure logic + tests
1. `mmAdvice(mission, state, market)` → `AdviceItem<MmAdviceAction>[]` ranked by `rankAdvice`; actions
   `{ kind: "key"; code: "F2" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" } | { kind: "screen"; screen:
   "debrief" } | { kind: "tab"; tab: "whatIf" | "guide" } | { kind: "point"; anchor: string }`. Rules:
   `ended`; `notQuoting` (urgent when live is false and the mission is running; F9); `inventoryNear` (urgent
   above 70% of the limit; skew toward flat (F7 if long, F8 if short) or F10 hedge); `oneSided` (suggest when
   the last 30 s of fills were ≥ 80% one side); `adverseHigh` (suggest when |adverse| > 60% of MM3's cap or of
   spread capture; widen F5); `newsSoon` (MM4: urgent from t = 270 to 300: pull or widen); `backOfQueue`
   (info when your bid or ask has > 3× quote size ahead: join the touch F4, or accept slower fills);
   `onTrack` (info; F2).
2. `mmWhatIf(mission, state, market)`: replay from the **current state** for the rest of the mission with
   each policy (`join`, `wide`, `as`, `flatten`) and "do nothing" (pull now) via the engine's
   `policyActions` — final P&L, max |inventory|, adverse, and a verdict
   `safe | risky | breaches | toxic`; cap at 5 rows; computed on demand (button), not every tick.
3. `guide.data.ts`: playbooks MM1–MM5; panel anchors (`mission, ticket, risk, book, price, tape, pnl, events`);
   keys; mistakes (6: quoting too tight in toxic flow, re-quoting every second, ignoring inventory, hedging
   too often, quoting through news, pulling and forgetting to restore); terms (`spread`, `queue`, `inventory`,
   `markout`, `adverseSelection`, `rebate`, `takerFee`, `reservationPrice`).
4. `buildMmDemo()` for MM1 (`MM_DEMO_SEED`): `welcome` (point at the book) → `join` (F4, play 30 s) →
   `inventory` (point at risk, skew F7) → `toxic` (explain the tape) → `widen` (F5, play 60 s) → `yourTurn`.
   Each step `{ id, screen: "desk", anchor, actions, holdMs }`.
5. Tests `scripts/micro-desk-help.test.mjs`: MM1 start → `notQuoting` first; after F4 → `onTrack`; long
   2,000 → `inventoryNear` urgent with F7; MM4 at t = 280 → `newsSoon`; ≤ 6 items in tone order; what-if does
   not mutate state and is deterministic; demo folds deterministically through `foldStates`; every advice /
   what-if / guide id has EN and HU copy, HU ≠ EN.

### Phase 2 — components, copy, styles
6. `MmMissionsScreen`: `MissionList` + `MissionBriefing` (setup: session length, quote size, rebate and fee,
   inventory limit, informed share shown as "low / some / high" except where the mission announces it, news
   time for MM4) + `DeskRules` (one tick = one second; your quotes rest in the book and keep their place
   only if you don't move them; informed customers look like everyone else; P&L is marked to the mid).
7. `MmDebriefScreen`: `DebriefPending` until settled; `DebriefBanner` (P&L, spread capture, adverse, max
   |inventory|); `DebriefObjectives`; `AttributionBars` (spread capture, adverse selection, inventory, fees →
   total; must sum within $0.01); **the reveal**: "Informed customers took N of your M fills" and a small
   chart of your fills' 10-s markout split informed vs noise; `PolicyTable` (Join, Wide, AS, Flatten, **Your
   run**: P&L, max |inventory|, adverse, fees); record progress once (`MM_PROGRESS.record(id, allPassed,
   pnl)`), skip in demo, guard against double recording with a ref.
8. Help tabs: `MmNextMove` (advice list with "Do it" running the key action and "Show me" pointing the
   anchor via the kit's `gdesk-pointed` class), `MmWhatIf` (run button + table), `MmGuide` (playbook for the
   current mission, panels, keys, mistakes, terms). Demo wiring through `useDemoPlayer({ deskId: "mm", … })`
   and `DemoBar` (take over at any step).
9. Copy tables for mission titles/briefs (if plan 11 didn't add them), setup, rules, objectives, advice,
   what-if, guide, demo captions, debrief.

## Acceptance criteria
- MM1–MM5 startable from the missions screen; debrief attribution sums to total within $0.01; the informed
  reveal and policy table appear; progress shows on `/sandbox`.
- Help actions, "Show me" and the demo (with take-over) work; `npm run test:micro-desk` green; smoke clean.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:micro-desk && npm run test:game-kit && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/market-making/desk?screen=missions,/market-making/desk?screen=debrief,/market-making/desk?demo=1,/hu/market-making/desk?screen=missions"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/market-making/desk?screen=missions,/market-making/desk?screen=debrief"
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **What-if cost:** five replays of up to 600 ticks each; run on click, show a pending state, never per tick.
- **Demo determinism:** the demo pins mission + seed; actions are engine actions, not DOM clicks.
- **Debrief from a demo run** must not record progress.

## Findings (fill in during execution)
- Files: `src/features/market-making-desk/` — `help/advice.math.ts` (`mmAdvice`, `ADVICE_IDS`, helpers `makerFills`, `aheadOf`, `adverseWarnAt`, `newsWindow`), `help/adviceText.ts`, `help/whatIf.math.ts` (`mmWhatIf`, `replayFrom`, `maxAbsInventory`, `WHAT_IF_IDS`, `WHAT_IF_VERDICTS`), `help/guide.data.ts`, `demo/demo.script.ts` (`buildMmDemo`, `demoStates`, `MM_DEMO_MISSION`, `MM_DEMO_SEED`), `debrief.math.ts` (`policyRows`, `markoutHistogram`), `missionSetup.ts`, `useMmDemo.ts`; components `MmMissionsScreen`, `MmDebriefScreen`, `MmInformedReveal` (new), help `MmNextMove`, `MmWhatIf`, `MmGuide` (stubs replaced; largest `.tsx` is `MmDebriefScreen` at 61 lines). Edited `useMarketMakingDesk.ts` (demo pins MM1 + seed 7, `takeOver`, `selectMission` leaves demo and bumps the run; `hasDemo` removed) and `MarketMakingDeskView.tsx` (`DemoBar` in demo mode, `help` passed to Next move / Guide). Copy `src/Language/MarketMakingDeskMissions.ts`/`MarketMakingDeskHelp.ts` (+ `.hu.ts`) appended to `desks.en.ts`/`desks.hu.ts`; styles `src/styles/_market-making-desk-help.scss` (`@use` appended to `main.scss`). Tests `scripts/micro-desk-help.test.mjs` (8 tests).
- Demo seed and captions: MM1, seed 7 (`MM_DEMO_SEED`; the desk's default seed). Steps welcome (book) → join (ticket; quotes at 0.5/0.5, +30 s) → inventory (risk; skew to sell, 1.5/0.5) → toxic (tape) → widen (pnl; 2.5/1.5, +60 s) → yourTurn (mission); 6.5 s each. Captions `mmdDemo_<id>_title/body`.
- New HU keys for owner review: the whole of `MarketMakingDeskMissions.hu.ts` and `MarketMakingDeskHelp.hu.ts` (draft). Choices: inventory → "készlet", hedge to flat → "nullázás", skew to sell/buy → "döntés az eladás/vétel felé", join the touch → "csatlakozás a legjobb árhoz", queue → "sor", markout → "Markout (utólagos elmozdulás)", reservation price → "rezervációs ár", maker rebate / taker fee → "maker-visszatérítés" / "taker-díj"; bid/ask/spread/long/short/desk/P&L/market maker kept in English.
- Deviations: (1) **Informed vs noise markout split not possible without an engine change**: maker fills in the ledger carry no informed flag (only the `informedFills` count), so the reveal shows the exact "Informed customers took N of your M fills" line plus a histogram of *all* your fills' 10 s markout (negative = the price moved against you); `BLOCKED` line in LOG.md asks for an `informed` flag on `MakerFill`/fill events. (2) Progress is still recorded once in `useMmSession` (plan 11, ref-guarded, skipped in demo) rather than in the debrief component, as in the portfolio desk. (3) What-if robots `join`/`wide`/`flatten` only quote at t = 0 in `policyActions`, so `replayFrom` applies the robot's opening quote on the first what-if tick (no engine edit). Five replays take ~0.35 s on click (synchronous; no separate pending state). (4) Advice items carry one action each (kit `AdviceView`): key advice says "Do it" via the key label; "Show me" lives in the Guide's panel list. (5) Briefing shows the informed share as Low / Some / High, except MM3 (its brief announces toxic flow), where it shows 30%. Verification: `node --test scripts/micro-desk-*.test.mjs` 24/24; `test:sandbox` 4/4, `test:challenges` 3/3; `test:game-kit` 13/14 (failing "CHALLENGES ids" count 28 ≠ 16 comes from other packs' challenges). tsc/eslint clean for desk files (shared tree not checked). Private build + CDP smoke clean on missions, debrief, `?demo=1`, HU missions, desk; interaction check: debrief "Run to the end" shows the reveal and 5 policy rows; demo bar shows step 1 of 6 with Take the desk; Next move after F4 = "On track"; What if lists five cards; Guide "Show me" lifts `mmd-mission`. Layout audit 360/768/1280/1536 light/dark: only the header brand tap target at 360. `test:seo`/full `npm run build` not run.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/12-desk-missions-help-demo.md`; confirm plan 11
> is done and read its Findings. Implement plan 12: advice, what-if and guide logic with tests, the missions
> screen, the debrief with P&L attribution, informed-flow reveal and policy table, the three help tabs and
> the six-step MM1 demo with take-over. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 12 to `done`, and summarise.
