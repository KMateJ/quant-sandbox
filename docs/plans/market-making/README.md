# Market making plans

**Pack status: READY (2026-10-28).** Claim plans on their `Status:` line; see §3 for order.

Goal: a new **Market Microstructure** area in Quant Sandbox with six hands-on labs (order book, market
making, Avellaneda–Stoikov, Glosten–Milgrom, Kyle, spread estimation) and one full **Market Making Desk**
game built on the shared game kit. Every lab is something you *play with*: you click the book, drag your
quotes while customers arrive, draw a policy, trade as the insider, or classify a tape. Sliders are only the
precise/keyboard alternative.

The owner shared nine mockups as **ideas, not specs** (a dense market-making terminal, a strategy lab, and
"Liquidity Provider / Order Book / Spread Decomposition / Glosten–Milgrom" lab sketches with a
Simulate · Predict · Challenge switch, plus two lesson pages). Take the spirit (one dominant interactive
figure, live readouts, predict-first, challenge mode) and **apply the house style**, not their rounded,
multi-colour look. The guide track ("Market microstructure" lessons) is **out of scope**: it will be its own
pack later (owner decision 2026-10-28).

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor (Sonnet recommended)
without the chat that produced it. Each plan ends with a ready-to-paste **handoff prompt**. Sessions
coordinate through the status table below and the append-only [`LOG.md`](LOG.md).

Snapshot taken: **2026-10-28** (commit `a4b1706`, clean tree). If the code has moved on, re-check your
plan's "Current state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Module registry | `src/modules/registry.ts` (473 lines) | `ModuleCategory` union L15–21, `CATEGORY_ORDER` L60, `CATEGORY_LABEL_KEYS` L69, `CATEGORY_DESC_KEYS` L78, `CATEGORY_ACCENT` L88; `modules` array; Sandbox entry is the last module (no category) |
| Category consumers | `TopNavigation.tsx`, `MobileNav.tsx`, `Sidebar.tsx`, `useSearchItems.ts` (all `src/components/layout/`), `src/features/home/home.data.ts` (`LAB_CATEGORIES`), `HomeLabCategory.tsx`, `src/seo.routes.ts`, `src/seo.markdown.ts` | All iterate `CATEGORY_ORDER` / the label maps, so a new category appears everywhere once the maps have it |
| Home tiles | `src/features/home/home.viz.ts` (`MODULE_VIZ[moduleId]`, 120×64 box, checked by `scripts/home.test.mjs`), `src/components/layout/ModuleIcon.tsx` (`ICONS[moduleId]`, 24×24 stroke glyphs, fallback dot) | Per-module mini chart and icon |
| Module copy | `src/Language/Home.ts`/`.hu.ts` (`nav*`, `cat*` keys), `src/Language/Seo.ts`/`.hu.ts` (`seoTitle*`, `seoDesc*`), `src/Language/ModuleAbout.ts`/`.hu.ts` (`about<Prefix>Intro`, `Q1..A4`, read by `moduleAbout(prefix, n)` in `src/modules/moduleAbout.ts`) | Every module needs these |
| SEO checks | `scripts/seo-audit.test.mjs` (`npm run test:seo`) | Lab pages need **≥ 400 words** (`MIN_WORDS.lab`) and an About section that **links to a guide lesson** (via `relatedGuides`) |
| Lab primitives | `src/components/layout` (`PageHeader`, `Workspace`, `Panel`, `ChartContainer`), `src/components/ui` (`Tabs`, `SegmentedControl`, `PredictReveal`/`usePredictReveal`, `PredictExplain`, `RangeGuess`, `ChallengeRecord`, `useChallengeStats`, `StatCard`, `DataTable`, `InfoTooltip`, `HelpDrawer`), `src/components/charts` (`LineChart`, `ScatterChart`, `Histogram`, `DraggableBars`, `DragHandles`, `SketchLayer` (modes `curve`/`line`), `CapitalSplitBar`, `WaterfallChart`, `useScatterDrag`, `SERIES_PALETTE`), `src/components/playback` (`usePlayback`, `PlaybackControls`, `useTicker`, `prefersReducedMotion`), `src/components/SeedControl.tsx`, `src/components/useUrlState.ts` + `src/lib/urlState.ts` | Reuse; do not build private copies |
| Challenges | `src/lib/game/challenges.data.ts` (`ChallengeArea` = stochastic/portfolio/rates/corporate; `CHALLENGES`), `src/lib/game/game.types.ts` (`ChallengeKind` = guess/range/pick/draw/place), `src/lib/game/challengeScores.ts` (`recordChallenge(id, hit, now)`), `src/features/sandbox/sandbox.math.ts` (`AREA_ORDER`), `src/Language/Sandbox.ts` (`sbxArea_*`, `sbxCh_<id>`) | `scripts/challenge-scores.test.mjs` requires the **set of call-site ids to equal `CHALLENGES` exactly** (regex `challengeId: "id"` or `const CHALLENGE = "id"` in `src/features/**`) |
| Game kit | `src/lib/game/*` (pure: objectives, progress, seed, demo, advice), `src/components/game/*` (`GameFrame`, `CommandBar`, `QuoteStrip`, `DeskGrid`, `ScreenTabs`, `FunctionKeyBar`, `ViewControls`, `HelpSheet`, `MissionList`, `MissionBriefing`, `DebriefBanner`, `AttributionBars`, `PolicyTable`, `useGameHelp`, `useDemoPlayer`), `src/styles/_game-kit.scss` (`.gdesk` amber terminal) | Built by `docs/plans/game-desks` (all done). Reference desk: `src/features/portfolio-desk/` |
| Desk routing | `src/features/immunization/ImmunizationPages.tsx` pattern; `withDeskCopy` in `src/languageLoader.ts`; desk copy tables registered in `src/Language/desks.en.ts`/`desks.hu.ts`; `src/features/sandbox/sandbox.data.ts` `DESK_IDS` | Desk = module `subNav` `[lab, desk]` + `<Module>Pages.tsx` |
| Workers | `src/features/monte-carlo/useMonteCarloLab.ts` L17 (`new Worker(new URL("./monteCarlo.worker.ts", import.meta.url), { type: "module" })`) | Pattern for heavy batch simulation |
| RNG | `src/lib/math/random.ts` (`makeRng(seed)`, `nextNormal`, `normals`, `nextGaussian`), `src/lib/game/seed.ts` (`subSeed`) | Deterministic seeds everywhere |
| Test loader | `scripts/lib/load-ts.mjs` → `importSrc("lib/…/x.ts")` | Relative imports only, `.ts` appended; no folder `index` imports |

