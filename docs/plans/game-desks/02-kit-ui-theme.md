# 02 — Game kit UI frame + `.gdesk` theme + GameKit copy

Status: done (2026-10-24) · Depends on: 01 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
Every desk on the canvas has the same terminal frame: amber command bar with Help / Watch / Expand / Full
screen, quote strip, screen tabs with an intro line, a three-column panel grid, function keys, a help
drawer (Next move / What if / Guide), a demo bar, a missions screen and a debrief. Today all of that is
hard-wired to the Hedging Desk. This plan builds it once as props-driven components so desks only supply
content.

## Current state (verified 2026-10-23, commit `73f67d7`)
Source to generalise (read, do not edit; plan 03 moves the Hedging Desk onto the result):

| Hedging file | Lines | What to lift |
|---|---|---|
| `src/features/hedging-desk/HedgingDeskView.tsx` | 87 | Root `div.hdesk` + modifiers `hdesk--expanded`, `hdesk--demo`; view controls live above the session key; root node kept in state for the help portal (L58–62) |
| `components/DeskHeader.tsx` | 57 | `.hdesk-cmd` (ticker, code, `h1`, clock, demo badge, `actions`), `dl.hdesk-quotes` cells `{label, value, className}` |
| `components/ScreenTabs.tsx` | 24 | `Tabs` with `className="hdesk-tabs"` + `p.hdesk-intro` row |
| `components/FunctionKeys.tsx` + `useFunctionKeys.ts` | 29 + 45 | Key table `{code, label, run, always?}`; window keydown, ignores repeat and modifiers, no `isTyping` guard on purpose (F-keys only) |
| `components/FullscreenButton.tsx` | 32 | Two `aria-pressed` buttons using `useExpandInPage` / `useFullscreen` |
| `help/useDeskHelp.ts` | 66 | `{open, tab, pointed, toggle, show, close, point, buttonRef}`; F1 and `?` (not while typing); `point` scrolls `#hd-<anchor>` into view, closes below 900 px, clears after 2500 ms |
| `components/help/HelpSheet.tsx`, `HelpTabs.tsx`, `HelpButton.tsx`, `AdviceItem.tsx`, `NextMoveTab.tsx`, `GuideTab.tsx`, `GuideList.tsx`, `GuidePlaybook.tsx`, `WhatIfCard.tsx` | 22–71 | Drawer shell on `src/components/ui/HelpDrawer.tsx` (props `open, onClose, title, children, closeLabel?, context?, id?, bodyRef?, returnFocusRef?, container?, className?`); arrow-key tabs; advice grouped by tone; `<details>` accordion |
| `demo/useDemo.ts`, `demo/demoStore.ts`, `components/demo/*` | 117, 48, 16–42 | Player (play/pause/next/back/goTo, autoplay with `useTicker`, ←/→/Space/Esc), module-level position store, caption, controls, button |
| `components/missions/MissionList.tsx`, `MissionBriefing.tsx`, `DeskRules.tsx`, `MissionPanel.tsx` | 26–59 | List with status, briefing with setup `dl`, rules grid, mission panel with clock bar and objectives |
| `components/debrief/DebriefBanner.tsx`, `DebriefPending.tsx`, `PnlAttribution.tsx`, `PolicyCompare.tsx`, `DebriefObjectives.tsx` | 22–45 | Verdict banner, pending state, bars centred on zero, policy table |
| `components/Blotter.tsx`, `DeltaMeter.tsx`, `ScenarioMatrix.tsx`, `SeriesKey.tsx`, `deskFormat.ts`, `engine/series.math.ts` `matrixCells` | | Event list, band meter (hard-coded range 400), heat grid, legend, number formats (`toneClass` returns `hdesk-up/down`) |
| `src/styles/_hedging-desk.scss` (398), `-side`, `-charts`, `-debrief`, `-missions`, `-demo`, `-help`, `-help-next` | | Token block L7–42; frame L44–325; helpers L327–342; fullscreen L350–398; demo/help highlights use `@each` anchor lists (L5–6 demo, L2 help) |
| `src/Language/HedgingDesk*.ts` | | Generic copy listed in the inventory: screens, keys aria, help shell, advice heads, demo shell, statuses, mission-screen shell, debrief shell, expand/fullscreen |

Plan 01 provides `src/lib/game/` (`ObjectiveStatus`, `AdviceTone`, `ProgressStore`, `EMPTY_PROGRESS`,
`foldStates`, `rankAdvice`, …).

## Goal
`src/components/game/` with the component API below, `src/styles/_game-kit.scss`, `src/Language/GameKit.ts`
(+ `.hu.ts`), and a unit test for the pure helpers and copy parity. No desk uses it yet.

