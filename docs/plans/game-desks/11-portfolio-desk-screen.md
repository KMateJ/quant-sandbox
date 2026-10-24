# 11 — Portfolio desk route, frame and desk screen

Status: done (2026-10-24) · Depends on: 02, 10 · Suggested model: Sonnet · Est. size: M

## Why
Puts the portfolio manager desk on screen at `/portfolio-lab/desk`: NAV and drawdown, the frontier under
today's risk model, correlation drift, positions, rebalance ticket, monthly return heat strip, risk panel
and events, plus the stubs plan 12 fills.

## Current state (verified 2026-10-23, commit `73f67d7`)
- Registry `src/modules/registry.ts` L272–282: `id: "portfolio-lab"`, `path: "/portfolio-lab"`, beta, no
  `subNav`, `Component: lazy(() => import("../features/portfolio-lab/PortfolioLabView"))`.
  `PortfolioUniverseProvider` wraps the whole app (`src/App.tsx`); the desk must not read or write it.
- Sub-page pattern: `src/features/delta-hedging/DeltaHedgingPages.tsx`, registry L174–189, `src/App.tsx`
  `${path}/*`, `src/seo.routes.ts` (description 50–160 chars).
- Engine (plan 10) `src/features/portfolio-desk/engine/`: `PORTFOLIO_MISSIONS`, `portfolioMissionById`,
  `monthlyReturns`, `ewmaCov`, `exAnteVol`, `riskShares`, `exAnteSharpe`, `trackingError`, `realizedVol`,
  `frontier`, `corrChange`, `startPortfolio`, `reducePortfolio`, `evaluatePortfolio`, `replayPortfolio`;
  `riskParityWeights`, `scaleToVol` in `src/lib/finance/portfolio.ts`.
- Kit (plans 01–02): frame components, `MissionPanel`, `EventLog`, `BandMeter`, `ScenarioGrid` (for the
  correlation grid), `SeriesKey`, `useGameHelp`, `HelpSheet`, `useProgress`, `gameFormat` (`heatCell`).
- Charts: `LineChart`, `ChartContainer`. Design: canvas board `PortfolioDesk.dc.html`.

## Goal
1. `/portfolio-lab/desk` (and `/hu/…`) renders the desk; `/portfolio-lab` unchanged; sidebar shows Lab and Portfolio desk.
2. Panels and keys work for every mission (`?m=P1…P5`). 3. Stubs for plan 12.

## Non-goals
- Missions screen, debrief, help content, demo (plan 12). No edits to portfolio-lab files except the new router.

## Constraints
- README §4 recipe: folder `src/features/portfolio-desk/`, prefix `pmgr`, ids `pmgr-*`, partial
  `src/styles/_portfolio-desk.scss` under `.pmgr`, table `src/Language/PortfolioDesk.ts` (+ `.hu.ts`).

## Steps
1. Router `src/features/portfolio-lab/PortfolioLabPages.tsx` (empty → `PortfolioLabView`, `"desk"` → lazy
   `../portfolio-desk/PortfolioDeskView`, else `<Navigate to="/portfolio-lab" replace />`).
2. Registry (portfolio-lab entry only): `Component` → `PortfolioLabPages`; `subNav: [{ id: "lab", labelKey: "navPortfolioLabLab", to: "/portfolio-lab" }, { id: "desk", labelKey: "navPortfolioDesk", descKey: "seoDescPortfolioDesk", seoTitle: "Portfolio Manager Desk: Volatility Target Game", to: "/portfolio-lab/desk" }]`.
3. Copy: nav labels in `Home.ts`/`.hu.ts`; `seoDescPortfolioDesk` in `Seo.ts`/`.hu.ts`.
4. URL `portfolioDesk.url.ts`: `m` (default `"P1"`), `seed` (`urlNumber(5, 1, 9999, 0)`), `screen`, `demo`.
5. Progress `portfolioProgress.ts`: `PORTFOLIO_PROGRESS = createProgressStore("portfolio", higherIsBetter)`
   (best = final NAV minus 60/40 NAV).
6. Hooks `usePortfolioDesk.ts`: `usePortfolioUrl()` (memo `monthlyReturns` per mission + seed) and
   `usePortfolioSession(url)` (reducer; derived `S = ewmaCov(…, month)`, `exAnte`, `shares`, `sharpe`, `te`,
   `realized`, `objectives`; ticket `targets: string[]` (5, %), `setTarget`, `fillScale`, `fillParity`,
   `fillBench`, `submit`, `scaleNow`, `parityNow`, `step(n)`, `dispatch`). Export `type PortfolioDeskModel`.
