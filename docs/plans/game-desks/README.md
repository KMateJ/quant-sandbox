# Game desks plans

**Pack status: READY (2026-10-24).** Claim plans on their `Status:` line; see §3 for order.

Goal: four new Bloomberg-style **desk games** (ALM, rates, portfolio, retirement) built on a **shared game
kit** extracted from the Hedging Desk, each with five missions, live help (next move / what if / guide),
a playthrough demo and a debrief. A new **Sandbox** page (`/sandbox`) lists every desk and every lab
challenge with saved scores. Each desk also lives as a sub-page of its module.

Design reference (approved by the owner): canvas **Quant Sandbox — Game Desks**,
https://claude.ai/artifact/RN8a5mqAh8kqEfZEy7KBBp. Boards: `Main.dc.html` (hub), `AlmDesk.dc.html`,
`RatesDesk.dc.html`, `PortfolioDesk.dc.html`, `RetirementDesk.dc.html`. If your environment has the
Artifact tool, read a board with `action: "read"`, `path: "project/<Board>.dc.html"`. The prototype code
is a layout and behaviour reference; **do not copy its maths** where this pack names repo code to reuse.
The built Hedging Desk (`/delta-hedging/desk`) is the reference for look and interaction.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor (Sonnet
recommended) without the chat that produced it. Each plan ends with a ready-to-paste **handoff prompt**.
Sessions coordinate through the status table below and the append-only [`LOG.md`](LOG.md).

Snapshot taken: **2026-10-23** (commit `73f67d7`; working tree has ~111 uncommitted HU copy edits in
`src/Language/**` from another session; leave them alone). If the code has moved on, re-check your plan's
"Current state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Hedging Desk | `src/features/hedging-desk/` (97 files, ~4,500 lines) | Complete desk game: engine, 5 missions, help drawer, demo, debrief. Mounted at `/delta-hedging/desk` via `src/features/delta-hedging/DeltaHedgingPages.tsx` and registry `subNav` (registry L174–189) |
| Desk styles | `src/styles/_hedging-desk*.scss` (9 used + 1 not `@use`d), `main.scss` L33–41 | `.hdesk` token block (amber terminal), frame, panels, help, demo |
| Desk tests | `scripts/hedging-desk-*.test.mjs` (10 files), `npm run test:hedging-desk` | Engine, charts, debrief, missions, side panels, demo, help |
| Shared hooks | `src/components/useFullscreen.ts`, `useExpandInPage.ts`, `useUrlState.ts`, `layout/isTyping.ts`, `playback/useTicker.ts`, `ui/HelpDrawer.tsx`, `ui/Tabs.tsx`, `layout/Panel.tsx`, `layout/ChartContainer.tsx`, `charts/LineChart` | Already reused by the desk |
| Immunization game | `src/features/immunization/immunization.math.ts` (205 lines) | `newGame`, `drawShock`, `advance`, `rebalance`, `immunisedWeights`, `exposure`, `liabilityDuration/Convexity`, `surplusAttribution`, `benchmarks`. Par-coupon bonds at 2/5/12y + cash, liability 1,000,000 at 8y, uniform shocks (±100 parallel, ±50 twist, 10 bp steps), 5 bp cost |
| Curve maths | `src/features/yield-curve/yieldCurve.math.ts` L105 `factorLoadings(t)` (Nelson–Siegel, λ 0.6); `src/features/guide/guide.wave4.math.ts` ~L120 `cholesky`, ~L157+ `zeroAt`, `priceOnCurve`, `keyWeight`, `keyRateDurations`, `bulletCashflows`; `src/features/treasury-futures/treasuryFutures.math.ts` (`generalizedConversionFactor`, `cheapestBond`, `switchingPoints`) | No stochastic curve path or futures-from-curve pricing exists |
| Portfolio maths | `src/features/portfolio-lab/portfolioLab.math.ts` (`covFromCorr` L36, `portfolioMetrics` L136, `frontierCurve` L207, `riskContributions` L259), `src/lib/finance/portfolio.ts`, `src/lib/math/matrix.ts` (`inverse`, `symmetricEig`; **no Cholesky**) | No EWMA, risk parity, regimes or monthly simulator |
| TVM | `src/features/tvm/tvm.math.ts` (`sequenceWealth` L137, deterministic) | No Monte Carlo or stochastic returns |
| Lab challenges | `src/components/ui/usePredictReveal.ts`, `useRangeGuess.ts` (12 PredictReveal users, 3 RangeGuess users, plus `yield-curve/components/ShockPredict.tsx`) | Session-only history; nothing saved |
| Progress pattern | `src/features/hedging-desk/deskProgress.ts` + `useDeskProgress.ts` | localStorage key `qs.hedgingDesk.progress.v1`, `useSyncExternalStore`, cross-tab `storage` listener |
| RNG / URL | `src/lib/math/random.ts` (`makeRng`, `nextNormal`, `nextGaussian`), `src/lib/urlState.ts` (`urlNumber/Enum/Bool/String`) | Reuse everywhere |
| Test loader | `scripts/lib/load-ts.mjs` → `importSrc("features/…/x.ts")` | Relative imports only, `.ts` appended; no folder `index` imports |

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| G1 | Generic game logic (statuses, progress stores, challenge scores, demo fold, advice ranking, Cholesky) lives inside the hedging desk or nowhere | 01 |
| G2 | Generic frame UI and amber theme are hedging-only (`.hdesk`, `hd*` keys) | 02 |
| G3 | Hedging Desk duplicates what the kit will hold; known dead code (`adviceRun.ts`, unloaded `_hedging-desk-help-guide.scss`) | 03 |
| G4–G7 | ALM, rates, portfolio, retirement desks: engine, screen, missions/help/demo/debrief | 04–15 |
| G8 | No Sandbox page listing desks and challenges | 16 |
| G9 | Lab challenge rounds are not saved or scored across visits | 17 |
| G10 | Cross-desk sign-off | 18 |