## Non-goals
- Do not edit any hedging-desk file (plan 03). No desk content. No route.

## Constraints
- Components take **already-translated strings** as props, except generic copy they own (`gk*` keys via
  `useI18n`). No desk-specific i18n keys inside the kit.
- Every `.tsx` ≤ ~150 lines. Generic ids come from an `idPrefix` prop (e.g. `"almd-"`), never `hd-`.
- Pointing and demo focus use classes, not anchor lists: add `gdesk-pointed` / `gdesk-demo-focus` to the
  target element by id and remove it afterwards.

## Steps

### Phase A — logic hooks and helpers
1. `src/components/game/gameFormat.ts` (pure): `num(x, d=2)`, `signed(x, d=0)` (true minus, `-0` → `0`),
   `money(x)`, `signedMoney(x)`, `pct(x, d=1)`, `toneClass(x)` → `"gdesk-up" | "gdesk-down" | ""`,
   `heatCell(value, max)` → `{ alpha: number; tone: "up" | "down" | "flat" }` (alpha 0.08–0.48; flat under 1% of max).
2. `useProgress(store: ProgressStore): ProgressMap` — `useSyncExternalStore(store.subscribe, store.read, () => EMPTY_PROGRESS)`.
3. `useFunctionKeys(keys: GameKey[], active: boolean)` with
   `export type GameKey = { code: string; label: string; run: () => void; enabled: boolean }`. Same guard
   rules as the hedging hook (no repeat, no Ctrl/Meta/Alt/Shift; `preventDefault` on match).
4. `useGameHelp({ disabled, idPrefix }): GameHelp` with
   `export type HelpTab = "next" | "whatIf" | "guide"` and
   `export type GameHelp = { open: boolean; tab: HelpTab; pointed: string | null; toggle(tab?: HelpTab): void; show(tab: HelpTab): void; close(): void; point(anchor: string): void; buttonRef: RefObject<HTMLButtonElement | null> }`.
   `point(anchor)` targets `document.getElementById(idPrefix + anchor)`.
5. Demo: `demoPosition.ts` — `useDemoPosition(deskId)` / `setDemoPosition(deskId, next)` / `endDemo(deskId)`
   (a `Map` per desk id instead of the hedging singleton) and `useDemoPlayer({ deskId, total, holdMs(i), onEnter(i), focusId(i): string | null, onExit, active })`
   returning `DemoPlayer = { index, total, playing, atStart, atEnd, play, pause, toggle, next, back, goTo }`.
   Autoplay via `useTicker` unless `prefersReducedMotion()`; keys ← → Space Esc (ignore while typing).

### Phase B — components (all in `src/components/game/`) — build green before continuing
6. Frame: `GameFrame({ deskClass, expanded, demo, rootRef, children })` (root `div.gdesk`),
   `CommandBar({ ticker, code, title, clock, demo, actions })`, `QuoteStrip({ id, cells: { label; value; tone?: "up" | "down" }[] })`,
   `ScreenTabs<S extends string>({ id, screens: { id: S; label: string }[], value, onChange, intro })`,
   `FunctionKeyBar({ id, keys: GameKey[], status })`, `ViewControls({ help?, onDemo?, demo, expanded, onExpand, fullscreen })`
   (Help, Watch the playthrough, Expand, Full screen buttons), `DeskGrid({ left, centre, right })` with
   `DeskPair({ children })`.
7. Panels: `EventLog({ id, title, rows: { t: string; kind: string; tone: "up" | "down" | "accent" | "muted" | ""; text: string }[] })`,
   `BandMeter({ value, min, max, lo, hi, scale: [string, string, string], label })`,
   `ScenarioGrid({ id, title, caption, corner, cols: string[], rows: { label: string; cells: { display: string; value: number }[] }[] })`,
   `SeriesKey` (move-copy of the hedging one), `ObjectiveList({ items: ObjectiveView[] })` where
   `export type ObjectiveView = { label: string; value: string; status: ObjectiveStatus }`,
   `MissionPanel({ id, title, brief, clockLabel, progress, objectives })` (hide the objective list and its
   heading when empty: free play).
8. Help: `HelpButton`, `HelpSheet({ help, title, context, container, next, whatIf, guide })`,
   `AdviceList({ items: AdviceView[] })` with
   `export type AdviceView = { id: string; tone: AdviceTone; title: string; body: string; action?: { label: string; run: () => void; disabled?: boolean } }`
   (groups by tone in `TONE_ORDER`, live count of urgent items, empty message `gkAdvEmpty`),
   `WhatIfCard({ title, body, rows: { label; value }[], verdicts: { text; tone: "good" | "bad" | "neutral" }[], block?: string, action?: { label; run }, detail?: ReactNode })`,
   `GuideAccordion({ sections: { id; title; body: ReactNode }[], defaultOpen? })`, `GuideList`, `GuidePlaybook({ brief, objectives, steps, traps })`.
