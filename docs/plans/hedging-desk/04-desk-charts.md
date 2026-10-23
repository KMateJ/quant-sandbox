# 04 — Desk centre: charts, scenario matrix, risk profile, positions

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
The centre column is what makes the desk a terminal rather than a form: the one price path as it
unfolds, the shares held against the shares needed, net delta against its band, P&L against doing
nothing, what an instant shock would do, and the book's payoff shape. Charts are the visually dominant
part of the page.

## Current state (verified 2026-10-23, after plans 01–02)
- Stubs to fill (`({ desk }: { desk: HedgingDeskModel })`): `src/features/hedging-desk/components/`
  `PriceSharesChart.tsx`, `NetDeltaChart.tsx`, `BookPnlChart.tsx`, `ScenarioMatrix.tsx`,
  `RiskProfileChart.tsx`, `PositionsTable.tsx`. Plan 02's `DeskScreen.tsx` places them: price/shares full
  width; net delta + P&L side by side; scenario matrix + risk profile side by side; positions below.
- Model: `mission`, `market` (`spot[]`, `iv[]`, `days`, `strikes`), `state` (`day`, `positions`,
  `cash`, `fills[]`, `history: DayRecord[]` with `openDelta`, `closeDelta`, `sharesHeld`,
  `sharesNeeded`, `pnl`, `breach`), `S`, `tau`, `greeks`, `pnl`, `quote(id)`.
- Engine (plan 01): `scenarioGrid(state, market, spotShocks, volShifts)`,
  `riskProfile(state, market, points, span)`, `positionValue`, `quoteInstrument`, `tauAt`,
  `CONTRACT_MULT`, `startBook`.
- Charts: `LineChart` from `src/components/charts` (props: `data`, `xKey`, `series` (`key`, `label`,
  `color`, `strokeWidth`, `dash`), `xDomain`, `yDomain`, `referenceLines` (`axis`, `value`, `color`,
  `dash`), `curve: "linear"`, `legend`, `valueFormat`, `xFormat`, `yFormat`, `tooltipLabel`,
  `layer(frame)`). `PlotFrame` (in `chart.types.ts`) gives the scales for overlays. Example usage:
  `src/features/delta-hedging/components/HedgePathCharts.tsx` (read-only reference, do not edit).
  `ChartContainer` (`title`, `actions`, `height`, `className`) from `src/components/layout`.
- Inside `.hdesk` plan 02 maps `--chart-1` white, `--chart-2` blue, `--chart-3` amber, `--chart-4` red,
  `--chart-reference` grey, so `SERIES_PALETTE[i]` is already on-theme.
- Design reference: canvas board `Main.dc.html`, centre column.

## Goal
1. **PriceSharesChart** (two stacked `LineChart`s sharing the x domain `[0, days]`):
   - Top: the **single realized price path** from day 0 to today only (no cone, no simulated paths);
     x axis always runs to `days` so the future stays empty; strike reference line(s) for the mission's
     opening option strikes (dashed grey); a "today" vertical reference (amber); fill markers drawn in
     `layer` as 6px squares at `(fill.day, spot[fill.day])`, blue for buys and red for sells (manual and
     auto fills; skip `client`).
   - Bottom strip (~90px): shares held (blue, step line) against shares needed for zero delta (amber,
     dashed, step line), from `history` plus today's live point.
2. **NetDeltaChart**: net delta per day as open → close steps plus today's live value; the ±band region
   shaded in `layer` (blue tint), zero line, breach markers (red squares at breaching closes). Symmetric
   y domain `±max(400, 1.15·max|δ|)`.
3. **BookPnlChart**: hedged book P&L (history `pnl` + live `pnl`, white) against the **unhedged** P&L of
   the opening trades alone on the same path (red dashed), zero reference line.
4. **ScenarioMatrix**: rows IV +5 / ±0 / −5 vol points, columns spot −10 / −5 / −2 / 0 / +2 / +5 / +10 %;
   cells show signed $ with a background tint whose strength scales with |value| (blue gains, red
   losses, alpha 0.08–0.48); the 0/0 cell is neutral. Caption: revalued at Black–Scholes, positions
   unchanged. A real `<table>` with `<th scope>` headers.
5. **RiskProfileChart**: book P&L across spot ±20% today (white) and at expiry (amber dashed), zero line
   and a spot marker.
6. **PositionsTable**: instrument, position (shares / contracts, coloured by sign), mid, market value, Δ
   (shares), Γ, vega, Θ/day, plus a bold amber BOOK total row. Inside a horizontally scrolling box on
   narrow screens. Reuse `DataTable` from `src/components/ui` if its API fits; otherwise a plain
   `<table>`.

## Non-goals
- No cone of simulated futures (the owner asked for a single trajectory).
- Side panels (03), missions/debrief screens (05/06). No engine edits: new pure helpers go in a new file
  this plan owns, `src/features/hedging-desk/engine/series.math.ts`.

## Constraints
- `.tsx` ≤ ~150 lines; the price/shares chart may need `PriceSharesChart.tsx` + `FillMarkers.tsx`.
- Strings: new table `src/Language/HedgingDeskCharts.ts` (`hedgingDeskChartsEn`) + `.hu.ts`, keys
  prefixed `hdChart`, registered additively in `index.en.ts` / `index.hu.ts`.
