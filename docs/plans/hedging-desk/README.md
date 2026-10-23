# Hedging Desk plans

Goal: a new page, **`/delta-hedging/desk`**, where the learner runs a short-call book like a trader on a
Bloomberg-style terminal. They step through a simulated price path day by day, buy and sell the stock
and listed options, watch the Greeks, scenario P&L and risk profile, and play **missions** with
pass/fail objectives. After expiry, a debrief shows where the P&L came from and how auto-hedging
policies would have done on the same path.

The approved design is the canvas **Hedging Desk — Trading Simulator**
(https://claude.ai/artifact/P4fn9LTKfX11jyxcgzGWXD). It has three boards: `Main.dc.html` (Desk),
`Missions.dc.html` and `Debrief.dc.html`. The prototype code in those boards is a reference for layout and
numbers. It is **not** to be copied: the real build reuses the repo's math, charts, i18n and tokens.
To view a board's source, use the Artifact tool's `read` action with `path: "project/Main.dc.html"`.
If the canvas is not available, the panel lists in plans 03–06 are enough to build from.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model (Sonnet
recommended) without this README's chat. Each plan ends with a ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-23** (commit `b0f23d3`). If the code has moved on, the executor re-checks its
plan's "Current state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Delta hedging lab | `src/features/delta-hedging/` (`DeltaHedgingView.tsx` 36 lines, `useDeltaHedging.ts`, `deltaHedging.math.ts` 111 lines, `deltaHedging.url.ts`, `components/*`) | Single-path discrete hedge, frequency study. **Owner: hands-off** (polish only). The desk must not change it. |
| Registry entry | `src/modules/registry.ts` L174–185 | `id: "delta-hedging"`, `path: "/delta-hedging"`, `status: "beta"`, no `subNav`, `Component: lazy(() => import("../features/delta-hedging/DeltaHedgingView"))` |
| Sub-page routing | `src/App.tsx` L25 | A module with `subNav` is mounted at `${path}/*`; the view reads `useParams()["*"]` (pattern: `src/features/stochastic-models/StochasticModelsView.tsx`) |
| Sub-page SEO | `src/seo.routes.ts` L23–45 | Every `subNav` item with a `descKey` becomes its own pre-rendered page (EN + `/hu/`). Description must be 50–160 chars (`scripts/seo-audit.test.mjs` L84) |
| Black–Scholes | `src/features/black-scholes/blackScholes.math.ts` | `blackScholesCall/Put/Delta/PutDelta/Gamma/Vega/Theta/PutTheta(S, K, T, r, sigma)`. **Theta is per year, vega per 1.00 of vol.** All return intrinsic or 0 when `T <= 0` |
| RNG | `src/lib/math/random.ts` | `makeRng(seed)` (mulberry32), `nextNormal(rng)`, `normals(n, rng)` |
| Stats | `src/lib/stats/moments.ts` | `mean`, `stdDev` (sample) |
| Charts | `src/components/charts/` | `LineChart` (visx): `data`, `xKey`, `series`, `xDomain`, `yDomain`, `referenceLines`, `curve: "linear"`, `layer(frame)` overlay. Series colours `SERIES_PALETTE[i]` = `var(--chart-N)`, `SERIES_ROLE.*` |
| URL state | `src/components/useUrlState.ts`, `src/lib/urlState.ts` | `useUrlState(schema)`; `urlNumber`, `urlEnum`; defaults while hydrating |
| UI primitives | `src/components/ui/` (`Tabs`, `SegmentedControl`, `InfoTooltip`, `DataTable`), `src/components/layout/` (`PageHeader`, `Panel`, `ChartContainer`) | Reuse; restyle inside the desk's scope class |
| i18n | `src/Language/<Name>.ts` + `<Name>.hu.ts`, spread in `src/Language/index.en.ts` / `index.hu.ts` | `useI18n().t(key, vars)`; nav labels live in `Home.ts` (`navDeltaHedging` L42) and SEO strings in `Seo.ts` (L30–31) |
| Styles | `src/styles/main.scss` (`@use "delta-hedging";` L31), `tokens.scss` | Tokens are CSS custom properties; radius tokens all 2px |
| Tests | `scripts/lib/load-ts.mjs` (`importSrc`), e.g. `scripts/chart-layout.test.mjs` | `node --test`. The TS loader resolves **relative imports only, by appending `.ts`** (no folder `index` imports). Each plan adds its own `scripts/hedging-desk-<area>.test.mjs`; `npm run test:hedging-desk` globs them |
| Smoke / layout | `scripts/cdp-smoke.mjs`, `scripts/layout-audit.mjs` | Headless checks against `vite preview` |

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | No trading engine: book, fills with spread, day stepping, breaches, Greeks, scenarios, missions | 01 |
| G2 | No route, sidebar entry, SEO page, terminal theme or page frame | 02 |
| G3 | Desk side columns: mission, risk, blotter, order ticket, option chain | 03 |
| G4 | Desk centre: price/shares, net delta, P&L, scenario matrix, risk profile, positions | 04 |
| G5 | Missions screen with briefing and unlock progress | 05 |
| G6 | Debrief: attribution, theta vs gamma, policy replay | 06 |
| G7 | Missions M2–M5 and the market events they need | 07 |
| G8 | Cross-width, language and accessibility sign-off | 08 |

## 2. Key decisions

- **A sub-page of the Delta hedging module, in its own feature folder.** The registry entry gains
  `subNav` (Lab → `/delta-hedging`, Hedging desk → `/delta-hedging/desk`). A small router
  `src/features/delta-hedging/DeltaHedgingPages.tsx` picks the lab or the desk. Everything else lives in
  **`src/features/hedging-desk/`**, so the hands-off lab files are not edited (`DeltaHedgingView.tsx`
  stays byte-identical).
- **One route, three screens.** Desk, Missions and Debrief are tabs of one page (`?screen=`), because
  the debrief needs the live run's state. URL holds only `m` (mission), `seed` and `screen`; the run
  itself (positions, fills, day) is React state from a pure reducer.
- **Pure engine first.** All trading logic is plain TS in `src/features/hedging-desk/engine/` (no
  React, no strings), unit-tested with `node --test`. The engine emits **structured events**; the UI
  formats them through i18n. This keeps EN/HU correct and lets every UI plan be tested by numbers.
- **Reuse Black–Scholes and the RNG** from §1. No new maths library and no new chart library: charts
  are `LineChart` with the `layer` overlay for bands and fill markers. The scenario matrix and the
  option chain are plain HTML grids.
- **Scoped terminal theme** (owner decision 2026-10-23): the desk's root element has class `hdesk`,
  which overrides the tokens inside it: near-black ground, **amber accent `#FB8B1E`**, `--font-mono`
  for everything, always dark whatever the site theme. Up/down colours are blue `#4FB3FF` and red
  `#FF5F57` (they differ in lightness, not only hue), always shown with a `+`/`−` sign. Square edges,
  no gradients, no pills, no left-border accents. The rest of the site keeps its blue accent.
- **Missions are data.** `MissionDef` objects with a market spec, starting book, limit band and
  objectives. M1 ships in plan 01; plan 07 adds M2–M5 and the engine features they need. Mission copy
  lives in i18n tables keyed by mission id. Unlock progress is stored in `localStorage`.
- **Stub-file contract for parallel UI work.** Plan 02 creates every panel component as a stub with
  the final props `({ desk }: { desk: HedgingDeskModel })`. Plans 03–06 each own and fill a disjoint
  set of those files, so they never edit the same file.
- **Determinism.** The same `m` and `seed` give the same path, quotes and outcomes. No `Math.random`,
  no `Date.now` in render, so the pre-rendered HTML (day 0, seed 7) matches the first client render.

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-engine-core.md) | Trading engine core + unit harness | – | M | Sonnet | done (2026-10-23) |
| [02](02-route-shell-theme.md) | Route, registry, SEO, terminal theme, page frame, stubs | 01 | M | Sonnet | done (2026-10-23) |
| [03](03-desk-side-panels.md) | Desk side columns: mission, risk, blotter, ticket, chain | 01, 02 | M | Sonnet | done (2026-10-23) |
| [04](04-desk-charts.md) | Desk centre: charts, scenario matrix, risk profile, positions | 01, 02 | M | Sonnet | done (2026-10-23) |
| [05](05-missions-screen.md) | Missions screen, briefing, unlock progress | 01, 02 | S | Sonnet | done (2026-10-23) |
| [06](06-debrief.md) | Debrief: attribution, theta vs gamma, policy replay | 01, 02 | M | Sonnet | done (2026-10-23) |
| [07](07-missions-m2-m5.md) | Missions M2–M5 + market events | 01, 02 | M | Sonnet | done (2026-10-23) |
| [08](08-final-qa.md) | Final QA: widths, languages, a11y, owner review list | all | S | Sonnet | done (2026-10-23) |

