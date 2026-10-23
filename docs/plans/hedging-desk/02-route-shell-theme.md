# 02 — Route, registry, SEO, terminal theme, page frame, stubs

Status: done (2026-10-23) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The desk needs a reachable, pre-rendered page under Delta hedging, a terminal look scoped to that page,
the page hook that wires the engine to React, and a frame whose panel slots other plans fill. Creating
every panel file as a stub with fixed props lets plans 03–06 work in parallel without touching the same
file.

## Current state (verified 2026-10-23)
- Registry entry `src/modules/registry.ts` L174–185:
  ```ts
  { id: "delta-hedging", intuition: deltaHedgingIntuition, path: "/delta-hedging", navKey: "navDeltaHedging",
    category: "derivatives", status: "beta", seo: { titleKey: "seoTitleDeltaHedging", descKey: "seoDescDeltaHedging" },
    about: moduleAbout("DeltaHedging"), relatedGuides: ["delta-hedging", "multi-step-trees"],
    Component: lazy(() => import("../features/delta-hedging/DeltaHedgingView")) },
  ```
  `ModuleSubNavItem` (L23–35): `{ id; labelKey; descKey?; seoTitle?; seoDescSuffix?; prefix?; to }`.
- `src/App.tsx` L22–33: a module with `subNav` is routed at `${m.path}/*`; `ModuleAboutSection` renders
  under every sub-page too (fine for the desk).
- Sub-page dispatch pattern: `src/features/stochastic-models/StochasticModelsView.tsx` L6–19
  (`const { "*": lessonId } = useParams();`, `<Navigate … replace />` for unknown ids).
- `src/seo.routes.ts` L28–45 turns each `subNav` item with a `descKey` into a page; English uses
  `seoTitle`, Hungarian uses `t(labelKey)`. `scripts/seo-audit.test.mjs` L84 requires descriptions of
  50–160 characters.
- Sidebar: `src/components/layout/SideSubNav.tsx` marks an item active when `item.to === pathname`
  (router basename strips `/hu`).
- Nav labels: `src/Language/Home.ts` L42 `navDeltaHedging: "Delta Hedging"` (HU `Home.hu.ts` L41). SEO
  strings: `src/Language/Seo.ts` L30–31 and `Seo.hu.ts` L30–31.
- Styles: `src/styles/main.scss` L31 `@use "delta-hedging";`. Tokens in `src/styles/tokens.scss`
  (`--bg`, `--surface`, `--surface-soft`, `--text`, `--muted`, `--border`, `--primary`, `--positive`,
  `--negative`, `--chart-1…8`, `--chart-reference`, `--font-mono`, `--radius-xs`).
- Primitives: `Panel` (`title`, `actions`, `footer`, `flush`, `className`) and `ChartContainer`
  (`title`, `actions`, `height`, `className`) in `src/components/layout/`; `Tabs` in
  `src/components/ui/Tabs.tsx` (`items`, `value`, `onChange`, `ariaLabel`, `className`).
- URL state: `useUrlState(schema)` in `src/components/useUrlState.ts`; field builders `urlNumber`,
  `urlEnum`, `urlString` in `src/lib/urlState.ts`.
- Engine (plan 01): `src/features/hedging-desk/engine/` exports `MISSIONS`, `missionById`,
  `buildMarket`, `startBook`, `reduceDesk`, `bookGreeks`, `markToMarket`, `evaluateObjectives`,
  `quoteInstrument`, `tauAt`, `autoHedgeOrder`, `realizedVol`, `DEFAULT_SEED`, types in `desk.types.ts`.

## Goal
1. `/delta-hedging/desk` (and `/hu/…`) renders the desk; `/delta-hedging` still renders the lab,
   unchanged; unknown sub-paths redirect to `/delta-hedging`.
2. Sidebar shows "Lab" and "Hedging desk" under Delta hedging.
3. The page hook `useHedgingDesk` and the page frame with header, quote strip, screen tabs, function
   keys and a responsive panel grid.
