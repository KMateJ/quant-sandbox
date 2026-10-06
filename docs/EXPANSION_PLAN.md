# Quant Sandbox — Expansion Plan

> Status: **Planning draft** · Date: 2026-10-05
> Goal: grow from ~6 modules to a ~25-module multi-domain quant learning app without the current
> architecture collapsing under duplication.

---

## 1. Target module tree

```
Quant Sandbox
│
├── DERIVATIVES
│   ├── Payoff Lab            [exists]
│   ├── Binomial Model        [exists]
│   ├── Black–Scholes         [exists]
│   ├── Heston                [exists]
│   └── Delta Hedging         [later]
│
├── PORTFOLIO & RISK
│   ├── Risk & Return         (expected return, volatility, covariance/correlation, Sharpe)
│   ├── Portfolio Lab         (2-asset, N-asset, diversification)
│   ├── Efficient Frontier    (min-variance, frontier, risk-free, tangency)
│   └── CAPM                  (beta, SML, alpha, CAPM expected return)
│
├── FIXED INCOME
│   ├── Yield Curve
│   ├── Bond Pricing
│   ├── Duration / Convexity
│   └── Rates models          [existing diffusion / later expansion]
│
├── CORPORATE FINANCE
│   ├── Time Value of Money
│   ├── NPV / IRR
│   ├── Cost of Capital       (cost of equity, cost of debt, WACC)
│   ├── Capital Structure
│   └── Valuation             (DCF, terminal value)
│
├── STOCHASTIC MODELS
│   ├── Brownian Motion
│   ├── GBM
│   ├── Itô Process
│   └── Monte Carlo
│
└── GUIDES                    [exists, registry-based]
```

---

## 2. Current architecture (as-is)

| Concern | Current approach | File |
| --- | --- | --- |
| Stack | React 19, Vite 8, TypeScript 5.9, RRD 7, Recharts 3, KaTeX | `package.json` |
| Routing | Hand-written `<Routes>` + one SEO-wrapper component per page | `src/App.tsx` |
| Nav | Hard-coded `items[]` + `PageKey` union + `labels` map | `src/components/Navbar.tsx` |
| Home | Hard-coded `teasers[]` list | `src/features/home/HomeView.tsx` |
| i18n | Custom context, **flat** key namespace merged from `src/Language/*.ts` | `src/i18n.tsx` |
| Features | `src/features/<name>/` with `*.math.ts`, `*.types.ts`, `<Name>View.tsx`, `components/` | — |
| Heavy compute | Web worker (Heston only) | `heston.worker.ts` |
| Guides | Registry array pattern (good model to generalize) | `GuideRegistry.tsx` |
| Charts | Shared `chartConfig.ts` + Recharts | — |
| Tests | None | — |

### Why it won't scale as-is
A single module today must be declared in **four** places (route, nav item, nav label, home teaser) plus
its i18n keys. At 25 modules that is ~100 hand-synced edits and a near-certain source of drift.

Specific scaling risks:
1. **Duplicated registration** across `App.tsx`, `Navbar.tsx`, `HomeView.tsx`.
2. **Flat i18n namespace** — every key is global; collisions (e.g. `navHome` defined in `Home.ts`)
   get worse with 5 domains. No per-feature isolation, no lazy loading of strings.
3. **No code splitting** — all views + Recharts + KaTeX load eagerly; bundle grows linearly.
4. **Flat navbar** — no grouping; the new tree has 5 categories with sub-items.
5. **Shared data problem** — Risk & Return, Portfolio Lab, Efficient Frontier and CAPM all operate on
   the *same* asset return/covariance inputs, but there is no shared state layer.
6. **Charting mismatch** — Recharts is composable but awkward for bespoke quant visuals (payoff kinks,
   shaded P/L regions, tangency/CML lines, dense simulated-path overlays, SML). A better-fit charting
   layer is needed before building the new domains.
7. **Article-like layout** — the centered `.page-container` (`min(1440px, 100% - 24px)`) wastes desktop
   width and reads as a document, not a workspace; it cannot host dense multi-panel modules.

---

## 3. Proposed architecture changes

### 3.1 Central module registry  ⭐ highest priority
Create `src/modules/registry.ts` as the single source of truth:

