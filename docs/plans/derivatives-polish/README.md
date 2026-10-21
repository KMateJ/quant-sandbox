# Derivatives polish plans

Goal: the five Derivatives labs (`/payoff`, `/binomial`, `/black-scholes`, `/heston`, `/delta-hedging`)
are **pixel-clean, theme-safe and rule-compliant without changing what they do**: no overlapping
labels, no hard-coded colours or English, no dead controls, square private-bank styling, and the
layout audit green at every width, both themes, EN and HU.

This is a **polish pack, not a redesign.** The owner reviewed the "Derivatives v2" boards on the design
canvas (Black–Scholes, Payoff Lab, Binomial with draggable numbers, node stepping, strike tabs) and
said they are not happy with them and do not want much change. Nothing from those boards is
implemented here. The labs keep their current controls, charts and interactions.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model (Sonnet
recommended) without this README's chat. Each plan ends with a ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-21** (commit `a750950`). If the code has moved on, the executor re-checks its
plan's "Current state" before editing.

## 1. Current state

| Piece | File | What it does |
|---|---|---|
| Module registry | `src/modules/registry.ts` L126–186 | 5 derivatives modules; `delta-hedging` is `status: "beta"`, the rest `live` |
| Payoff lab | `src/features/payoff-lab/` | Two tabs (`?lab=builder` / `replicate`) in `PayofView.tsx`; builder = `StrategyLab.tsx` + `usePayoffView.ts` (URL state via `payoff.url.ts`) + `Components/PayoffBuilder.tsx`, `PayoffChart.tsx`, `PayoffSummary.tsx`, `PayoffDock.tsx` (**351 lines**, phone editor); legacy `SectionCard` + `.view-layout` grid |
| Binomial | `src/features/binomial/` | `BinomialView.tsx` + `useBinomialView.ts` (hand-rolled URL parsing); `components/BinomialLattice.tsx` draws the SVG tree with **hard-coded dark colours**; legacy `SectionCard` + `.view-layout` |
| Black–Scholes | `src/features/black-scholes/` | `Workspace` + `Panel` + `ChartContainer`; `useBlackScholesView.ts` (hand-rolled URL parsing, fixed y-domains); 2D curves or lazy 3D surface |
| Heston | `src/features/heston/` | `Workspace` + `Panel`; **13 sliders** in one column (`heston.controls.ts`); three tabs (paths / pricing / greeks); workers |
| Delta hedging | `src/features/delta-hedging/` | **Rebuilt by the owner's session on 2026-10-21** (after this snapshot): URL state via `useUrlState`, daily grid with quarterly/monthly/weekly/daily rebalancing, stock + delta + hedge-error charts, metric strip, 200-path frequency study, explainer; token colours, i18n complete, tests in `scripts/lab-delta-hedging.test.mjs`. **Plans 02 and 05 skip this folder.** |
| Layout audit | `scripts/layout-audit.mjs` | CDP script from the fixed-income pack; `--group derivatives` resolves the five paths (+ `/hu/`) from the registry |
| Smoke test | `scripts/cdp-smoke.mjs` | console errors, exceptions, `lang`, `h1`, links; `--after` for clicks |
| Shared primitives (reuse!) | `src/components/layout/` (`PageHeader`, `Workspace`, `Panel`, `ChartContainer`), `src/components/ui/` (`Tabs`, `ControlGroup`, `StatCard`, `SegmentedControl`, `InfoTooltip`), `src/components/SliderField.tsx`, `SliderDock.tsx`, `NumberStepper.tsx`, `SeedControl.tsx`, `src/components/useUrlState.ts` + `src/lib/urlState.ts`, `src/components/charts/chart.theme.ts` (`SERIES_PALETTE`, `SERIES_ROLE`, `CHART_COLORS`) | Do not build private copies |
| Styles | `src/styles/payoff.scss`, `binomial.scss`, `surface3d.scss` (Black–Scholes), `global.scss` L185–240 (Heston), `mobile.scss` (slider docks), `layout.scss` L481–540 and L705–745 (`.view-layout`, `.metric-button`), `_primitives.scss` (page header, workspace, stat cards, tabs) | Radius tokens are all 2px (`tokens.scss` L25–34) but payoff/binomial partials still hard-code 10–16px radii |

