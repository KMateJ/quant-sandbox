# Factor models and systemic risk plans

**Pack status: READY (2026-10-28).** Claim plans on their `Status:` line; see §3 for order.

Goal: two additions to **Portfolio & Risk**. (1) A **Fama–French lab** next to CAPM, built on a bundled
snapshot of the real Ken French Data Library factors: you build the factors yourself from a sort, decompose
a mystery fund by dragging its loadings, watch a CAPM alpha disappear as factors are added, and test which
model prices the 25 size/value portfolios. (2) A **Systemic Risk** module with three pages: a network
explorer you can edit, a shock simulation with a rescue game, and stylised historical episodes with
what-if switches.

The owner shared mockups as **ideas, not specs** (force-directed bank networks, contagion timelines, channel
toggles, episode timelines). Take the spirit and apply the house style. Owner decisions (2026-10-28):
**real Ken French data** (cited snapshot); systemic-risk institutions are **stylised archetypes** ("Dealer
bank A", "Money market fund"), with real dates and public events in the episodes but **no invented figures
attached to real firms**.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor (Sonnet recommended)
without the chat that produced it. Each ends with a ready-to-paste **handoff prompt**. Sessions coordinate
through the status table and the append-only [`LOG.md`](LOG.md).

Snapshot taken: **2026-10-28** (commit `a4b1706`; the working tree also has the in-progress
`docs/plans/market-making` pack: a `microstructure` category and six new modules already sit in
`src/modules/registry.ts`). Re-check your plan's "Current state" before editing; line numbers move.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Portfolio modules | `src/modules/registry.ts` entries `risk-return`, `capm` (`/capm`, `relatedGuides: ["capm", "efficient-frontier"]`), `portfolio-lab` (with desk `subNav`), `efficient-frontier` | Category `"portfolio"`; label key `catPortfolio` |
| CAPM lab | `src/features/capm/` (`capm.math.ts`: `assetRows`, `betaObservations`, `regressBeta`, `fittedLine`, `BETA_TOLERANCE`; `components/BetaTab.tsx` draw-a-line challenge) | Single-factor only; no multi-factor anything |
| Finance/stats libs | `src/lib/finance/capm.ts` (`beta`, `jensenAlpha`, `capmRegression`), `src/lib/stats/regression.ts` (`linearRegression` — one regressor), `src/lib/stats/moments.ts`, `src/lib/stats/distributions.ts` (`normCdf`, `normInv`), `src/lib/math/matrix.ts` (`transpose`, `matMul`, `matVec`, `inverse`, `symmetricEig`, `cholesky`) | **No multiple regression**, no t-statistics |
| Factor lesson | guide lesson `factor-models` (`src/Language/guides/factorModels.ts`; figure `FactorVarianceFigure.tsx`; `src/features/guide/guide.wave3.math.ts` L169 `factorRows`) | Teaches single-index variance split; links labs `capm`, `portfolio-lab` |
| Graph layout | `src/features/guide/guide.graph.layout.ts` (136 lines: `forceLayout(nodes, edges, options)`, `fitInto`, `placeLabels`, types `LayoutNode`, `LayoutEdge`, `Point`) | Seeded force-directed layout used by the guide knowledge graph |
| Graph viewport | `src/features/guide/components/graph/useGraphViewport.ts` (123 lines: `useGraphViewport(home, size)` → wheel zoom, pan, node drag, `wasDrag`; `fitView(bounds, w, h)`) and `GraphCanvas.tsx` (usage) | Pan/zoom/drag for SVG graphs |
| Lab primitives | `PageHeader`, `Workspace`, `Panel`, `ChartContainer`; `Tabs`, `SegmentedControl`, `PredictReveal`/`usePredictReveal`, `PredictExplain`, `ChallengeRecord`, `StatCard`, `DataTable`; charts `LineChart`, `ScatterChart`, `Histogram`, `DraggableBars` (with `shadows` ghost bars), `DragHandles`, `IntervalSelector` (`frame`, `from`, `to`, `onChange`, `bounds`, `minGap`, `snap`, `color`), `WaterfallChart` (`steps: { key, label, value, kind? }[]`), `HeatmapPicker` (`xValues`, `yValues`, `value(x, y)`, `onPick`, `selected?`, `scale?`), `SketchLayer`; `usePlayback`/`PlaybackControls`/`useTicker`; `SeedControl`; `useUrlState(schema)` | `writeUrlState` keeps keys the schema doesn't own, so several schemas can share one URL if their keys differ |
| Workers | `src/features/monte-carlo/useMonteCarloLab.ts` + `monteCarlo.worker.ts` | Pattern for batch simulation |
| Challenges | `src/lib/game/challenges.data.ts` (`ChallengeArea` includes `"portfolio"`), `ChallengeKind` (`guess`/`range`/`pick`/`draw`/`place`/`score`), `recordChallenge`, `src/Language/Sandbox.ts` `sbxCh_<id>` | `scripts/challenge-scores.test.mjs`: call-site ids (`challengeId: "id"` or `const CHALLENGE = "id"` in `src/features/**`) must equal `CHALLENGES` exactly |
| SEO | `scripts/seo-audit.test.mjs` | Lab pages ≥ 400 words and an About that links a lesson (`relatedGuides`). Sub-pages (`subNav` with `descKey`) are pre-rendered too and also show the module's About (`src/App.tsx` L29) |

Nothing models factor sorts, multi-factor regressions, financial networks, contagion or fire sales. There
are **no bundled datasets** yet (no `.json` over 5 KB in `src` or `public`).

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | Ken French data snapshot, OLS with t-stats, factor maths, `fama-french` module shell | 01 |
| G2 | Mystery-fund decomposition and alpha hunt | 02 |
| G3 | Build-the-factors sort and 25-portfolio cross-section | 03 |
| G4 | `systemic-risk` module shell (three pages), shared graph layout/viewport, generic network chart | 04 |
| G5 | Network generators, systemic metrics, multi-channel contagion engine | 05 |
| G6 | Network explorer page | 06 |
| G7 | Shock simulation page with rescue game and fragility sweep | 07 |
| G8 | Historical episodes page | 08 |
| G9 | Sign-off | 09 |

## 2. Key decisions

- **Placement:** both in category `"portfolio"`. `fama-french` (`/fama-french`, prefix `ffm`) right after
  `capm`; `systemic-risk` (prefix `syr`) after `efficient-frontier` with `subNav` pages `/systemic-risk`
  (Network), `/systemic-risk/shocks`, `/systemic-risk/episodes`, routed by `SystemicRiskPages.tsx`.
- **Data (Fama–French):** a one-time script converts Ken French's CSVs into
  `src/features/fama-french/data/famaFrench.json` (monthly FF5 + momentum + RF, 25 size×B/M value-weighted
  portfolios, 10 industry portfolios, from 1963-07 to the latest full year), loaded with dynamic `import()` so
  it is its own chunk and never in pre-rendered HTML. Attribution line on the page and in About.
- **Synthetic funds on real factors:** the "mystery funds" are built from the real factor series with hidden
  loadings, a hidden alpha and noise (seeded), so the reader's answer can be checked exactly; real industry
  portfolios are offered as "no answer key" cases.
- **One shell per module, tabs/pages owned by different plans:** plan 01 creates the Fama–French view with
  four stub tab components and separate copy tables/partials, so 02 and 03 work in different files; plan 04
  does the same for the three systemic pages. Each tab/page owns its own hook and URL keys.
- **Shared graph code moves to shared places (DRY):** `forceLayout`/`fitInto`/`placeLabels` →
  `src/lib/graph/forceLayout.ts`; `useGraphViewport`/`fitView` → `src/components/charts/network/
  useGraphViewport.ts`. The old guide files become one-line re-exports, so guide code and
  `scripts/guide-graph.test.mjs` keep working unchanged. A generic `NetworkGraph` chart (nodes/edges by props,
  no finance) lives next to it.
- **Systemic engine is pure and seeded** (`src/features/systemic-risk/engine/`): stylised balance sheets,
  exposures by type (interbank, repo, derivatives), common asset holdings; day-by-day contagion with four
  channels — direct counterparty losses (sequential default rounds with loss given default), fire sales
  (deleveraging to a target leverage, linear price impact, mark-to-market for every holder), funding runs
  (short-term funding withdrawn below a capital trigger), and CCP loss mutualisation — plus interventions
  (capital injection, liquidity facility). DebtRank and eigenvector centrality as systemic-importance metrics.
- **Interaction bar for every tab/page** (owner's main ask, "not just line charts with sliders"): a directly
  manipulated main figure (drag loadings, drag sort breakpoints, draw an exposure between two nodes, click a
  node to fail it, inject capital by clicking); time you can play/step; Simulate · Predict · Challenge where it
  fits; you vs model on the same seed; one written surprise; keyboard path; URL state.
- **House style** (owner memory): square corners, 1px hairlines, no gradients/glows/neon, no pills, never
  left-border accents, one blue key accent `var(--primary)`; categorical node kinds use `SERIES_PALETTE`
  plus a legend with words; status is never colour alone (defaulted nodes are hollow with a cross,
  stressed nodes get a dashed ring).

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-ff-foundation.md) | Fama–French data, OLS, factor maths, module shell | – | L | Sonnet | done (2026-10-28) |
| [02](02-ff-fund-and-alpha.md) | Fama–French: mystery fund and alpha hunt tabs | 01 | L | Sonnet | done (2026-10-28) |
| [03](03-ff-sort-and-cross-section.md) | Fama–French: build-the-factors sort and cross-section tabs | 01 | L | Sonnet | done (2026-10-28) |
| [04](04-systemic-foundation.md) | Systemic risk shell, shared graph code, network chart | – | M | Sonnet | done (2026-10-28) |
| [05](05-systemic-engine.md) | Systemic engine: networks, metrics, contagion | – | L | Sonnet | done (2026-10-28) |
| [06](06-network-explorer.md) | Network explorer page | 04, 05 | L | Sonnet | done (2026-10-28) |
| [07](07-shock-simulation.md) | Shock simulation page: rescue game, fragility sweep | 04, 05 | L | Sonnet | done (2026-10-28) |
| [08](08-historical-episodes.md) | Historical episodes page | 04, 05 | M | Sonnet | done (2026-10-28) |
| [09](09-final-qa.md) | Final QA | all | M | Sonnet | done (2026-10-28) |

**Start in parallel on day one:** 01, 04, 05. **After 01:** 02 and 03 in parallel. **After 04 and 05:** 06,
07, 08 in parallel (05 is pure maths and may also be built while 04 runs; 06–08 can build components
against `engine/systemic.types.ts` as soon as 05 has committed it — see 05 step 1). **Last:** 09.
**Must run one after another:** only the dependencies above (shell → tabs/pages that replace its stubs).

Shared files edited by several plans (additive only; re-read right before editing; never reorder or
rewrite other plans' lines): `src/modules/registry.ts` (01 and 04 each add one entry; later plans change
only their own entry's `status`), `src/lib/game/challenges.data.ts` (each plan appends its own rows),
`src/Language/Sandbox.ts`/`.hu.ts` (append `sbxCh_<id>`), `src/Language/index.en.ts`/`index.hu.ts`,
`Home.ts`, `Seo.ts`, `ModuleAbout.ts` (+ `.hu`), `src/features/home/home.viz.ts`,
`src/components/layout/ModuleIcon.tsx`, `src/styles/main.scss`, `package.json` (01 and 04 only).

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Claim a plan first by setting its `Status:` line to `in progress (claimed <date>, <session name>)`.

## 4. Rules for every executor

### Project rules
- Read `CLAUDE.md`. Hard rules: DRY; maths in `*.math.ts` / `src/lib/**` (no React there); types in
  `*.types.ts`; **`.tsx` ≤ ~150 lines** (split in the same change); styles in SCSS under `src/styles/**`
  with tokens; **all user text through i18n**, EN and HU tables with identical keys (`index.hu.ts` ends with
  `satisfies Record<BaseKey, string>`, so a missing HU key is a compile error); `///` doc comments on
  exported functions and in `*.math.ts`; no comments on code you did not change.
- Hungarian copy is a **draft** (glossary: keep English: short/long, spread, payoff, drift, desk; keep
  Hungarian: Sharpe-mutató, hatékony front, kockáztatott érték (VaR); "faktor", "faktorkitettség",
  "rendszerkockázat", "fertőzés (contagion)" on first mention; te-form). HU ≠ EN for every key. List new HU
  keys in Findings.
- Do not touch the derivatives labs, the desks, or `docs/plans/market-making` files. Guide files only where
  plan 04 names them (re-export shims).
- `docs/LABS_PLAN.md`: append one Log line per plan (`- HH:MM factor-systemic NN: <summary>`).

### Lab recipe
`<x>.types.ts`, `<x>.math.ts`, `<x>.url.ts` (keys unique per tab/page — prefix them, e.g. `fund`, `fm`,
`sortSz`), `use<X>.ts`, `<X>.tsx` composition only, `components/*.tsx`. Challenge wiring: append your rows
to `CHALLENGES` (area `"portfolio"`), add `sbxCh_<id>` EN/HU, reference each id exactly once in
`src/features/**` as `challengeId: "<id>"` (predict hooks) or `const CHALLENGE = "<id>"` (score rounds
calling `recordChallenge(CHALLENGE, hit, Date.now())`).

### Parallel sessions
- Never run `git stash`, `git checkout` or tree-wide git commands. Compare with `git diff --quiet <rev> --
  <files>`. If the shared tree is red because of someone else's half-done files, verify in a temporary
  `git worktree add --detach` copy (junction `node_modules`), then remove it.
- Read [`LOG.md`](LOG.md) before starting and before verification; append `CLAIM`, `CONTRACT`, `BLOCKED`,
  `DEVIATION`, `DONE` lines (never edit others).

### Standard verification
```bash
npx tsc -b && npm run lint && npm run test:fama-french && npm run test:systemic-risk && npm run test:challenges && npm run test:sandbox && npm run test:home
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "<your paths>,/hu<your paths>"
```
(`test:fama-french` comes from plan 01, `test:systemic-risk` from plan 04; before they exist run your
`node --test scripts/<file>.test.mjs` directly.) Stop the server; confirm the port is free (`netstat -ano |
grep :4173`). Layout audits with `node scripts/layout-audit.mjs` against `vite preview`, never the dev
server. Windows: prefix CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash. No new dependencies; no commits
or pushes unless asked.

## 5. Definition of done
- `/fama-french`, `/systemic-risk`, `/systemic-risk/shocks`, `/systemic-risk/episodes` (+ `/hu/…`)
  pre-rendered, in the sitemap, pass `test:seo`, listed under Portfolio & Risk in nav, sidebar (systemic risk
  with its three sub-pages), search and home.
- Fama–French: four tabs meet the interaction bar; regressions match the OLS reference within 1e-9; the data
  attribution is visible; the data chunk is not requested on other pages.
- Systemic risk: an editable network, a playable multi-channel shock with interventions and a rescue game, and
  four stylised episodes with what-if switches; no invented figures attached to real firms.
- Challenges recorded and listed on `/sandbox`; no `.tsx` over ~150 lines; smoke and layout audit clean at
  360/768/1280/1536, EN/HU, light/dark; guide graph unchanged (`test:guide-graph` green).

## 6. Post-merge checklist
- Owner reviews HU drafts, the About copy, the episode texts (dates and events), challenge thresholds.
- Refresh the Ken French snapshot yearly with the plan 01 script (`npm run data:fama-french`).
