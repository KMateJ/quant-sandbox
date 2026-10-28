# 01 — Dissolve the studio: move lessons, routes, redirects

Status: done (2026-10-28) · Depends on: – · Suggested model: Opus or Sonnet · Est. size: L

## Why
The owner does not want `/stochastic-models` to start with a curriculum walkthrough; the guide knowledge
graph already does that. Lessons should live on the lab they belong to, as sub-pages.

## Current state (verified 2026-10-28)
- Registry entry `id: "stochastic-models"` in `src/modules/registry.ts` (~L386): `homeFeatured: true`,
  `path: STUDIO_PATH`, `intuition: stochasticModelsIntuition` (from `src/modules/stochasticModelsIntuition.ts`),
  `subNav: lessonNavItems()`, `about: moduleAbout("StochasticModels", 4)`.
- `brownian-motion` entry right after it: no `subNav`, Component `features/brownian-motion/BrownianMotionView`.
- `stochasticModels.curriculum.ts`: `curriculum` (chapters → lessons with `id`, `number`, `titleKey`,
  `descKey`, `questionKey`, `objectiveKey`, `intuitionSectionId`, lazy `Component`), `lessonNavItems()`,
  `findLesson()`. Ch. 1 ids: `random-walk, rescaled-walk, why-sqrt-t, clt`. Ch. 2: `wiener-process,
  increments, covariance` (+ planned `transformations, quadratic-variation, brownian-bridge`). Ch. 3:
  `running-max, reflection, first-passage, hitting`.
- Each `*Lesson.tsx` renders `<LessonFrame numberLabel="2.2" titleKey questionKey objectiveKey
  intuitionSectionId tabs=[…] />`.
- `LessonPage.tsx` adds breadcrumb + prev/next footer (remove). `CurriculumPage.tsx`, `ChapterCard.tsx`,
  `ChapterGuides.tsx`, `StochasticModelsView.tsx` are the walkthrough (delete).
- Sub-page pattern: `src/features/yield-curve/YieldCurvePages.tsx` + `subNav` items
  `{ id, labelKey, descKey?, seoTitle?, prefix?, to }`. `App.tsx` mounts `${m.path}/*` when `subNav` exists.
  `seo.routes.ts` prerenders every subNav item.
- In-app redirects: `export const redirects = guideRedirects();` in `registry.ts`; `App.tsx` maps them to
  `<Navigate replace>`. Check how `/hu/` variants are produced (search `redirects` in `App.tsx` /
  `languageLoader`) and mirror it.
- External refs: see README §1 list (guide.meta, challenges.data, home.viz, brownianProperties guide
  links, seo-audit test, clt test import, vercel.json, main.scss).

## Goal
1. New module `random-walk` at `/random-walk` (category `stochastic`, `homeFeatured` no) with sub-pages
   `random-walk`(the module root shows it for now, plan 04 replaces root), `rescaled-walk`, `why-sqrt-t`, `clt`.
2. `brownian-motion` gets `subNav`: `lab` (root, existing view) + `wiener-process, increments, covariance,
   running-max, reflection, first-passage, hitting`; `homeFeatured: true`.
3. `stochastic-models` module, curriculum page and walkthrough files removed.
4. Redirects: `/stochastic-models` → `/random-walk`; `/stochastic-models/<ch1 id>` → `/random-walk/<id>`
   (`random-walk` → `/random-walk`); `/stochastic-models/<ch2/3 id>` → `/brownian-motion/<id>`; also
   `/hu/…` and `vercel.json` (permanent) incl. the `?lesson=` rule.
5. Lesson frame: no number eyebrow, no breadcrumb, no footer; objective box without left border.

## Steps
1. **Shared code.** Build the import graph: files imported by both ch.1 and ch.2/3 lessons are shared.
   Pure `.math.ts`/`.types.ts` → `src/lib/stochastic/`; `.tsx`/hooks (`LessonFrame`, `TimeCursorControl`,
   `useTimeCursor`, `predictRound.ts` …) → `src/components/lesson/`. Use `git mv`, then fix imports.
2. **Move** ch.1-only files to `src/features/random-walk/`, ch.2/3-only to
   `src/features/brownian-motion/lessons/`. Keep file names.
3. **Lesson table per module**: `src/features/random-walk/lessons.ts` and
   `src/features/brownian-motion/lessons/lessons.ts` export `{ id, titleKey, descKey, Component }[]` and a
   `subNavItems(base)` helper. One generic helper `lessonSubNav(base, lessons)` in
   `src/components/lesson/lessonNav.ts` (DRY).
4. **Pages wrappers**: `RandomWalkPages.tsx`, `BrownianMotionPages.tsx` like `YieldCurvePages.tsx` but
   look the id up in the lesson table, render inside `<Suspense>`, unknown id → `<Navigate to=base replace/>`.
5. **LessonFrame**: drop `numberLabel`; render `PageHeader`-like heading (title + question) and tabs.
   Update every `*Lesson.tsx` call site. Remove `.stoch-eyebrow`, breadcrumb, lesson-nav styles; change
   `.stoch-learning-objective` to background `var(--surface-soft)` with no border-left.