Nothing in `src` models an order book, order flow, market-maker P&L, or any microstructure model
(searched `microstructure|order book|avellaneda|glosten|kyle`: no hits outside an unrelated demo string).
Existing guide lessons that fit as `relatedGuides` until the track exists: `random-walks`, `martingales`,
`filtrations`, `law-of-large-numbers-clt`, `risk-aversion`, `mean-reversion`, `returns-volatility`.

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | No microstructure category, modules, copy tables, partials, test scripts, challenge area | 01 |
| G2 | No order book, matching, order flow, maker ledger or quoting maths | 02 |
| G3 | Order book lab (walk the book, queue position, execution challenge) | 03, 04 |
| G4 | Market making lab (live quoting rounds, spread vs income, adverse selection replay) | 05 |
| G5 | Avellaneda–Stoikov lab (inventory skew, drawn policy, tournament) | 06 |
| G6 | Glosten–Milgrom lab (Bayesian maker, you-quote card game) | 07 |
| G7 | Kyle lab (you are the insider; estimate λ) | 08 |
| G8 | Spread estimation lab (classify a tape, Roll, effective spread, decomposition) | 09 |
| G9 | Market Making Desk game (engine, screen, missions/help/demo/debrief) | 10, 11, 12 |
| G10 | Cross-pack sign-off | 13 |

## 2. Key decisions

- **New category `microstructure`**, label "Market Microstructure" / HU "Piaci mikrostruktúra", after
  `stochastic` in `CATEGORY_ORDER`. Six modules, one featured (`market-making`). Plan 01 registers all six
  as **working stub pages** (header + About + FAQ, ≥ 400 words, passing `test:seo`) so every later plan only
  replaces its own `<Lab>View.tsx` and flips its own `status`. This removes almost every shared-file edit
  from the lab plans.