### Measured (2026-10-21, `layout-audit.mjs`, widths 360/768/1280/1536, light+dark, EN+HU)

- 80 page-states, **44 failing** on the dev server. After discounting harness artefacts (below), the real defects are:
  - **Payoff 360:** the page-header actions (segmented "Strategy builder / Replicate payoff" + Intuition) sit **on top of the title** (`h1.page-header-title x button.tab`). Confirmed in the screenshot.
  - **Payoff 360:** a lone full-width "-" button (the collapse toggle) at the top of the builder card; the leg list it would collapse is hidden on phones anyway (`mobile.scss` L281–283).
  - **Payoff 360:** ~240 px of blank space between the Summary card and "About this tool" (dock clearance `.view-main--dock-tall{padding-bottom:244px}`).
  - **Binomial 1536:** 30 `svg-text-collision` pairs: the three 11 px text lines in each node (`t=…`, `S=…`, `V=…`) touch; edge labels `q=0.571` / `1-q=0.429` repeat on all 40 edges and collide with edges.
  - **Binomial, light theme:** nodes are hard-coded navy boxes (`#162235`, `#415269`, `#e2e8f0`) on a white page; node corners `rx=10`.
  - **Heston 1280×900:** the Controls panel does not fit the viewport (13 sliders + 3 reference cards ≈ 1600 px); the sticky panel scrolls internally, hiding 8 sliders.
  - **Delta hedging:** the main column is one 380 px chart in a ~1000 px tall row; metrics live in the sidebar.
  - **Payoff summary:** green "Detected equivalents" colour flood (`.success-card`), inline `style` with `borderRadius: 12`; `.repl-warning` uses a 3 px **left border** (owner-forbidden).
  - **binomial.scss:** literal radii 10/12/14/16 px on `.replication-item`, `.summary-hero` (primary-tinted flood), `.summary-tile`, `.summary-replication`, `.repl-cell`.