## 2. Key decisions

- **One kit, two layers.** Pure logic in **`src/lib/game/`** (no React, testable with `node --test`);
  React frame in **`src/components/game/`**; theme in **`src/styles/_game-kit.scss`**; generic copy in
  **`src/Language/GameKit.ts`** (keys prefixed `gk`). Desks compose kit components and pass content as
  props; the kit knows nothing about options, bonds or portfolios.
- **Amber terminal for every desk.** The owner approved the canvas, where all desks share the Hedging
  Desk's look. The kit root class is **`.gdesk`** with the same tokens as `.hdesk` (black ground, amber
  `#FB8B1E`, blue `#4FB3FF` up, red `#FF5F57` down, `--font-mono`, always dark). This extends the
  "amber only inside `.hdesk`" exception to `.gdesk`; nowhere else.
- **Pointing and demo highlights without anchor lists.** The kit adds class `gdesk-pointed` to the
  element whose id is pointed (and `gdesk-demo-focus` in the demo) instead of the hand-mirrored SCSS
  `@each` anchor lists the hedging desk uses.
- **Progress key convention:** `qs.game.<deskId>.progress.v1`, record `{ completed: boolean; best: number | null }`.
  Desk ids: `hedging`, `alm`, `rates`, `portfolio`, `retirement`. The Sandbox reads these keys directly.
- **Missions are data, objectives optional.** Every engine separates the market/scenario spec from the
  objectives. A mission with `objectives: []` is free play; the kit hides objective UI when the list is
  empty. That is the hook for the owner's future **sandbox mode** (no goals, free simulation). Building
  sandbox mode is out of scope.
