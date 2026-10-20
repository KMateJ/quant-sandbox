# Home redesign plans

Goal: replace the current card-and-pill home page with the "Home v3" design: a navy, square, ruled-grid
page that feels like a premium private bank — serif display headlines, one blue accent, an animated
Monte Carlo fan figure, a registry-driven labs index and the guide tracks. The same palette, fonts and
square edges become the app-wide default.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model
(Sonnet recommended) without this README or the chat that produced it. Each plan ends with a
ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-20** (commit `ecb42f8`). If the code has moved on, the executor re-checks its
plan's "Current state" before editing. At snapshot time another session had **uncommitted edits** to
`src/features/home/HomeCatalogue.tsx`, `src/features/home/HomeRoadmap.tsx` and `src/styles/layout.scss`;
see rule 4.3.

## 0. The design (source of truth)

The approved design lives on the claude.ai Design canvas "QuantSandbox UX"
(`https://claude.ai/artifact/YKBdD3qY1LU5av72yapaes`), boards **HomeTiles** (desktop, 1440 wide),
**HomeTilesMobile** (390 wide) and **BlueStudies** (six palette options). Plans quote every value they
need, so executors do not need the canvas. Summary:

- **Feel:** private bank / annual report. Square edges (0–2px), 1px hairline rules between cells
  (`gap: 1px` over a rule-coloured background), no floating cards.
- **Colour:** deep navy ground, cool-white text, **one** blue accent used only for the single key mark
  (the key line of a chart, the section number, "move" in the headline, progress fill). Categories are
  told apart by number (01–05) and name, **not** by colour.
- **Type:** Newsreader (serif display: headlines, wordmark, featured tile names, big numbers),
  Geist (UI text), Geist Mono (numbers, codes, eyebrows).
- **Forbidden:** gradients, glows, neon/gradient text, marquees or other moving text, arrows ("→") on
  links/buttons/tiles, pills/capsules, left-border accent bars, per-category colour floods.
- **Allowed motion:** the hero's price paths draw in once on load; a tile's key line redraws on hover;
  both off under `prefers-reduced-motion`.
- **Top bar:** wordmark · category links · search button · theme toggle · "EN ▾" language menu.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Home page | `src/features/home/HomeView.tsx` (22 lines) | Renders `HomeHero`, `HomeCatalogue`, `HomeRoadmap`, a footnote |
| Hero | `src/features/home/HomeHero.tsx` (81) | Title, lede, three "pillar" items with icons |
| Catalogue | `src/features/home/HomeCatalogue.tsx` (56) + `CatalogueSection.tsx` (52) | Search input + registry-driven category sections of `.mod-card` links with `ModuleIcon`, coloured by `CATEGORY_ACCENT` |
| Roadmap | `src/features/home/HomeRoadmap.tsx` (30) | Three `dev-card` lists (recent / upcoming / future) |
| Home styles | `src/styles/layout.scss` lines ~904–1180, ~1260–1300, ~1607–1640 | `.dev-*`, `.home-hero*`, `.home-pillar*`, `.catalogue-*`, `.home-footnote`, `.mod-grid`, `.mod-card`, `.home-section` |
| Module registry | `src/modules/registry.ts` | `ModuleDef` (id, path, navKey, icon?, category?, status, …), `CATEGORY_ORDER`, `CATEGORY_LABEL_KEYS`, `CATEGORY_DESC_KEYS`, `CATEGORY_ACCENT`, `modulesInCategory()` |
| Guide data | `src/features/guide/guide.meta.ts`, `useGuideProgress.ts` | `guideTracks`, `trackLessons()`, `guideTrackPath()`, `guidePath()`, `useGuideProgress()` (read lessons in localStorage) |
| Tokens | `src/styles/tokens.scss` (164) | `:root` dark tokens, `:root[data-theme="light"]`, radii 4–20px + `--radius-pill: 999px`, `--font-sans` Inter, `--font-serif` Source Serif 4 |
| Fonts | `src/main.tsx` | Imports `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4/opsz(.italic).css` |
| Top bar | `src/components/layout/TopNavigation.tsx` (66) + `src/styles/_shell.scss` | `.brand`, `.cat-tabs/.cat-tab`, `.topnav-controls` with `ThemeToggle` (`.nav-icon-button`) and `LanguageMenu` (`.nav-lang*`), `.nav-toggle` for mobile |
| Shell | `src/components/layout/AppShell.tsx` (31) | TopNavigation, Sidebar (category pages only), main, SiteFooter, MobileNav |
| Seeded RNG | `src/lib/math/random.ts` | `makeRng(seed)`, `nextNormal(rng)` |
| Pre-render | `src/main.tsx`, `seo.plugin.ts` | Production pages ship pre-rendered (EN at `/`, HU at `/hu/…`) and **hydrate** — first client render must match the HTML |
| Test pattern | `scripts/*.test.mjs` | `node --test` + a `load()` helper that transpiles a TS file and its **relative** imports into `data:` URLs |
| Browser smoke | `scripts/cdp-smoke.mjs` | Headless Chrome/Edge check: console errors, exceptions, `h1`, title, links; `--after` for clicks |

Measured: 24 category modules (Derivatives 5, Portfolio 4, Fixed Income 5, Corporate 5, Stochastic 5 —
count from `modulesInCategory`), 55 guide lessons in 5 tracks (derivatives 16, portfolio 8,
fixed-income 8, corporate 8, stochastic 15). `border-radius` appears 209 times across `src/styles/*.scss`.

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| 1 | Palette, fonts and radii don't match the design | 01 |
| 2 | Top bar is rounded/pill-styled and the wordmark is plain sans | 02 |
| 3 | No pure, tested model for the home (featured lab per category, mini visuals, stats, GBM fan) | 03 |
| 4 | No record of the last lab visited ("Continue" tile) | 04 |
| 5 | Home page layout/sections are the old design | 05 |
| 6 | No global search (top-bar "Search  Ctrl K") | 06 |
| 7 | Shared primitives (Panel, SectionCard, buttons, inputs) still rounded across the app | 07 |

