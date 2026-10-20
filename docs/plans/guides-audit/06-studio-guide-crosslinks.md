# 06 — Stochastic Studio ↔ guide cross-links

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: S

## Why
There are two stochastic curricula: the **Stochastic Studio** lab (`/stochastic-models`, 7 chapters of
interactive lessons) and the **guide track** (`/guide/stochastic`, 15 theory lessons). Guide lessons already
link into Studio lessons (`lab("/stochastic-models/reflection", …)` etc.), but the Studio does not link back,
and its chapter 6 "Advanced Concepts — martingales, stopping times, filtrations and Girsanov's theorem" is
still marked *Planned* although all four topics are now guide lessons. A reader on the Studio page is told
the theory does not exist.

## Current state (verified 2026-10-20)
- `src/features/stochastic-models/stochasticModels.curriculum.ts`:
  ```ts
  export interface StochChapter {
    number: number; titleKey: TranslationKey; descKey: TranslationKey; lessons: StochLesson[];
    standalone?: { route: string; labelKey: TranslationKey }; planned?: boolean;
  }
  ```
  Chapters: 1 (4 lessons), 2 (6 lessons, standalone `/brownian-motion`), 3 (4 lessons), 4 (0 lessons, standalone
  `/ito-process`), 5 (0, standalone `/gbm`), 6 (0, `planned: true`), 7 (0, standalone `/monte-carlo`).
- `src/features/stochastic-models/ChapterCard.tsx` (76 lines) renders a chapter: header with a "Planned" tag when
  `chapter.planned && lessons.length === 0`, the lesson list, the standalone link
  (`<Link className="stoch-standalone-link">` with an arrow glyph), and a foot note
  (`stochStructuredPlanned` / `stochChapterPlannedNote`).
- Strings: `src/Language/StochasticModels.ts` (EN) and its `.hu` twin: `stochChapter6`, `stochChapter6Desc`,
  `stochPlanned`, `stochStructuredPlanned`, `stochChapterPlannedNote`, `stoch*Standalone`.
- Guide side: `guidePath(id)` in `src/features/guide/guide.meta.ts` gives a lesson's route; titles via
  `t(lesson.titleKey)` with `guideLessons.find(l => l.id === id)`. Guide ids for the Studio chapters:
  - ch. 1 → `random-walks` (and plan 12's `law-of-large-numbers-clt` once it exists)
  - ch. 2 → `brownian-properties`, `brownian-bridge`
  - ch. 3 → `reflection-principle`
  - ch. 4 → `ito-integral`, `ito-lemma`
  - ch. 5 → `sde-simulation`, `mean-reversion`
  - ch. 6 → `probability-spaces`, `filtrations`, `martingales`, `change-of-measure`
  - ch. 7 → `monte-carlo-pricing`
- Registry: module `stochastic-models` has no `relatedGuides`; `relatedLessons()` in `guide.meta.ts` still finds
  lessons whose `labs` include it (`probability-spaces`, `filtrations`, `brownian-properties`, `reflection-principle`,
  `brownian-bridge`), so the sidebar's Connected Guides already work. Leave the registry alone.
- Owner style: no pills; arrow glyphs were removed from guide components in the guides redesign (keep the
  Studio's existing glyph as is, do not add new ones).

## Goal
1. `StochChapter` gets `guides?: GuideId[]`; every chapter lists its guide lessons as above.
2. `ChapterCard` renders them as a short "Theory" list of links (title from the guide registry, route from
   `guidePath`) under the lesson list, using existing text styles (reuse `stoch-standalone-link` for each link or a
   plain `<ul>` with the same font; no new pills).
3. Chapter 6 is no longer "planned": remove `planned: true`; its foot note disappears because the chapter now has
   guide links (adjust the condition: show the planned note only when there are no lessons, no standalone and no
   guides).
4. New strings `stochTheoryHeading` ("Theory in the guides" / „Elmélet az útmutatókban”) in EN and HU.

## Non-goals
- No change to the guide pages, the registry, the Studio lessons or their routes.
- No new chapter, no reordering.

## Constraints
- `ChapterCard.tsx` is 76 lines; the new list must keep it under 150 — extract `ChapterGuides.tsx` (≈ 25 lines) if
  it grows past ~120. Strings via `useI18n`.
- `stochasticModels.curriculum.ts` imports `lazy` from React; importing `GuideId` as a type from
  `../guide/guide.types` is fine (type-only).

## Steps
1. Add `guides?: GuideId[]` to `StochChapter` and fill it for all 7 chapters per the mapping above.
2. Create `src/features/stochastic-models/ChapterGuides.tsx`: props `{ ids: GuideId[] }`; maps ids through
   `guideLessons` (skip unknown ids), renders `<h4>{t("stochTheoryHeading")}</h4>` + `<ul>` of `<Link to={guidePath(id)}>`.
3. In `ChapterCard.tsx` render `<ChapterGuides ids={chapter.guides} />` when `chapter.guides?.length`, after the
   lesson list and before the standalone link. Change the foot-note condition to
   `chapter.lessons.length === 0 && !chapter.guides?.length`.
4. Remove `planned: true` from chapter 6. Add the two strings to `StochasticModels.ts` / `.hu.ts`.
5. Styles: add `.stoch-chapter-guides` rules to the Studio's SCSS partial (find it with
   `grep -rn "stoch-standalone-link" src/styles`), matching the existing link size and spacing; no borders.
6. Add a test to `scripts/guide-audit.test.mjs`: every `guides` id in the Studio curriculum is a lesson id, and
   every stochastic-track lesson appears in at least one chapter's `guides`. (Parse `stochasticModels.curriculum.ts`
   as text: `/guides: \[([^\]]*)\]/g`; do not import it — it imports React.)

