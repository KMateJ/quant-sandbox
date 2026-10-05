# CLAUDE.md

Guidance for AI agents and contributors working in this repository (Quant Sandbox).

---

## Architectural philosophy (hard rules)

These three rules are non-negotiable and take priority when making changes.

1. **DRY** — Do not repeat logic, markup, config, or data. Extract shared behaviour into reusable
   functions, hooks, components, or the module registry. If you copy-paste, stop and abstract instead.
   - Module metadata lives **once** in the module registry (see `docs/EXPANSION_PLAN.md` §3.1), not
     duplicated across routes, nav, and home.
   - Shared math/number helpers live in `src/lib/`, not re-implemented per feature.

2. **Separation of concerns** — Keep distinct responsibilities in distinct places.
   - **Math / logic:** `*.math.ts`, `src/lib/**` — pure, UI-free, framework-free.
   - **Types:** `*.types.ts`.
   - **View / UI:** `*.tsx` components — presentation and interaction only.
   - **Styling:** SCSS in `src/styles/**` (design tokens stay as CSS custom properties).
   - **i18n strings:** `src/Language/**`, never hard-coded in components.
   - **Heavy compute:** web workers (`*.worker.ts`), off the main thread.
   - A component should not contain business math; a math file should not import React.

3. **No file over ~150 lines** — applies **mainly to `.tsx` / `.jsx`**. Split large views into
   smaller components, extract hooks, move logic to `*.math.ts` / `src/lib/`.
   - **Exempt (may be larger):** plain `.ts` (e.g. `*.math.ts`, data/presets), `.scss`, and generated
     files. Keep them cohesive even when long.
   - If a `.tsx` approaches the limit, that is a signal to decompose, not to relax the rule.

---

## What this project is

Interactive quant/finance learning app (study aid) built as a dense, professional **workspace** — not
an article or marketing dashboard. It is expanding from ~6 modules to ~25 across Derivatives,
Portfolio & Risk, Fixed Income, Corporate Finance, Stochastic Models, plus Guides.

The full expansion plan, design system, and roadmap live in **`docs/EXPANSION_PLAN.md`** — read it
before large changes.

## Tech stack

- React 19 + TypeScript (strict) · Vite · React Router 7
- i18n: `i18next` + `react-i18next` (resources from `src/Language/*.ts`, accessed via `useI18n()`)
- Charts: migrating off Recharts → `visx` (+ `uPlot` for dense paths) behind `src/components/charts/`
- Styling: SCSS + CSS custom properties for themeable tokens (`src/styles/tokens`)
- Math rendering: KaTeX
- Heavy compute: web workers (Heston already uses one)

## Project structure

```
src/
  modules/registry.ts      # single source of truth for modules (planned)
  components/              # reusable layout + UI primitives, charts
  features/<name>/         # one folder per module: View + *.math.ts + *.types.ts + components/
  lib/                     # shared numerics / stats / finance / workers (planned)
  Language/                # i18n string tables (en/hu)
  styles/                  # SCSS (tokens, layout, per-feature partials)
```

Adding a module = one registry entry + one `features/<name>/` folder. Do not wire modules into routes,
nav, or home by hand.

---

## UI / UX conventions (see `docs/EXPANSION_PLAN.md` §4)

- **Workspace over webpage:** near-full-width shell, dense but not cluttered, ~16–24px outer padding.
- **Two-level nav:** top categories + registry-driven left sidebar (module tree + Connected Guides).
- **Compose primitives** (`AppShell`, `Panel`, `PageHeader`, `Workspace`, `ControlGroup`, `Tabs`,
  `InfoTooltip`, `Popover`, `HelpDrawer`, `ChartContainer`) — don't invent new layout per page.
- **Progressive disclosure** for help (icon → tooltip → popover → drawer); no permanent prose walls.
- **Avoid excessive pills/capsules** (§4.8): no pills for nav rows, sidebar rows, or decorative labels.
  Use tabs / segmented controls / plain-text nav. Chips only for real status badges or interactive
  tags. Buttons use small/moderate radii, not capsules.
- **Data visualisations are visually dominant** when present.
- Keep dark/light theming via CSS custom properties.

## Conventions

- Localise all user-facing text through the i18n system (`useI18n` / `src/Language`).
- Keep `*.math.ts` pure and independently reasoned about.
- Prefer editing existing files and composing existing primitives over creating new patterns.
- Match existing code style.

## Comments

- Keep comments short and only where necessary — state what the code cannot show on its own, not what
  it already says.
- Use `///` doc comments on exported functions and in `*.math.ts` so the description shows on hover.
- `// #region` / `// #endregion` are fine for grouping/folding larger files.
- Do not add docstrings, comments, or type annotations to code you did not change.

## Working agreement

- Read `docs/EXPANSION_PLAN.md` for context before structural work.
- When a `.tsx` grows past ~150 lines, split it as part of the same change.
- Do not create documentation markdown files unless explicitly requested.
