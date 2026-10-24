# 03 — Move the Hedging Desk onto the kit

Status: done (2026-10-24) · Depends on: 02 · Suggested model: Sonnet · Est. size: L (three phases, stop when green)

## Why
Once the kit exists, the Hedging Desk holds a second copy of the same frame, help shell, demo player,
mission screens and styles. Moving it onto the kit removes the duplication (CLAUDE.md DRY rule), proves
the kit on a real, fully tested page, and fixes known leftovers.

## Current state (verified 2026-10-23, commit `73f67d7`)
- Desk: `src/features/hedging-desk/` (97 files). Mounted by `src/features/delta-hedging/DeltaHedgingPages.tsx`
  at `/delta-hedging/desk`. Root `HedgingDeskView.tsx` (87 lines) renders `div.hdesk` with
  `hdesk--expanded` / `hdesk--demo`, `DeskHeader`, `ScreenTabs` + intro, screen switch, `FunctionKeys` or
  `DemoBar`, `HelpSheet` portalled into the root.
- Generic pieces to replace with kit components (plan 02): `components/DeskHeader.tsx` (frame only; the 11
  quote cells stay desk-specific), `ScreenTabs.tsx`, `FunctionKeys.tsx` + `useFunctionKeys.ts` (key table
  stays), `FullscreenButton.tsx`, `help/useDeskHelp.ts`, `components/help/{HelpButton,HelpSheet,HelpTabs,AdviceItem,NextMoveTab,GuideList,GuidePlaybook}.tsx`
  (content builders stay), `demo/useDemo.ts` + `demoStore.ts` + `components/demo/*`, `components/missions/{MissionList,MissionBriefing,DeskRules}.tsx`,
  `components/MissionPanel.tsx`, `components/debrief/{DebriefBanner,DebriefPending,DebriefObjectives,PnlAttribution,PolicyCompare}.tsx`
  (the row data stays), `components/Blotter.tsx` (list shell), `DeltaMeter.tsx`, `ScenarioMatrix.tsx`,
  `SeriesKey.tsx`, `deskFormat.ts`.
- Known defects to fix here: `help/adviceRun.ts` is unused while `components/help/AdviceItem.tsx` L20–51
  duplicates it; `src/styles/_hedging-desk-help-guide.scss` is not `@use`d (and uses undefined
  `--hd-up/--hd-down`); stale "unlock" comment in `components/MissionsScreen.tsx` L9; unused keys
  `hdMissionsScreenTitle`, `hdDebriefScreenTitle`, `hdDebriefNewPath`, `hdDebriefMissions`, `hdDebriefDaily`;
  three copies of the anchor list (`help/help.config.ts` `HELP_ANCHORS`, `demo/demo.config.ts`
  `DEMO_ANCHORS`, `help/guide.data.ts` `GuideAnchor`) mirrored in SCSS `@each` lists.
- Progress: `deskProgress.ts` key `qs.hedgingDesk.progress.v1`, record `{ completed, bestPnl }`.
- Tests: `npm run test:hedging-desk` (10 files). `scripts/hedging-desk-demo.test.mjs` checks every step
  anchor is in `DEMO_ANCHORS`; `hedging-desk-help-guide.test.mjs` checks EN/HU parity and HU ≠ EN for
  `hd` guide keys.
- `src/styles/_hedging-desk.scss` L384–386 holds the global `html.page-expanded { overflow: hidden }` rule.
- **Coordination:** `docs/plans/hedging-desk-demo/09-help-qa.md` is `todo` and works in the same folder.
  Do not start while it is `in progress`; if it is still `todo`, append a LOG.md line and go ahead.

## Goal
1. The Hedging Desk renders through `src/components/game/*` with identical behaviour and DOM ids (`hd-*`).
2. Generic duplicates and the defects above are gone.
3. Progress uses `createProgressStore("hedging", closerToZero)` (key `qs.game.hedging.progress.v1`) and
   imports old `qs.hedgingDesk.progress.v1` data once.

## Non-goals
- No change to the engine, missions, advice rules, what-if maths, demo script or copy wording.
- No visual redesign. Pixel differences from moving to `.gdesk` classes are fine; layout must not change.