## Acceptance criteria
- `/stochastic-models` shows theory links on every chapter; chapter 6 has no "Planned" tag.
- The new harness test passes; `npm run test:guide-audit` green.
- Smoke `/stochastic-models` and `/hu/stochastic-models`: no problems, no leaking links.

## Verification
```bash
npm run test:guide-audit
npx tsc -b && npx eslint src/features/stochastic-models
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/stochastic-models,/hu/stochastic-models" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- `guidePath()` returns the EN route; the app's language prefix is added by the router's `Link` handling as in
  other components (check how `stoch-standalone-link` builds its `to` — it passes `/brownian-motion` unprefixed,
  so do the same).
- Do not import `guideContent` here (large chunk); only `guideLessons` and `guidePath`.

## Findings (fill in during execution)
- DONE steps 1–5 (2026-10-20): `guides` on all 7 chapters, `ChapterGuides.tsx`, chapter 6 un-planned, `.stoch-chapter-guides` styles, `stochTheoryHeading`. tsc + eslint clean; build ok; smoke `/stochastic-models` and `/hu/stochastic-models`: no problems, no leaking links; link counts per chapter 1,2,1,2,2,4,1, no Planned tag.
- DONE step 6: harness test added to `scripts/guide-audit.test.mjs` (Studio guides ids are real lessons; every stochastic lesson is linked by a chapter). `test:guide-audit` 14 pass, `test:guide-graph` green.
- Deviation: the plan's mapping left `jump-diffusion` and `feynman-kac` unlinked, so the new test failed; added `jump-diffusion` to chapter 5 and `feynman-kac` to chapter 7 (no allowlist needed).
- HU strings written (for owner review): stochTheoryHeading „Elmélet az útmutatókban”.
- Note: the foot note now disappears on every chapter, since all have guides (per step 3), so chapters 4, 5, 7 lose "Structured lessons planned…".
- Deviations and why: …

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`). Read `CLAUDE.md`, `docs/plans/guides-audit/README.md`
> (section 4) and `docs/plans/guides-audit/06-studio-guide-crosslinks.md`, and confirm plan 01 is marked done in
> the README (stop and report if not). Implement plan 06: add `guides?: GuideId[]` to the Stochastic Studio
> chapters, render the guide links in `ChapterCard` via a small `ChapterGuides` component, un-plan chapter 6, add
> the EN/HU strings and the harness test. Run the verification commands (including the smoke test) and make them
> pass. Fill in Findings, set plan 06 to `done` in the README table, and summarise.