```ts
type ModuleCategory =
  | "derivatives" | "portfolio" | "fixed-income" | "corporate" | "stochastic";

interface ModuleDef {
  id: string;                 // "efficient-frontier"
  path: string;               // "/efficient-frontier"
  category: ModuleCategory;
  status: "live" | "beta" | "planned";
  i18nKey: string;            // namespace prefix
  seo: { titleKey: string; descKey: string };
  Component: React.LazyExoticComponent<React.ComponentType>;
  icon?: ReactNode;
  accent?: string;            // for home teaser
  relatedGuides?: string[];   // GuideId[] — feeds the sidebar "Connected Guides"
}
```

`App.tsx`, `Navbar.tsx`, and `HomeView.tsx` all derive from this array. Adding a module becomes a
single entry + one feature folder.

### 3.2 Lazy loading / code splitting
Wrap every module `Component` in `React.lazy()` and render `<Routes>` inside `<Suspense>`.
Keeps initial load small as module count grows.

### 3.3 Grouped navigation
Superseded by the **two-level navigation** in §4.3 (top categories + registry-driven left sidebar).
`Navbar` is driven by the registry's `category`; the `PageKey` union is removed in favour of registry
ids.

### 3.4 Shared "market data" store
Portfolio & Risk and CAPM share inputs (asset list, returns, covariance, risk-free rate). Introduce a
lightweight store so these modules read/write one dataset.
- **Recommendation:** `zustand` (tiny, no boilerplate, fits current Context style).

### 3.5 i18n restructure
**Chosen & implemented: Option B — migrated to `i18next` + `react-i18next`.**
- The existing `useI18n()` API (`language` / `setLanguage` / `t`) and the `src/Language/*.ts` tables are
  preserved and fed to i18next as `resources`, so no call sites changed.
- Namespaced per-feature resources and lazy loading can be layered on later as the string count grows.
- Rejected Option A (custom provider) — i18next gives interpolation, plurals and a standard ecosystem.

### 3.6 Compute in workers
Generalize the Heston worker pattern. Monte Carlo, Efficient Frontier optimisation, and path
simulators (Brownian/GBM) should run off the main thread.
- **Recommendation:** add `comlink` to remove hand-written `postMessage` plumbing.

### 3.7 Charting overhaul  ⭐ (replacing Recharts)
Recharts is being phased out in favour of a stack better suited to interactive math visuals.
- **Primary — `visx`** (D3 primitives + React): full control over axes, shaded regions, kinked payoff
  lines, tangency/CML/SML overlays; tree-shakable; no "fight the abstraction" for custom shapes.
- **High-density paths — `uPlot`**: extremely fast/tiny for Monte Carlo, Brownian and GBM path
  bundles (hundreds of series) where Recharts/visx would stutter.
- **Alternative (batteries-included) — `ECharts`** via `echarts-for-react`: less custom code, heavier
  bundle; fallback if `visx` authoring cost feels too high.
- **Approach:** build a thin `src/components/charts/` wrapper layer so modules depend on *our* chart
  API, not the lib directly — lets us migrate existing modules off Recharts incrementally.

### 3.8 Testing (explicitly de-prioritised)
Not a priority for this phase. Keep math in isolated `*.math.ts` so tests *can* be added later if a
numbers-correctness bug appears, but do not block module work on a test harness.

### 3.9 Styling → SCSS
Migrate the global CSS layer (`src/styles/*.css` + `App.css` / `index.css`, all imported flat in
`main.tsx`) to SCSS. Vite supports it natively — only the `sass` dev dependency is needed.
- **Keep** the design tokens as CSS custom properties (`tokens.css` → `tokens.scss` but still emitting
  `--vars`) so runtime theming (light/dark via `theme.tsx`) keeps working.
- **Gain** nesting, `@use`/partials, mixins (responsive breakpoints, chart/card patterns), and
  functions — valuable as per-module styles multiply across 25 modules.
- **Structure:** one SCSS partial per feature (`styles/_payoff.scss`, `_portfolio.scss`, …) composed
  via a single `main.scss` entry with `@use`, replacing the 8 flat `import` lines in `main.tsx`.
- **Migration:** rename `.css` → `.scss` (valid SCSS is a superset, so it compiles immediately), then
  incrementally refactor to nesting/mixins. Co-locate future module styles with their feature folder.

---

## 4. Application shell & UX/UI redesign (design system)