- **Modules** (ids, paths, folders, prefixes; fixed for the whole pack):

  | Plan | Module id / path | Folder | i18n prefix + table | SCSS partial | Challenge ids | Test files |
  |---|---|---|---|---|---|---|
  | 03–04 | `order-book` | `src/features/order-book/` | `obk` · `OrderBook.ts` | `_order-book.scss` | `obk-avg-price` (place), `obk-execution` (score) | `scripts/micro-order-book*.test.mjs` |
  | 05 | `market-making` | `src/features/market-making/` | `mkm` · `MarketMaking.ts` | `_market-making.scss` | `mkm-best-spread` (place), `mkm-round` (score) | `scripts/micro-market-making*.test.mjs` |
  | 06 | `avellaneda-stoikov` | `src/features/avellaneda-stoikov/` | `avs` · `AvellanedaStoikov.ts` | `_avellaneda-stoikov.scss` | `avs-reservation` (place), `avs-beat` (score) | `scripts/micro-avellaneda*.test.mjs` |
  | 07 | `glosten-milgrom` | `src/features/glosten-milgrom/` | `glm` · `GlostenMilgrom.ts` | `_glosten-milgrom.scss` | `glm-belief` (guess), `glm-quote` (score) | `scripts/micro-glosten*.test.mjs` |
  | 08 | `kyle` | `src/features/kyle/` | `kyl` · `Kyle.ts` | `_kyle.scss` | `kyl-lambda` (draw), `kyl-insider` (score) | `scripts/micro-kyle*.test.mjs` |
  | 09 | `spread-estimation` | `src/features/spread-estimation/` | `spe` · `SpreadEstimation.ts` | `_spread-estimation.scss` | `spe-roll` (guess), `spe-classify` (score) | `scripts/micro-spread*.test.mjs` |
  | 10–12 | desk at `/market-making/desk` | `src/features/market-making-desk/` | `mmd` · `MarketMakingDesk*.ts` (desk tables) | `_market-making-desk*.scss` | – | `scripts/micro-desk-*.test.mjs` |

- **One pure market core** in `src/lib/market/` (plan 02): integer-tick limit order book with price–time
  priority, Poisson order flow with noise and informed traders, a maker ledger with an exact P&L
  decomposition (spread capture + adverse selection + inventory + fees = total), and the
  Avellaneda–Stoikov / exponential-intensity quoting formulas. The order book lab, market making lab,
  Avellaneda–Stoikov lab and the desk import it. Glosten–Milgrom, Kyle and spread estimation keep their
  models in their own `*.math.ts` (one consumer each).
