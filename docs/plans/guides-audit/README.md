# Guides audit plans

Goal: every guide lesson meets the same standard (figure, retrieval checks, a worked example, both
languages in step, correct metadata), the docs and SEO texts describe the curriculum that actually exists,
the Stochastic Studio and the guide track point at each other, and the clear gaps in the curriculum
get lessons.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model
(Sonnet recommended) without this README or the chat that produced it. Each plan ends with a
ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-20** (commit `ee89f36` plus uncommitted work in the tree). If the code has
moved on, the executor re-checks its plan's "Current state" before editing.

## 1. Current state (what already works)

| Piece | File | What it does |
|---|---|---|
| Lesson registry | `src/features/guide/guide.meta.ts` (`guideLessons`, `guideTracks`) | 55 lessons in 5 tracks: derivatives 16, portfolio 8, fixed-income 8, corporate 8, stochastic 15. Order in the array = reading order. Each lesson: `id`, `track`, `titleKey`, `descKey`, `labs` (registry module ids) |
| Lesson ids | `src/features/guide/guide.types.ts` (`GuideId` union) | one string literal per lesson |
| Lesson text | `src/Language/guides/<camelCaseId>.ts`, collected in `src/Language/guides/index.ts` (`guideContent`) | `{ en: GuideBlock[], hu: GuideBlock[] }` built with `p, h, eq, list, steps, note, figure, lab` from `guides/blocks.ts`; `check` and `worked` blocks are written as object literals |
| Block types | `src/features/guide/guide.content.types.ts` | `GuideBlock` union, `GuideFigureId` union (63 ids), `GuideCheckAnswer`, `GuideWorkedStep` |
| Figures | `src/features/guide/components/figures/index.ts` (`guideFigures: Record<GuideFigureId, ComponentType>`) | every figure id has a component; folders `figures/`, `figures/interactive/`, `figures/interactive2/`, `figures/stochastic/` |
| Titles / descriptions | EN: `src/Language/Guide*.ts` (`*En` exports spread in `src/Language/index.en.ts`); HU: `src/Language/Guide*.hu.ts` (`*Hu` exports, spread in `index.hu.ts` **and** in `src/Language/guideTitles.hu.ts`) | a new string file must be added in all three places |
| SEO | `src/features/guide/guide.seo.ts` (`guideSeoTitles`, EN only), track SEO texts in `src/Language/Seo.ts` / `Seo.hu.ts` (`seoTitleGuide*`, `seoDescGuide*`) | 40 of 55 lessons have a search title |
| Graph + citations | `src/features/guide/guide.graph.ts` | `findLessonCitations`, `readingOrderIssues`, `lessonCitations`, `blockTexts`; citations = exact registered title in `"…"` (EN) or `„…”` (HU) |
| Checks | `src/features/guide/guide.check.logic.ts`, `components/GuideTrackChecks.tsx` | checks are collected per track and shown on the track page, not inline (owner's rule) |
| Studio curriculum | `src/features/stochastic-models/stochasticModels.curriculum.ts` | 7 chapters; chapter 6 "Advanced Concepts" is `planned: true` with no lessons although the guide track now covers it |
| Existing tests | `scripts/guide-checks.test.mjs`, `guide-graph.test.mjs`, `guide-markdown.test.mjs`, `guide-wave2/3.test.mjs`, `guide-stochastic.test.mjs`, `guide-interactive-*.test.mjs`, `guides-ui.test.mjs` | structural checks on practice blocks, titles in both languages, reading order (allowlist `PREVIEWS` of 7 forward references), figure maths |
| TS loader for tests | `scripts/lib/load-ts.mjs` (`importSrc("features/guide/guide.meta.ts")`) | transpiles TS + relative imports; type-only imports vanish; `react` imports resolve from node_modules |
| Coordination doc | `docs/GUIDES_PLAN.md` | curriculum tables (48 rows, stale), writing conventions (§"Writing conventions"), log |

Measured on 2026-10-20 with a scratch audit over `guideContent` (word counts are EN, `blockTexts` joined):

- EN/HU block kinds match in all 55 lessons. Every lesson ends with `h("Summary")`/`h("Összefoglalás")` + list + `lab()`.
- Figures: 54/55 have one (wacc has none, by design). All 63 figure ids are used and registered. No figure is shared by two lessons.
- **26 lessons have no `check` block** and **38 have no `worked` block** (list in plans 03–05). The lessons that do have them (my-app-6c's 19 + the 7 new stochastic ones) have 2–3 checks each.
- **15 lessons have no SEO title** in `guideSeoTitles`: annuities, valuation-multiples, risk-aversion, performance-measures, immunization, callable-bonds, sde-simulation, probability-spaces, filtrations, martingales, brownian-properties, reflection-principle, brownian-bridge, ito-integral, feynman-kac.
- EN word counts: 592 (interest-discounting) to 2222 (martingales). The convention says 700–1400; the 7 rigorous stochastic lessons and martingales are 1500–2222 on purpose (user asked for rigour).
- `docs/GUIDES_PLAN.md` curriculum tables list 48 lessons; the 7 stochastic lessons added last (probability-spaces, filtrations, brownian-properties, reflection-principle, brownian-bridge, ito-integral, feynman-kac) are missing, and the stochastic order in the table is stale.
- Track descriptions (`guideTrack*Desc` in `Guide.ts`/`Guide.hu.ts`) and the SEO track texts describe the first wave only (e.g. fixed income: "Bond pricing, yield curves, duration and convexity"; stochastic: "Brownian motion, GBM, Itô's lemma and Monte Carlo").
- Module `immunization` (lab, registered 2026-10-19) is practised by no lesson: the `immunization` lesson's `labs` is `["duration-convexity", "bond-pricing"]` and its `lab()` points to `/duration-convexity`.
- Reading order: `npm run test:guide-graph` passes; 7 forward references are allowlisted previews.
- Opening paragraphs: every lesson except the root `interest-discounting` cites at least one earlier lesson by exact title.

### Gaps (each is handled by a plan)

| # | Gap | Plan |
|---|---|---|
| 1 | No single check that enforces the lesson standard; regressions between plans go unnoticed | [01](01-guide-audit-harness.md) |
| 2 | GUIDES_PLAN tables, track descriptions, SEO track texts and 15 SEO titles are stale or missing; immunization lesson ignores the immunization lab | [02](02-metadata-and-docs-sync.md) |
| 3 | 14 derivatives lessons have no checks / worked example | [03](03-checks-derivatives.md) |
| 4 | 8 portfolio / fixed-income / corporate lessons lack checks or a worked example | [04](04-checks-portfolio-fixed-income-corporate.md) |
| 5 | 10 stochastic lessons lack checks or a worked example | [05](05-checks-stochastic.md) |
| 6 | Stochastic Studio chapter 6 says "planned" although the guide track covers it; chapters 2–3 do not point at their guide lessons | [06](06-studio-guide-crosslinks.md) |
| 7 | Missing lessons (see §2) need ids, order, titles, figure ids and placeholders registered in the shared files once | [07](07-register-new-lessons.md) |
| 8 | Derivatives: no lesson on dividends, indices, currencies and futures as underlyings (Black-76, Garman–Kohlhagen) | [08](08-new-lessons-derivatives.md) |
| 9 | Portfolio: no lesson on estimation error / unstable frontiers, none on constraints (no short sales) | [09](09-new-lessons-portfolio.md) |
| 10 | Fixed income: no lesson on non-parallel curve moves / key-rate durations, none on real rates and inflation-linked bonds | [10](10-new-lessons-fixed-income.md) |
| 11 | Corporate: no lesson on dividend policy (Gordon growth, MM irrelevance), none on project risk (sensitivity, scenarios, Monte Carlo NPV) | [11](11-new-lessons-corporate.md) |
| 12 | Stochastic: no lesson on the law of large numbers and the CLT (the Studio has a CLT lab with no theory), none on correlated Brownian motions (needed by Heston and basket Monte Carlo) | [12](12-new-lessons-stochastic.md) |
| 13 | Final verification over all 64 lessons in both languages | [13](13-final-qa.md) |

## 2. Key decisions

- **Harness first, allowlists shrink to empty.** Plan 01 adds `scripts/guide-audit.test.mjs` with explicit
  allowlists of today's known failures. Each later plan removes the entries it fixes; plan 13 requires every
  allowlist to be empty except `NO_FIGURE = ["wacc"]`. This is how an executor proves its own plan.
- **Lesson standard** (from `docs/GUIDES_PLAN.md` §"Writing conventions", tightened): one figure (wacc exempt),
  **at least 2 `check` blocks and 1 `worked` block** per lesson, same block kinds in the same order in EN and HU,
  checks with ids `<lessonId>/<slug>` identical in both languages, Summary + lab at the end, EN 600–2300 words.
  The 700–1400 ceiling of the convention is raised to 2300 rather than cutting the rigorous stochastic lessons.
- **Word count on the 7 stochastic lessons stays.** The user asked for rigour there; we add worked examples,
  not cuts.
- **New lessons are registered once, by one plan (07), as placeholders.** The guide shared files
  (`guide.types.ts`, `guide.meta.ts`, `guide.content.types.ts`, `guides/index.ts`, `figures/index.ts`,
  `Guide*.ts` strings, `index.en.ts`/`index.hu.ts`/`guideTitles.hu.ts`, `guide.seo.ts`, `package.json`) are edited
  by plan 07 only. Plans 08–12 then write only their own files (lesson text, figure, math, test) and can run in
  parallel. This repeats the pattern that worked for the earlier waves (see the GUIDES_PLAN log, 15:45 / 20:0x).
- **Nine new lessons, two per track except derivatives (one).** Derivatives already has 16 lessons and the user
  said the other tracks were thin. Each new lesson plan is droppable on its own: if the user cuts a lesson, delete
  it from plan 07's table and skip its section in the track plan.
- **Checks stay at the track end.** The owner does not want inline quizzes; `check` blocks are placed in the
  lesson source after the section they test (that is how the review queue keys them), and the track page
  collects them. No new UI.
- **Hungarian text is written by the executor** in the same plan as the English (the convention requires EN and
  HU in step), and listed in Findings under "awaiting owner review". Natural Hungarian, decimal comma, „…” quotes,
  informal "te" as in the existing lessons.
- **Studio ↔ guide links are data, not new UI.** Plan 06 adds an optional `guides?: GuideId[]` to `StochChapter`
  and renders it with the existing `stoch-standalone-link` style, so chapter 6 stops saying "planned".

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-guide-audit-harness.md) | Guide audit harness (`test:guide-audit`) | – | M | Sonnet | done (2026-10-20) |
| [02](02-metadata-and-docs-sync.md) | Metadata, SEO and docs sync | 01 | S | Sonnet | done (2026-10-20) |
| [03](03-checks-derivatives.md) | Checks + worked examples: derivatives (14 lessons) | 01 | L | Sonnet | done (2026-10-20) |
| [04](04-checks-portfolio-fixed-income-corporate.md) | Checks + worked examples: portfolio, fixed income, corporate (10 lessons) | 01 | M | Sonnet | done (2026-10-20) |
| [05](05-checks-stochastic.md) | Checks + worked examples: stochastic (10 lessons) | 01 | M | Sonnet | done (2026-10-20) |
| [06](06-studio-guide-crosslinks.md) | Stochastic Studio ↔ guide cross-links | 01 | S | Sonnet | done (2026-10-20) |
| [07](07-register-new-lessons.md) | Register the 9 new lessons as placeholders | 01, 02 | M | Sonnet | done (2026-10-20) |
| [08](08-new-lessons-derivatives.md) | New lesson: options on dividends, indices, currencies and futures | 07 | M | Sonnet | done (2026-10-20) |
| [09](09-new-lessons-portfolio.md) | New lessons: input estimation; portfolio constraints | 07 | L | Sonnet | done (2026-10-20) |
| [10](10-new-lessons-fixed-income.md) | New lessons: curve risk and key-rate durations; real rates and inflation | 07 | L | Sonnet | done (2026-10-20) |
| [11](11-new-lessons-corporate.md) | New lessons: dividend policy; capital budgeting under uncertainty | 07 | L | Sonnet | done (2026-10-20) |
| [12](12-new-lessons-stochastic.md) | New lessons: law of large numbers and CLT; correlated Brownian motions | 07 | L | Sonnet | done (2026-10-20) |
| [13](13-final-qa.md) | Final QA: harness green, build, smoke EN + HU | all | S | Sonnet | done (2026-10-20) |

Recommended order: 01 → 02 → {03, 04, 05, 06 in parallel} → 07 → {08, 09, 10, 11, 12 in parallel} → 13.

Plans that edit the same file run **one after another**:
- `scripts/guide-audit.test.mjs` allowlists: every plan removes its own entries. Keep each edit to the lines of
  your own lesson ids so concurrent sessions do not collide; re-read the file right before saving.
- `docs/GUIDES_PLAN.md`: plans 02 and 07 edit the curriculum tables; everyone else appends one Log line only.
- Shared guide files listed in §2: plan 07 only (plan 02 edits `guide.seo.ts`, `Guide.ts`/`Guide.hu.ts` track
  descriptions, `Seo.ts`/`Seo.hu.ts`, and the `immunization` lesson's `labs` before 07 starts).
- Lesson files `src/Language/guides/<id>.ts`: one plan per file (03/04/05 by lesson list; 08–12 their new files).

When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.

## 4. Rules for every executor

- Read `CLAUDE.md` first. Hard rules: DRY, separation of concerns (`*.math.ts` pure, no React; strings in
  `src/Language/**`, never in components), `.tsx` files under ~150 lines (split otherwise). `///` doc comments on
  exported functions. Do not add comments to code you did not change.
- Lesson writing conventions: `docs/GUIDES_PLAN.md` §"Writing conventions". Exemplars: `src/Language/guides/annuities.ts`
  (checks + worked), `interestDiscounting.ts` (structure). Titles are plain descriptive noun phrases (no questions,
  no taglines, no "movie" titles). Headings name the concept. At most two `note()`s. Lessons cite earlier lessons by
  their **exact registered title** in quotes (`"…"` EN, `„…”` HU); that is what turns into links and graph edges.
- TeX inside TS strings: escape backslashes (`\\frac`), never a literal `$` for currency, use `{,}` for a Hungarian
  decimal comma in TeX (`0{,}9`) and `{,}` for thousands in EN (`7{,}360`).
- Owner preferences: no inline quizzes in lessons (checks are collected at the track end, already built); no
  left-border accents; square, one-accent visual style; the derivatives **labs** (`payoff`, `binomial`,
  `black-scholes`, `heston`, `delta-hedging`) are hands-off — link to them, never edit them.
- Figures: `GuideFigure` + `SliderField` / `SegmentedControl` + charts from `src/components/charts` +
  `FigureReadout`; helpers in `figureFormat.ts` / `figureSeries.ts`; every component under ~80 lines; the maths in a
  `guide.*.math.ts` file with a `scripts/guide-*.test.mjs` test; every default readout quoted in the lesson text must
  match the figure's actual default output (compute it in node and paste the numbers).
- Platform: Windows 11, Git Bash for `Bash` tool commands. Prefix smoke commands with `MSYS_NO_PATHCONV=1`.
  `npx vite preview --port 4173` serves `dist/`.
- Standard verification (all must pass before "done"):

```bash
npx tsc -b
npx eslint src/features/guide src/Language/guides scripts/guide-audit.test.mjs
npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph && npm run test:guide-markdown
```

- Browser smoke for anything that changes a page (plans 02, 06, 08–13):

```bash
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/derivatives,/guide/stochastic,/hu/guide/stochastic/filtrations" --prefix /hu
# expect: every line has "problems": [], no "leakingLinks", h1 present
```

  Then stop the preview server and confirm port 4173 is free (`netstat -ano | findstr 4173` prints nothing).

## 5. Definition of done (whole programme)

- `npm run test:guide-audit` passes with every allowlist empty except `NO_FIGURE = ["wacc"]`.
- 64 lessons (55 + 9) in `guideLessons`, each with ≥ 2 checks, 1 worked example, a figure (wacc exempt), an SEO
  title, EN and HU titles/descriptions, same block kinds in EN and HU.
- `docs/GUIDES_PLAN.md` curriculum tables list all 64 lessons in registry order with their real figure ids and
  "done" status; track descriptions and SEO texts name the current content.
- Stochastic Studio chapter 6 links to its guide lessons instead of saying "planned"; chapters 2 and 3 link to
  their guide lessons.
- `npx tsc -b`, eslint on the guide folders, every `test:guide*` script and `npm run build` pass; the smoke
  command reports no problems on the track pages and a sample of lessons in EN and HU.

## 6. Post-merge checklist

- Run `npm run indexnow` (new lesson URLs) after deploy.
- Re-run `npm run test:seo` and `npm run test:seo-schema` (new lessons add pages to the pre-render).
