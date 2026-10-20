# 01 — Heading fix, track tokens, no arrows, helpers + harness

Status: done (2026-10-20) · Depends on: home-redesign 01 · Suggested model: Sonnet · Est. size: M

## Why
Every later guide plan needs the same base: readable headings, track colours as tokens, no arrow
glyphs, and two tested pure helpers (learning-path levels; a lesson's "builds on / leads to").

## Current state (verified 2026-10-20)
- `src/index.scss` (Vite starter leftovers): `:root { --text-h: #08060d; … }` (line ~3),
  `@media (prefers-color-scheme: dark) { :root { --text: #9ca3af; --text-h: #f3f4f6; --bg: #16171d; --border: #2e303a; … } }`
  (lines ~32–40), and `h1, h2 { font-family: var(--heading); font-weight: 600; color: var(--text-h); }`
  (lines ~67–72), `--heading: var(--font-sans)` (line ~15). The app's real theme tokens live in
  `src/styles/tokens.scss` under `:root, :root[data-theme="dark"]` and `:root[data-theme="light"]`.
  **Danger:** the `prefers-color-scheme` block in `index.scss` also redefines `--text`, `--bg`, `--border`;
  check whether `tokens.scss` loads after it (`src/styles/main.scss` starts with `@use "../index";` then
  `@use "tokens";`, so tokens win for equal specificity — but `--text-h` exists only in `index.scss`).
- Track colours: `CATEGORY_ACCENT` in `src/modules/registry.ts` (`derivatives #22c55e`, `portfolio #3b82f6`,
  `fixed-income #f59e0b`, `corporate #ec4899`, `stochastic #a855f7`, `guides #06b6d4`), read by
  `nodeColor()` in `src/features/guide/components/graph/useGuideGraph.ts` and by `GraphClusters.tsx`.
- Arrow glyphs in guide components: `GuideFigure.tsx:24` (` →`), `GuideTryIt.tsx:20`
  (`<span aria-hidden="true"> →</span>`), `GuideLessonNav.tsx:22` (`← `), `:30` and `:35` (` →`),
  `graph/GraphDetails.tsx:40`, `graph/GraphPath.tsx:46`, `graph/LessonGraph.tsx:51` (` →` after text).
- Graph data: `src/features/guide/guide.graph.ts` — `type GraphNode` (lesson: `{ id, kind: "lesson",
  lessonId, track, degree, rank }`; lab: `{ id, kind: "lab", moduleId, … }`), `type GraphEdge = { source,
  target, kind: "citation" | "sequence" | "practice" }` (citation: source quotes target, so **target is
  read first**; sequence: source then target; practice: lesson → lab), `lessonNodeId(id) = "lesson:<id>"`.
  It is loadable by the test loader (see `scripts/guide-graph.test.mjs`, which imports it with `load()`).

## Goal
1. Headings always use the app's text colour in both themes.
2. Track colour tokens in `tokens.scss`, used by the graph.
3. No arrow glyphs in `src/features/guide/components/**`.
4. `src/features/guide/guide.ui.ts` with `prerequisiteLevels()` and `lessonLinks()`, tested by
   `scripts/guides-ui.test.mjs` (`npm run test:guides-ui`).

## Non-goals
- No layout redesign (plans 02–05). No lesson content edits.

## Constraints
- `guide.ui.ts` imports only types from `./guide.graph` (relative) — no React, no registry.
- `package.json` is a GUIDES_PLAN shared file: follow README rule 4.3 for the new script.

## Steps
1. **Heading colour.** In `src/index.scss` replace `color: var(--text-h);` on `h1, h2` (and any other
   `var(--text-h)` use) with `color: var(--text);`. Then delete the `--text-h` declarations and the whole
   `@media (prefers-color-scheme: dark) { :root { … } }` block **only if** every variable it sets is also
   defined in `tokens.scss` (grep each name); otherwise delete just `--text-h`. Record what you removed.
2. **Track tokens** in both theme blocks of `tokens.scss`:
   | token | dark | light |
   |---|---|---|
   | `--track-derivatives` | `#5fb98a` | `#2f8a5c` |
   | `--track-portfolio` | `#6f9cf0` | `#2f62c8` |
   | `--track-fixed-income` | `#d9a74a` | `#a8761c` |
   | `--track-corporate` | `#d27aa3` | `#b04c7c` |
   | `--track-stochastic` | `#a98ae0` | `#7452b8` |
   Add to `src/features/guide/guide.ui.ts`:
   `/// CSS colour of a guide track (knowledge graph only).`
   `export const trackColor = (track: GuideTrackId) => \`var(--track-${track})\`;`
3. **Arrows.** Remove the glyphs listed above (keep the words). In `GuideLessonNav.tsx` the direction is
   already in the words "Previous"/"Next".
4. **Helpers** in `src/features/guide/guide.ui.ts`:
   ```ts
   export type PathLevel = { depth: number; ids: string[] };
   /// Lessons to read before `target`, grouped by shortest distance (1 = directly before).
   /// Prerequisite edges: citation (target before source) and sequence (source before target); practice ignored.
   /// Depths ≥ `maxDepth` merge into the last level. Ids inside a level keep `order` (curriculum) order.
   export function prerequisiteLevels(edges: GraphEdge[], target: string, order: ReadonlyMap<string, number>, maxDepth = 3): PathLevel[]
   /// Direct neighbours of a lesson node: what it builds on (read before) and what it leads to (read after).
   export function lessonLinks(edges: GraphEdge[], id: string): { buildsOn: string[]; leadsTo: string[] }
   ```
   `buildsOn` = sources of `sequence` edges into `id` + targets of `citation` edges out of `id`;
   `leadsTo` = targets of `sequence` edges out of `id` + sources of `citation` edges into `id`; both
   de-duplicated, `id` excluded.
5. **Harness** `scripts/guides-ui.test.mjs` (copy `load()` from `scripts/guide-graph.test.mjs`) with a
   hand-written fixture of ~8 nodes/10 edges covering both edge kinds and a cycle. Tests: levels for a
   chain A←B←C←D (citation) give depths 1,2,3; a node reachable by two routes takes the shorter depth;
   cycles terminate; `maxDepth` merges; `lessonLinks` direction for each edge kind; `trackColor("portfolio")
   === "var(--track-portfolio)"`. Also run the helpers on the real graph: import `guide.graph.ts` and
   `guide.meta.ts` the way `guide-graph.test.mjs` builds sources, and assert every lesson's levels contain
   only lesson ids. **Break it on purpose:** flip the citation direction in `lessonLinks`, see a test fail.
6. Script: `"test:guides-ui": "node --test scripts/guides-ui.test.mjs"` (rule 4.3).

## Acceptance criteria
- With OS light mode and app dark theme, `getComputedStyle(document.querySelector('h2')).color` equals
  the computed `--text` (smoke check below forces it with emulation-free logic: compare to `--text`).
- `grep -rn "→\|←" src/features/guide/components` → nothing.
- `npm run test:guides-ui` passes; break-it check fails as expected.

## Verification
```bash
npm run test:guides-ui && npm run test:guide-graph && npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/portfolio,/hu/guide/portfolio,/guide/graph" \
  --after "/guide/portfolio|(()=>{const h=document.querySelector('.guide-track-checks h2');const t=getComputedStyle(document.documentElement).getPropertyValue('--text').trim();return [getComputedStyle(h).color,t]})()"
# expect: no problems; the h2 colour is the rgb() of --text (not near-black)
```
Stop the server; check the port is free.

## Pitfalls
- `index.scss` is imported by `main.scss` before `tokens.scss`; removing variables there that tokens
  don't define (e.g. `--heading`) breaks fonts — only remove what tokens re-define.
- `trackColor()` returns a CSS value (`var(--track-…)`) meant for `style={{ fill }}`, `background` or a
  custom property such as the graph's `--gg-color`.

## Findings (fill in during execution)
- Removed from `index.scss`: both `--text-h` declarations; `h1, h2` and the other `--text-h` use now read `var(--text)`. The `prefers-color-scheme` block stays: it also sets `--code-bg`, `--accent-bg`, `--accent-border`, `--social-bg`, which `tokens.scss` does not define (App.css uses three of them).
- Shared-file request/edit logged in GUIDES_PLAN: additive `test:guides-ui` script in `package.json` (logged).
- Tests: 5 pass; break-it (citation direction flipped in `before()`) failed 4 of 5, restored. Smoke: no problems on `/guide/portfolio`, `/hu/guide/portfolio`, `/guide/graph`; h2 colour = `--text`.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/01-foundations.md`.
> Run `git status` and stop if files you will edit have changes you didn't make. Implement plan 01: fix the
> heading colour in `index.scss`, add the track colour tokens, remove arrow glyphs from guide components, and add
> `guide.ui.ts` (`trackColor`, `prerequisiteLevels`, `lessonLinks`) with `scripts/guides-ui.test.mjs` and an
> `npm run test:guides-ui` script (log the `package.json` edit in GUIDES_PLAN per README rule 4.3). Run the
> Verification commands and make them pass. Fill in Findings, set plan 01 to `done (<date>)` in the README
> table, and summarise.