- **Interaction bar for every lab** (this is the owner's main ask, "not just line charts with sliders"):
  1. One **dominant, directly manipulated figure** (click a ladder row, drag a quote line, draw a curve,
     drag an order bar, tap B/S on a tape). Sliders only as the precise/keyboard alternative.
  2. **Time you can feel:** play / pause / step / speed through `useTicker` or `usePlayback`; with
     `prefers-reduced-motion`, step manually instead of auto-playing.
  3. **Simulate · Predict · Challenge** mode switch (`SegmentedControl`) in the header actions. Predict is a
     committed guess revealed against the truth; Challenge is a scored round saved through
     `recordChallenge` and listed on `/sandbox`.
  4. **You vs theory:** your result is always shown next to the model's (Bayes maker, Kyle optimum, AS
     quotes, Roll estimate) on the same seed, so the lesson is the gap.
  5. **One surprise per lab** written into the plan (e.g. "Roll underestimates the spread when traders are
     informed"), with a `PredictExplain` question that sets it up.
  6. Full keyboard path, deterministic seeds (`SeedControl`), URL state for the setup.
- **House style wins over the mockups** (owner memory): square corners (`var(--radius-xs)`), 1px
  hairlines, no gradients/glows/neon, no pills, **never left-border accents**, one blue key accent
  (`var(--primary)`), bids/buys `var(--positive)`, asks/sells `var(--negative)`, and every up/down also
  carries a sign or word. Only the desk uses the amber `.gdesk` terminal look.
- **Desk follows the game-desks recipe** exactly (engine → screen → missions/help/demo/debrief), desk id
  `mm`, class `mmd`, DOM id prefix `mmd-`, ticker `QSMM Market Maker`, code `MMKR <GO>`, progress key
  `qs.game.mm.progress.v1`. Missions keep market spec separate from objectives (empty objectives = free play).
- **Determinism:** same seed + same actions ⇒ same events, fills and scores. No `Math.random`/`Date.now`
  in maths or render (`Date.now()` only as the `now` argument of `recordChallenge`).

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-wiring.md) | Category, module stubs, copy tables, partials, test scripts | – | M | Sonnet | done (2026-10-28) |
| [02](02-market-core.md) | Market core: order book, flow, maker ledger, quoting | – | L | Sonnet | done (2026-10-28) |
| [03](03-order-book-ladder.md) | Order book lab I: live ladder, walk the book, predict | 01, 02 | L | Sonnet | done (2026-10-28) |
| [04](04-order-book-queue.md) | Order book lab II: your limit order, queue, execution challenge | 03 | M | Sonnet | done (2026-10-28) |
| [05](05-market-making-lab.md) | Market making lab: live quoting rounds | 01, 02 | L | Sonnet | done (2026-10-28) |
| [06](06-avellaneda-stoikov.md) | Avellaneda–Stoikov lab: skew, drawn policy, tournament | 01, 02 | L | Sonnet | done (2026-10-28) |
| [07](07-glosten-milgrom.md) | Glosten–Milgrom lab: Bayes maker and you-quote game | 01 | M | Sonnet | done (2026-10-28) |
| [08](08-kyle.md) | Kyle lab: trade as the insider, estimate λ | 01 | M | Sonnet | done (2026-10-28) |
| [09](09-spread-estimation.md) | Spread estimation lab: tape, Roll, decomposition | 01 | M | Sonnet | done (2026-10-28) |
| [10](10-desk-engine.md) | Market Making Desk engine + 5 missions | 02 | L | Sonnet | done (2026-10-28) |
| [11](11-desk-screen.md) | Desk route, frame and desk screen | 01, 10 | L | Sonnet | done (2026-10-28) |
| [12](12-desk-missions-help-demo.md) | Desk missions screen, help, demo, debrief | 11 | L | Sonnet | done (2026-10-28) |
| [13](13-final-qa.md) | Final QA across the area | all | M | Sonnet | done (2026-10-28) |

**Start in parallel on day one:** 01 and 02. Plans 07, 08 and 09 may also start on day one with their
pure-maths phase (it only touches their own folder); they wire their view once 01 is done.
**After 01 and 02:** 03, 05, 06 and 10 in parallel (07–09 continue). **After 10:** 11 (also needs 01).
**Must run one after another:** 03 → 04 (same folder and view), 10 → 11 → 12 (the screen imports the
engine; the missions plan fills stub files the screen creates). 13 last. Everything else in any order.

Shared files edited by several plans (additive only; re-read right before editing; never reorder or
rewrite other plans' lines): `src/modules/registry.ts` (lab plans change **only** `status` of their own
entry; 11 adds the desk `subNav`), `src/lib/game/challenges.data.ts` (each lab appends its own rows at the
end of `CHALLENGES`), `src/Language/Sandbox.ts`/`.hu.ts` (append `sbxCh_<id>` after the last `sbxCh_`
key), `src/Language/desks.en.ts`/`desks.hu.ts` and `src/styles/main.scss` (desk plans append at the end),
`src/features/sandbox/sandbox.data.ts` (11 adds one `DESK_IDS` line). `src/lib/market/ladder.ts`
(`ladderRows`, `windowCentre`) is created by whichever of plans 03 and 11 gets there first, with the
signature fixed in `03-order-book-ladder.md` step 1; the other imports it unchanged.

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Claim a plan first by setting its `Status:` line to `in progress (claimed <date>, <session name>)`.

## 4. Rules for every executor

### Project rules
- Read `CLAUDE.md`. Hard rules: DRY; maths in `*.math.ts` / `src/lib/**` (no React there); types in
  `*.types.ts`; **`.tsx` ≤ ~150 lines** (split in the same change); styles in SCSS under `src/styles/**`
  with tokens; **all user text through i18n** (`useI18n`), both EN and HU tables; `///` doc comments on
  exported functions and in `*.math.ts`; no comments on code you did not change.