**Start right away:** 01. **After 01:** 02. **After 02:** 03, 04, 05, 06 and 07 in parallel (disjoint
files; each adds its own i18n table and its own SCSS partial). **Last:** 08.

**Must run one after another:**
- 01 → 02: the page hook wires the engine reducer and imports its types.
- 02 → 03…07: they fill the stub files, helpers and mission table that 02 creates.
- 07 edits the engine files 01 created (`market.math.ts`, `book.math.ts`, `missions.data.ts`,
  `objectives.math.ts`, `desk.types.ts`). No other UI plan edits engine files; 04 and 06 add **new**
  engine files of their own.
- Plan 02 creates `src/Language/HedgingDeskMissions.ts` (M1 copy, objective and status labels) and the
  shared helpers `missionCopy.ts` / `deskFormat.ts`. Plans 05 and 07 append their own blocks to that
  table at the end; re-read before editing and keep the other plan's lines. Plans 03–06 otherwise each
  create their **own** i18n table and SCSS partial (named in each plan), so they never share a file.

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Executors working in parallel claim a plan first: `in progress (claimed <date>)` on its `Status:` line.

## 4. Rules for every executor

- Read `CLAUDE.md`. Hard rules: DRY; math in `*.math.ts` / `engine/*.ts` / `src/lib/**` (no React
  there); types in `*.types.ts`; **`.tsx` ≤ ~150 lines** (split in the same change); styles in SCSS
  under `src/styles/**` with tokens; **all user text through i18n** (both EN and HU tables, registered in
  `src/Language/index.en.ts` / `index.hu.ts`); `///` doc comments on exported functions; no comments on
  code you did not change.
