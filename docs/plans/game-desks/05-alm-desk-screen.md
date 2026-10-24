# 05 — ALM desk route, frame and desk screen

Status: done (2026-10-24, session alm-screen) · Depends on: 02, 04 · Suggested model: Sonnet · Est. size: M

## Why
This plan puts the ALM desk on screen at `/immunization/desk`: the terminal frame from the kit, the
desk's panels (curve, surplus, attribution, holdings, rebalance ticket, scenario grid, risk, events),
function keys, URL state and saved progress. It also creates the stub files plan 06 fills (missions
screen, debrief, help tabs, demo script), so the two plans never edit the same file.

## Current state (verified 2026-10-23, commit `73f67d7`)
- Registry `src/modules/registry.ts` L239–249: `id: "immunization"`, `path: "/immunization"`,
  `navKey: "navImmunization"`, category fixed-income, `status: "beta"`, no `subNav`,
  `about: moduleAbout("Immunization", 4)`, `Component: lazy(() => import("../features/immunization/ImmunizationView"))`.
- Sub-page pattern to copy: `src/features/delta-hedging/DeltaHedgingPages.tsx` (13 lines: `useParams()["*"]`;
  empty → lab view, `"desk"` → lazy desk view, else `<Navigate to="/delta-hedging" replace />`) and the
  delta-hedging registry entry L174–189 (`subNav: [{ id: "lab", labelKey, to }, { id: "desk", labelKey, descKey, seoTitle, to }]`).
  `src/App.tsx` routes modules with `subNav` at `${path}/*`; `src/seo.routes.ts` makes a page of each
  `subNav` item with `descKey` (description 50–160 chars, `scripts/seo-audit.test.mjs` L84).
- Nav labels live in `src/Language/Home.ts` / `.hu.ts`; SEO strings in `src/Language/Seo.ts` / `.hu.ts`.
- Engine (plan 04) in `src/features/alm-desk/engine/`: `startAlm`, `reduceAlm`, `almRisk`, `surplusGrid`,
  `curvePoints`, `evaluateAlm`, `replayAlm`, `surplusSeries`, `benchmarkSeries`, `attributionTotals`,
  `ALM_MISSIONS`, `almMissionById`, types `AlmState`, `AlmAction`, `AlmMission`, `AlmEvent`. Immunization
  helpers: `immunisedWeights`, `weightsOf`, `TENORS`, `money`, `signedBp` in `immunization.math.ts`.
- Kit (plans 01–02): `src/components/game/*` (`GameFrame`, `CommandBar`, `QuoteStrip`, `ScreenTabs`,
  `ViewControls`, `FunctionKeyBar` + `useFunctionKeys`, `DeskGrid`, `DeskPair`, `MissionPanel`,
  `ObjectiveList`, `EventLog`, `BandMeter`, `ScenarioGrid`, `SeriesKey`, `useGameHelp`, `HelpSheet`,
  `useProgress`, `gameFormat`), `src/lib/game/progress.ts` (`createProgressStore`, `higherIsBetter`).
  `src/components/useFullscreen.ts`, `useExpandInPage.ts`, `useUrlState.ts`; `src/lib/urlState.ts`.
- Charts: `LineChart` and `ChartContainer` (`src/components/charts`, `src/components/layout`); see
  `src/features/hedging-desk/components/PriceSharesChart.tsx` for a terminal-styled example.
- Design: canvas board `AlmDesk.dc.html` (README has the link).

## Goal
1. `/immunization/desk` (and `/hu/…`) renders the ALM desk; `/immunization` still renders the lab, unchanged.
2. Sidebar shows "Lab" and "ALM desk" under Immunization.
3. Desk screen panels and keys work end to end for every mission (missions chosen by `?m=`).
4. Stubs for plan 06 exist with their final props.

## Non-goals
- Missions screen content, debrief, help tab content, demo script (plan 06). Do not edit
  `ImmunizationView.tsx` or the lab's components.

## Constraints
- README §4 desk recipe: folder `src/features/alm-desk/`, i18n prefix `almd`, DOM ids `almd-*`, partial
  `src/styles/_alm-desk.scss` (scoped under `.almd`), table `src/Language/AlmDesk.ts` (+ `.hu.ts`).
- Root: `<GameFrame deskClass="almd" …>`. Colours only via tokens.

## Steps
1. **Router** `src/features/immunization/ImmunizationPages.tsx`: empty → `<ImmunizationView />`, `"desk"` →
   lazy `../alm-desk/AlmDeskView`, else `<Navigate to="/immunization" replace />`.
2. **Registry** (immunization entry only): `Component` → `ImmunizationPages`; add
   `subNav: [{ id: "lab", labelKey: "navImmunizationLab", to: "/immunization" }, { id: "desk", labelKey: "navAlmDesk", descKey: "seoDescAlmDesk", seoTitle: "ALM Desk: Pension Immunization Game", to: "/immunization/desk" }]`.
