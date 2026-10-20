# Guides redesign plans

Goal: bring the guide pages (track pages, lessons, knowledge graph) into the same premium, square,
one-accent style as the new home page, fix the visible bugs, and make each page easier to scan: a quiet
sidebar with book icons, ruled lesson tables, a reading column with clear structure, and a knowledge
graph that keeps track colours but highlights one learning path with a layered side panel.

This folder holds **self-contained plans**. Each `NN-*.md` can be handed to an executor model
(Sonnet recommended) without this README or the chat that produced it. Each plan ends with a
ready-to-paste **handoff prompt**.

Snapshot taken: **2026-10-20** (commit `ecb42f8` plus uncommitted work from `docs/plans/home-redesign`
plans 01–04). If the code has moved on, the executor re-checks its plan's "Current state" first.

## 0. The design (source of truth)

Design canvas "QuantSandbox UX" (`https://claude.ai/artifact/YKBdD3qY1LU5av72yapaes`), boards
**GuideTrack**, **GuideLesson**, **GuideGraph** (row "Guides v2"). Plans quote every value they need.

- **Same language as the home page** (`docs/plans/home-redesign/README.md` §0): navy ground, cool-white
  text, square edges, 1px ruled grids (`gap: 1px` over `--rule`), serif display (`--font-display`)
  for titles, Geist UI text, Geist Mono for numbers/codes/eyebrows, **one accent** (`--accent`) for the
  key mark. No gradients, glows, pills, left-border accent bars or arrows ("→", "←") on links.
- **Exception — knowledge graph:** nodes keep a colour per track (softened hues, plan 01 tokens). The
  selected learning path is drawn in `--text` (cool white), thicker.
- **Owner likes:** the **book icon** on guide tracks; a **clear hierarchy** in side panels (big title,
  then grouped, levelled lists).

## 1. Current state (what already works)
| Piece | File | Notes |
|---|---|---|
| Routes | `src/features/guide/GuideView.tsx` | `/guide/<track>` → `GuideIndex`, `/guide/<track>/<lesson>` → `GuideLessonPage`; graph at `/guide/graph` |
| Track page | `components/GuideIndex.tsx` (22 lines), `GuideTrackSection.tsx` (53), `GuideProgressBar.tsx`, `GuideTrackChecks.tsx` (53), `GuideCheck.tsx` (85), `GuideCheckInput.tsx` | PageHeader "Guide", progress bar, numbered rows with ✓ and "READ", "Check yourself" accordion |
| Lesson page | `components/GuideLessonPage.tsx` (63), `GuideBlocks.tsx`, `GuideWorked.tsx`, `GuideWorkedStep.tsx`, `GuideFigure.tsx`, `GuideTryIt.tsx`, `GuideLessonNav.tsx`, `GuideRail.tsx` (49) | Rail = TOC + `LessonGraph` mini graph ("Connections") + labs |
| Graph | `components/graph/*` (`GuideGraphPage.tsx` 128, `GraphCanvas.tsx` 130, `GraphDetails.tsx` 72, `GraphControls`, `GraphLegend`, `GraphClusters`, `GraphPath`, `GraphList`, `GraphZoom`, `LessonGraph`, `useGuideGraph.ts`, `useGraphViewport.ts`) | Colours from `CATEGORY_ACCENT` (`src/modules/registry.ts`: `#22c55e #3b82f6 #f59e0b #ec4899 #a855f7`) via `nodeColor()` |
| Graph data | `src/features/guide/guide.graph.ts` | `GUIDE_GRAPH` nodes/edges (`citation`, `sequence`, `practice`), `neighbourhood()`, `learningPath()`, `lessonNodeId()` |
| Sidebar | `src/components/layout/Sidebar.tsx`, `SideModuleRow.tsx`, `SideSubNav.tsx` (shared by all categories) | Guide tracks are registry modules in category `guides` with `subNav` lessons; `ModuleIcon id="guide"` |
| Styles | `src/styles/guide.scss` (995 lines), `src/styles/_guide-graph.scss` (617), `_guide-interactive*.scss` | |
| Tokens | `src/styles/tokens.scss` | After home plan 01: `--rule`, `--rule-strong`, `--text-sub`, `--text-dim`, `--accent`, `--font-display`, radii 2px |

**Visible bugs (from owner screenshots):**
1. "Check yourself" `h2` is near-invisible: `src/index.scss` sets `h1, h2 { color: var(--text-h) }`, and
   `--text-h` is `#08060d` unless the **operating system** prefers dark (`@media (prefers-color-scheme: dark)`),
   so with the app in dark theme and the OS in light mode, headings go black.
2. On the track page the progress label ("7 of 8 read") sits under the sticky top bar.
3. The rail's mini graph clips its labels ("Risk aversion and the optima…").
4. Arrows on links: `GuideFigure.tsx:24`, `GuideTryIt.tsx:20`, `GuideLessonNav.tsx:22,30,35`,
   `graph/GraphDetails.tsx:40`, `graph/GraphPath.tsx:46`, `graph/LessonGraph.tsx:51`.

