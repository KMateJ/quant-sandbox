# Stochastic labs plans

Goal: the Stochastic Models area stops being a walkthrough ("Stochastic Studio" curriculum at
`/stochastic-models`) and becomes a set of **labs with their own sub-pages**, like Yield Curve → Desk. Each
lab owns its topic, visualisations are clean and readable, and the empty chapters 4–7 become real pages on
the Itô, GBM and Monte Carlo labs.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model (Sonnet
recommended) without this README's chat. Each plan ends with a ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-28** (commit `a4b1706`). If the code has moved on, the executor re-checks its
plan's "Current state" before editing.

## 1. Current state

| Piece | File | What it does |
|---|---|---|
| Studio module | `src/modules/registry.ts` (entry `id: "stochastic-models"`, ~L386) | path `/stochastic-models`, `homeFeatured: true`, `subNav: lessonNavItems()` (14 lessons), Component `StochasticModelsView` |
| Curriculum data | `src/features/stochastic-models/stochasticModels.curriculum.ts` | 7 chapters; ch. 1 (4 lessons: random-walk, rescaled-walk, why-sqrt-t, clt), ch. 2 (wiener-process, increments, covariance + **planned** transformations, quadratic-variation, brownian-bridge), ch. 3 (running-max, reflection, first-passage, hitting), ch. 4–7 empty, only link to `/ito-process`, `/gbm`, `/monte-carlo` |
| Studio pages | `StochasticModelsView.tsx`, `CurriculumPage.tsx`, `ChapterCard.tsx`, `ChapterGuides.tsx`, `LessonPage.tsx` (breadcrumb + prev/next footer), `LessonFrame.tsx` (number eyebrow, question, objective, Explore/Mathematics tabs) | the walkthrough the owner wants gone |
| Lesson bodies | `src/features/stochastic-models/*Lesson.tsx`, `*Explore.tsx`, `*Mathematics.tsx`, `*Prediction.tsx` + `*.math.ts` | ~85 files, 3675 lines of `.tsx` |
| Brownian lab | `src/features/brownian-motion/BrownianMotionView.tsx` (123 lines) + `components/BarrierPanel.tsx`, `BarrierPredict.tsx` | parameter sliders, 6 rainbow sample paths, 400-path quantile fan + terminal histogram, barrier/first-passage panel |
| Itô lab | `src/features/ito-process/` (`ItoStepper`, `ItoBothSides`, `ItoBothSidesErrors`) | one page |
| GBM lab | `src/features/gbm/` (`GbmView`, `GbmCentres`) | one page |
| Monte Carlo lab | `src/features/monte-carlo/` (convergence, distribution, exotic, worker) | one page |
| Sub-page pattern | `src/features/yield-curve/YieldCurvePages.tsx`, registry `subNav` on `yield-curve` / `delta-hedging` | `useParams()["*"]` picks the page; `App.tsx` mounts `${path}/*` when `subNav` is set; `seo.routes.ts` prerenders each subNav item |
| In-app redirects | `export const redirects = guideRedirects();` (`registry.ts` ~L535), mounted in `App.tsx` | `{ from, to }` list |
| Host redirects | `vercel.json` `redirects` | has a `?lesson=` → `/stochastic-models/:lesson` rule |
| i18n | `src/Language/StochasticModels(.hu).ts`, `BrownianFundamentals`, `WienerProcess`, `BrownianMotion`, `ItoProcess`, `Gbm`, `MonteCarlo` (+ `.hu`) | |
| Styles | `src/styles/_stochastic-models.scss` (709 lines), imported in `main.scss` | `.stoch-*` classes |
| Harnesses (exist) | `scripts/layout-audit.mjs`, `scripts/cdp-smoke.mjs` | geometry audit incl. `left-border-accent`; headless smoke |

Measured 2026-10-28, `layout-audit` dark 1280: failing pages `/stochastic-models/random-walk`,
`/stochastic-models/increments`, `/brownian-motion`, `/gbm`. Visual defects seen in screenshots:
- Lesson objective box uses a **left border accent** (owner forbids; `.stoch-learning-objective`).
- Brownian lab: six rainbow paths (noise, no story), barrier histogram from few paths is ragged, "Median
  hitting time" label clipped at the right, fan chart is a solid blue blob.
- Increment lesson "Every window restarted at zero": x-axis runs to 1.4 with an empty right half.

External references to the studio (all must be updated by plan 01): `src/features/guide/guide.meta.ts`
(`labs: ["stochastic-models", …]` on 5 guides), `src/lib/game/challenges.data.ts` (7 challenges
`moduleId: "stochastic-models"`), `src/features/home/home.viz.ts` (key `"stochastic-models"`),
`src/Language/guides/brownianProperties.ts` L110/L218 (`/stochastic-models/covariance`),
`scripts/seo-audit.test.mjs` L57–66, `scripts/clt.test.mjs` L11 (imports `features/stochastic-models/clt.math.ts`),
`vercel.json`, `src/styles/main.scss`.