7. View `PortfolioDeskView.tsx`: kit frame; `CommandBar` (ticker `QSMA Multi-Asset Fund`, code `PMGR <GO>`,
   clock "Month {m}/{months} · {left} months left"); `QuoteStrip` `pmgr-quotes` (NAV, month return, since
   start, 60/40, realised vol, ex-ante vol, drawdown, vs 60/40); tabs + intro; `FunctionKeyBar` `pmgr-keys`
   (F2 Next month, F3 +6 months, F4 Scale to target vol, F6 Risk parity at target, F8, F9); Sandbox link;
   `HelpSheet` with stub tabs.
8. Panels (`components/`):
   - Left: `MissionPanel` `pmgr-mission`; `PortfolioRiskPanel` `pmgr-risk` (ex-ante vol with on target / too
     hot / too cold, `BandMeter` 0–25% band 8.5–11.5, risk-share bars per asset, ex-ante Sharpe, tracking
     error vs 60/40, max drawdown, costs in bp, share misses for P2); `EventLog` `pmgr-events`.
   - Centre: `NavChart` `pmgr-nav` (fund vs 60/40, future months shaded, drawdown strip below with the
     mission's drawdown limit line); `DeskPair` of `FrontierChart` `pmgr-frontier` (frontier under today's
     EWMA model, assets as squares, fund and 60/40 dots, vertical target line) and `CorrelationGrid`
     `pmgr-corr` (kit `ScenarioGrid`: EWMA correlation as text, tint = change vs calm); `PositionsTable`
     `pmgr-positions` (weight, value, month return, since M0, EWMA vol vs long-run, risk share; cash row).
   - Right: `RebalanceTicket` `pmgr-ticket` (target % per asset with labels, cash = rest, preset buttons
     Scale to 10% / Risk parity / 60/40, preview ex-ante vol after, Sharpe after, turnover, cost; submit
     `pmgr-submit`); `ReturnHeat` `pmgr-heat` (last 12 months per asset + fund, tint by `heatCell` ±8%,
     `title` with the value, oldest left).
9. Stubs for plan 12 (first line `// Stub: filled by docs/plans/game-desks/12.`): `components/PortfolioMissionsScreen.tsx`,
   `PortfolioDebriefScreen.tsx`, `help/PortfolioNextMove.tsx`, `PortfolioWhatIf.tsx`, `PortfolioGuide.tsx`,
   `demo/demo.script.ts` (`buildPortfolioDemo` → `[]`).
10. Styles `_portfolio-desk.scss`, copy table `PortfolioDesk.ts`/`.hu.ts` (asset class names: Global equity,
    EM equity, Government bonds, Credit, Gold, Cash), tests `scripts/portfolio-desk-screen.test.mjs`
    (`eventText` exhaustive, EN/HU parity, HU ≠ EN).

## Acceptance criteria
- `/portfolio-lab` and its shared universe unchanged; `/portfolio-lab/desk?m=P1`: F4 then F3 × 6 reaches
  settlement with no console errors; ticket blocks targets over 100%.
- Sidebar lists Lab and Portfolio desk; build pre-renders the desk paths; `test:seo` passes; smoke and
  layout audit clean; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:portfolio-desk && npm run test:portfolio-labs && npm run test:game-kit