4. Stub components for every panel, with the final props, owned by plans 03–06.
5. Scoped terminal theme in `src/styles/_hedging-desk.scss`.

## Non-goals
- Panel contents (03–06). Stubs render a titled empty `Panel` only.
- Do not edit `DeltaHedgingView.tsx` or anything else in the lab (README §4).

## Constraints
- `.tsx` ≤ ~150 lines; hook and URL schema in `.ts` files; strings in a new table.
- Additive edits only in `registry.ts`, `Home*.ts`, `Seo*.ts`, `index.en.ts`/`index.hu.ts`, `main.scss`.

## Steps
1. **Router** `src/features/delta-hedging/DeltaHedgingPages.tsx` (new, ~20 lines): `"*"` empty →
   `<DeltaHedgingView />`; `"desk"` → `<HedgingDeskView />` (lazy-import
   `../hedging-desk/HedgingDeskView`); anything else → `<Navigate to="/delta-hedging" replace />`.
2. **Registry**: in the `delta-hedging` entry only, point `Component` at `DeltaHedgingPages` and add
   ```ts
   subNav: [
     { id: "lab", labelKey: "navDeltaHedgingLab", to: "/delta-hedging" },
     { id: "desk", labelKey: "navHedgingDesk", descKey: "seoDescHedgingDesk",
       seoTitle: "Delta Hedging Trading Simulator", to: "/delta-hedging/desk" },
   ],
   ```
3. **Strings**: append `navDeltaHedgingLab` ("Lab" / HU "Labor") and `navHedgingDesk`
   ("Hedging desk" / HU "Fedezési pult") right after `navDeltaHedging` in `Home.ts` / `Home.hu.ts`.
   Append `seoDescHedgingDesk` after `seoDescDeltaHedging` in `Seo.ts` / `Seo.hu.ts`, 50–160 chars, e.g.
   "Trade a short call book day by day: buy and sell stock and options, keep delta inside a band and
   pass hedging missions on simulated paths." (count it; HU is a draft).