> Scope: shell, navigation, spacing, responsive behaviour, reusable primitives, visual language.
> **Not** module content or quant logic. This is the foundation every module composes.

### 4.1 Design intent
Shift from the current centered, article-like layout to a dense, professional quantitative
**workspace** — closer to GitHub / developer tools / financial terminals than a marketing dashboard.
Stay clean for experts yet understandable for learners, and scale to ~25 modules.

### 4.2 Application shell
Replace the centered container (today `.page-container` / `.topbar-inner` = `min(1440px, 100% - 24px)`
in `styles/layout.css`) with a near-full-width shell:
- ~16–24px outer padding, no large empty margins.
- Fluid growth on large screens; apply a `max-width` only where readability needs it (prose/help), not
  to the whole workspace.
- Use the viewport aggressively but deliberately.

### 4.3 Two-level navigation (supersedes §3.3)
- **Top nav:** main categories (Derivatives, Portfolio & Risk, Fixed Income, Corporate Finance,
  Stochastic Models, Guides). Persistent, compact, clearly marks the active category.
- **Left sidebar (~180–220px):** modules of the active category. Dense, persistent on desktop,
  collapsible. **Generated from the module registry** (§3.1) grouped by `category`.
- Main workspace takes all remaining space. Keep navigation depth at 2 levels max.

**Sidebar structure** — two stacked sections, kept structurally simple:
1. **Module tree (top, primary).** Compact vertical tree/list like GitHub / dev-tool nav. Clearly mark
   the active module; use indentation, subtle hierarchy, section labels and lightweight icons only
   where they aid scanning. **No cards or pills** for rows; compact, consistent row heights; subtle
   hover and a clear-but-light active state. Supports future nesting but avoids needless depth.
   Occupies the primary portion of the sidebar and stays scannable even with many modules.
2. **Connected Guides (below, secondary).** Guides relevant to the current module/category, rendered as
   compact **text link rows (not cards)**. Prefer **2–5 highly relevant** guides over a full library;
   minimal metadata (optional small label/icon). A contextual bridge from lab → explanation without
   cluttering the workspace. **Omit the whole section when there are no connected guides** — no empty
   placeholder. Keep scroll behaviour predictable: the module tree stays easy to reach as the guides
   list grows (e.g. tree scrolls independently, guides pinned/secondary below).

> Registry impact: modules declare `relatedGuides?: GuideId[]` (§3.1) so the Connected Guides list is
> **derived, not hand-maintained** — extends the existing `GuideRegistry`.

### 4.4 Page structure
```
┌───────────────────────────────────────┐
│ Top navigation                              │
├────────────┬──────────────────────────────┤
│ Sidebar    │ Page header (title · actions)  │
│ (category  ├────────────────────────────────┤
│  modules)  │ Workspace (panels / charts)    │
└────────────┴────────────────────────────────┘
```
Pages are workspaces, not documents inside big centered cards.

### 4.5 Density & spacing
- Cut unnecessary margins/vertical rhythm; one consistent spacing scale.
- Compact controls and panels; avoid oversized cards and deep card nesting.
- Not every group needs a rounded container — use borders, dividers, background hierarchy.
- Reserve larger whitespace for real hierarchy, not decoration.

### 4.6 Panel system
Reusable `Panel` with optional header (title + actions), content, optional footer/status.
- Small radii, subtle borders.
- Avoid the "floating cards" dashboard look; adjacent related panels may share borders / use simple
  separators instead of each being isolated.

### 4.7 Control language
- Label + current value on the same row; values are **editable inputs**, not decorative badges.
- Compact sliders; always-clear units.
- Consistent heights across input / select / tabs / toggle / button.
- Group via hierarchy and spacing, not extra containers; avoid pill-heavy UIs.

### 4.8 Shape discipline — avoid excessive pills
Do not default to pill/capsule shapes. They are overused in generated UIs; use them only when the
shape carries real interaction or semantic meaning. **Rule of thumb:** if removing the rounded
background doesn't reduce usability or meaning, don't use a pill.
- **No pills** for nav items, sidebar rows, decorative labels around plain text, or turning every
  option/state into a chip.
- Prefer standard **tabs, segmented controls, radio, select, or plain-text nav** over a row of pills
  when they communicate hierarchy better.