9. Demo: `DemoButton({ onStart, hidden })`, `DemoBar({ id, player, caption: { title; body }, onTakeOver, onExit, onMissions? })`.
10. Missions/debrief: `MissionList({ items: { id; title; tagline; tags?: string; done: boolean; best?: string }[], selectedId, onSelect })`,
    `MissionBriefing({ id, title, brief, setup: { label; value }[], objectives: string[], note?: string, onStart, onDemo? })`,
    `DeskRules({ rules: { title; body }[] })`, `DebriefBanner({ id, passed, stats: { label; value }[] })`,
    `DebriefPending({ title, note, runLabel, onRun, onBack })`,
    `AttributionBars({ id, title, rows: { label; value: number; display: string }[], total: { label; display } })`,
    `PolicyTable({ id, title, columns: string[], rows: { name: string; cells: string[]; highlight?: boolean }[], note? })`.
11. `src/styles/_game-kit.scss`, appended as `@use "game-kit";` at the end of `src/styles/main.scss`.
    Port the frame, panel, helper, meter, objective, event-log, help, advice, what-if, guide, demo,
    missions, debrief and fullscreen rules from the hedging partials, renamed `hdesk-*` → `gdesk-*`, plus:
    `.gdesk` token block identical to `.hdesk` (see `_hedging-desk.scss` L7–42); `.gdesk-keys` uses
    `repeat(auto-fit, minmax(120px, 1fr))` (not a fixed 6); `.gdesk-pointed, .gdesk-demo-focus` outline
    `1px solid var(--primary)` + panel-head tint; `.gdesk--demo` dims panels to .55 except
    `.gdesk-demo-focus`; `.gdesk--expanded` and `.gdesk:fullscreen`. Do **not** copy the global
    `html.page-expanded` rule (plan 03 moves the one in the hedging partial here).
12. `src/Language/GameKit.ts` (`gameKitEn`) + `.hu.ts` (`gameKitHu`), registered at the end of
    `index.en.ts` / `index.hu.ts`. Keys (EN copy taken from the matching `hd*` keys): `gkScreensAria`,
    `gkScreenDesk|Missions|Debrief`, `gkKeysAria`, `gkHelpButton|Title|Close|Context|TabNext|TabWhatIf|TabGuide|TabsAria|KeysHint|ShowMe`,
    `gkAdvHeadUrgent|Suggest|Info|Done`, `gkAdvEmpty`, `gkWhatIfDetails`, `gkGuideThisMission|Panels|Keys|Mistakes|Terms|OtherMissions|HowToWin|Traps`,
    `gkDemoWatch|WatchFirst|Badge|BarAria|StepOf|Play|Pause|Next|Back|TakeOver|Exit|Missions|TakeOverHint|KeysHint`,
    `gkStatusOnTrack|AtRisk|Pass|Fail`, `gkMsListTitle|ListAria|ColMission|ColStatus|Available|Completed|BriefingTitle|Setup|Objectives|Start|RulesTitle`,
    `gkDebriefPassed|Failed|ObjectivesTitle|PendingTitle|RunToEnd|BackToDesk`, `gkExpandEnter|Exit`,
    `gkFullscreenEnter|Exit`, `gkSandboxLink` ("Sandbox <GO>"). HU from the matching `hd*` HU values.
13. `scripts/game-kit-ui.test.mjs`: `gameFormat` cases (signs, `-0`, heat bounds); `GameKit` EN/HU key parity
    and HU ≠ EN for every key. Extend `"test:game-kit"` to `node --test scripts/game-kit*.test.mjs`.

## Acceptance criteria
- `npx tsc -b`, lint and `npm run test:game-kit` green; no file in `src/components/game` imports from
  `src/features/**`.