3. **Copy**: `navImmunizationLab` ("Lab" / "Labor"), `navAlmDesk` ("ALM desk" / "ALM desk") after
   `navImmunization` in `Home.ts`/`.hu.ts`; `seoDescAlmDesk` after the Immunization SEO keys in
   `Seo.ts`/`.hu.ts` (count 50–160 chars). HU must differ from EN where a test requires it (desk tables);
   nav labels may match.
4. **URL** `alm-desk/almDesk.url.ts`: `m` (validated via `almMissionById`, default `"A1"`), `seed`
   (`urlNumber(1, 1, 9999, 0)`), `screen` (`urlEnum(["desk","missions","debrief"], "desk")`), `demo` (`urlBool(false)`).
5. **Progress** `alm-desk/almProgress.ts`: `export const ALM_PROGRESS = createProgressStore("alm", higherIsBetter)` (best = final surplus).
6. **Hooks** `useAlmDesk.ts`: `useAlmUrl()` (url, run counter, mission, `setScreen`, `selectMission`,
   `newPath` via `nextSeed`, `restart`, `startDemo`, `takeOver`, `exitDemo`) and `useAlmSession(url)`
   (`useReducer` over `reduceAlm` with `startAlm`; derived `risk = almRisk`, `objectives = evaluateAlm`,
   `grid = surplusGrid(state, mission, [-100,-50,-25,0,25,50,100], [50,0,-50])`; ticket state
   `targets: string[]` (4 slots, %), `setTarget(i, v)`, `fillMatch()`, `submit()`, `matchNow()`,
   `step()`, `dispatch`). Export `type AlmDeskModel`.
7. **View** `AlmDeskView.tsx`: like `HedgingDeskView.tsx` but with kit components — view controls above
   the session key (`${mission.id}-${seed}-${run}`), `CommandBar` (ticker `PNSN Liability`, code
   `ALMD <GO>`, title, clock "Round {n}/{years} · {left} years to pay"), `QuoteStrip` id `almd-quotes`
   (1Y, 5Y, 10Y yield, 2s10s, last shock, assets, liability PV, funded %, surplus), `ScreenTabs` with the
   intro line, the desk screen or the stub screens, `FunctionKeyBar` id `almd-keys` (F2 Next year, F4 Match
   duration, F8 New path, F9 Restart; `enabled` false after settlement except F8/F9), a link
   `gkSandboxLink` to `/sandbox` in the command bar actions, and `HelpSheet` with the three stub tab bodies.
8. **Panels** (`components/`, each with its `almd-*` id):
   - Left: `MissionPanel` (kit) `almd-mission`; `AlmRiskPanel` `almd-risk` — `BandMeter` for the duration
     gap (range ±2 y, band ±0.25), DV01 assets/liability, convexity assets/liability, surplus per +1 bp, cash,
     costs paid, gap misses, trades left (when `maxTrades`); `EventLog` `almd-events` from a pure
     `alm-desk/eventText.ts` (exhaustive switch over `AlmEvent` kinds).
   - Centre: `CurveChart` `almd-curve` (today, last year dashed, start faint; square markers for held bonds
     at their remaining maturity, a diamond for the liability; x 0–15 y); `DeskPair` of `SurplusChart`
     `almd-surplus` (you vs `matchYearly` vs `buyHold` up to the current round) and `AttributionPanel`
     `almd-attr` (kit `AttributionBars`: carry, rate, convexity, cost for the last round); `HoldingsTable`
     `almd-holdings` (slot, years left, coupon, face, price, value, weight, DV01, plus the liability row).
   - Right: `RebalanceTicket` `almd-ticket` (target % inputs with labels for the alive slots, cash = the
     rest, "Fill targets: match duration", preview of duration after, gap after, convexity after, value
     traded, cost, trades left; submit `almd-submit` "REBALANCE <GO>"; notice when settled);
     `ScenarioGrid` `almd-grid` (rows twist +50/0/−50, columns parallel −100…+100).
9. **Stubs for plan 06** (each `export default` with final props, returning a titled empty panel, first line
   `// Stub: filled by docs/plans/game-desks/06.`): `components/AlmMissionsScreen.tsx`
   (`{ desk: AlmDeskModel }`), `components/AlmDebriefScreen.tsx` (`{ desk }`), `help/AlmNextMove.tsx`,
   `help/AlmWhatIf.tsx`, `help/AlmGuide.tsx` (`{ desk, help: GameHelp }`), and `demo/demo.script.ts`
   exporting `buildAlmDemo(mission, seed): AlmDemoStep[]` returning `[]` (the view hides the Watch button
   when the script is empty).