- **Status badges** (Beta, Experimental, New) may use a compact badge/chip — that is genuine metadata.
- **Tags** may use chips only when users conceptually interact with them as tags.
- Small binary / mutually-exclusive controls may use a **segmented control**, but keep the radius
  restrained, not fully rounded.
- **Buttons:** small/moderate radii, not capsules.
- Build hierarchy from typography, alignment, whitespace, borders, underlines, background states and
  subtle separators.
- Token impact: retire `--radius-pill: 999px` from nav and controls (it currently styles `.nav-tab`);
  reserve a rounded treatment for true status badges only.

### 4.9 Progressive disclosure (help)
No large permanent prose blocks in the workspace. Layer help:
info icon → concise tooltip (hover) → richer popover → optional contextual help / drawer for long form.
Clean for experts, learnable for beginners.

### 4.10 Visual language
Keep dark/light theming (CSS custom properties), stronger system:
- Dark: deep navy/charcoal surfaces, subtle elevation, restrained borders, high readability; accents
  mainly for interaction and data viz.
- General: professional not playful; restrained gradients; limited shadows; small/moderate radii;
  clear type hierarchy; strong alignment; consistent dimensions.
- **Data visualisations are visually dominant** when present. Don't look like a generic SaaS dashboard.
- Token impact: the current pill nav (`--radius-pill: 999px`) and large card radii (`14–18px`) get
  dialled down for the workspace chrome.

### 4.11 Responsiveness (re-layout, not shrink)
- **Desktop:** persistent top nav + sidebar; multi-column workspace where useful.
- **Tablet:** narrower / collapsible sidebar; preserve workspace width; panels may reflow.
- **Mobile:** drop the persistent sidebar → drawer/sheet nav; compact header; stack regions; secondary
  sections become tabs / accordions / sheets; touch-friendly controls; keep charts readable; primary
  interaction first.
- Desktop and mobile share the *design language*, not the same layout.

### 4.12 Reusable primitives (`src/components/layout/` + `src/components/ui/`)
`AppShell` · `TopNavigation` · `Sidebar` (+ mobile drawer) · `PageHeader` · `Workspace` · `Panel` ·
`ControlGroup` · `Tabs` · `Tooltip`/`InfoTooltip` · `Popover` · `ContextualHelp`/`HelpDrawer` ·
`ChartContainer`. Future modules compose these instead of inventing layout.

**Contextual intuition (implemented):** a module may declare an `intuition` document in
`src/modules/registry.ts`; routes scope it with `IntuitionProvider`. Documents contain
unique stable section IDs, localized `titleKey` / `summaryKey` / `bodyKey`, optional
`formula` (KaTeX), `exampleKey`, or React `content`. Shared bond sections are reused.
Place `<IntuitionTrigger sectionId="modified-duration" />` next to the relevant UI;
omit the ID (or use `variant="button"`) to open at the top. `PageHeader` adds the
document button automatically. `NumberInput` and `SliderField` accept `sectionId`;
chart series accept `intuitionSectionId` for legend help. Keep trigger buttons outside
input labels and other buttons. Summary tooltips are one-line definitions; the drawer
holds the deeper explanation, not a duplicate prose panel in the workspace.

Desktop uses a non-modal 420px overlay so other triggers remain usable; tablet/mobile
uses a modal sheet with backdrop, focus containment and background scroll protection.
Opening does not scroll the page; subsequent triggers scroll only the document and
briefly accent the target. Escape/close restore focus to the trigger. Reduced motion is
respected. State is page-local (URL deep links are not currently enabled).
Run `npm run test:intuition` to check stable IDs, localized document content,
KaTeX equations, shared bond sections and parameter/legend trigger references.

### 4.13 Design tokens to centralise (in `tokens.scss`, still emitting CSS vars)
spacing scale · typography · border radii · control heights · surface colors · borders · interactive
states · chart colors · breakpoints · transitions · z-index layers. Extends the existing `tokens.css`.

### 4.14 UX principles
1. Workspace over webpage. 2. Density without clutter. 3. Viz/interaction over prose.
4. Progressive disclosure over permanent help. 5. Consistent patterns. 6. Minimal nav depth.
7. Fast for experts, accessible to learners. 8. Aggressive but deliberate use of space.
9. No decorative-only UI. 10. Shared design language across desktop/mobile.
11. Shape discipline — no decorative pills/capsules.