- `grep -rn "hdesk\|\"hd" src/components/game src/styles/_game-kit.scss` finds nothing.
- Every `.tsx` in `src/components/game` ≤ ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:game-kit && npm run test:hedging-desk && npm run build
grep -rn "features/" src/components/game && echo "LEAK" || echo "kit is standalone"
find src/components/game -name "*.tsx" | xargs wc -l | sort -n | tail -5
```
There is no page using the kit yet; browser checks happen in plan 03 and the desk screen plans.

## Pitfalls
- **Help portal:** `HelpDrawer` must be portalled into the `.gdesk` root (pass `container`) so it keeps
  the tokens and shows in full screen; keep the root node in state like `HedgingDeskView.tsx` L58–62.
- **Hooks above the session key:** expand/fullscreen/help state must live outside the component that is
  re-keyed on restart, or a restart closes the help drawer and leaves full screen.
- **Demo position survives remount:** the bar remounts when the demo switches screens; keep position in
  the module-level map, not component state.
- **`--text-muted` vs `--muted`:** the hedging help partial uses the site token `--text-muted`; inside
  `.gdesk` use `--muted`.

## Findings (fill in during execution)
- Files: `src/components/game/` — `gameFormat.ts`, `gameCopy.ts` (`STATUS_KEY`), `gameHooks.ts` (`GameKey`, `useProgress`, `useFunctionKeys`), `useGameHelp.ts` (`HelpTab`, `HELP_TABS`, `GameHelp`), `demoPosition.ts`, `useDemoPlayer.ts`, `GameFrame.tsx` (`GameFrame`, `CommandBar`, `QuoteStrip`, `DeskGrid`, `DeskPair`), `GameControls.tsx` (`ScreenTabs`, `FunctionKeyBar`, `HelpButton`, `DemoButton`, `ViewControls`), `GamePanels.tsx` (`EventLog`, `BandMeter`, `ScenarioGrid`, `SeriesKey`, `ObjectiveList`, `ObjectiveView`), `MissionPanel.tsx`, `HelpSheet.tsx`, `HelpContent.tsx` (`AdviceList`, `AdviceView`, `WhatIfCard`), `GuideContent.tsx` (`GuideAccordion`, `GuideList`, `GuidePanels`, `GuidePlaybook`), `DemoBar.tsx`, `MissionScreen.tsx` (`MissionList`, `MissionBriefing`, `DeskRules`), `DebriefParts.tsx` (`DebriefBanner`, `DebriefPending`, `AttributionBars`, `PolicyTable`, `DebriefObjectives`); barrel `index.ts`. Largest .tsx 125 lines.
- Deviations (all logged as CONTRACT in LOG.md):
  - `MissionPanel` takes an extra `heading` (mission title) beside `brief`; `progress` is a 0–1 share.
  - `ViewControls` takes `deskId` and `helpId` (for focus return and `aria-controls`); help/demo buttons hide themselves while `demo`.
  - `useDemoPlayer` also takes `onTakeOver` and returns `takeOver()`/`exit()`; `DemoBar` props are `{ id, player, caption, onMissions? }` (take-over/exit come from the player).
  - `HelpSheet` takes `idPrefix` (drawer id `<prefix>help`) instead of `title`; title is the generic `gkHelpTitle`.
  - `AttributionBars` `total` needs `value` too (for its bar).
  - `WhatIfCard` only shows "Details" when `detail` is given; `body` optional.
  - Extra keys: `gkHelpUseTicket`, `gkMsCompletedPlain`, `gkMsFreePlay`, `gkDebriefRunToEnd` (generic, replaces "run to expiry"). `gkHelpContext` dropped (desks pass translated context).
  - SCSS generated from the hedging partials (renamed), minus ticket/chain/positions/greek-grid/daily-bars/theta rules and the anchor lists; `.gdesk-blotter-row--{up,down,accent}` tones; `.gdesk-mlist-tags`, `.gdesk-wi-table`; chart heights `.gdesk-chart--main|strip|half`. `html.page-expanded` not copied.
- Verification: `tsc -b` clean; eslint clean on the kit (12 repo lint errors are pre-existing, all in untouched files: AppShell, diffusion, heston, home, payoff-lab, PortfolioUniverseContext, i18n, theme); `test:game-kit` 14/14; `test:hedging-desk` 78/78; build green; kit has no `features/` imports and no `hdesk`/`hd*` strings.
- Items awaiting owner approval: HU strings added (all of `src/Language/GameKit.hu.ts`, mostly copied from the matching `hd*` HU): new or changed wording — `gkScreenDesk` "Desk nézet", `gkAdvEmpty`, `gkMsFreePlay`, `gkMsCompletedPlain`, `gkDebriefPendingTitle` "A kiértékelés a futás végén nyílik meg", `gkDebriefRunToEnd` "Futtatás a végéig", `gkSandboxLink` "Sandbox oldal <GO>".

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/02-kit-ui-theme.md`; confirm plan 01 is done. Implement plan
> 02: props-driven kit components in `src/components/game/`, `_game-kit.scss` with the `.gdesk` theme, the
> `GameKit` i18n tables and `scripts/game-kit-ui.test.mjs`, generalising the Hedging Desk frame without
> editing it. Run the verification block. Append a CONTRACT line to LOG.md listing any prop that differs
> from the plan, fill in Findings, set plan 02 to `done`, and summarise. Do not stash or check out.
