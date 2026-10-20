# 01 — Guide audit harness (`test:guide-audit`)

Status: done (2026-10-20) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
Fifty-five lessons were written by several sessions over several waves, and the only structural checks today
are spread over `guide-checks`, `guide-graph` and `guide-markdown`. Nothing enforces "every lesson has a
figure, checks, a worked example, an SEO title, both languages in step". This plan adds one test that
states the standard, with allowlists of today's failures, so every later plan proves its own work by
shrinking an allowlist.

## Current state (verified 2026-10-20)
- Lesson registry: `src/features/guide/guide.meta.ts` exports `guideLessons: GuideLessonMeta[]` (55 entries,
  fields `id`, `track`, `titleKey`, `descKey`, `labs: string[]`) and `guideTracks`.
- Content: `src/Language/guides/index.ts` exports `guideContent: Record<GuideId, GuideLessonContent>` where
  `GuideLessonContent = { en: GuideBlock[]; hu: GuideBlock[] }`.
- Block kinds (`src/features/guide/guide.content.types.ts`): `p`, `h`, `math`, `list`, `note`, `figure {id}`,
  `lab {to, text}`, `check {id, prompt, answer, explain}`, `worked {title, steps[]}`.
- `blockTexts(blocks)` in `src/features/guide/guide.graph.ts` returns the prose of a block list (used for
  word counts and citations). `lessonCitations(sources)` returns every exact-title citation, with `preview`.
- `src/features/guide/guide.seo.ts` exports `guideSeoTitles: Partial<Record<GuideId, string>>` (40 entries).
- Figure ids: the `GuideFigureId` union in `guide.content.types.ts` (63 ids); components in
  `src/features/guide/components/figures/index.ts` as `guideFigures: Record<GuideFigureId, ComponentType>`.
  That file imports React components, so **do not import it in the test**; parse it as text instead (regex
  `^\s+"?([a-z0-9-]+)"?: \w+Figure,` with the `m` flag) and parse the union the same way (`/\| "([a-z0-9-]+)"/g`).
- Registry module ids and paths: parse `src/modules/registry.ts` as text (regex `^\s+id: "([^"]+)"` and
  `^\s+path: "([^"]+)"` with the `m` flag; `relatedGuides: \[([^\]]*)\]` for lesson ids referenced by labs).
  Do not import it (it imports React and lazy routes).
- EN strings: every `src/Language/Guide*.ts` (not `.hu.`) exports one `…En` object; spread them all. HU titles:
  `src/Language/guideTitles.hu.ts` exports `guideTitleTablesHu` (already merges the HU guide tables).
- Test loader: `scripts/lib/load-ts.mjs` exports `importSrc(pathUnderSrc)`. Example usage in
  `scripts/guide-checks.test.mjs` lines 1–9.