---

## 5. Package plan

### 5.1 Upgrade / keep
| Package | Action | Note |
| --- | --- | --- |
| react / react-dom 19 | keep | current |
| vite 8 | keep | current |
| typescript 5.9 | keep | — |
| react-router-dom 7 | keep | consider data-router API for nested category routes |
| recharts 3 | **remove (migrate off)** | replace with `visx` behind our own chart wrapper |
| katex / react-katex | keep | formula rendering |

### 5.2 Add (new capabilities)
| Package | Purpose | Modules served |
| --- | --- | --- |
| `zustand` | shared market-data store | Portfolio & Risk, CAPM |
| `i18next` + `react-i18next` | i18n runtime (installed) | all modules |
| `visx` (`@visx/*`) | primary charting (replaces Recharts) | all charted modules |
| `uplot` | fast dense path rendering | Brownian, GBM, Monte Carlo |
| `comlink` | ergonomic web-worker RPC | Monte Carlo, Frontier, GBM |
| `ml-matrix` *(or small custom)* | covariance/matrix ops, inversion | Portfolio Lab (N-asset), Efficient Frontier |
| `simple-statistics` *(optional)* | mean/var/cov/correlation/regression | Risk & Return, CAPM (beta via OLS) |
| `d3-random` *(optional)* | seeded normal RNG for simulations | Brownian, GBM, Monte Carlo |
| `sass` *(dev)* | SCSS compilation (nesting, mixins, partials) | all styles |

### 5.3 Deliberately avoid
| Package | Why not |
| --- | --- |
| `mathjs` | heavy, poor tree-shaking; prefer `ml-matrix` + small utils |
| `financejs` | unmaintained; write our own TVM/IRR |
| `plotly` | large bundle; `visx` + `uPlot` cover our needs more cheaply |
| `nivo` | nicer defaults but heavier than `visx`; less low-level control |

> Numerical helpers that are tiny (Newton–Raphson, bisection, Box–Muller) should be **hand-written**
> in a shared `src/lib/numerics/` rather than pulled as dependencies.

---

## 6. Shared infrastructure to build (`src/lib/`)

| Module | Contents | Reused by |
| --- | --- | --- |
| `numerics/rootfind.ts` | bisection, Newton–Raphson | IRR, implied vol, yield bootstrap |
| `numerics/random.ts` | seeded RNG, Box–Muller normals | Brownian, GBM, Monte Carlo, Heston |
| `numerics/matrix.ts` | cov matrix, inverse, quadratic form | Portfolio, Frontier |
| `stats/moments.ts` | mean, variance, std, covariance, correlation | Risk & Return, CAPM |
| `finance/tvm.ts` | discount factors, annuities, PV/FV | TVM, NPV/IRR, Bond, DCF |
| `workers/createWorker.ts` | Comlink worker factory | all heavy modules |
| `components/charts/` | visx/uPlot wrappers (axes, line, area, scatter, paths) | all charted modules |

Building these first prevents re-implementing the same math per module.

---

## 7. Module-by-module notes

### Portfolio & Risk
- **Risk & Return:** moments, Sharpe = (E[r]−rf)/σ. Depends on `stats/moments`.
- **Portfolio Lab:** 2-asset closed form; N-asset needs `matrix`. Diversification = correlation sweep.
- **Efficient Frontier:** min-variance (analytic w/ matrix inverse), frontier parametrisation, CML with
  risk-free, tangency (max Sharpe). Optimisation in a worker.
- **CAPM:** β via OLS regression (`stats`), SML plot, α = actual − CAPM expected return.

### Fixed Income
- **Yield Curve:** bootstrap spot rates from par/coupon instruments (`rootfind`).
- **Bond Pricing:** PV of cashflows (`finance/tvm`).
- **Duration/Convexity:** Macaulay/modified duration, convexity, price sensitivity.
- **Rates models:** fold existing diffusion work in later.

### Corporate Finance
- **TVM / NPV / IRR:** `finance/tvm` + `rootfind` for IRR.
- **Cost of Capital / WACC:** depends on CAPM (cost of equity) → cross-module link.
- **Valuation (DCF / Terminal Value):** reuses TVM + WACC.

### Stochastic Models
- **Brownian / GBM / Itô:** path simulators via `numerics/random`, rendered as sampled paths.
- **Monte Carlo:** generic simulator feeding option pricing; worker + Comlink.