- Styles: new partial `src/styles/_hedging-desk-charts.scss`, `@use "hedging-desk-charts";` appended
  after the other `hedging-desk*` lines in `main.scss`; every rule under `.hdesk`.
- Colours only through `SERIES_PALETTE` / `SERIES_ROLE` / `var(--…)`; no hex in `.tsx`.
- Chart heights: price ≈ `clamp(240px, 34vh, 340px)`, shares strip 90px, half-width charts 180px.

## Steps
1. `engine/series.math.ts` (pure, `///` docs):
   - `priceSeries(market, day) → { day, S }[]` (days 0..day).
   - `deltaSteps(history, openDelta, liveDelta, day) → { day, delta }[]` (open then close for each
     record, then today's open and live value).
   - `sharesSteps(history, liveHeld, liveNeeded, day) → { day, held, needed }[]` as step rows (repeat the
     previous value at the same x before each change, like `heldDeltaStepRows` in the lab's math file).
   - `unhedgedPnl(mission, market, day) → { day, pnl }[]`: value of `startBook` with only the opening
     trades, marked each day (no stock trades, cash accrual as in the engine).
   - `matrixCells(grid, max) → { value, alpha, tone }[][]`.
   Tests in a new `scripts/hedging-desk-charts.test.mjs` (via `importSrc`): lengths, step shape,
   `unhedgedPnl` at day 0 equals `markToMarket(startBook)`, alpha bounds.
2. Fill the six stubs as in Goal. Memoise series with `useMemo` keyed on `state` and `market`.
3. Tooltip labels: `D{day}`; value formats from `deskFormat.ts`.

## Acceptance criteria
- At day 0 the price chart shows one point and an empty future; after F3 (+5 days) it shows six
  points, and the x axis still ends at the expiry day.
- After a manual buy of 500 shares on day 0 and F2, the shares strip shows held = 500 from day 0, and a
  blue marker sits on the price path at day 0.
- With no stock trades for 5 days, the net delta chart shows red breach markers on each close outside
  the band, and their count equals the risk panel's breach count (or `state.breaches` if plan 03 is not
  done yet).
- Scenario centre cell reads 0; risk profile "today" curve crosses the spot marker at the book P&L.
- The layout audit reports no overlaps on `/delta-hedging/desk` at 360/768/1280/1536.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk,/hu/delta-hedging/desk"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/delta-hedging/desk"
```
Use `cdp-smoke.mjs --after` (see `--help`) to click "+5 days" and confirm no console errors. Stop the
server and confirm port 4173 is free.

## Pitfalls
- **visx needs a sized parent.** `LineChart` fills its parent; give each chart wrapper an explicit height
  in SCSS or it renders nothing (`ParentSize` reports 0).
- **One-point series.** At day 0 the price series has one point; make sure the chart does not divide by a
  zero-width y domain: pass a `yDomain` padded to at least ±5% of spot.
- **Step lines** need duplicated x values; with `curve="linear"` that draws vertical jumps correctly, a
  smooth curve does not.
- **Fills on the same day** stack; draw markers once per (day, side).
- **Matrix tint contrast:** text stays `var(--text)` (near-white) on every tint; keep alpha ≤ 0.48 so
  contrast stays ≥ 4.5:1.

## Findings (fill in during execution)
- Baseline / measurements: `test:hedging-desk` 40/40 (5 new in `scripts/hedging-desk-charts.test.mjs`), `test:labs` 59/59,
  `test:seo` 25/25, `tsc -b` clean, lab files unchanged vs `b0f23d3`. Smoke clean on `/delta-hedging`,
  `/delta-hedging/desk`, `/hu/delta-hedging/desk` (and after clicking +5 days). Layout audit: no chart defects
  at 360–1536 EN/HU; remaining failures are not plan 04 files (tap targets at 360/390 in ticket/chain/tabs;
  HU 768 overlap of `.hdesk-fkey-label` in FunctionKeys).
- Deviations and why: panel titles reuse plan 02's `hdPriceSharesTitle`… keys (DRY), so `HedgingDeskCharts`
  holds only series/column/caption strings. Shares strip is 100px (not 90) with its key moved into the panel
  header (`SeriesKey.tsx`), because the chart legend squeezed the plot and ticks collided at 768. Money/delta
  y ticks use `compactTick` (`−15k`) so they fit the axis gutter. Scenario caption is a `<p>` under the
  table linked by `aria-describedby` (a `<caption>` widened past the panel and overlapped the chain). Chart
  pairs stack to one column at 768–1199px (override in `_hedging-desk-charts.scss`) so x ticks stay readable.
  `npm run lint` has pre-existing errors in unrelated files (AppShell, i18n, theme, heston…); plan 04 files lint clean.
- Items awaiting owner approval: HU strings added (draft) in `src/Language/HedgingDeskCharts.hu.ts`: all 22
  `hdChart*` keys (hdChartSpot … hdChartDay).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/04-desk-charts.md`, and confirm plans 01 and 02 are marked
> done (stop and report if not). Implement plan 04: add `engine/series.math.ts` with its tests, fill the
> PriceSharesChart, NetDeltaChart, BookPnlChart, ScenarioMatrix, RiskProfileChart and PositionsTable
> stubs using `LineChart`/`ChartContainer`, plus the `HedgingDeskCharts` i18n table and the
> `_hedging-desk-charts.scss` partial. The price chart shows a single realized path only. Run the
> verification block and make it pass. Fill in Findings, set plan 04 to `done` in the README table, and
> summarise.