### Gaps
| # | Gap | Plan |
|---|---|---|
| G1 | Walkthrough shell; lessons not owned by labs; no redirects | 01 |
| G2 | Brownian main page visuals are weak | 02 |
| G3 | Planned Brownian lessons 2.4–2.6 never built | 03 |
| G4 | Random-walk topic has no lab page of its own, only 4 lessons | 04 |
| G5 | Itô lab has one page; ch. 4 + martingale/Girsanov topics have no lab | 05 |
| G6 | GBM lab has one page; SDE topics (Euler, OU, jumps, correlation) have no lab | 06 |
| G7 | Monte Carlo lab has one page; variance reduction / Feynman–Kac missing | 07 |
| G8 | Cross-area sign-off | 08 |

## 2. Key decisions
- **No curriculum page, no chapter numbers, no prev/next walkthrough.** The registry sub-nav is the only
  navigation. The guide knowledge graph already plays the "learning path" role.
- **New module `random-walk`** (`/random-walk`) owns ch. 1 (random walk, rescaled walk, √t, CLT).
  **`brownian-motion`** owns ch. 2–3. Itô/GBM/MC get *new* pages, not moved ones.
- **URLs:** lessons become `/<module>/<lesson-id>` with the same ids (e.g. `/brownian-motion/increments`).
  Every old `/stochastic-models[/id]` URL redirects (in-app list + `vercel.json`, permanent).
- **Folders:** lesson files move with `git mv` into the owning feature folder (`features/random-walk/`,
  `features/brownian-motion/lessons/`). Files used by both owners go to `src/components/lesson/` (tsx/hooks)
  or `src/lib/stochastic/` (pure `.math.ts`/`.types.ts`). `features/stochastic-models/` is deleted.
- **Lesson frame keeps** title, question, Explore/Mathematics tabs and the intuition trigger; drops number
  eyebrow, breadcrumb and footer; the objective box loses its left border.
- `homeFeatured` moves from `stochastic-models` to `brownian-motion`.

## 3. Plans, order, status
| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-dissolve-studio.md) | Dissolve studio: move lessons, routes, redirects | – | L | Opus/Sonnet | done (2026-10-28) |
| [02](02-brownian-lab-redesign.md) | Brownian main page redesign | – | M | Sonnet | done (2026-10-28) |
| [03](03-brownian-new-pages.md) | Brownian: transformations, quadratic variation, bridge | 01 | L | Sonnet | done (2026-10-28) |
| [04](04-random-walk-lab.md) | Random Walk lab main page | 01 | M | Sonnet | done (2026-10-28) |
| [05](05-ito-pages.md) | Itô: integral sums, Itô's lemma, martingales, Girsanov | – | L | Sonnet | done (2026-10-28) |
| [06](06-sde-pages.md) | GBM/SDE: Euler vs exact, OU, jumps, correlated BMs | – | L | Sonnet | done (2026-10-28) |
| [07](07-monte-carlo-pages.md) | Monte Carlo: variance reduction, Feynman–Kac | – | M | Sonnet | done (2026-10-28) |
| [08](08-final-qa.md) | Final QA | all | S | Sonnet | done (2026-10-28) |

**Start in parallel right away:** 01, 02, 05, 06, 07. **After 01:** 03, 04.
02 and 01 both touch `features/brownian-motion/`: 01 only *adds* `BrownianMotionPages.tsx` and `lessons/`;
02 only edits `BrownianMotionView.tsx` and `components/`. No overlap.
Executors claim a plan by setting its `Status:` line to `in progress (claimed <date>)`, and set the table row
to `done (<date>)` when finished.

## 4. Rules for every executor
- Read `CLAUDE.md`. Hard rules: DRY, separation of concerns (`*.math.ts` pure, no React; strings in
  `src/Language/**`, EN **and** HU), **`.tsx` ≤ ~150 lines**.
- Owner taste: square-ish edges, one accent, no gradients/neon, **no left-border accents** (use background
  or colour), no pills for nav/decorative labels, visualisations dominant. No inline quizzes in guides
  (labs may have Predict steps). HU terms: drift, call/put stay English.
- Shared files (`registry.ts`, `main.scss`, `src/Language/index.*.ts`, `vercel.json`): re-read right before
  editing, append/replace **only your own lines**, keep other plans' edits.
- No `git stash` (parallel sessions). Do not commit unless asked.
- Audit on a private build, not the shared `dist/` or port 4173 (other sessions use them):
  ```bash
  S=$(mktemp -d); npx vite build --outDir "$S/dist" >/dev/null && (npx vite preview --outDir "$S/dist" --port 4191 --strictPort &) ; sleep 4
  MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4191 --port 9351 --paths "<paths>" --widths 360,768,1280 --themes light,dark --out "$S/audit"
  ```
  Then open a few screenshots with Read and look at them. Stop the server afterwards.
- Standard checks: `npx tsc -b`, `npx eslint <changed files>`, relevant `node --test scripts/*.test.mjs`.

## 5. Definition of done
- `/stochastic-models` and every `/stochastic-models/<id>` (and `/hu/…`) redirect to the new home.
- Sidebar shows Random Walk, Brownian Motion, GBM, Itô, Monte Carlo, each with sub-pages; no "Studio".
- Every new/changed page passes `layout-audit` at 360/768/1280, light+dark, EN+HU.
- `npm run build`, `tsc -b`, all `scripts/*.test.mjs` touched by these plans pass.
