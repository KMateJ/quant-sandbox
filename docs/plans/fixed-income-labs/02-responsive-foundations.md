# 02 — Responsive foundations

Status: done (2026-10-19) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Most FI layout defects come from shared code: width-blind axis ticks, in-chart labels with no collision
handling, ad-hoc breakpoints and a sidebar that truncates module names. Fixing these once fixes every lab
(DRY) and leaves plan 03 only lab-specific work.

## Current state (verified 2026-10-19)
- Axis ticks: `src/components/charts/LineChartInner.tsx:164` `numTicks={isMobile ? 5 : 8}` (x) and `:172`
  `numTicks={7}` (y); `src/components/charts/ScatterChartInner.tsx:244` same `isMobile ? 5 : 8` for x,
  `yNumTicks` for y. `isMobile` is a viewport media query, so a 300 px-wide chart in a desktop two-column
  row still gets 8 ticks → collisions (treasury cash-flow chart: `0.0 1.0 … 9.0` overlap at 360 px).
- Edge ticks: the duration chart's last x tick `+200` is clipped at the SVG right edge (x-axis label
  `textAnchor: "middle"` at the last tick; right margin too small).
- In-chart labels: duration `SensitivityChart` draws "Duration: tangent slope" text over the curves at
  360 px. Labels on `DragHandles` were already moved left of the knob for the same reason (LABS_PLAN log).
- Breakpoints in use: 540 (`_treasury-futures.scss:65`), 560 (`duration.scss:270`), 640 (`layout.scss:1434`,
  `mobile.scss:14`, `_primitives.scss:379,992`, `yieldcurve.scss:264,623`), 680 (`layout.scss:1047`),
  760 (`bond.scss:117`), 900/901 (`layout.scss:496,1391`, `_primitives.scss:79,88`, `duration.scss:264`,
  `yieldcurve.scss:258`, `_treasury-futures.scss:60`), 1100 (`layout.scss:1362`, `yieldcurve.scss:252`),
  360 (`mobile.scss:292`). JS side: `src/components/useMediaQuery.ts`.
- Sidebar: `src/components/layout/SideModuleRow.tsx` + `Sidebar.tsx`, styles in `src/styles/layout.scss` /
  `_shell.scss`. At 1280 px FI names are truncated with an ellipsis ("Duration & Co…", "Treasury Futur…")
  because the BETA status chip takes ~40 px.
- Chart sizing: `src/components/charts/useMeasuredHeight.ts`, `ChartContainer` in
  `src/components/layout/ChartContainer.tsx`; check whether the Inner components already receive `width`
  (they do via visx `ParentSize`/props — confirm by reading the file head).

## Goal
1. A tick-count helper used by every shared chart: ticks depend on the **inner plot width/height**, not on
   the viewport.
2. First/last x tick labels never clipped (anchor `start`/`end` at the edges, or margin grows).
3. A tiny collision helper for in-chart text labels, used by the duration chart label and available to
   other charts.
4. One breakpoint scale as SCSS mixins, used by every **FI** stylesheet (others may migrate later).
5. Sidebar shows full FI module names at ≥ 1024 px.

## Non-goals
Migrating non-FI stylesheets to the mixins; restyling charts; changing data or math.

## Constraints
Pure helpers in `src/components/charts/*.logic.ts` (no React) with `///` docs; unit tests in
`scripts/*.test.mjs` using `scripts/lib/load-ts.mjs` like `scripts/drag-handles.test.mjs`. No left-border
accents, no pills.

## Steps
1. `src/components/charts/ticks.logic.ts`:
   ```ts
   /// Number of axis ticks that fit `length` px with labels of ~`labelPx` px plus spacing.
   export function tickCount(length: number, labelPx = 44, min = 2, max = 10): number
   /// Picks `textAnchor` per tick so the first/last labels stay inside [0, length].
   export function edgeAnchor(pos: number, length: number, halfLabelPx = 18): "start" | "middle" | "end"
   ```
   Use in `LineChartInner.tsx` and `ScatterChartInner.tsx` (and `HistogramInner`, `WaterfallChartInner` if
   they set `numTicks` the same way): x → `tickCount(innerW, 48)`, y → `tickCount(innerH, 28)`; x tick
   label props use `edgeAnchor(xScale(v), innerW)`. Keep explicit `tickValues` props winning when passed.
