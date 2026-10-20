# 05 — Knowledge graph

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The graph is the one place where colour helps: it shows five tracks at once. The design keeps track
colours (softened), draws the selected learning path in cool white, and gives the side panel a clear
hierarchy: big title, then what to read first, layered by distance.

## Current state (verified 2026-10-20)
- Route `/guide/graph` → `src/features/guide/components/graph/GuideGraphPage.tsx` (128 lines). Selection is
  in the URL: `?focus=<lessonId>` → `selected = "lesson:<id>"`.
- Composition: `GraphControls` (track filters, labs toggle, search, Graph/List view), `GraphLegend` (dots),
  `GraphCanvas` (130; nodes as circles with `style={{ "--gg-color": nodeColor(n) }}`, edges via `GraphEdges`,
  cluster labels via `GraphClusters` using `CATEGORY_ACCENT[track]`), `GraphZoom`, `GraphList`,
  `GraphPath` (selected lesson's reading path: numbered `steps` in reading order + `direct` set + read ticks),
  `GraphDetails` (72; head with dot + track, `h2.gg-details-title`, "Open lesson →", groups
  Builds on / Previous / Next / Cited by / Labs, each "show all" after 6).
- `useGuideGraph.ts`: `GUIDE_GRAPH`, `nodeColor(n)` = `CATEGORY_ACCENT[n.track]` for lessons,
  `var(--muted)` for labs; `useLearningPath(selected)` (uses `learningPath()` from `guide.graph.ts`).
- Styles: `src/styles/_guide-graph.scss` (617 lines; classes `gg-*`).
- Plan 01 provides `trackColor(track)` → `var(--track-<id>)`, `prerequisiteLevels(edges, target, order,
  maxDepth)` and `lessonLinks(edges, id)` in `src/features/guide/guide.ui.ts`.
- Strings: `src/Language/GuideGraph.ts` / `.hu.ts` (`gg*` keys, e.g. `ggBuildsOn`, `ggNext`, `ggCitedBy`,
  `ggLabs`, `ggOpenLesson`, `ggPathTitle`, `ggStartingPoint`).

## Goal (design board GuideGraph)
1. **Colours:** lesson nodes use `trackColor(track)`; unselected nodes: dark fill (`--bg`) with track-colour
   stroke at 75% opacity; nodes on the selected path: filled with their track colour; the selected node:
   larger, track-colour fill, 2px `--text` ring. Edges: track colour at 35% opacity, 0.8px; path edges
   `--text`, 1.8px, 95%. Filtered-out tracks fade to 20%. Labels only for path nodes (and hover),
   white text with a `--bg` halo (`paint-order: stroke`).
2. **Header:** mono eyebrow "Guides · 55 lessons · 24 labs" (computed), `h1` "Knowledge graph" in display
   48px, lede "Pick a lesson to see everything it builds on, in the order to read it."
3. **Controls:** track filters as underline buttons with an 8px colour dot each ("All tracks" dot =
   `--text`), square search field, square Graph/List segmented control (active = `--surface-soft`).
   Cluster labels: mono uppercase 11px in the track colour.
4. **Side panel (340px, ruled from the canvas):**
   - Top block: dot + mono "PORTFOLIO & RISK · 02.04", title in display 28px, muted summary
     "Lesson 4 of 8 · builds on 4 lessons in 2 tracks", solid "Open lesson" button (no arrow).
   - "Read first" (mono label, `--text`): `prerequisiteLevels` groups — "Directly before" (14.5px, `--text`),
     "Two steps back" (13px, `--text-sub`, indented 14px), "Foundations" (13px, indented 28px); each item =
     track dot, mono code, title; clicking selects it. Empty → "Nothing. This is a starting point."
   - "Leads to": same row style. Then "Practised in" labs (lab nodes) if any.
   - Read-progress line from `GraphPath` ("2 of 4 read") stays, as a mono line under "Read first".
   This replaces the current flat groups in `GraphDetails` and merges `GraphPath`'s list into the levels.
5. No arrows anywhere (plan 01 removed glyphs; keep it so).

## Non-goals
- No change to graph data, layout algorithm (`guide.graph.layout.ts`), zoom/pan behaviour or the URL contract.

## Constraints
- `GraphDetails.tsx` must stay ≤150 lines: put the level list in `GraphLevels.tsx`.
- Colours only via `trackColor()` / tokens; remove `CATEGORY_ACCENT` imports from `components/graph/*`.
- Strings (`GuideGraph.ts` is not a GUIDES_PLAN shared file; edit it directly): `ggReadFirst` "Read first",
  `ggDirectlyBefore` "Directly before", `ggTwoBack` "Two steps back", `ggFoundations` "Foundations",
  `ggLeadsTo` "Leads to", `ggSummary` "Lesson {{n}} of {{total}} · builds on {{count}} lessons in {{tracks}} tracks",
  `ggEyebrow` "Guides · {{lessons}} lessons · {{labs}} labs" (+ HU drafts; handle singular/plural with
  separate keys if i18next plural isn't set up — check `src/i18n.tsx`).

## Steps
1. `useGuideGraph.ts`: `nodeColor` → lessons `trackColor(n.track)`, labs `var(--muted)`.
   `GraphClusters.tsx`: `style={{ fill: trackColor(track) }}`.
2. `GraphCanvas`/`GraphEdges`: path membership from `useLearningPath(selected)`; apply Goal 1 via classes
   (`.gg-node.on-path`, `.gg-node.selected`, `.gg-edge.on-path`) in `_guide-graph.scss`; colour through the
   existing `--gg-color` custom property.
3. `GraphControls`/`GraphLegend`: underline filters with colour dots; square search and view toggle.
4. `GraphLevels.tsx` + rewrite `GraphDetails.tsx` per Goal 4, using `prerequisiteLevels(GUIDE_GRAPH.edges,
   selected, curriculumOrder)` (reuse the curriculum order map `useLearningPath` already builds; export it
   if needed) and `lessonLinks`. Keep "show all" for lists longer than 6.
5. `GuideGraphPage`: header per Goal 2; panel layout; remove the separate `GraphPath` block if its content
   now lives in the panel (keep the read-progress line).
6. `_guide-graph.scss`: square everything (radius ≤ 2px), ruled panel, fonts per tokens.

## Acceptance criteria
- `/guide/graph?focus=risk-aversion`: path nodes filled, path edges white, panel shows the three level
  groups with the right counts; clicking a level item updates `?focus=`.
- `grep -rn "CATEGORY_ACCENT" src/features/guide` → nothing.
- `npm run test:guide-graph` and `npm run test:guides-ui` pass.

## Verification
```bash
npm run test:guide-graph && npm run test:guides-ui && npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/graph,/guide/graph?focus=risk-aversion,/hu/guide/graph?focus=risk-aversion" \
  --after "/guide/graph?focus=risk-aversion|[document.querySelectorAll('.gg-level').length, document.querySelectorAll('.gg-edge.on-path').length>0]"
# expect: no problems; [≥1, true]
```
Stop the server; check the port is free.

## Pitfalls
- Keep colours flowing through the existing `--gg-color` custom property (set in `style`), so hover/selected
  CSS rules can override them; don't hard-code a second colour path in attributes.
- `prerequisiteLevels` counts both citation and sequence edges; `learningPath` uses the same rule — if the
  counts in the panel and the path disagree, the rule differs: fix the helper, not the view.

## Findings (fill in during execution)
- New HU strings (EN/HU in GuideGraph): ggEyebrow "Útmutatók · {{lessons}} lecke · {{labs}} labor", ggLede, ggReadFirst "Először olvasd", ggDirectlyBefore "Közvetlenül előtte", ggTwoBack "Két lépéssel korábban", ggFoundations "Alapok", ggLeadsTo "Ide vezet", ggNothingBefore, ggSummary.
- Deviations: ggSummary lists counts as "lessons before it: N · tracks: M" (avoids singular/plural forms). Edges stay `--muted` (edges carry no track colour); path edges are `--text`. The "All tracks" dot and the clear-selection button are not built (Escape still clears); `GraphPath` is now used only in list view. Panel shows the whole-curriculum path, not just visible tracks. Edge arrowheads (SVG markers) kept; only text glyph arrows were in scope.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/05-knowledge-graph.md`,
> and confirm plan 01 is done (stop if not). Run `git status` and stop if graph files have changes you didn't
> make. Implement plan 05: track-colour tokens on nodes and clusters, the white highlighted path, square controls
> with colour-dot filters, and the levelled side panel (`GraphLevels`). Run the Verification commands and make
> them pass. Fill in Findings, set plan 05 to `done (<date>)` in the README table, and summarise.
