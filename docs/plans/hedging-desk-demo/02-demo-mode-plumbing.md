# 02 — `?demo=1` mode, `dispatch`, effective session key, guards, anchors, entry buttons, stub bar

Status: done (2026-10-23) · Depends on: – (verified together with 01) · Suggested model: Sonnet · Est. size: M

## Why
The demo needs a way in (URL and buttons), a way to drive the book (`dispatch` on the model), stable
targets to highlight (ids), and two guards so a demo run neither records progress nor reacts to F-keys.
With these in place plan 03 can build the bar without touching any existing file.

## Current state (verified 2026-10-23)
- `src/features/hedging-desk/hedgingDesk.url.ts` (33 lines): `HEDGING_DESK_URL = { m: missionField, seed: urlNumber(DEFAULT_SEED, 1, 9999, 0), screen: urlEnum(DESK_SCREENS, "desk") }`,
  type `HedgingDeskUrlState = { m: string; seed: number; screen: DeskScreen }`. `urlBool(fallback)` exists
  in `src/lib/urlState.ts` (written as `"1"`/`"0"`, left out when equal to the fallback).
- `src/features/hedging-desk/useHedgingDesk.ts` (117 lines):
  - L22–40 `useDeskUrl()`: `mission = missionById(url.m) ?? MISSIONS[0]`, `market = buildMarket(mission.market, url.seed)`,
    `setScreen`, `selectMission(id)` → `{ m: id, screen: "desk" }`, `newPath()` (seed + 1, wraps at 9999),
    `restart()` (bumps `run`, `screen: "desk"`); returns `{ url, run, mission, market, setScreen, selectMission, newPath, restart }`.
  - L50–56 `useDeskSession(desk)`: `useReducer((s, a) => reduceDesk(s, a, market, mission), undefined, () => startBook(mission, url.seed, market))`;
    `dispatch` is local. L93–114 returns `{ ...desk, state, day, …, submit, autoHedge, step }`.
    `export type HedgingDeskModel = ReturnType<typeof useDeskSession>`.
- `src/features/hedging-desk/HedgingDeskView.tsx` (58 lines): L18–31 builds `viewControls = <FullscreenButton expanded onExpand fullscreen />`
  and renders `<DeskSession key={`${m}-${seed}-${deskUrl.run}`} …>` with `m, seed` taken from `deskUrl.url`;
  L48–55 renders `DeskScreen` + `FunctionKeys` on the desk screen, `MissionsScreen`, `DebriefScreen`.
- `src/features/hedging-desk/useDebrief.ts` (40 lines): L20 `replayPolicy(mission, market, url.seed, p.every)`;
  L30–35 `recordResult(mission.id, passed, pnl)` in an effect guarded by a ref.
- `src/features/hedging-desk/useFunctionKeys.ts` (44 lines): L34–40 window keydown handler; `keyEnabled(key, desk)` L24.
- `src/components/layout/Panel.tsx` (41 lines): props `title, actions, footer, children, dominant, flush, className`;
  renders `<section className={classes}>`.
- Panels (all `<Panel … className="hdesk-panel">`): `components/MissionPanel.tsx` L12, `RiskPanel.tsx` L32,
  `Blotter.tsx` L13, `PriceSharesChart.tsx` L48, `NetDeltaChart.tsx` L39, `BookPnlChart.tsx` L26,
  `ScenarioMatrix.tsx` L23, `RiskProfileChart.tsx` L21, `PositionsTable.tsx` L30, `OrderTicket.tsx` L18,
  `OptionChain.tsx` L15, `debrief/PnlAttribution.tsx` L22, `debrief/PolicyCompare.tsx` L18,
  `debrief/DebriefObjectives.tsx` L10, `debrief/ThetaGammaPanel.tsx` L18. `debrief/DebriefBanner.tsx` and
  `debrief/PnlHistoryChart.tsx`: check their root element (a `Panel` or a `div`) before adding the id.
- `components/DeskHeader.tsx` (56 lines): `dl.hdesk-quotes` is the quote strip; `actions` slot after the clock.
- `HedgingDeskView.tsx` L44–47: `<div className="hdesk-tabsrow">` wraps `ScreenTabs` and `p.hdesk-intro`.
- `components/OrderTicket.tsx` L65–72: the submit `<button className={`hdesk-submit …`}>`.
- `components/FullscreenButton.tsx` (32 lines): `CmdToggle` renders `button.hdesk-cmd-btn[aria-pressed]`.
- `components/MissionsScreen.tsx` (23 lines) → `missions/MissionBriefing.tsx` (59 lines, props
  `{ mission, progress, onStart }`), start button `button.hdesk-brief-start` L50.