---

## 8. Phased roadmap

| Phase | Theme | Deliverables |
| --- | --- | --- |
| **0 — Shell & design system** | new UI foundation | `AppShell`, two-level nav (top categories + registry-driven `Sidebar` + mobile drawer), `PageHeader`/`Workspace`/`Panel`/`ControlGroup`/`Tabs`/`InfoTooltip`/`Popover`/`HelpDrawer`/`ChartContainer`, token system in `tokens.scss` (radii, z-index, breakpoints, chart colors), responsive desktop/tablet/mobile |
| **0.5 — Platform plumbing** | de-risk scaling | module registry, lazy routes, SCSS migration (`.css` → `.scss` + `main.scss`), chart wrapper (`visx`) + migrate 1 module off Recharts, `src/lib/numerics` + `stats` + `tvm`, i18n namespacing decision |
| **1 — Portfolio & Risk** | first new domain | Risk & Return → Portfolio Lab → Efficient Frontier → CAPM (shared zustand store) |
| **2 — Corporate Finance** | reuse TVM | TVM, NPV/IRR, Cost of Capital/WACC, Valuation |
| **3 — Fixed Income** | curves & bonds | Yield Curve, Bond Pricing, Duration/Convexity |
| **4 — Stochastic Models** | simulators | Brownian, GBM, Itô, Monte Carlo (Comlink workers) |
| **5 — Derivatives finish** | complete tree | Delta Hedging, fold Rates models |
| **ongoing** | Guides | add narrative guides per new domain |

> Phases 0 and 0.5 must land before Phase 1 — they are what make the other phases cheap. The shell /
> design system (Phase 0) and the registry (Phase 0.5) are intertwined: the sidebar is generated from
> the registry, so build them together.

---

## 9. Open questions (decide before Phase 0)

1. **Charts:** `visx` as primary (+ `uPlot` for paths), or go batteries-included with `ECharts`?
2. ~~**i18n:** custom vs. `react-i18next`.~~ **Resolved:** migrated to `i18next` (Option B).
3. **State:** adopt `zustand` globally, or only for the shared market-data store?
4. **Data input UX:** how do users enter asset returns — manual table, presets, or
   uploaded/synthetic series? Affects Portfolio & Risk design.
5. **Matrix math:** external `ml-matrix` vs. a small audited in-house implementation?
6. **Worker strategy:** adopt `comlink` now, or keep raw `postMessage` like Heston?
7. **URL structure:** flat (`/efficient-frontier`) or nested per category (`/portfolio/frontier`)?
8. **Sidebar:** collapsed or expanded by default on desktop/tablet, and drawer vs. sheet on mobile?
9. **Top nav style:** category tabs vs. a compact menu bar; does it also show a breadcrumb?

---

## 10. Immediate next actions (Phase 0, concrete)

- [x] Build `AppShell` + `TopNavigation` + registry-driven `Sidebar` (+ mobile drawer), replacing the
      centered `.page-container`.
- [x] Add the core primitives (`PageHeader`, `Workspace`, `Panel`, `ControlGroup`, `Tabs`,
      `InfoTooltip`, `Popover`, `ChartContainer`). Added `HelpDrawer` too; barrels in
      `components/layout/index.ts` + `components/ui/index.ts`; styled in `styles/_primitives.scss`.
- [ ] Expand `tokens` (dial radii down, add z-index layers, breakpoints, chart colors, control heights).
- [ ] Chart spike: add `visx`, build `src/components/charts/` wrappers, migrate **one** existing module
      (e.g. Payoff Lab) off Recharts to validate the API.
- [ ] Create `src/modules/registry.ts` and migrate the 6 existing modules into it.
- [ ] Refactor `App.tsx` to render routes from the registry with `React.lazy` + `Suspense`.
- [ ] Refactor `Navbar.tsx` + `HomeView.tsx` to consume the registry.
- [ ] Decide i18n Option A vs B; scaffold namespaced keys for the first new module.
- [ ] Add `sass`, rename `src/styles/*.css` → `.scss`, introduce `main.scss` with `@use` partials.
- [ ] Scaffold `src/lib/numerics/` (`rootfind`, `random`) and `src/lib/finance/tvm.ts`.
```