6. **Registry**: add `random-walk` entry (navKey `navRandomWalk`, seo keys `seoTitleRandomWalk` /
   `seoDescRandomWalk`, `about: moduleAbout("RandomWalk", 4)` – reuse the StochasticModels about text,
   rewritten to describe this lab, EN+HU, `relatedGuides: ["random-walks", "law-of-large-numbers-clt"]`,
   `intuition: stochasticModelsIntuition`). Put it **before** `brownian-motion`. Delete the
   `stochastic-models` entry. Add `subNav` to `brownian-motion`, switch Component to `BrownianMotionPages`.
   Add redirects: `export const redirects = [...guideRedirects(), ...stochasticRedirects()]`.
7. **Icon**: `ModuleIcon.tsx` – add a `random-walk` glyph (zig-zag) or reuse an existing one via `icon:`.
8. **External refs**: guide.meta `labs` → `random-walk` (LLN/CLT, probability-spaces, filtrations) or
   `brownian-motion` (others; dedupe); challenges.data `moduleId` → owning module; home.viz key; guide link
   `/stochastic-models/covariance` → `/brownian-motion/covariance` (EN+HU); seo-audit test paths; clt test
   import path; `vercel.json` rules.
9. **Language**: unused studio keys (`stochChapter*`, `stochCurriculum`, prev/next, breadcrumb) removed from
   `StochasticModels(.hu).ts`. New nav/seo keys EN+HU.
10. Delete `features/stochastic-models/`; build must not reference it.

## Acceptance criteria
- `grep -r "stochastic-models" src scripts` returns only redirect definitions.
- All 11 lesson URLs load at the new paths; old URLs redirect (EN and `/hu`).
- No `.tsx` over ~150 lines added; `tsc -b`, build, `clt.test`, `seo-audit.test`, `challenge-scores.test`,
  `guide-audit.test` pass.
- `layout-audit` shows no `left-border-accent` on lesson pages.

## Verification
```bash
npx tsc -b && npm run build
node --test scripts/clt.test.mjs scripts/seo-audit.test.mjs scripts/challenge-scores.test.mjs scripts/guide-audit.test.mjs
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4191 --port 9352 \
  --paths "/random-walk,/random-walk/clt,/brownian-motion,/brownian-motion/increments,/stochastic-models,/stochastic-models/hitting,/hu/stochastic-models/covariance"
# expect final URLs at the new paths, no console errors
```
Plus the README §4 layout-audit over the new paths.

## Pitfalls
- `seo.routes.ts` builds prerender pages from `subNav`; the `lab` item `to` equals the module path – check it
  doesn't duplicate the module page (see how `yield-curve` does it).
- `stochasticModelsIntuition` section ids are referenced by lessons' `intuitionSectionId`; keep the file.
- Lazy lesson components must stay lazy (bundle size).
- Parallel plan 02 edits `BrownianMotionView.tsx`; do not touch it beyond imports.

## Findings (fill in during execution)
- 91 files moved with `git mv`: shared → `src/components/lesson/` (`LessonFrame`, `usePinnedCurves`, `predictRound`) and `src/lib/stochastic/` (math/types/url); ch.1 → `features/random-walk/`, ch.2–3 → `features/brownian-motion/lessons/`. Walkthrough files and `stochasticModels.curriculum.ts` deleted.
- Generic routing: `src/components/lesson/labLessons.ts` (`LabLesson`, `lessonSubNav`) + `LabLessonPages.tsx`; module tables `random-walk/lessons.ts`, `brownian-motion/lessons/lessons.ts`. Plans 03/04 append rows there.
- Redirect table `src/modules/stochasticRedirects.ts` (in-app) mirrored in `vercel.json` (EN, `/hu`, `?lesson=`).
- `LessonFrame`: no number eyebrow, title is `h1`, objective box has no left border. 325 lines of dead studio CSS and 42 dead strings removed.
- New strings: `navRandomWalk`, `navRandomWalkLab`, `navBrownianLab`, `seoTitle/DescRandomWalk`, `aboutRandomWalk*`, `homeLabDesc_randomWalk` (EN+HU).
- Tests updated: `guide-audit` (lesson paths parsed from the lesson tables; Studio-chapter test removed), `seo-audit` KNOWN lists, `clt` import path.
- Smoke: 10 new/legacy URLs land on the right page, no console errors. Audit (360/1280, light/dark): clean except two pre-existing defects → plan 08: `/random-walk/why-sqrt-t` 360 clipped "250" tick (shared `LineChart` right margin), `/brownian-motion/first-passage` 360 range-guess thumbs overlap.
- Main-folder `vite build` prerender fails with "useI18n must be used inside LanguageProvider" on every page, but the identical `src` builds cleanly in a separate worktree → environmental (parallel builds), not code.

## Prompt to hand off
> Read `CLAUDE.md`, `docs/plans/stochastic-labs/README.md` §4 and `01-dissolve-studio.md`. Implement plan 01:
> move the studio lessons into `random-walk` and `brownian-motion` sub-pages, delete the walkthrough, add
> redirects, update external references. Run the Verification commands. Fill Findings, mark 01 done in the
> README, summarise.