- i18n: `src/Language/HedgingDesk.ts` (`hedgingDeskEn`, 42 keys), registered in `index.en.ts` L53–58 (imports)
  and L114–119 (spreads); HU mirror in `index.hu.ts` L53–58 / L115–120.
- Plan 01 creates `src/features/hedging-desk/demo/demo.config.ts` exporting `DEMO_MISSION = "M1"` and
  `DEMO_SEED`. Plan 03 creates `demo/useDemo.ts` and fills the `DemoBar` stub.

## Goal
1. `?demo=1` → effective mission `M1` and seed `DEMO_SEED`; `startDemo()`, `takeOver()`, `exitDemo()` on the model.
2. `desk.demo`, `desk.seed` (effective), `desk.dispatch` exposed; session key from effective values.
3. `useDebrief` never records progress and never replays with the wrong seed in demo mode; F-keys ignored in demo mode.
4. `Panel` accepts `id`; every anchor from plan 01's `DemoAnchor` union exists as `id="hd-<anchor>"`.
5. Entry buttons: command bar ("Watch the playthrough") and M1 briefing ("New here? Watch a two-minute playthrough").
6. `components/demo/DemoBar.tsx` stub rendered in place of `FunctionKeys` on the desk screen and under the debrief screen while `desk.demo`.
7. `src/Language/HedgingDeskDemo.ts` + `.hu.ts` with the bar and button strings plan 03 will use.

## Non-goals
- No controller logic, no highlight CSS, no captions (plan 03). Do not edit `engine/*` (plan 01 does).

## Constraints
- `.tsx` ≤ ~150 lines; `useHedgingDesk.ts` may grow a little but stays under ~150 as well (split
  `useDeskUrl` into `useDeskUrl.ts` if it does not).
- Additive edits only in `Panel.tsx`, `index.en.ts`/`index.hu.ts`. `Panel`'s new prop is optional and
  changes nothing for existing callers.

## Steps

1. **URL.** In `hedgingDesk.url.ts` add `demo: boolean` to `HedgingDeskUrlState` and `demo: urlBool(false)`
   to the schema (import `urlBool`).

2. **`useDeskUrl`** (edit L22–40):
   - `const demo = url.demo;`
   - `const mission = useMemo(() => (demo ? missionById(DEMO_MISSION)! : missionById(url.m)) ?? MISSIONS[0], [demo, url.m]);`
   - `const seed = demo ? DEMO_SEED : url.seed;` and `market = buildMarket(mission.market, seed)`.
   - `startDemo = () => { setRun(r => r + 1); setUrl({ demo: true, m: DEMO_MISSION, seed: DEMO_SEED, screen: "desk" }); }`
   - `takeOver = () => setUrl({ demo: false, m: DEMO_MISSION, seed: DEMO_SEED })` (screen unchanged).
   - `exitDemo = () => setUrl({ demo: false, screen: "desk" })`.
   - Return `{ url, run, demo, seed, mission, market, setScreen, selectMission, newPath, restart, startDemo, takeOver, exitDemo }`.
   - If `demo/demo.config.ts` does not exist yet (plan 01 not started), create it with exactly
     `export const DEMO_MISSION = "M1"; export const DEMO_SEED = 7;` plus `///` comments and tell plan 01 in
     Findings; plan 01 will overwrite the seed.

3. **`useDeskSession`**: use `desk.seed` in `startBook` (L55); expose `dispatch` and `demo` in the returned
   object (`dispatch` typed as `(action: DeskAction) => void`). Document on `dispatch`: "Raw engine
   dispatch for the demo controller; panels use `submit`/`autoHedge`/`step`."
   Replace every other `url.seed` read in the feature with `seed`: `grep -rn "url.seed" src/features/hedging-desk`
   (expected: `useDebrief.ts` L20–21 and `components/FunctionKeys.tsx` status line).

4. **View.** `HedgingDeskView.tsx`: key the session on `${deskUrl.mission.id}-${deskUrl.seed}-${deskUrl.run}`.
   Add `viewControls`: `<DemoButton onStart={deskUrl.startDemo} hidden={deskUrl.demo} />` before
   `FullscreenButton` (new `components/demo/DemoButton.tsx`, ~15 lines, a `button.hdesk-cmd-btn`, returns
   `null` when hidden). In `DeskSession`: desk screen renders `{desk.demo ? <DemoBar desk={desk} /> : <FunctionKeys desk={desk} />}`;
   debrief screen renders `<DebriefScreen …/>` followed by `{desk.demo && <DemoBar desk={desk} />}`.
   Root class: `["hdesk", expanded && "hdesk--expanded", desk.demo && "hdesk--demo"].filter(Boolean).join(" ")`.
   Add `id="hd-tabs"` to `div.hdesk-tabsrow`.