- **Harness artefacts** (plan 01 fixes them): (a) elements scrolled out of view inside the sticky controls panel are reported as overlapping "About this tool" (`heston`, `delta-hedging`, `payoff`, `black-scholes` at ≥1280: 1–23 false pairs each); (b) on the dev server the light theme never applied (`data-theme` stayed `dark` because `ThemeProvider` writes `dark` before reading storage under StrictMode); (c) binomial 360 reports the sticky top bar overlapping the page header (14 pairs) although the screenshot at scroll 0 shows no overlap — the page is measured at whatever scroll position it settled (phone scroll-snap).
- Code-level findings (no screenshot needed):
  - Hard-coded English: `BlackScholesControls.tsx` L20/L48/L66 (`years`/`curves`/`db`/`év`), `PayoffSummary.tsx` L13–19, `LegCard.tsx` L34–38 (`Vanilla`, `Exotics`/`Exotikusak`), `PresetSelect.tsx` L63, `legFields.ts` L63–72 and `PayoffDock.tsx` L103–110 (exotic instrument names, duplicated), `HestonGreeksChart.tsx` L36–38/L80/L89, `HestonPriceComparisonChart.tsx` L14–15, `HestonSmileChart.tsx` L21–22, `HestonGreeksSummary.tsx` L27–28.
  - Hard-coded chart hex colours instead of `SERIES_PALETTE` / `SERIES_ROLE` / `CHART_COLORS`: `useBlackScholesView.ts` L17–24, `HestonPathsChart.tsx` L8–15 (same six hexes, duplicated), `PayoffChart.tsx` L19–27 and L46–60, `DeltaHedgingView.tsx` L32–33, all Heston charts (`#3b82f6`, `#f59e0b`), reference lines `#94a3b8`.
  - Dead state: `controlsOpen` in `usePayoffView.ts`, `useBinomialView.ts`, `useBlackScholesView.ts`, `useHestonView.ts`; `.toggle-button{display:none}` in `layout.scss` L707–709 hides the toggle on desktop, so the collapse feature is unreachable there and useless on phones.
  - `HestonPathsChart.tsx` L27–37 re-implements `useMediaQuery` with a resize listener.
  - `useBlackScholesView.ts` L32–82 and `useBinomialView.ts` L10–50 each re-implement `clamp` / `parseNumber` / `formatNumber` that `src/lib/urlState.ts` already provides.
  - `BinomialSummary.tsx` L17 labels the risk-neutral probability `"q"`, which `.stat-title{text-transform:uppercase}` renders as **"Q"**.

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | Audit reports false overlaps (clipped scroller content, scroll position) and silently audits the wrong theme | 01 |
| G2 | English leftovers, hex palettes, dead collapse toggles, 351-line dock, duplicated helpers across the five labs | 02 |
| G3 | Payoff: header overlap on phones, colour flood + inline styles in the summary, left-border warning, dock clearance | 03 |
| G4 | Binomial: theme-blind lattice colours, rounded nodes, colliding node text and edge labels, "Q" label, literal radii, empty summary rows | 04 |
| G5 | Black–Scholes: clipped y-domains, `T_max` label, hand-rolled URL code (Delta hedging part done 2026-10-21, outside the pack) | 05 |
| G6 | Heston: 13-slider column does not fit a 900 px viewport | 06 |
| G7 | Final cross-width / theme / language sign-off | 07 |

## 2. Key decisions

- **No redesign.** The owner rejected the "Derivatives v2" canvas boards ("i dont think we need too much
  change"). Every plan changes layout, colour, copy or code structure only; controls, charts, tabs and
  interactions stay as they are. Interactivity ideas in `docs/LABS_PLAN.md` L160–173 stay **on hold**.
- **Harness first (plan 01)** so later plans can prove their pages are clean, and so the fixed-income
  pack's audit results can be trusted too (its "light" runs on a dev server were in fact dark).
- **Audit against `vite preview`**, never the dev server, until the `ThemeProvider` write-before-read
  race is fixed (plan 01 fixes it; the preview rule stays because it is what ships).
- **Tokens over hex.** 2D chart series take `SERIES_PALETTE[i]` / `SERIES_ROLE.*` (CSS variables work in
  SVG attributes); reference lines take `CHART_COLORS.axis`. The 3D surfaces (three.js) keep their own
  colour handling and are out of scope.
- **Remove the collapse toggle** instead of fixing it: it is hidden on desktop by CSS, so nobody uses it,
  and on phones the leg editor lives in the dock anyway.
- **URL state through `useUrlState`** for Black–Scholes, Binomial and Delta hedging (DRY with the other
  ~20 labs). Query keys and defaults stay byte-identical; the only visible change is that default values
  are no longer written into the URL.
- **Binomial edge labels only at the root.** `q` is constant across a recombining tree, so labelling 40
  edges with the same two numbers is noise and the main cause of collisions.
- **Heston: two control groups**, "Model" (9 sliders) and a collapsed "Simulation" disclosure (4
  sliders), using a native `<details>` styled once in `_primitives.scss`. No new primitive component.
- Out of scope, listed for the owner: English preset names in `PresetSelect.tsx` (strategy names), the
  English synthetic-match labels generated inside `payoff.math.ts`, the global phone `scroll-snap`
  (`mobile.scss` L31–39), and the 27 px tall `Tabs` / 18 px `InfoTooltip` tap targets (shared primitives;
  the audit reports them as warnings only).

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-audit-harness-fixes.md) | Audit harness fixes + derivatives baseline | – | S | Sonnet | done (2026-10-21) |
| [02](02-shared-hygiene.md) | Shared hygiene: i18n, palette tokens, dead toggles, dock split | 01 | M | Sonnet | done (2026-10-21) |
| [03](03-payoff-polish.md) | Payoff lab: phone header, summary styling, dock clearance | 01, 02 | M | Sonnet | done (2026-10-21) |
| [04](04-binomial-polish.md) | Binomial: theme-safe lattice, label spacing, summary, URL state | 01, 02 | M | Sonnet | done (2026-10-21) |
| [05](05-black-scholes-and-delta-hedging.md) | Black–Scholes domains + URL state (Delta hedging phase already done) | 01, 02 | S | Sonnet | done (2026-10-21) |
| [06](06-heston-controls.md) | Heston: Model / Simulation control groups | 01, 02 | S | Sonnet | done (2026-10-21) |
| [07](07-final-qa.md) | Final cross-width / theme / language QA | all | S | Sonnet | todo |