## 2. Key decisions

- **Palette = tokens, not hard-coded hex.** All colours come from CSS custom properties in
  `tokens.scss`, so switching among the six studied blues is a tokens-only change. Default dark theme =
  **Graphite** (chosen by the owner; earlier drafts: Sapphire, then Steel ink); light theme = **Porcelain** (the light option from the studies). Revisit if the owner
  picks another blue — only plan 01's table changes.
- **One serif.** Newsreader replaces Source Serif 4 as `--font-serif` (guides use that token), plus a
  new `--font-display` alias. Inter is replaced by Geist as `--font-sans`; Geist Mono becomes
  `--font-mono`. All via `@fontsource-variable/*` (already the project's font mechanism; packages
  `geist`, `geist-mono`, `newsreader` exist at 5.3.0).
- **Registry stays the single source of truth.** The featured lab per category is a registry flag
  (`homeFeatured?: true`), not a list in the home code. Mini visuals are pure data keyed by module id in
  `src/features/home/home.viz.ts`, checked against the registry by the harness.
- **Hydration-safe.** The hero fan uses a fixed seed (`makeRng(7)`), so server and client draw the same
  paths. Anything from localStorage (Continue, guide progress) renders only after mount.
- **No arrows, no roadmap cards.** The roadmap section is kept but restyled as a plain ruled list
  (owner may later drop it — draft question in plan 05 Findings).
- **Search moves to the top bar** (plan 06). Until 06 lands, plan 05 keeps a plain search field in the
  labs header so the feature never disappears.

## 3. Plans, order, status
| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-tokens-fonts.md) | Palette, fonts and square radii tokens | – | M | Sonnet | done (2026-10-20) |
| [02](02-top-bar.md) | Top bar restyle | 01 | S | Sonnet | done (2026-10-20) |
| [03](03-home-model.md) | Home model, mini visuals, fan math + harness | – | M | Sonnet | done (2026-10-20) |
| [04](04-last-lab.md) | Last-visited lab store (Continue) | – | S | Haiku | done (2026-10-20) |
| [05](05-home-page.md) | Home page UI | 01, 03, 04 | L | Sonnet | done (2026-10-20) |
| [06](06-search-palette.md) | Global search (Ctrl K) | 02, 05 | M | Sonnet | done (2026-10-20) |
| [07](07-square-primitives.md) | Square, flat shared primitives app-wide | 01 | M | Sonnet | done (2026-10-20) |

Recommended order: **01 → 03 → 04 → 02 → 05 → 06 → 07**. 03 and 04 touch no shared files and may run in
parallel with 01. 01, 02, 07 all edit `src/styles/*.scss` and run **one after another**; 05 and 06 both
edit `src/features/home/**` and `src/Language/Home*.ts` and run one after another.
When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.

## 4. Rules for every executor
1. **Project rules (`CLAUDE.md`):** DRY; math/logic in `*.math.ts` / `src/lib/**` (no React), types in
   `*.types.ts`, views in `*.tsx`; **no `.tsx` over ~150 lines** — split instead; SCSS in
   `src/styles/**` with tokens as CSS custom properties; **every user-facing string through i18n**
   (`src/Language/*.ts` EN + `*.hu.ts` HU, read with `useI18n().t`); `///` doc comments on exported
   functions; short comments only; no pills; no new docs files.
2. **Owner preferences:** see §0 "Forbidden". Never add left-border/inset-left accent bars (use a
   background tint or colour). Derivatives labs (`payoff`, `binomial`, `black-scholes`, `heston`,
   `delta-hedging`) are **behaviour hands-off**: token/primitive restyles reach them, but do not edit
   their feature folders.
3. **Guides are shared:** several sessions work on guides; read `docs/GUIDES_PLAN.md` before touching
   anything under `src/features/guide/**` or `src/Language/guides/**`. These plans only *read* guide
   modules (05) and change the `--font-serif` token (01).
4. **Before editing, run `git status`.** (4.3) If a file this plan edits has uncommitted changes you did
   not make, stop and report — another session may own it.
5. **Platform:** Windows 11, Git Bash or PowerShell. Prefix smoke commands with `MSYS_NO_PATHCONV=1` in
   Git Bash.
6. **Standard checks:** `npx tsc -b`, `npx eslint <changed files>` (the repo has pre-existing lint errors
   in `src/i18n.tsx`; only report new ones), `npm run build` (also pre-renders every page), plus the
   plan's own tests and smoke command.
7. Hungarian strings: write them, but list every new HU string in the plan's Findings for owner review.

## 5. Definition of done (whole programme)
- `/` and `/hu/` render the new home: hero with fan figure, stats + Continue row, labs index with
  filter, tracks table, roadmap list, no arrows, no gradients, no pills, square edges.
- `npm run test:home` passes; `npm run build` passes; smoke over `/`, `/hu/`, `/black-scholes`,
  `/guide/derivatives`, `/yield-curve` shows no problems.
- Palette, fonts and radii come only from `tokens.scss`; switching dark/light works on every page.
- Ctrl K / the top-bar search opens a palette that finds labs and lessons in both languages.
- Lighthouse-style sanity: no layout shift from fonts (fontsource CSS loaded in `main.tsx`), hero
  animation disabled under reduced motion.