5. **Stub** `components/demo/DemoBar.tsx`:
   ```tsx
   // Stub: filled by docs/plans/hedging-desk-demo/03.
   import type { HedgingDeskModel } from "../../useHedgingDesk";
   export default function DemoBar({ desk }: { desk: HedgingDeskModel }) { void desk; return null; }
   ```

6. **Guards.** `useDebrief.ts`: `if (!state.settled || recorded.current || desk.demo) return;` and replay
   with `desk.seed`. `useFunctionKeys.ts`: in `onKeyDown`, `if (latest.current.demo) return;` before the
   lookup (the bar handles its own keys); `FunctionKeys.tsx` is not rendered in demo mode anyway.

7. **Anchors.** `Panel.tsx`: add `id?: string` to the props and `id={id}` on the `<section>`. Then set
   `id="hd-…"` on: MissionPanel `mission`, RiskPanel `risk`, Blotter `blotter`, PriceSharesChart `price`,
   NetDeltaChart `delta`, BookPnlChart `pnl`, ScenarioMatrix `matrix`, RiskProfileChart `profile`,
   PositionsTable `positions`, OrderTicket `ticket`, OptionChain `chain`, PnlAttribution
   `debrief-attribution`, PolicyCompare `debrief-policies`, PnlHistoryChart `debrief-history`,
   DebriefBanner `debrief-banner` (on its root element). Non-panel anchors: `dl.hdesk-quotes` →
   `id="hd-quotes"`; OrderTicket submit button → `id="hd-submit"`; the function-key row `div.hdesk-keys` →
   `id="hd-keys"` (during the demo the bar sits there; plan 03 gives the bar's own root the same id so the
   `keys` anchor resolves in both modes).

8. **Entry on the Missions screen.** `MissionBriefing` gains `onDemo?: () => void`; when
   `mission.id === DEMO_MISSION && onDemo` it renders, under the start button, a secondary
   `button.hdesk-btn.hdesk-brief-demo` with `t("hdDemoWatchFirst")`. `MissionsScreen` passes
   `onDemo={desk.startDemo}`.

9. **Strings** `src/Language/HedgingDeskDemo.ts` (`hedgingDeskDemoEn`) and `.hu.ts` (`hedgingDeskDemoHu`),
   registered by appending after the `hedgingDeskMissionScreen` import and spread lines:
   `hdDemoWatch` "Watch the playthrough", `hdDemoWatchFirst` "New here? Watch a two-minute playthrough",
   `hdDemoBadge` "DEMO", `hdDemoBarAria` "Playthrough controls", `hdDemoStepOf` "Step {{n}} of {{total}}",
   `hdDemoPlay` "Play", `hdDemoPause` "Pause", `hdDemoNext` "Next", `hdDemoBack` "Back",
   `hdDemoTakeOver` "Take the desk", `hdDemoExit` "Exit demo", `hdDemoMissions` "Missions",
   `hdDemoTakeOverHint` "The book stays as it is; the function keys are yours.",
   `hdDemoKeysHint` "← → step · space play/pause · Esc exit". HU drafts for all (list in Findings).

10. **Badge.** `DeskHeader`: when `desk.demo`, render `<span className="hdesk-cmd-badge">{t("hdDemoBadge")}</span>`
    right after the clock (plain text on the amber bar; no pill). Style it in plan 03's partial; until
    then it inherits the bar's text style, which is acceptable.

## Acceptance criteria
- `/delta-hedging/desk?demo=1` renders the desk with `.hdesk--demo`, no function keys, the DEMO badge,
  and `document.querySelectorAll('[id^="hd-"]').length >= 16` on the desk screen; `?demo=1&seed=12&m=M3`
  still shows M1 and the status line says `Path #<DEMO_SEED>`.
- Clicking "Watch the playthrough" on a plain desk sets `?demo=1&seed=<DEMO_SEED>` (and `m=M1` only if
  not default); the tabs still switch screens.