- **Reuse before writing.** ALM wraps `immunization.math.ts` (its par-bond and uniform-shock model wins
  over the canvas prototype's zeros and Gaussian shocks). Rates reuses `factorLoadings`, the curve-risk
  helpers (promoted to `src/lib/finance/curveRisk.ts`) and the conversion-factor maths. Portfolio reuses
  `covFromCorr`, `riskContributions`, `frontierCurve`. Cholesky moves to `src/lib/math/matrix.ts`.
- **Routes:** `/immunization/desk`, `/yield-curve/desk`, `/portfolio-lab/desk`, `/tvm/desk` (each module
  gains `subNav` `[Lab, Desk]` and a small `<Module>Pages.tsx` router, the delta-hedging pattern), and
  `/sandbox` (a registry module without a category, linked from every desk's command bar).
- **Five missions per desk now** (owner decision 2026-10-23).
- **Determinism:** same mission + seed ⇒ same path, advice, what-if numbers and debrief. No `Math.random`
  or `Date.now` in render.

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-kit-core.md) | Game kit core (pure) + Cholesky + challenge store | – | M | Sonnet | done (2026-10-24) |
| [02](02-kit-ui-theme.md) | Game kit UI frame + `.gdesk` theme + GameKit copy | 01 | L | Sonnet | done (2026-10-24) |
| [03](03-hedging-desk-on-kit.md) | Move the Hedging Desk onto the kit | 02 | L | Sonnet | done (2026-10-24) |
| [04](04-alm-engine.md) | ALM desk engine + 5 missions | 01 | M | Sonnet | done (2026-10-24) |
| [05](05-alm-desk-screen.md) | ALM desk route, frame and desk screen | 02, 04 | M | Sonnet | done (2026-10-24) |
| [06](06-alm-missions-help-demo.md) | ALM missions screen, help, demo, debrief | 05 | L | Sonnet | done (2026-10-24) |
| [07](07-rates-engine.md) | Rates desk engine + 5 missions | 01 | L | Sonnet | done (2026-10-24) |
| [08](08-rates-desk-screen.md) | Rates desk route, frame and desk screen | 02, 07 | M | Sonnet | done (2026-10-24) |
| [09](09-rates-missions-help-demo.md) | Rates missions screen, help, demo, debrief | 08 | L | Sonnet | done (2026-10-24) |
| [10](10-portfolio-engine.md) | Portfolio desk engine + 5 missions | 01 | M | Sonnet | done (2026-10-24) |
| [11](11-portfolio-desk-screen.md) | Portfolio desk route, frame and desk screen | 02, 10 | M | Sonnet | done (2026-10-24) |
| [12](12-portfolio-missions-help-demo.md) | Portfolio missions screen, help, demo, debrief | 11 | L | Sonnet | done (2026-10-24) |
| [13](13-retirement-engine.md) | Retirement desk engine + 5 missions | 01 | M | Sonnet | done (2026-10-24) |
| [14](14-retirement-desk-screen.md) | Retirement desk route, frame and desk screen | 02, 13 | M | Sonnet | done (2026-10-24) |
| [15](15-retirement-missions-help-demo.md) | Retirement missions screen, help, demo, debrief | 14 | L | Sonnet | done (2026-10-24) |
| [16](16-sandbox-hub.md) | Sandbox page: desks and challenges | 02 | M | Sonnet | done (2026-10-24) |
| [17](17-challenge-scores.md) | Save and score lab challenges | 01 | M | Sonnet | done (2026-10-24) |
| [18](18-final-qa.md) | Final QA across desks, Sandbox and the Hedging Desk | all | M | Sonnet | done (2026-10-24) |

**Start on day one:** 01. **After 01:** 02, 04, 07, 10, 13 and 17 in parallel. **After 02:** 03 and 16;
each desk screen (05, 08, 11, 14) as soon as its engine is also done. **After each screen:** that desk's
missions/help plan (06, 09, 12, 15). **Last:** 18.

**Must run one after another** (and why):
- 01 → everything that imports `src/lib/game` (types and helpers).
- 02 → 03, 05, 08, 11, 14, 16 (they compose kit components).
- Engine → its screen → its missions/help plan: the screen plan creates the view and the stub files the
  missions/help plan fills; both import the engine.
- 03 must not start while `docs/plans/hedging-desk-demo/09-help-qa.md` is `in progress` (same folder).

Shared files edited by several plans (additive edits only; re-read right before editing; never reorder
or rewrite other plans' lines): `src/modules/registry.ts` (one module entry each), `src/Language/index.en.ts`
/ `index.hu.ts` (append imports and spreads at the end), `src/Language/Home.ts` / `.hu.ts` and `Seo.ts` /
`.hu.ts` (append after the module's existing keys), `src/styles/main.scss` (append `@use` lines at the
end), `package.json` (one script line each).

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.
Claim a plan first by setting its `Status:` line to `in progress (claimed <date>, <session name>)`.

## 4. Rules for every executor

### Project rules
- Read `CLAUDE.md`. Hard rules: DRY; maths in `*.math.ts` / `src/lib/**` (no React there); types in
  `*.types.ts`; **`.tsx` ≤ ~150 lines** (split in the same change); styles in SCSS under `src/styles/**`
  with tokens; **all user text through i18n**, both EN and HU tables, registered in
  `src/Language/index.en.ts` / `index.hu.ts`; `///` doc comments on exported functions; no comments on
  code you did not change.
- Owner style: no pills or capsules; **never left-border accents** (use background tint); square corners
  (`var(--radius-xs)`); no gradients, glows, colour floods or marquee motion; inside `.gdesk` the only
  accent is amber; up/down always carry a `+`/`−` sign or a status word, never colour alone.
- Hungarian copy is a **draft**: follow the glossary (keep English: short/long, call/put, drift, swap,
  futures, spread, payoff, strike, bid/ask, desk; keep Hungarian: duráció, Sharpe-mutató, hatékony front,
  kupon, görögök; te-form). List every new HU key in your plan's Findings. Every HU value must differ from
  its EN value (a test enforces this for desk tables); give loanword-only labels a qualifier.
- Do not touch the derivatives labs (`src/features/{payoff-lab,binomial,black-scholes,heston,delta-hedging}`)
  except where plan 03 explicitly names a file.
- Labs owned by other packs: `docs/plans/fixed-income-labs` plans 03/04/05/08/09/10 are `todo` and touch
  yield-curve, duration-convexity, treasury-futures and the registry. Your edits there are limited to the
  new `<Module>Pages.tsx` file, the module's registry entry, and additive exports named in your plan.
- `docs/LABS_PLAN.md`: append one Log line per plan (`- HH:MM game-desks NN: <summary>`); edit nothing else.

### Parallel sessions
- Never run `git stash`, `git checkout` or other tree-wide git commands: other sessions are editing.
  Compare with `git diff --quiet <rev> -- <files>`. If the shared tree is red because of another plan's
  half-done files, verify in a temporary `git worktree add --detach` copy (junction `node_modules`), then
  remove it.
- Before you start, read [`LOG.md`](LOG.md); read it again before running verification. Append one line
  (never edit others) when you change something another plan imports (`CONTRACT`), are blocked
  (`BLOCKED`), or deviate from your plan in a way others will feel (`DEVIATION`); add `DONE` when finished.

### Desk recipe (applies to plans 04–15)
Each desk lives in its own folder and owns its own tables and partials:

| Desk | Folder | Desk id | Code / ticker | i18n prefix + tables | DOM id prefix | SCSS partials | Route |
|---|---|---|---|---|---|---|---|
| ALM | `src/features/alm-desk/` | `alm` | `ALMD` / `PNSN Liability` | `almd` · `AlmDesk.ts`, `AlmDeskMissions.ts`, `AlmDeskHelp.ts` | `almd-` | `_alm-desk.scss`, `_alm-desk-help.scss` | `/immunization/desk` |
| Rates | `src/features/rates-desk/` | `rates` | `RATD` / `QSRB Bond Book` | `ratd` · `RatesDesk*.ts` | `ratd-` | `_rates-desk*.scss` | `/yield-curve/desk` |
| Portfolio | `src/features/portfolio-desk/` | `portfolio` | `PMGR` / `QSMA Multi-Asset Fund` | `pmgr` · `PortfolioDesk*.ts` | `pmgr-` | `_portfolio-desk*.scss` | `/portfolio-lab/desk` |
| Retirement | `src/features/retirement-desk/` | `retirement` | `RETR` / `QSRT Retirement Plan` | `retr` · `RetirementDesk*.ts` | `retr-` | `_retirement-desk*.scss` | `/tvm/desk` |

Folder layout per desk: `engine/` (pure: `<desk>.types.ts`, `market.math.ts` or equivalent,
`book.math.ts` with a `reduce<Desk>(state, action, ctx)` reducer, `objectives.math.ts`,
`policy.math.ts`, `missions.data.ts`), `help/` (pure `advice.math.ts`, `whatIf.math.ts`,
`guide.data.ts`), `demo/demo.script.ts`, `<desk>.url.ts`, `use<Desk>.ts`, `<Desk>View.tsx`,
`components/`. Tests: `scripts/<desk-id>-desk-*.test.mjs`, run by one script
`"test:<desk-id>-desk": "node --test scripts/<desk-id>-desk-*.test.mjs"`.

### Standard verification
```bash
npx tsc -b && npm run lint && npm run test:game-kit && npm run test:hedging-desk
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "<your paths>"
```
Add your own desk test script. Stop the server afterwards and confirm the port is free
(`netstat -ano | grep :4173`). Audit layouts against `vite preview`, never the dev server. Windows: prefix
CDP commands with `MSYS_NO_PATHCONV=1` in Git Bash. Do not add dependencies; do not commit or push unless asked.

## 5. Definition of done
- `/immunization/desk`, `/yield-curve/desk`, `/portfolio-lab/desk`, `/tvm/desk` and `/sandbox` (plus
  `/hu/…`) are pre-rendered, in the sitemap, pass `test:seo`, and appear in the sidebar (desks) or from
  every desk's command bar (Sandbox).
- Each desk: five missions playable to the end, live objectives, help drawer with three tabs, a demo you
  can take over, a debrief with attribution and a policy comparison, progress saved under the key
  convention.
- The Hedging Desk behaves as before (all `test:hedging-desk` tests pass, smoke clean) but renders through
  the kit; `adviceRun.ts` duplication and the unloaded guide partial are resolved.
- Lab challenges record plays, hits and streaks; the Sandbox lists them with scores.
- No `.tsx` over ~150 lines; no hard-coded English in components; all colours via tokens inside `.gdesk`.
- Smoke and layout audit clean at 360/768/1280/1536 in EN and HU.

## 6. Post-merge checklist
- Owner reviews HU drafts listed in each plan's Findings and the mission limits recorded in each engine
  plan's Findings (are they solvable, too easy?).
- Owner decides the order of desks on the Sandbox page and whether the modules stay `beta`.