4. **Table** `src/Language/HedgingDesk.ts` (`export const hedgingDeskEn = { … }`) + `HedgingDesk.hu.ts`
   (`hedgingDeskHu`), registered by appending an import and a spread at the end of the lists in
   `index.en.ts` / `index.hu.ts`. Keys prefixed `hd`: page title/description, screen tabs (Desk, Missions,
   Debrief), function keys (Next day, +5 days, +21 days, Auto-hedge Δ to 0, New path, Restart), quote
   strip labels (Last, Change, Open, High, Low, Implied vol, Realized vol 20D, Rate, Trades, Last
   rebalance, P&L), status line ("Path #{{seed}} · fills cross the spread · breaches counted at the
   close"), stub panel titles used in step 7.
4b. **Mission copy table** `src/Language/HedgingDeskMissions.ts` (`hedgingDeskMissionsEn`) +
   `.hu.ts`, registered the same way. Plans 05 and 07 append to it later. Contents:
   - M1 copy: `hdMissionM1Title` "Hedge a short call through expiry", `hdMissionM1Tagline` "Sold 10 ×
     100C. Stay delta-neutral for 63 days.", `hdMissionM1Brief` "A client bought 10 at-the-money calls
     from you. You keep the premium and the risk. Hold net delta inside the band at every close until
     the options expire."
   - Objective labels for **every** `ObjectiveDef` kind in `engine/desk.types.ts` (plan 01 declares all
     ten, M1 uses three), with variables and a value line each: `hdObjMaxBreaches` "Net Δ inside
     ±{{band}} sh at each close", `hdObjMaxBreachesValue` "{{value}} of {{limit}} breaches allowed",
     `hdObjPnlWithin` "Hedge P&L within ±${{limit}} at expiry", `hdObjCostsBelow` "Spread costs below
     ${{limit}}", `hdObjMaxTrades` "Use at most {{limit}} hedge trades", `hdObjPnlAbove` "Total P&L above
     ${{limit}}", `hdObjGammaLimitFrom` "Keep |Γ| ≤ {{limit}} sh per $1 from D{{fromDay}}",
     `hdObjGapLoss` "Loss on the gap day below ${{limit}}", `hdObjVegaLimitBy` "Vega inside ±${{limit}}
     per vol pt by D{{byDay}}", `hdObjBeatPolicy` "Beat the auto-hedge every {{every}} days",
     `hdObjFlatStock` "No stock position left after settlement".
   - Blotter/event words used by several screens: none here (plan 03 owns event text).
   - Statuses: `hdStatusOnTrack` "On track", `hdStatusAtRisk` "At risk", `hdStatusPass` "Pass",
     `hdStatusFail` "Fail".
4c. **Shared helpers** (owned by this plan, used by 03–06):
   - `src/features/hedging-desk/missionCopy.ts`: `missionTitleKey(id)`, `missionTaglineKey(id)`,
     `missionBriefKey(id)` (template keys cast to `TranslationKey`), `objectiveText(t, def, band)` and
     `objectiveValueText(t, result)` (switch on `def.kind`, with a `never` check so plan 07's new kinds
     fail to compile until handled), `statusKey(status)`.
   - `src/features/hedging-desk/deskFormat.ts`: `num(x, digits)`, `signed(x, digits)` (`+`/`−` with a
     true minus sign, and `-0` shown as `0`), `money(x)` (grouped thousands, 0 digits),
     `toneClass(x)` → `"hdesk-up" | "hdesk-down" | ""`. Pure, no React.
5. **URL schema** `src/features/hedging-desk/hedgingDesk.url.ts`:
   `m: urlString("M1")` (validated with `missionById`, falling back to M1),
   `seed: urlNumber(DEFAULT_SEED, 1, 9999, 0)`, `screen: urlEnum(["desk","missions","debrief"], "desk")`.
6. **Hook** `src/features/hedging-desk/useHedgingDesk.ts` returning one model object:
   - `url`, `setScreen(screen)`, `selectMission(id)` (sets `m`, keeps seed, screen → desk),
     `newPath()` (seed + 1), `restart()` (bumps a local `run` counter that is part of the session key).
   - `mission`, `market = useMemo(buildMarket(mission.market, seed))`.
   - `state` from `useReducer((s, a) => reduceDesk(s, a, market, mission), …, () => startBook(…))`.
     Reset on mission/seed/run change by keying: `HedgingDeskView` renders an inner `<DeskSession
     key={`${m}-${seed}-${run}`} />` that calls the session part of the hook. Split the hook in two if
     that reads cleaner (`useDeskUrl` + `useDeskSession`).
   - Derived: `S = market.spot[state.day]`, `tau`, `greeks = bookGreeks`, `pnl = markToMarket`,
     `objectives = evaluateObjectives`, `quote(id) = quoteInstrument(id, S, tau, market.iv[day], …)`.
   - Ticket state (`useState`): `ticketId` (default `"STOCK"`), `side` (`"buy"`), `qty` (string, `"500"`);
     switching between stock and option resets qty to `"500"` / `"5"`.
   - Actions: `submit()`, `autoHedge()`, `step(days)` dispatching `DeskAction`s.
   - `export type HedgingDeskModel = ReturnType<typeof useHedgingDesk>` (or of the session hook).
7. **Frame components** in `src/features/hedging-desk/components/` (owned by this plan):
   - `DeskHeader.tsx`: amber command bar (`QSBX US Equity`, `HDGS <GO>`, page name, `SIM D{day}/{days} ·
     {n} TD LEFT`) and the quote strip; P&L right-aligned. The ticker `QSBX` is fictional; keep it as a
     constant in the component, not a string key.
   - `ScreenTabs.tsx`: `Tabs` with `className="hdesk-tabs"` for the three screens.
   - `FunctionKeys.tsx`: real `<button>`s with an amber key label (F2 Next day, F3 +5 days, F5 +21 days,
     F4 Auto-hedge, F8 New path, F9 Restart) and the status line. **No global keyboard shortcuts.**
     Buttons disabled when settled except New path / Restart.
   - `DeskScreen.tsx`: the 3-column grid: left (MissionPanel, RiskPanel, Blotter), centre
     (PriceSharesChart full width; NetDeltaChart + BookPnlChart; ScenarioMatrix + RiskProfileChart;
     PositionsTable), right (OrderTicket, OptionChain).
   - `src/features/hedging-desk/HedgingDeskView.tsx`: `<div className="hdesk">` with an `h1` (visually
     styled as part of the command bar is fine, but keep a real `h1`), header, tabs, the active screen,
     function keys on the desk screen.
8. **Stubs** (one file each, `export default function X({ desk }: { desk: HedgingDeskModel })`,
   returning `<Panel title={t("hd…Title")} className="hdesk-panel">{null}</Panel>`):
   03 → `MissionPanel`, `RiskPanel`, `Blotter`, `OrderTicket`, `OptionChain`;
   04 → `PriceSharesChart`, `NetDeltaChart`, `BookPnlChart`, `ScenarioMatrix`, `RiskProfileChart`,
   `PositionsTable`; 05 → `MissionsScreen`; 06 → `DebriefScreen`. Put a one-line comment at the top
   of each stub: `// Stub: filled by docs/plans/hedging-desk/NN.`
9. **Theme** `src/styles/_hedging-desk.scss`, appended as `@use "hedging-desk";` after line 31 of
   `main.scss`. Scope everything under `.hdesk`:
   - Token overrides: `--bg: #000`, `--surface: #0a0a0a`, `--surface-soft: #141414`,
     `--surface-muted: #111`, `--text: #e6e6e6`, `--muted: #9a9a9a`, `--border: #262626`,
     `--primary: #fb8b1e`, `--positive: #4fb3ff`, `--negative: #ff5f57`, `--chart-1: #f2f2f2`,
     `--chart-2: #4fb3ff`, `--chart-3: #fb8b1e`, `--chart-4: #ff5f57`, `--chart-reference: #7a7a7a`,
     `font-family: var(--font-mono)`, `color-scheme: dark`, `background: var(--bg)`. Same values in
     both site themes.
   - Grid: three columns (`minmax(260px, 300px) minmax(0, 1fr) minmax(300px, 340px)`) at ≥ 1280px; two
     (centre + right, left column moved under) at 768–1279px; one column below 768px. 1px hairlines via
     `gap: 1px; background: var(--border)` on the grid with panels on `var(--surface)`.
   - `.hdesk-panel` header: 26px tall, `var(--surface-soft)` band, amber uppercase title, muted aside.
   - Command bar: amber background, black text. Tabs: active tab = amber background + black text (no
     underline, no pill). Function keys: 44px tall, `#111` with a 1px `#333` border.
   - Shared helpers for plans 03–06: `.hdesk-up` / `.hdesk-down` (colour only), `.hdesk-num`
     (`font-variant-numeric: tabular-nums; text-align: right`), `.hdesk-label` (11px muted, letter
     spacing).

## Acceptance criteria
- `/delta-hedging` renders exactly as before; `git diff --stat src/features/delta-hedging` lists only
  the new `DeltaHedgingPages.tsx`.
- `/delta-hedging/desk` shows the frame with 13 empty panels, tabs switch screens and update `?screen=`;
  F2 advances the day shown in the command bar; New path changes `?seed=`.
- `npm run build` pre-renders `dist/delta-hedging/desk/index.html` and `dist/hu/delta-hedging/desk/…`;
  `npm run test:seo` passes.
- Smoke has no problems on the three paths; sidebar shows both sub-items and marks the current one.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
npm run build && npm run test:seo && ls dist/delta-hedging/desk dist/hu/delta-hedging/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging,/delta-hedging/desk,/delta-hedging/desk?screen=missions,/delta-hedging/nope,/hu/delta-hedging/desk"
# expect: no problems; /delta-hedging/nope ends on /delta-hedging
```
Stop the server afterwards and confirm port 4173 is free.

## Pitfalls
- **Hydration.** `useUrlState` returns defaults while hydrating; never read `window`, `localStorage`,
  `Math.random` or the clock during render. The pre-rendered desk is M1, seed 7, day 0.
- **Prerender fails on any thrown error** (`src/entry-prerender.tsx` L8–12), so lazy imports and stubs
  must render without data the server does not have.
- **Session reset.** Changing `m`/`seed` must restart the run; keying the session component is simpler
  and safer than syncing reducer state in an effect.
- **Theme leaks.** Token overrides must sit under `.hdesk` only; the sidebar and top bar keep the site
  theme. Check light mode: the desk stays dark, the shell around it turns light.
- **Sidebar labels.** The module row label stays `navDeltaHedging`; only the two children are new.

## Findings (fill in during execution)
- Baseline / measurements (verified in an isolated worktree: HEAD + plan 01 engine + plan 02 files + fresh stubs,
  because plans 03–07 were mid-edit in the shared tree): `tsc -b` clean; `test:hedging-desk` 33/33 and `test:labs`
  59/59 pass; lint shows only the 12 errors already at HEAD; build pre-renders 214 pages incl. both desk pages;
  `test:seo` 25 pass, 0 fail, 3 todo (HEAD's known baseline). Smoke: no problems on `/delta-hedging`,
  `/delta-hedging/desk`, `?screen=missions`, `/hu/delta-hedging/desk`. F2 twice → `SIM D2/63`; New path →
  `?seed=8` and the clock back to D0. Light site theme: shell light, `.hdesk` stays black with amber. Lab files
  match `b0f23d3` (`git diff --quiet`).
- Deviations and why:
  - Pages are written as `dist/delta-hedging/desk.html` (the build's naming), not `desk/index.html`.
  - `/delta-hedging/nope` redirects correctly but logs React #418 under `vite preview`: preview serves the home
    HTML for unknown paths. Same on `/stochastic-models/nope` at HEAD, so not caused by this plan.
  - Hook split into `useDeskUrl` (URL, mission, market, run counter) + `useDeskSession` (reducer, ticket,
    derived numbers); `HedgingDeskModel = ReturnType<typeof useDeskSession>`. The model also exposes `day`, `S`,
    `iv`, `tau`, `realizedVol`, `trades`, `lastRebalanceDay`, `setTicketId`, `setSide`, `setQty`.
  - `deskFormat.ts` also has `signedMoney` and `pct`; objective value keys exist for every objective kind.
  - The page intro (`hdDesc`) sits beside the screen tabs; the `h1` is the page name inside the command bar.
- Items awaiting owner approval: HU strings added (drafts): `navDeltaHedgingLab` "Labor", `navHedgingDesk`
  "Fedezési pult", `seoDescHedgingDesk`; every key in `src/Language/HedgingDesk.hu.ts` and the plan 02 block
  (M1 copy, `hdObj*`, `hdStatus*`) of `src/Language/HedgingDeskMissions.hu.ts`.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/02-route-shell-theme.md`, and confirm plan 01 is marked done
> (stop and report if not). Implement plan 02: the `DeltaHedgingPages` router and registry `subNav`, SEO
> and nav strings, the `HedgingDesk` i18n table, URL schema and `useHedgingDesk` hook, the frame
> components, the 13 panel stubs, and the scoped `.hdesk` theme. Run the verification block and make it
> pass. Fill in Findings (list every HU string), set plan 02 to `done` in the README table, and
> summarise. Do not edit the existing lab files.