Order: 01 → 02 → then 03, 04, 05, 06 in any order (separate feature folders) → 07.
**02 touches every derivatives folder plus `layout.scss`, `payoff.scss` and the `Language` tables, so
nothing else runs while 02 is in progress.** 03 edits `_primitives.scss` and `mobile.scss`; 06 edits
`_primitives.scss` too: run 03 and 06 one after another, not in parallel.
When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Executors working in parallel sessions mark a plan `in progress (claimed <date>)` on its `Status:` line
before touching files.

## 4. Rules for every executor

- Read `CLAUDE.md`. Hard rules: DRY; math in `*.math.ts` / `src/lib/**` (no React there); types in
  `*.types.ts`; **`.tsx` ≤ ~150 lines** (split as part of the same change); styles in SCSS under
  `src/styles/**` using tokens; **all user text through i18n** (`useI18n()`, tables `src/Language/<Name>.ts`
  + `<Name>.hu.ts`, both languages, registered in `src/Language/index.en.ts` / `index.hu.ts`); `///` doc
  comments on exported functions; no comments on code you did not change.
- Owner preferences: **no redesign of the derivatives labs**; **no pills**; **never left-border accents**;
  square corners (`var(--radius-xs)`), no gradients, no colour floods (a whole card tinted green/blue);
  one accent colour; Hungarian copy you write is a **draft** — list every new HU string in Findings.
- Reuse the primitives in §1. Do not add dependencies.
- Platform: Windows 11, Git Bash + PowerShell. Prefix CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash.
  Start servers with `--strictPort`; afterwards stop them and confirm the port is free
  (`netstat -ano | grep :4173`).
- Do not edit `docs/LABS_PLAN.md` except to append one Log line per plan
  (`- HH:MM derivatives-polish NN: <summary>`).
- Standard verification (every plan):

```bash
npx tsc -b && npm run lint && npm run test:payoff-replication && npm run test:payoff-positions && npm run test:url-state
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group derivatives
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/payoff,/payoff?lab=replicate,/binomial,/black-scholes,/heston,/delta-hedging,/hu/payoff,/hu/binomial,/hu/black-scholes,/hu/heston,/hu/delta-hedging"
```

## 5. Definition of done

- `layout-audit.mjs --group derivatives` exits 0 at 360, 390, 768, 1024, 1280, 1536 px, light and dark,
  `/` and `/hu/`, on a preview build, with no `data-layout-allow` that is not justified in plan 07's Findings.
- Light-theme screenshots of all five pages look light (no navy boxes, no dark chart frames).
- No derivatives `.tsx` above ~150 lines; no hex colour literal in derivatives `.tsx` files except inside
  `surface3d`; no English string literal shown to users in derivatives `.tsx`; no `controlsOpen` left.
- Black–Scholes, Binomial and Delta hedging state lives in the URL via `useUrlState`, same keys as before.
- tsc, lint, the listed tests, build and the smoke run are green; nothing in the derivatives labs
  looks or behaves differently beyond what the plans list.