### Gaps (each is handled by a plan)
| # | Gap | Plan |
|---|---|---|
| 1 | Heading colour bug, no track-colour tokens, arrows, no tested helpers for path levels / neighbours | 01 |
| 2 | Guides sidebar: wrapping rows, no per-track progress, inconsistent with design | 02 |
| 3 | Track page layout | 03 |
| 4 | Lesson page header, prose, worked example, figure frame, nav, rail | 04 |
| 5 | Knowledge graph colours, panel hierarchy, controls | 05 |
| 6 | Figures use loud series colours (yellow dashed, green, etc.) | 06 |

## 2. Key decisions
- **Track colours become tokens** (`--track-derivatives` …) with softened hues, used only by the
  knowledge graph (and the small track dots in its panel/legend). `CATEGORY_ACCENT` stays for any other
  current user, but the graph stops reading it.
- **The rail's mini graph is replaced by text lists** ("Builds on", "Leads to") from the same graph data
  (`citation`/`sequence` edges) plus a link into the full graph. Text never clips and reads as a hierarchy.
- **The graph's side panel shows the learning path in levels** ("Directly before", "Two steps back",
  "Foundations") computed by a pure helper, instead of flat groups.
- **Sidebar changes stay scoped to the `guides` category** so lab sidebars are unaffected.
- **Figures:** a guide-wide figure palette (`--fig-key` = `--accent`, `--fig-base` = `--text`,
  `--fig-muted` = `--text-dim`) replaces per-figure hex; figure owners are other sessions — see rule 4.3.

## 3. Plans, order, status
| Plan | Title | Depends on | Size | Model | Status |
|---|---|---|---|---|---|
| [01](01-foundations.md) | Heading fix, track tokens, no arrows, helpers + harness | home 01 | M | Sonnet | done (2026-10-20) |
| [02](02-guides-sidebar.md) | Guides sidebar | 01 | M | Sonnet | done (2026-10-20) |
| [03](03-track-page.md) | Track page | 01 | M | Sonnet | done (2026-10-20) |
| [04](04-lesson-page.md) | Lesson page | 01 | L | Sonnet | done (2026-10-20) |
| [05](05-knowledge-graph.md) | Knowledge graph | 01 | M | Sonnet | done (2026-10-20) |
| [06](06-figure-palette.md) | Figure palette pass | 01, 04 | M | Sonnet | done (2026-10-20) |

Recommended order: **01 → 03 → 04 → 05 → 02 → 06**. All plans edit `src/styles/guide.scss` or
`_guide-graph.scss`; run them **one after another**. 02 also edits shared sidebar files used by every
lab page — run it when no lab work is in flight.
When a plan is finished, the executor sets its row to `done (<date>)` and changes nothing else here.

## 4. Rules for every executor
1. **Project rules (`CLAUDE.md`):** DRY; pure logic in `*.ts` without React; `.tsx` ≤ ~150 lines;
   SCSS in `src/styles/**` with tokens only; every user-facing string via i18n (EN + HU files);
   `///` doc comments on exports; no new docs files; no pills.
2. **Owner style** (see §0). Never add left-border/inset-left accent bars; active rows get a background
   tint (`--surface-soft`) and `--text` colour.
3. **Guides are a multi-session area.** (4.3) Read `docs/GUIDES_PLAN.md` first. Its **shared files**
   (`guide.types.ts`, `guide.content.types.ts`, `guide.meta.ts`, `src/Language/guides/index.ts`,
   `components/figures/index.ts`, `src/i18n.tsx`, `src/Language/Guide.ts`, `package.json`) have a single
   writer (my-app-1b). If your plan needs one of them, **append a request to its Log** with the exact
   change, then either wait for the reply or, if the Log shows no activity in the last hour, make only
   additive edits (new keys / scripts) and log what you did. Never edit lesson content files under
   `src/Language/guides/**` or individual figure components owned by another session (plan 06 explains
   how to restyle figures without touching them).
4. **Before editing, `git status`.** If a file you will edit has uncommitted changes you didn't make,
   stop and report (unless the plan names them as expected).
5. **Platform:** Windows 11; Git Bash needs `MSYS_NO_PATHCONV=1` before smoke commands.
6. **Standard checks:** `npx tsc -b`; `npx eslint <changed files>` (pre-existing errors in
   `src/i18n.tsx` are not yours); `npm run build`; `npm run test:guide-graph`, `npm run test:guide-checks`,
   plus the plan's own tests and smoke command.
7. Hungarian strings: write them; list each new HU string in the plan's Findings for owner review.

## 5. Definition of done (whole programme)
- Headings readable in both themes regardless of OS colour scheme.
- `/guide/portfolio`, `/guide/portfolio/risk-aversion`, `/guide/graph` (and `/hu/…`) match §0; no arrows
  in `src/features/guide/components/**`; no hex colours in guide `.tsx`.
- Knowledge graph: track colours from tokens, selected path in `--text`, panel shows levelled path.
- `npm run test:guides-ui`, `npm run test:guide-graph`, `npm run test:guide-checks` and `npm run build`
  pass; smoke over the pages above shows no problems.