- **Do not edit the existing lab:** `src/features/delta-hedging/DeltaHedgingView.tsx`, its
  `components/`, `useDeltaHedging.ts`, `deltaHedging.math.ts`, `deltaHedging.url.ts`, and
  `src/styles/_delta-hedging.scss` stay untouched. (Plan 02 adds one new file in that folder and edits
  the registry entry, nothing else.)
- Owner style: no pills or capsules; never left-border accents (use a background tint); square corners
  (`var(--radius-xs)`); no gradients, glows or colour floods; no marquee/ticker motion. Inside `.hdesk`
  the only accent is amber.
- Hungarian copy you write is a **draft**: list every new HU key in your plan's Findings for owner review.
- Shared files (registry, `index.en.ts`/`index.hu.ts`, `main.scss`, `Home.ts`, `Seo.ts`): re-read right
  before editing, make an **additive** edit at the stated insertion point, never reorder or rewrite
  other lines.
- Platform: Windows 11, Git Bash + PowerShell. Prefix CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash.
  Start servers with `--strictPort`; afterwards stop them and confirm the port is free
  (`netstat -ano | grep :4173`). Audit against `vite preview`, not the dev server.
- Do not add dependencies. Do not commit or push unless asked.
- Standard verification (every plan, after its own checks):

```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging,/delta-hedging/desk,/hu/delta-hedging/desk"
```

(`test:hedging-desk` exists once plan 01 is done. Before that, skip it and say so in Findings.)

## 5. Definition of done

- `/delta-hedging/desk` and `/hu/delta-hedging/desk` are pre-rendered, listed in the sitemap, reachable
  from the sidebar under Delta hedging, and pass `test:seo`.
- M1 can be played from day 0 to expiry with manual trades, auto-hedge and day stepping; objectives
  update live; the debrief shows the run's attribution and a policy comparison on the same path.
- M2–M5 are playable after unlocking; locked missions show their briefing and unlock rule.
- `npm run test:hedging-desk` covers accounting identities (P&L = premium + settlement + stock P&L −
  costs), determinism, breaches, objectives and each mission's special mechanics.
- No `.tsx` over ~150 lines; no hard-coded user-facing English; all colours via tokens inside `.hdesk`.
- Smoke and layout audit clean at 360 / 768 / 1280 / 1536 px in EN and HU; the existing lab at
  `/delta-hedging` is unchanged (its tests pass, its file hashes match `b0f23d3`).

## 6. Post-merge checklist

- Owner reviews the HU drafts listed in each plan's Findings.
- Owner plays M1 once on a fresh path and decides whether `status` of the Delta hedging module stays
  `beta`.