## Constraints
- Keep every `hd-<anchor>` id (tests and the demo script use them). Pass `idPrefix="hd-"` to kit hooks.
- Root element: `<GameFrame deskClass="hdesk" …>` so it has both `gdesk` and `hdesk`; desk-specific rules
  stay under `.hdesk`.
- Hedging-specific copy stays in `HedgingDesk*.ts`; delete only `hd*` keys whose kit `gk*` twin replaces
  them, and update the help-guide test's key lists if it enumerates removed keys.

## Steps

### Phase 1 — frame, keys, help shell (green before continuing)
1. `HedgingDeskView.tsx`: use `GameFrame`, `CommandBar` (ticker `QSBX US Equity`, code `HDGS <GO>`),
   `QuoteStrip` (cells built in a new pure `deskQuotes.ts` from the old `DeskHeader` logic),
   `ScreenTabs`, `ViewControls`, `FunctionKeyBar` + `useFunctionKeys` (map the existing `FUNCTION_KEYS`
   table to `GameKey[]` with translated labels and `enabled = keyEnabled(key, desk)`), `HelpSheet` with the
   three existing tab bodies as `next` / `whatIf` / `guide` props.
2. Replace `useDeskHelp` with `useGameHelp({ disabled: demo, idPrefix: "hd-" })`; delete `useDeskHelp.ts`,
   `help.config.ts` anchor list, `HelpButton.tsx`, `HelpSheet.tsx`, `HelpTabs.tsx`; the root no longer needs
   `data-help-anchor`.
3. `NextMoveTab` builds `AdviceView[]` (title/body via existing copy helpers, action label/run via
   `adviceRun.ts` — make `AdviceItem` logic use it, then delete the duplicate) and renders `AdviceList`.

### Phase 2 — demo, missions, debrief, panels (green before continuing)
4. Demo: replace `useDemo` + `demoStore` + `components/demo/*` with `useDemoPlayer({ deskId: "hedging", … })`,
   `DemoBar`, `DemoButton`. `onEnter(i)` keeps today's behaviour (dispatch `restore`, switch screen, set
   ticket). `focusId(i)` returns `"hd-" + step.anchor`. Keep `DEMO_ANCHORS` (the demo test uses it) but
   delete the SCSS `@each` list in `_hedging-desk-demo.scss` and the help one in `_hedging-desk-help.scss`.
5. Missions screen: `MissionList`, `MissionBriefing`, `DeskRules` from the kit; the hedging-only "greeks"
   column becomes the `tags` string. Mission panel: kit `MissionPanel` + `ObjectiveList`.
6. Debrief: kit `DebriefBanner`, `DebriefPending`, `AttributionBars`, `PolicyTable`, `ObjectiveList`;
   keep `ThetaGammaPanel` and the history chart as desk components.
7. Panels: `Blotter` → kit `EventLog` (rows from `blotterText.ts`); `DeltaMeter` → `BandMeter`;
   `ScenarioMatrix` → `ScenarioGrid`; `SeriesKey`, `deskFormat.ts` → kit versions (re-point imports;
   `toneClass` now returns `gdesk-*`, so update any `.hdesk-up/down` selectors).

### Phase 3 — progress, styles, copy, cleanup
8. `deskProgress.ts`: export a store `HEDGING_PROGRESS = createProgressStore("hedging", closerToZero)`.
   Migration: when the new key is absent and `qs.hedgingDesk.progress.v1` exists, map
   `{ completed, bestPnl }` → `{ completed, best: bestPnl }`, write the new key, keep the old one. Keep
   `mergeResult`/`recordResult` names as thin wrappers if tests import them, or update the tests.
   `useDeskProgress` becomes `useProgress(HEDGING_PROGRESS)`.
9. Styles: delete from the `_hedging-desk*.scss` partials every rule now provided by `_game-kit.scss`;
   move `html.page-expanded` into `_game-kit.scss`; fold the useful rules of the unloaded
   `_hedging-desk-help-guide.scss` into `_game-kit.scss` (guide accordion) or delete them, and delete the
   file. Remove now-empty partials and their `@use` lines in `main.scss`.