npm run build && npm run test:seo && ls dist/portfolio-lab/desk dist/hu/portfolio-lab/desk
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/portfolio-lab,/portfolio-lab/desk,/portfolio-lab/desk?m=P3,/portfolio-lab/nope,/hu/portfolio-lab/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/portfolio-lab/desk"
```
Stop the server; confirm the port is free.

## Pitfalls
- **Shared universe:** importing `usePortfolioUniverse` would couple the desk to the lab's editable assets.
- **Returns memo:** compute `monthlyReturns` once per mission + seed; EWMA per month is cheap but memoise.
- **Frontier domain:** clamp the chart to 0–30% vol and 0–12% return; the unconstrained frontier can run off.

## Findings (fill in during execution)
- Files: `src/features/portfolio-lab/PortfolioLabPages.tsx`; registry `portfolio-lab` gains `subNav` + router;
  `src/features/portfolio-desk/` — `PortfolioDeskView.tsx`, `portfolioDesk.url.ts`, `portfolioProgress.ts`,
  `usePortfolioDesk.ts` (`usePortfolioUrl`, `usePortfolioSession`, `PortfolioDeskModel`), `usePortfolioKeys.ts`,
  pure helpers `ticket.math.ts`, `positions.math.ts`, `eventText.ts`, `objectiveViews.ts`, `quoteCells.ts`,
  `portfolioFormat.ts` (`spct`, `navIndex`, `ASSET_CODES`, `FUND_SIZE`), `portfolioCopy.ts` (typed key maps:
  `ASSET_KEY`, `missionKeys`, `SCREEN_KEY`); components `PortfolioDeskScreen`, `PortfolioRiskPanel`, `NavChart`,
  `FrontierChart`, `CorrelationGrid`, `PositionsTable`, `RebalanceTicket`, `ReturnHeat` (largest .tsx 84 lines);
  stubs for plan 12; `_portfolio-desk.scss`; `PortfolioDesk.ts`/`.hu.ts`; `scripts/portfolio-desk-screen.test.mjs`.
- For plan 12: mission titles/briefs are already in the table (`pmgrMs_<id>_title|_brief`, via `missionKeys`),
  objective labels via `objectiveView(result, t)`. "Watch the playthrough" is hidden while `buildPortfolioDemo()`
  returns `[]` (same as ALM). `usePortfolioUrl` has `startDemo`/`exitDemo` but no demo mission/seed pinning yet.
  Progress is recorded once per settled run (not in demo), best = NAV − 60/40 NAV.
- Deviations: NAV chart marks "now" with a dashed vertical line instead of shading future months (`LineChart` has no
  bands); frontier assets are round markers (`ScatterChart` has no square marker). Position values use a notional
  100m fund (`FUND_SIZE`). Ticket blanks count as 0%; negatives or junk block the submit like totals over 100%.
- Verification: `tsc -b` clean for this plan (rates-desk had an unrelated unused-variable error at the time);
  eslint clean on all plan files; `test:portfolio-desk` 20/20, `test:portfolio-labs` 26/26, `test:game-kit` green;
  build green; `dist/portfolio-lab/desk.html` and `dist/hu/portfolio-lab/desk.html` pre-rendered and in the sitemap
  (pages are emitted as `desk.html`, not a folder). Smoke clean on `/portfolio-lab`, `/portfolio-lab/desk`, `?m=P3`,
  `/portfolio-lab/nope` (redirects to the lab), `/hu/portfolio-lab/desk`. Acceptance: P1 F4 then F3×6 reaches
  "Month 36/36", END event, submit locked; a 90% equity target (total 135%) shows the error and blocks submit.
- `test:seo`: desk pages pass; failures are `/sandbox` (plan 16 in progress) and the pack-wide initial-JS budget
  (991,763 B > 955,000 B; this plan's EN table is ~4.7 KB) already flagged by 05/08 for plan 18.
- Layout audit (preview on port 4183): only overlaps with the sticky function-key footer (same as the hedging, ALM
  and rates desks) and the site-wide `a.brand` tap target; no overflow or clipping. The run timed out at 390 px dark HU
  after covering every width in light and 360/390 EN dark.
- Items awaiting owner approval: HU strings added: all of `src/Language/PortfolioDesk.hu.ts` (desk copy, asset class
  names "Globális részvény", "Feltörekvő piaci részvény", "Állampapír", "Vállalati kötvény", "Arany", "Készpénz";
  event tags INDULÁS/ÚJRASÚLY/MOZGÁS/VISSZAESÉS/KOCKÁZAT/VÉGE; "Nettó eszközérték" for NAV; "Visszaesés" for
  drawdown), plus `navPortfolioLabLab` "Labor", `navPortfolioDesk` "Portfólió desk", `seoDescPortfolioDesk`.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/11-portfolio-desk-screen.md`; confirm plans 02 and 10 are
> done. Implement plan 11: `/portfolio-lab/desk` route and registry `subNav`, URL/progress/hooks, kit view,
> panels, stubs for plan 12, styles, copy and tests. Run the verification block, fill in Findings, append
> DONE to LOG.md, set plan 11 to `done`, and summarise. Do not touch the portfolio-lab universe or views.