2. `src/components/charts/labels.logic.ts`:
   ```ts
   export type LabelBox = { id: string; x: number; y: number; w: number; h: number; priority: number };
   /// Greedy placement: keeps higher-priority labels, nudges others vertically (±h steps, max 3) inside
   /// [0,W]×[0,H], hides a label that still collides. Returns positions and a `hidden` set.
   export function placeLabels(boxes: LabelBox[], W: number, H: number, obstacles?: LabelBox[]): …
   ```
   Estimate text width as `chars × fontSize × 0.6`. Apply it to the duration `SensitivityChart` label(s)
   (`src/features/duration-convexity/components/SensitivityChart.tsx`), treating the curve points near the
   label as obstacles (sample the series at the label's x range). If a label is hidden, its meaning must
   still be in the legend (it already is).
3. `src/styles/_breakpoints.scss`:
   ```scss
   $bp-phone: 640px; $bp-tablet: 900px; $bp-desktop: 1100px;
   @mixin phone { @media (max-width: $bp-phone) { @content; } }
   @mixin below-tablet { @media (max-width: $bp-tablet) { @content; } }
   @mixin below-desktop { @media (max-width: $bp-desktop) { @content; } }
   @mixin tiny { @media (max-width: 360px) { @content; } }
   ```
   `@use` it in `bond.scss` (760 → below-tablet), `duration.scss` (900, 560 → below-tablet, phone),
   `yieldcurve.scss`, `_treasury-futures.scss` (540 → phone). Re-run the audit after each file: snapping a
   breakpoint can change layout at 541–640 px, so audit with `--widths 360,560,640,700,900,1100,1280`.
   Mirror the values in `useMediaQuery` callers only if an FI component hard-codes a px query (grep FI
   features for `useMediaQuery(`).
4. Sidebar: give names priority — the status chip becomes a small text badge (no capsule, moderate
   radius ≤ 4px) placed after the name and allowed to wrap below, or hidden under 1100 px with the status
   kept in `title`/aria. Pick whichever passes the audit with no truncation at 1024/1280/1536 and keep the
   sidebar width unchanged (EXPANSION_PLAN: 180–220 px). Record the choice in Findings.
5. Tests: `scripts/chart-layout.test.mjs` covering `tickCount` (monotonic, bounds) and `placeLabels` (two
   colliding labels → one nudged; impossible case → lower priority hidden). Add
   `"test:chart-layout": "node --test scripts/chart-layout.test.mjs"` to `package.json`.

## Acceptance criteria
- Audit on FI: zero `svg-text-collision` and `svg-text-clipped` failures caused by axes at all widths.
- Duration 360 px: the tangent label no longer overlaps curves (audit + screenshot).
- Sidebar: no ellipsis on FI names at 1024+ (audit `text-clipped` would not catch ellipsis — check the
  screenshots and state it in Findings).
- `test:chart-layout` passes; existing `test:*` pass; non-FI pages load without console errors
  (cdp-smoke on `/black-scholes,/capm,/npv-irr` — shared charts changed).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:chart-layout && npm run test:drag-handles && npm run test:labs
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/black-scholes,/capm,/npv-irr,/bond-pricing"
```

## Pitfalls
- Derivatives labs are hands-off for *feature* changes, but they use the shared charts; the tick change is
  allowed only if it doesn't alter their look beyond tick density. Check black-scholes screenshots.
- Charts that pass fixed `xDomain` for dragging must keep it; only tick count changes.
- `.tsx` files you touch must stay ≤ ~150 lines; `LineChartInner.tsx` may already be near it — extract the
  axis block into `ChartAxes.tsx` if needed.

## Findings (fill in during execution)
- Audit before / after (FI group, private build, own Chrome port, 3.5 s settle):
  - **Before** (plan 01 baseline): `svg-text-collision` at 360/390 on bond-pricing and yield-curve,
    `svg-text-clipped` on duration (360–1536) and bond-pricing/yield-curve (768, 1280, 1536).
  - **After**: **0** `svg-text-collision` and **0** `svg-text-clipped` on all four FI pages and the
    new `/immunization`, at 360, 390, 560, 640, 700, 768, 900, 1024, 1100, 1200, 1280, 1536 px, light and
    dark, EN and HU (240 runs, then 48 re-runs after the last two tweaks).
  - Still failing, **not axis defects** (left for plan 03 / 10):
    - `left-border-accent` on `/yield-curve` (`.yc-quote-row.is-selected`), all widths — plan 03.
    - Page-level overflow / `offscreen` at **700 and 768 px**: `.topnav-controls` ends at x=745 (EN) /
      809 (HU), so the top bar is wider than the viewport between the phone and tablet breakpoints. Global
      shell, present on every FI page; needs its own fix (suggest plan 03 or 10).
    - `/hu/bond-pricing` at 360/390 (and 700/768): the cash-flow / price–yield / pull-to-par tab strip in
      `.chart-container-actions` is wider than the viewport in Hungarian (`PénzáramokÁr–hozamÁrkonv…`).
- Sidebar choice: the beta **text badge became a 6 px status dot** (no capsule) with the status in the
  row's `title` and an `aria-label`; "planned" keeps its text badge. Sidebar width unchanged (220 px).
  Measured with a probe: "Duration & Convexity" had 104–106 px of room for 122–131 px of text; after the
  change no FI module name is truncated at 1024, 1280 or 1536 px (EN and HU). What still ellipsises are
  long guide-lesson titles inside sub-menus (they keep `title`). The `.side-row.active::before` bar
  (a 3 px left accent) is shared by the whole sidebar and **was not touched**; the owner forbids left
  accents, so it needs a decision.
- Deviations:
  - **Collision handling is opt-in**: `ScatterChart` got `avoidLabelCollisions` (default off) so no
    derivatives chart changes; only the duration chart sets it. Logic: `annotations.logic.ts` (curve
    samples as obstacles) + `labels.logic.ts` (`placeLabels` tries vertical nudges, then sideways shifts,
    then hides); rendering in `ScatterAnnotations.tsx`.
  - Extra helper `thinTicks` (`ticks.logic.ts`): explicit tick lists (yield-curve maturities) and the bond
    timeline's period labels are thinned by real label width, allowing for inward-anchored edge labels
    (this was the cause of the last "3M x 6M" overlap). `bond TimelineChart` no longer uses the
    width-blind `labelEvery`.
  - New shared `ChartAxes.tsx` (used by `LineChartInner`, `ScatterChartInner`); `HistogramInner` and
    `WaterfallChartInner` use `tickCount` directly. `LineChartInner` 216→200 lines and
    `ScatterChartInner` 282→266 lines: both are still over the ~150-line guide and need a further split.
  - Breakpoints: FI stylesheets use the mixins in `src/styles/_breakpoints.scss`
    (640 / 900 / 1100). I **added a fourth step, `below-wide` (1200 px)**, and use it to stack the duration
    lab's chart above its result panel: between 901 and ~1200 px the chart was squeezed to ~160 px
    (it clipped its own x-axis title and pushed the Pin/Formulas buttons out of its panel).
  - Scatter charts with a y-axis title now reserve 26 px (was 14) so the rotated title never touches
    the tick labels; this also affects non-FI charts that set `yLabel`, only by a few px of left margin.
  - **Measurement method**: the shared `.layout-audit` output and the default Chrome port (9340) are used
    by other sessions at the same time, which mixed pages and produced phantom defects. I built into
    private folders (`vite build --outDir`), served them with `vite preview --outDir` on my own port and
    passed `--port` to the audit. The default 2.5 s settle also catches charts mid-render; 3.5–4 s was
    stable. Worth putting in plan 01's notes.
  - Non-FI check: `/black-scholes`, `/capm`, `/npv-irr` load with no console errors.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/02-responsive-foundations.md`; confirm plan 01 is done
> (stop if not). Implement plan 02: width-aware tick and edge-anchor helpers in the shared charts, the label
> placement helper applied to the duration chart, SCSS breakpoint mixins in the FI stylesheets, and the
> sidebar name fix, with unit tests. Run the verification commands, record before/after audit counts in
> Findings, set plan 02 to done in the README table, and summarise.