10. Copy: delete the `hd*` keys replaced by `gk*` keys in both languages and the five unused keys listed
    above; fix the stale comment; update `docs/plans/hedging-desk-demo/README.md` L34 (`isUnlocked` → removed).

## Acceptance criteria
- `npm run test:hedging-desk` passes with no test weakened (updating import paths and removed key names is
  fine; record each test change in Findings).
- Smoke and layout audit of `/delta-hedging/desk` (all three screens, demo, help open) are clean; the help
  drawer's "Show me" and the demo highlight still outline the right panel.
- `grep -rln "useDeskHelp\|demoStore\|adviceRun\|FullscreenButton" src/features/hedging-desk` finds nothing
  except deliberate kept names recorded in Findings.
- Hedging-desk line count drops; record before/after in Findings.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:game-kit
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/delta-hedging/desk?screen=missions,/delta-hedging/desk?screen=debrief,/delta-hedging/desk?demo=1,/hu/delta-hedging/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk,/delta-hedging/desk?screen=missions"
find src/features/hedging-desk -name "*.ts*" | xargs wc -l | tail -1
```
Use `cdp-smoke.mjs --after` (see `--help`) to press F1, click "Show me" on the first advice, and confirm an
element with class `gdesk-pointed` exists. Stop the server and confirm port 4173 is free.

## Pitfalls
- **Session key:** the view key is `${mission.id}-${seed}-${run}`; kit hooks for help, expand and full
  screen must stay above it (as today) or restarts will close the drawer.
- **Demo restore:** `onEnter` must dispatch `restore` before switching screens, or the debrief step flashes
  the previous book.
- **Do not stash** to compare behaviour; use `git diff 73f67d7 -- <file>` and a temporary worktree.
- The HU tables have uncommitted edits by another session: re-read them before deleting keys.

## Findings (fill in during execution)
- Line counts before/after: `src/features/hedging-desk/` 97 files / 4,526 lines -> 68 files / 3,487 lines (`.ts`/`.tsx`; largest `.tsx` is `DeskSession.tsx` at 96, then `PriceSharesChart.tsx` 81; `HedgingDeskView.tsx` 38). Hedging SCSS 10 partials / 1,613 lines -> one `_hedging-desk.scss` of 262 lines (only the ticket, chain, greek grid, positions and debrief-extra rules the kit has no twin for); `main.scss` lost 8 `@use` lines. Copy: `HedgingDeskDemo.ts` (+ HU) deleted and about 75 `hd*` keys removed from both languages.
- Replaced by the kit: frame, command bar, quote strip, tabs, function keys, view controls, help state + drawer + tabs + advice list + what-if card + guide accordion, demo player + bar + button, mission list/briefing/rules, mission panel, debrief banner/pending/attribution/policy table/objectives, event log, band meter, scenario grid, series key, number formatting. New thin glue in the desk: `DeskSession.tsx`, `deskQuotes.ts`, `demo/useDeskDemo.ts`, `components/missions/missionViews.ts`, `components/debrief/debriefViews.ts`, `components/ScenarioPanel.tsx`, `blotterRows` in `blotterText.ts`, `objectiveViews` in `missionCopy.ts`.
- Defects fixed: `adviceRun.ts` is now the single advice-action implementation (`NextMoveTab` uses it, the duplicate in `AdviceItem` is gone); `_hedging-desk-help-guide.scss` deleted (the guide accordion rules were already in `_game-kit.scss`); stale "unlock" comment gone with the rewrite of `MissionsScreen.tsx`; the five unused keys deleted; `HELP_ANCHORS` and both SCSS `@each` anchor lists deleted (`DEMO_ANCHORS` stays for the demo test; the `GuideAnchor` type is gone, `GUIDE_PANELS` is the single guide anchor list); `docs/plans/hedging-desk-demo/README.md` L34 updated. `html.page-expanded` moved into `_game-kit.scss`.
- Progress: `deskProgress.ts` exports `HEDGING_PROGRESS` (kit store, key `qs.game.hedging.progress.v1`, `closerToZero`), wrapped so the first `read` or `record` imports old `qs.hedgingDesk.progress.v1` once (`legacyToProgress`; the old key is kept). `mergeResult`, `readProgress`, `recordResult` stay as thin wrappers. Caveat: the migration lives in the desk module, so `/sandbox` shows no hedging progress for a returning visitor until the desk page has loaded once.
- Tests changed and why (`test:hedging-desk` 78 -> 78 passing; `test:game-kit` 14/14):
  - `hedging-desk-missions.test.mjs`: expected record shape `{ completed, bestPnl }` -> `{ completed, best }` (kit store shape); added a test for `legacyToProgress`.
  - `hedging-desk-charts.test.mjs`: removed the `matrixCells` test together with the function (the kit's `heatCell` has the same bounds test in `game-kit-ui.test.mjs`).
  - `hedging-desk-side.test.mjs`: removed the four `meterPosition` asserts with the function (the kit's `BandMeter` owns that mapping); the nearest-strike asserts stay.
  - Guide, advice and demo tests untouched (none enumerated the removed keys).
- Verification: `tsc -b` clean for all hedging and kit files (the shared tree's only errors came from another plan's half-done `retirement-desk`, so `tsc -b`, `build` and `test:seo` were run in a temporary worktree copy of the working tree: clean and green there); eslint clean on `src/features/hedging-desk` and `src/components/game` (12 repo-wide lint errors are the known ones in untouched files); `test:seo` 24 pass, 1 fail = the pack-wide initial-JS budget (1,030,595 B vs 955,000 B, other plans' copy); smoke on `/delta-hedging/desk`, `?screen=missions`, `?screen=debrief`, `?demo=1`, `/hu/delta-hedging/desk`, `/delta-hedging`: no problems. Interaction probe on the built app: F1 opens help, "Show me" puts `gdesk-pointed` on `#hd-delta`, "Put in ticket" and Details work, all 6 guide sections render, F2 steps the day, the demo walks all 16 steps with `gdesk-demo-focus` on the right element (including the switch to the debrief), "Take the desk" keeps the book, old progress `{M2:{completed,bestPnl:-123}}` shows as "Completed · best −$123" and is copied to the new key. Layout audit (24 views): only the known overlaps with the sticky function-key footer and the site brand tap target; the missions screen is clean.
- Deviations:
  - Demo focus: `useDeskDemo` returns `focusId = null` until the step's screen is showing; otherwise the kit looked the element up before the debrief had mounted and never outlined it (kit unchanged; other desks with screen-switching steps may need the same).
  - Demo "submit" anchor: the old CSS lifted the whole ticket panel; kept as one `:has()` rule in `_hedging-desk.scss` because the kit dims every `.gdesk-panel` during the demo.
  - Mission briefing: the "Instruments" line is now the last row of the setup table (the kit briefing has no separate heading for it). The mission list "Greeks" column header is the kit's unlabelled tags column.
  - The blotter list lost its `aria-label` (`hdSideBlotterAria`) and the clock bar its separate aria text (`hdSideClockAria`): the kit components use the panel title and clock label instead.
  - Quote strip: the P&L cell is no longer pushed to the right edge (kit `QuoteStrip` has no such modifier); the what-if "step 1 of n / multi-leg" line moved from below the buttons to above the numbers (kit `body`).
  - Kept names: `adviceRun.ts` (now the only implementation, used by `NextMoveTab`), `DEMO_ANCHORS`, `mergeResult`/`readProgress`/`recordResult`. `hdSideBidAsk` and `hdSideDelta` were already unused before this plan and are left alone.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/03-hedging-desk-on-kit.md`; confirm plan 02 is done and that
> `docs/plans/hedging-desk-demo/09-help-qa.md` is not in progress. Implement plan 03 in its three phases,
> keeping behaviour and `hd-*` ids identical and every hedging-desk test green. Run the verification block,
> fill in Findings (line counts, test changes), append DONE to LOG.md, set plan 03 to `done`, and summarise.