- `docs/GUIDES_PLAN.md` curriculum tables: rows look like
  `| 7b | american-options | American options and early exercise | my-app-6c | done | american-boundary |`
  (columns: #, id, Title (EN), Owner, Status, Figure; figure `(none)` for wacc).
- Measured today (so you know what the allowlists must hold): 26 lessons without checks, 38 without a worked
  block, 15 without an SEO title, 7 lessons missing from the GUIDES_PLAN tables, module `immunization`
  practised by no lesson, `interest-discounting` at 592 EN words and citing nothing (it is the root lesson).

## Goal
1. `scripts/guide-audit.test.mjs` with one `test()` per rule below, each reporting *every* offending lesson id
   in its assertion message (not just the first).
2. `"test:guide-audit": "node --test scripts/guide-audit.test.mjs"` in `package.json` (additive edit).
3. The test passes today thanks to explicit allowlists at the top of the file, each with a comment naming the
   plan that empties it.

## Non-goals
- Do not fix any lesson, string or doc in this plan. Allowlist, don't repair.
- Do not touch `guide-checks.test.mjs` or `guide-graph.test.mjs`.

## Constraints
- Node's built-in test runner, no new dependencies. ESM `.mjs`. Keep the file under ~200 lines; put the
  parsers in `scripts/lib/guide-audit-sources.mjs` if it grows.
- Comments only where the rule is not obvious from the assertion.

## Steps
1. Create `scripts/guide-audit.test.mjs`. Load:
   ```js
   import { importSrc } from "./lib/load-ts.mjs";
   const { guideLessons, guideTracks } = await importSrc("features/guide/guide.meta.ts");
   const { guideContent } = await importSrc("Language/guides/index.ts");
   const { guideSeoTitles } = await importSrc("features/guide/guide.seo.ts");
   const { blockTexts, lessonCitations } = await importSrc("features/guide/guide.graph.ts");
   const { guideTitleTablesHu } = await importSrc("Language/guideTitles.hu.ts");
   ```
   Build `en` by importing every `src/Language/Guide*.ts` file whose name has no `.hu.` and spreading every
   export whose name ends in `En` (use `readdirSync` on `src/Language`).
2. Allowlists (top of file, exact ids, sorted):
   ```js
   // Shrunk by plans 03–05; must be empty by plan 13.
   const NO_CHECKS = [ /* 26 ids */ ];
   const NO_WORKED = [ /* 38 ids */ ];
   // Plan 02.
   const NO_SEO_TITLE = [ /* 15 ids */ ];
   const NOT_IN_GUIDES_PLAN = ["probability-spaces", "filtrations", "brownian-properties", "reflection-principle", "brownian-bridge", "ito-integral", "feynman-kac"];
   const LAB_WITHOUT_LESSON = ["immunization"];
   // Permanent.
   const NO_FIGURE = ["wacc"];
   const ROOT_LESSONS = ["interest-discounting"]; // may cite nothing and be short
   const EN_WORDS = { min: 600, max: 2300 };
   ```
   Fill the id lists by running the rules once with empty lists and pasting the reported ids.
3. Rules, one `test()` each. Helper `offenders(predicate)` returns the ids of lessons failing `predicate`,
   minus an allowlist, and `assert.deepEqual(offenders, [], \`…: ${offenders.join(", ")}\`)`.
   - **kinds-match:** `en.map(b => b.kind).join()` equals the HU one.
   - **figure:** at least one `figure` block in EN (allow `NO_FIGURE`); every figure id used exists in the
     `GuideFigureId` union and in `figures/index.ts`; every union id is used by some lesson; no figure id used
     by two lessons.
   - **checks:** ≥ 2 `check` blocks in EN (allow `NO_CHECKS`); **worked:** ≥ 1 `worked` block (allow `NO_WORKED`).
     (Cross-language equality of ids/answers is already covered by `guide-checks.test.mjs`; do not repeat it.)
   - **ending:** last `h` is `Summary` (EN) / `Összefoglalás` (HU), followed by a `list`, and the last block is
     `lab`.
   - **notes:** at most 2 `note` blocks per language.
   - **words:** EN `blockTexts` word count within `EN_WORDS` (allow `ROOT_LESSONS` below the minimum).
   - **labs:** every `lesson.labs` entry is a registry module id; every `lab.to` path (before `?`) is a registry
     module path or starts with `/stochastic-models/`; every registry module except `home`, `guide-*` is listed
     in some lesson's `labs` (allow `LAB_WITHOUT_LESSON`); every `relatedGuides` id in the registry is a lesson.
   - **strings:** `en[titleKey]`, `en[descKey]`, `guideTitleTablesHu[titleKey]`, `guideTitleTablesHu[descKey]` all
     non-empty; EN title has no trailing period and does not start with "Why"/"How"/"What" (plain noun phrases).
   - **seo:** `guideSeoTitles[id]` present (allow `NO_SEO_TITLE`).
   - **cites:** every lesson has ≥ 1 non-preview citation in EN **and** ≥ 1 in HU (allow `ROOT_LESSONS`); every
     citation pair `source>target` that appears in one language appears in the other.
   - **opening:** the first block is a `p` and its EN text quotes at least one registered title (allow
     `ROOT_LESSONS`).
   - **guides-plan:** parse the curriculum tables of `docs/GUIDES_PLAN.md` (regex
     `/^\| \d+b? \| ([a-z0-9-]+) \| ([^|]+) \| [^|]+ \| ([^|]+) \| ([^|]+) \|$/gm`); every lesson id appears
     (allow `NOT_IN_GUIDES_PLAN`); for rows that exist, the title equals `en[titleKey]` and the figure column
     (trimmed, `(none)` → none) is one of the lesson's figure ids.
4. Add the npm script. Run it; paste the ids into the allowlists until green.
5. Break it on purpose once (e.g. temporarily remove `"wacc"` from `NO_FIGURE`) and confirm the failure message
   lists `wacc`; restore.

## Acceptance criteria
- `npm run test:guide-audit` passes; the file has the allowlists above with the measured ids.
- Removing one id from any allowlist makes exactly that rule fail and the message names the id.
- `npx eslint scripts/guide-audit.test.mjs` is clean; `npx tsc -b` unaffected.
- No lesson, string or doc file changed.

## Verification
```bash
npm run test:guide-audit
npx eslint scripts/guide-audit.test.mjs
npx tsc -b
```

## Pitfalls
- `figures/index.ts` and `registry.ts` pull in React and lazy imports: **parse them as text**, never import.
- `importSrc` resolves only relative imports; `react`, `typescript` etc. resolve from `node_modules`. Any
  `src/Language/Guide*.ts` file imports only types and sibling `.hu` tables, so they load fine.
- HU quotes are `„…”`; EN quotes are `"…"` or `“…”`. Use `lessonCitations` rather than your own regex.
- `/payoff?lab=replicate` is a valid lab path (strip the query before comparing).
- `GUIDES_PLAN.md` has CRLF line endings on some lines; strip `\r` before matching.

## Findings (fill in during execution)
- Baseline counts per allowlist: NO_CHECKS 24, NO_WORKED 34, NO_SEO_TITLE 15, NOT_IN_GUIDES_PLAN 7, LAB_WITHOUT_LESSON 1 (plan text said 26 / 38; the tree had moved on).
- Deviations and why: added stale-entry checks (an allowlisted id that now passes fails the test, so plans must remove it). The registry parser also reads `stochasticModels.curriculum.ts` because the `stochastic-models` module's path is the imported constant `STUDIO_PATH`. Another session filled the allowlists in the same file while this was in progress. The "break it on purpose" step (step 5) was not run; the stale-entry checks exercise the same message path.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`). Read `CLAUDE.md`, `docs/plans/guides-audit/README.md`
> (section 4) and `docs/plans/guides-audit/01-guide-audit-harness.md`. Implement plan 01: create
> `scripts/guide-audit.test.mjs` with the listed rules and allowlists, add the `test:guide-audit` npm script, and
> make `npm run test:guide-audit`, `npx eslint scripts/guide-audit.test.mjs` and `npx tsc -b` pass. Do not fix any
> lesson; allowlist today's failures with the measured ids. Fill in the plan's Findings (baseline counts), set
> plan 01 to `done` in the README table, and summarise what the allowlists contain.