- Owner style: see §2 "House style". Active/selected = background tint (`var(--surface-muted)`) + colour.
- Hungarian copy is a **draft**: follow the glossary (keep English: bid/ask, spread, market maker → "market
  maker", short/long, desk, payoff, drift; keep Hungarian: árjegyző may appear once in parentheses on first
  mention, ajánlati könyv for order book is fine, te-form). Every HU value must differ from its EN value
  (tests enforce this for Sandbox/desk tables); give loanword-only labels a qualifier. List new HU keys in
  your plan's Findings for owner review.
- Do not touch the derivatives labs (`src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging}`)
  or the other desks.
- `docs/LABS_PLAN.md`: append one Log line per plan (`- HH:MM market-making NN: <summary>`); edit nothing else.

### Lab recipe (plans 03–09)
Folder layout: `<lab>.types.ts`, `<lab>.math.ts` (or several `*.math.ts`), `<lab>.url.ts` (schema with
`urlNumber/urlEnum/urlBool` from `src/lib/urlState.ts`, used via `src/components/useUrlState.ts`),
`use<Lab>.ts` (state + derived values; React allowed), `<Lab>View.tsx` (composition only),
`components/*.tsx`. Copy goes in the lab's own table (plan 01 created it; append keys). Styles go in the
lab's own partial (plan 01 created and `@use`d it). Charts sit in `ChartContainer`/`Panel`; the page uses
`PageHeader` (with the mode switch in `actions` if `PageHeader` supports it, else directly under it) and
`Workspace`. Each lab's About copy already exists (plan 01); revise it only if the lab's behaviour makes a
sentence wrong, and note that in Findings.
Challenge wiring: append your rows to `CHALLENGES` (area `"microstructure"`), add `sbxCh_<id>` EN/HU, and
reference each id exactly once in `src/features/**` as `challengeId: "<id>"` (predict hooks) or
`const CHALLENGE = "<id>"` (score rounds calling `recordChallenge(CHALLENGE, hit, Date.now())`).

### Parallel sessions
- Never run `git stash`, `git checkout` or other tree-wide git commands: other sessions are editing.
  Compare with `git diff --quiet <rev> -- <files>`. If the shared tree is red because of another plan's
  half-done files, verify in a temporary `git worktree add --detach` copy (junction `node_modules`), then
  remove it.
- Read [`LOG.md`](LOG.md) before you start and before verification. Append one line (never edit others)
  for `CONTRACT` (you changed something another plan imports), `BLOCKED`, `DEVIATION`, and `DONE`.

### Standard verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox && npm run test:home
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "<your paths>,/hu<your paths>"
```
Stop the server afterwards and confirm the port is free (`netstat -ano | grep :4173`). Audit layouts with
`node scripts/layout-audit.mjs` against `vite preview`, never the dev server (its light theme is actually
dark). Windows: prefix CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash. Do not add dependencies; do not
commit or push unless asked.

## 5. Definition of done
- `/order-book`, `/market-making`, `/market-making/desk`, `/avellaneda-stoikov`, `/glosten-milgrom`,
  `/kyle`, `/spread-estimation` (plus `/hu/…`) are pre-rendered, in the sitemap, pass `test:seo`, appear
  under "Market Microstructure" in the top nav, sidebar, mobile nav, search and home.
- Each lab meets the §2 interaction bar: a directly manipulated main figure, playable time, Simulate ·
  Predict · Challenge, you-vs-theory, one written surprise, keyboard path, URL state.
- Twelve new challenges record plays/hits/streaks and show on `/sandbox` under "Market microstructure".
- The desk: five missions playable to the end, live objectives, help drawer with three tabs, a demo you
  can take over, a debrief with P&L attribution and a policy comparison, progress saved, listed on `/sandbox`.
- No `.tsx` over ~150 lines; no hard-coded English; colours via tokens; smoke and layout audit clean at
  360/768/1280/1536 in EN and HU, light and dark.

## 6. Post-merge checklist
- Owner reviews HU drafts listed in each plan's Findings, the About copy from plan 01, and the mission
  limits in plan 10's calibration table.
- The "Market microstructure" guide track is planned in `docs/plans/market-making-guides/` (its plan 01
  retargets each lab's `relatedGuides` to its lessons; its plan 05 shares `src/lib/market/informed.ts` with
  this pack's plan 05).