10. **Styles** `src/styles/_alm-desk.scss` (`@use "alm-desk";` appended to `main.scss`): column widths,
    chart heights, ticket grid, holdings table; everything under `.almd`.
11. **Copy** `src/Language/AlmDesk.ts` / `.hu.ts` (`almdTitle`, `almdDesc` intro, clock, quotes, panel
    titles, ticket labels, keys, event texts, chart labels); register at the end of the index files.
12. **Tests** `scripts/alm-desk-screen.test.mjs`: `eventText` covers every event kind (EN and HU tables
    have the keys it uses), `AlmDesk` EN/HU parity and HU ≠ EN.

## Acceptance criteria
- `/immunization` unchanged; `/immunization/desk?m=A1` plays to settlement with F4 then F2 × 8 and shows the
  surplus series, attribution and a settled notice; `?m=A3` rejects a 4th rebalance with an event row.
- Sidebar lists Lab and ALM desk; build pre-renders both desk paths; `test:seo` passes.
- Smoke and layout audit clean at all widths; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:alm-desk && npm run test:immunization-lab && npm run test:game-kit
npm run build && npm run test:seo && ls dist/immunization/desk dist/hu/immunization/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/immunization,/immunization/desk,/immunization/desk?m=A4,/immunization/nope,/hu/immunization/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/immunization/desk"
```
Use `cdp-smoke.mjs --after` to press F4 and F2 and confirm no console errors. Stop the server; confirm the
port is free.

## Pitfalls
- **Hydration:** no `localStorage`, `Math.random` or clock reads during render; the pre-rendered page is
  A1, seed 1, round 0.
- **Ticket strings:** targets are strings; parse with a guard and block submit when they sum above 100%.
- **Matured slots:** disable their inputs; their target is 0.
- **Registry is shared** with other plans: re-read before editing; change only the immunization entry.

## Findings (fill in during execution)
- Deviations and why:
  - `navImmunizationLab` / `navAlmDesk` sit in `Home.ts` after `navHedgingDesk`; `navImmunization` actually lives in `Immunization.ts`.
  - The surplus chart compares you with `matchYearly` and **no trades** (`benchmarkSeries` returns `{ matchYearly, none }`), not `buyHold`.
  - No slot is disabled: Immunization re-issues a changed slot as a new par bond at full tenor, so a matured slot can always be bought again.
  - The ticket stays open after the last trade (with a "no trades left" note) and F4 stays enabled, so a 4th attempt logs a `rejected` event, as the acceptance asks.
  - Added `shiftCurve` to `immunization.math.ts` (the curve clamp, now shared by `advance`) for the "last year" curve; lab numbers unchanged.
  - Extra pure helpers: `ticket.math.ts`, `deskView.math.ts` (holdings rows, curve history, chart domains), `missionCopy.ts` (mission title/brief keys `almdMission<Id>Title|Brief`, objective labels for plan 06 to reuse). Demo constants `ALM_DEMO_MISSION` / `ALM_DEMO_SEED` live in the `demo/demo.script.ts` stub.
  - Verified on a separate build (`vite build --outDir dist-alm`) because `tsc -b` was red only from other plans' half-done files (portfolio-desk, rates-desk) and other sessions were rebuilding `dist`.
- Verification: tsc clean for alm-desk; eslint clean; `test:alm-desk` 19/19, `test:immunization-lab`, `test:game-kit` green; both desk paths pre-rendered and in the sitemap; smoke clean on `/immunization`, `/immunization/desk`, `?m=A4`, `/hu/immunization/desk` (`/immunization/nope` shows the same React #418 as `/delta-hedging/nope`, which was already there). A1 F4 then F2×8 settles; A3 4th rebalance gives a Rejected row. Layout audit at 360–1536 EN/HU: no svg clipping or collisions; the remaining failures are the function-key footer overlaps (hedging desk has the same) and the site brand tap target.
  - `test:seo`: the desk pages pass; the failures are `/sandbox` (plan 16 in progress), known baselines, and **initial JS 991,763 B > 955,000 B budget**. Every desk adds its EN copy to the initial bundle (this plan adds ~8 KB), so this is a pack-wide issue for plan 18 or the owner.
- Items awaiting owner approval: HU strings added: all of `src/Language/AlmDesk.hu.ts` (~120 keys), `navImmunizationLab` "Labor", `navAlmDesk` "ALM desk", `seoDescAlmDesk`.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/05-alm-desk-screen.md`; confirm plans 02 and 04 are done.
> Implement plan 05: the `/immunization/desk` route and registry `subNav`, URL/progress/hooks, the kit-based
> view, the desk panels, the stubs for plan 06, styles, copy and tests. Run the verification block, fill in
> Findings, append DONE to LOG.md, set plan 05 to `done`, and summarise. Do not edit the Immunization lab view.