- After a demo-mode run to expiry (use `desk.dispatch` from the console is not possible; instead confirm
  by code reading and plan 04's test) no `localStorage` key `qs.hedgingDesk.progress.v1` is written.
- `git diff --stat src/components/layout/Panel.tsx` shows only the `id` additions; all other modules
  render unchanged (smoke on `/binomial`, `/bond-pricing` clean).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/delta-hedging/desk?demo=1,/delta-hedging/desk?demo=1&seed=12&m=M3,/hu/delta-hedging/desk?demo=1,/binomial" \
  --after "/delta-hedging/desk?demo=1|(()=>({demo:document.querySelector('.hdesk--demo')!==null,keys:document.querySelectorAll('.hdesk-fkey').length,anchors:[...document.querySelectorAll('[id^=\"hd-\"]')].map(e=>e.id).sort(),status:document.querySelector('.hdesk-status')?.textContent??null}))()" \
  --after "/delta-hedging/desk|(async()=>{document.querySelector('.hdesk-cmd-btn').click();await new Promise(r=>setTimeout(r,400));return {search:location.search,demo:document.querySelector('.hdesk--demo')!==null}})()"
# expect: no problems; first --after: demo true, keys 0, anchors include hd-mission…hd-chain, hd-quotes, hd-tabs, hd-submit;
# second --after: search contains demo=1 and seed=<DEMO_SEED>
```
Then stop the server and confirm port 4173 is free. If plan 01 is not done, `test:hedging-desk` still
passes (no demo test yet); note it in Findings.

## Pitfalls
- **Hydration.** `useUrlState` returns `demo: false` while hydrating, so the pre-rendered HTML is the
  normal desk and the demo appears on the first client render after hydration; never read `window` in
  render to detect it. The `--after` checks run after that switch.
- **Session key.** Build it from `deskUrl.mission.id` and `deskUrl.seed`, not from `url.m`/`url.seed`,
  or `takeOver()` remounts and wipes the scripted book.
- **`startDemo` while already on M1/`DEMO_SEED`.** The `run` bump guarantees a fresh session; plan 03's
  controller also restores `states[0]` on mount.
- **`DemoButton` is outside the session** (it lives next to the fullscreen button); it gets `startDemo`
  from `deskUrl`, not from the model.
- **Ids must be unique.** One desk per page; do not put `hd-keys` on both the key row and a visible bar
  at the same time (they are never rendered together).
- **Lint `react-refresh/only-export-components`**: keep `DemoButton.tsx` and `DemoBar.tsx` component-only.

## Findings (fill in during execution)
- Baseline / measurements: `useHedgingDesk.ts` now 131 lines (no split needed); `HedgingDeskView.tsx` 69.
  `tsc -b` clean, `test:hedging-desk` 49/49, `test:seo` 25/25, build OK. Smoke on vite preview clean on
  `/delta-hedging/desk`, `?demo=1`, `?demo=1&seed=12&m=M3`, `/hu/…?demo=1`, `/binomial`, `/bond-pricing`.
  `?demo=1`: `.hdesk--demo`, 0 function keys, DEMO badge. Desk-screen anchors present (14): hd-blotter chain
  delta matrix mission pnl positions price profile quotes risk submit tabs ticket; `hd-keys` is on the
  function-key row (absent in demo until plan 03's bar root takes the id); the four `hd-debrief-*` ids sit on
  the debrief screen, so the "≥16 on the desk screen" count is 14 by design. "Watch the playthrough" →
  `?seed=49&demo=1` (DEMO_SEED 49 from plan 01; `m` omitted as default). `?demo=1&seed=12&m=M3` shows M1.
  M1 briefing shows the `hdesk-brief-demo` button.
- Deviations and why: `ChartContainer` also got an optional `id` prop (additive), because
  `PnlHistoryChart` is a `ChartContainer`, not a `Panel`. `DebriefBanner`'s root `div` carries
  `hd-debrief-banner`. `dispatch` is exposed as a typed alias of the reducer dispatch.
  One `--after` run on `?screen=missions` logged React #418 once; 12 further loads of the missions, desk
  and demo pages were clean (my-app-6a saw the same intermittent #418 before this plan). Plan 04 should
  keep an eye on it.
- Items awaiting owner approval: HU drafts in `src/Language/HedgingDeskDemo.hu.ts`: hdDemoWatch
  "Bemutató lejátszása", hdDemoWatchFirst, hdDemoBadge "DEMÓ", hdDemoBarAria, hdDemoStepOf
  "{{n}}. lépés / {{total}}", hdDemoPlay, hdDemoPause, hdDemoNext, hdDemoBack, hdDemoTakeOver
  "Átveszem a pultot", hdDemoExit, hdDemoMissions, hdDemoTakeOverHint, hdDemoKeysHint.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk-demo/README.md`
> (sections 2 and 4) and `docs/plans/hedging-desk-demo/02-demo-mode-plumbing.md`. Implement plan 02: the
> `demo` URL key, the effective mission/seed and `startDemo`/`takeOver`/`exitDemo` in `useDeskUrl`,
> `dispatch` and `demo` on the model, the effective session key, the debrief and F-key guards, the `Panel`
> `id` prop and every `hd-*` anchor, the `DemoButton` and briefing entry, the `DemoBar` stub, the DEMO
> badge and the `HedgingDeskDemo` i18n tables. Run the Verification block and make it pass. Fill in
> Findings (list every HU string), set plan 02 to `done` in the README table, and summarise. Do not edit
> `src/features/hedging-desk/engine/` or `src/features/delta-hedging/`. Do not run `git stash`.
