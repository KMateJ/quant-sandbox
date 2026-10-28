# 04 — Systemic risk shell, shared graph code, network chart

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The three systemic-risk pages (plans 06–08) all draw an interactive network and share one module, one
router and one URL vocabulary. This plan builds those once: the registered module with three stub pages,
the guide's force layout and pan/zoom viewport promoted to shared locations (DRY), and a generic, accessible
`NetworkGraph` chart that knows nothing about finance.

## Current state (verified 2026-10-28, commit `a4b1706`)
- `src/features/guide/guide.graph.layout.ts` (136 lines): imports `makeRng` from `../../lib/math/random`;
  exports types `LayoutNode = { id; group; radius }`, `LayoutEdge = { source; target; length; strength }`,
  `Point = { x; y }`, `LayoutOptions` (L7) and functions `forceLayout(nodes, edges, options)` (L20),
  `fitInto(points, width, height, padding)` (L105), `placeLabels(candidates, width, charWidth?, lineHeight?)`
  (L120) with `LabelCandidate`, `PlacedLabel`. Consumers: `components/graph/useGuideGraph.ts`,
  `GraphCanvas.tsx`, `GraphClusters.tsx`, `GraphEdges.tsx`, `useGraphViewport.ts`, and
  `scripts/guide-graph.test.mjs` L95 (imports the file by path through `scripts/lib/load-ts.mjs`).
- `src/features/guide/components/graph/useGraphViewport.ts` (123 lines): `View`, `Bounds`, `fitView(b, w, h,
  pad?, maxK?)`, `useGraphViewport(home, size)` → `{ svgRef, svgHandlers, transform, zoom, panX, panY, moved,
  reset, zoomBy, wasDrag, startNodeDrag }` (wheel zoom via a native non-passive listener, background pan,
  node drag). See `GraphCanvas.tsx` (132 lines) and `GraphZoom.tsx` (26 lines) for usage and zoom buttons.
- Registry: `efficient-frontier` entry in category `"portfolio"`; insert the new entry **directly after** it.
  Sub-page pattern: `src/features/immunization/ImmunizationPages.tsx` (`useParams()["*"]`, `<Navigate>`
  fallback) and `subNav` items with `descKey` + `seoTitle` (e.g. the `delta-hedging` entry). Every sub-page
  also renders the module's About (`src/App.tsx` L29), so word counts are shared.
- Copy tables registered in `src/Language/index.en.ts`/`index.hu.ts` (identical keys enforced by
  `satisfies Record<BaseKey, string>`); `Home.ts` (nav keys), `Seo.ts`, `ModuleAbout.ts` (+ `.hu`).
- Home: `src/features/home/home.viz.ts` `MODULE_VIZ`; icons `src/components/layout/ModuleIcon.tsx` `ICONS`.
- `SERIES_PALETTE` (`var(--chart-1..8)`) in `src/components/charts/chart.theme.ts`.
- Guide files are coordinated in `docs/GUIDES_PLAN.md`; the two guide files below become re-export shims only
  — append a Log line there saying so.

## Goal
1. `src/lib/graph/forceLayout.ts` and `src/components/charts/network/useGraphViewport.ts` hold the code; the
   old paths re-export it; the guide graph is unchanged.
2. `NetworkGraph` chart: nodes/edges by props, pan/zoom/drag, selection, connect-by-drag, statuses that are
   not colour-only, keyboard path.
3. `systemic-risk` module with router, three stub pages, copy tables, partials, shared URL keys, scripts.

## Non-goals
- No finance or contagion maths (plan 05); no page content (06–08); no visual change to the guide graph.

## Steps
1. **Promote layout**: create `src/lib/graph/forceLayout.ts` with the full content of
   `guide.graph.layout.ts` (fix the `makeRng` import to `../math/random`). Replace the guide file with explicit
   re-exports (`export { forceLayout, fitInto, placeLabels } from "../../lib/graph/forceLayout";` and `export
   type { LayoutNode, LayoutEdge, Point, LayoutOptions, LabelCandidate, PlacedLabel } from …`). Run `npm run
   test:guide-graph`; if the loader cannot follow re-exports, point the test's import at the new file and note
   it in Findings.
2. **Promote viewport**: move `useGraphViewport.ts` to `src/components/charts/network/useGraphViewport.ts`
   (import `Point` from `../../../lib/graph/forceLayout`); the old file re-exports `useGraphViewport`,
   `fitView`, `View`, `Bounds`.
3. **Network chart** in `src/components/charts/network/`:
   - `network.types.ts`: `NetStatus = "ok" | "stressed" | "critical" | "failed"`; `NetNode = { id: string; label:
     string; radius: number; fill: string; group: string; status?: NetStatus; badge?: string }`; `NetEdge = { id:
     string; source: string; target: string; width: number; color: string; dashed?: boolean; directed?: boolean;
     active?: boolean }`; `NetworkGraphProps = { nodes; edges; height: number; seed?: number; positions?:
     Map<string, Point>; selectedId?: string | null; onSelect?: (id: string | null) => void; onEdgeSelect?: (id:
     string) => void; connectMode?: boolean; onConnect?: (from: string, to: string) => void; dimmed?: ReadonlySet<string>;
     ariaLabel: string; labels: { zoomIn; zoomOut; fit; status: Record<NetStatus, string> } }`.
   - `network.logic.ts` (pure, tested): `edgePath(a, b, ra, rb, curve)` (start/end trimmed by node radii so
     arrowheads touch the rim; slight curve so A→B and B→A don't overlap); `layoutFor(nodes, edges, w, h, seed)`
     via `forceLayout` + `fitInto`; `nearestNode(points, p, max)`.
   - `NetworkGraph.tsx` (+ `NetworkNodes.tsx`, `NetworkEdges.tsx`, `NetworkZoom.tsx`, each ≤ 150 lines):
     measured width (`useMeasuredHeight`-style or `ParentSize` like other charts), `useGraphViewport` for
     pan/zoom/drag, SVG `marker` arrowheads coloured by edge colour, `active` edges drawn thicker with a
     one-shot dash animation (none under reduced motion). Status glyphs: `stressed` dashed ring, `critical`
     thick ring, `failed` hollow fill with an × — plus a legend row with the words. Nodes are focusable
     (`tabIndex=0`, `role="button"`, `aria-label` "label, status"); Enter selects; Esc clears. Connect mode:
     pointer-down on a node draws a rubber-band line to the pointer; release over another node calls
     `onConnect`; keyboard alternative: select a node, press C, then Enter on the target.
   - Styles `src/styles/_network-graph.scss` (tokens only; square legend swatches).
   - Copy table `src/Language/NetworkChart.ts`/`.hu.ts` (prefix `net`: zoom in/out, fit, status words, connect
     hint).
4. **Module**: registry entry after `efficient-frontier`: `{ id: "systemic-risk", path: "/systemic-risk", navKey:
   "navSystemicRisk", category: "portfolio", status: "planned", seo: { titleKey: "seoTitleSystemicRisk", descKey:
   "seoDescSystemicRisk" }, about: moduleAbout("SystemicRisk", 4), relatedGuides: ["credit-risk",
   "risk-measures"], subNav: [{ id: "network", labelKey: "navSystemicNetwork", to: "/systemic-risk" }, { id:
   "shocks", labelKey: "navSystemicShocks", descKey: "seoDescSystemicShocks", seoTitle: "Financial Contagion
   Simulator: Defaults, Fire Sales and Runs", to: "/systemic-risk/shocks" }, { id: "episodes", labelKey:
   "navSystemicEpisodes", descKey: "seoDescSystemicEpisodes", seoTitle: "Systemic Risk Episodes: 2008, LTCM,
   March 2020, SVB", to: "/systemic-risk/episodes" }], Component: lazy(() =>
   import("../features/systemic-risk/SystemicRiskPages")) }`.
5. **Router and stubs** in `src/features/systemic-risk/`: `SystemicRiskPages.tsx` ("" → `pages/NetworkPage`,
   "shocks" → `pages/ShocksPage`, "episodes" → `pages/EpisodesPage`, else `<Navigate to="/systemic-risk"
   replace />`; pages lazy). Each stub page: `PageHeader` + planned `Panel`; `NetworkPage` also renders a
   12-node sample `NetworkGraph` from `pages/sampleGraph.ts` (abstract nodes "A"…"L") so this plan's chart is
   exercised in the browser.
6. **Shared URL keys** `systemicRisk.url.ts`: `net` (`urlEnum(["core-periphery", "complete", "ring", "random",
   "starter"], "core-periphery")`), `seed` (`urlNumber(3, 1, 9999, 0)`), `edits` (`urlString("")`, an encoded
   edit list defined by plan 05). Pages add their own keys in their own schema files.
7. **Copy**: `Home.ts` nav keys (`navSystemicRisk` "Systemic Risk" / "Rendszerkockázat", `navSystemicNetwork`
   "Network" / "Hálózat", `navSystemicShocks` "Shock simulation" / "Sokkszimuláció", `navSystemicEpisodes`
   "Historical episodes" / "Történelmi epizódok"); `Seo.ts` title + three descriptions (120–160 chars); About
   intro (~90 words) + 4 Q&As (~70 words: what systemic risk is; the contagion channels — counterparty losses,
   fire sales, funding runs; why "robust yet fragile"; that the institutions are stylised archetypes, not real
   firms). Tables `SystemicRisk.ts` (prefix `syr`, shell + network page), `SystemicRiskShocks.ts`
   (`syrShock…`), `SystemicRiskEpisodes.ts` (`syrEp…`), each `.hu.ts`, registered in both index files.
8. **Styles**: `_systemic-risk.scss`, `_systemic-risk-shocks.scss`, `_systemic-risk-episodes.scss` (one-line
   owner comments), plus `_network-graph.scss`; four `@use` lines at the end of `main.scss`. `MODULE_VIZ
   ["systemic-risk"]` (a few dots with connecting lines, one key dot) and an `ICONS` glyph (three linked circles).
9. **Scripts/tests**: `package.json` `"test:systemic-risk": "node --test scripts/systemic-*.test.mjs"`.
   `scripts/systemic-network-chart.test.mjs`: `edgePath` endpoints lie on the rims; reversed edges don't
   coincide; `layoutFor` deterministic per seed and inside the box. `scripts/systemic-wiring.test.mjs`: registry
   entry with three `subNav` items; copy keys EN/HU present and HU ≠ EN.
10. Log lines in `docs/GUIDES_PLAN.md` (shims) and `docs/LABS_PLAN.md`.

## Acceptance criteria
- `npm run test:guide-graph` and `/guide/graph` behave exactly as before (smoke + one screenshot compare by eye).
- `/systemic-risk`, `/systemic-risk/shocks`, `/systemic-risk/episodes` render; the sidebar shows the three
  sub-pages; the sample graph pans, zooms, drags, selects by click and keyboard, and connects two nodes.
- `test:seo` green (stub pages ≥ 400 words thanks to the shared About).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:systemic-risk && npm run test:guide-graph && npm run test:home && npm run test:search
npm run build && npm run test:seo && ls dist/systemic-risk/shocks dist/hu/systemic-risk/episodes
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/systemic-risk,/systemic-risk/shocks,/systemic-risk/episodes,/systemic-risk/nope,/hu/systemic-risk,/guide/graph"
node scripts/layout-audit.mjs   # the three pages at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Wheel listener:** keep the native non-passive wheel listener from the guide hook, or pages scroll while
  zooming.
- **Arrowhead colours:** SVG `marker` elements don't inherit stroke colour; create one marker per edge colour
  (few colours) with ids scoped by a `useId()` prefix so two graphs on a page don't clash.
- **SSR:** measure width on the client only; pre-render a fixed-height placeholder.
- Don't change guide visuals or behaviour; the guide keeps its own `GraphCanvas`.

## Findings (fill in during execution)
- Re-export approach that worked with the test loader: plain `export { … } from "../../lib/graph/forceLayout";` plus `export type { … } from …` in the old files. `scripts/lib/load-ts.mjs` follows relative `from "…"` specifiers, including re-exports, so `guide-graph.test.mjs` is unchanged and green (7/7; its 150 ms layout budget is load-sensitive: one run under parallel builds took 195 ms, later runs 76 ms).
- New HU keys for owner review: all draft. `navSystemicRisk` (Rendszerkockázat), `navSystemicNetwork`, `navSystemicShocks`, `navSystemicEpisodes`; `seoTitleSystemicRisk`, `seoDescSystemicRisk`, `seoDescSystemicShocks`, `seoDescSystemicEpisodes`; `aboutSystemicRiskIntro`, `…Q1–Q4`, `…A1–A4`; `homeLabDesc_systemicRisk`; `netZoomIn/ZoomOut/Fit/ZoomGroup`, `netStatusOk/Stressed/Critical/Failed`, `netConnectHint`, `netConnecting`; `syrTitle/Desc/Planned/SampleAria/SampleCaption/SampleSelect/SampleConnect/SampleMode`; `syrShockTitle/Desc/Planned`; `syrEpTitle/Desc/Planned`.
- Deviations:
  - `NetLabels` gained `zoomGroup`, `connectHint` and `connecting` (the plan's label list had no place for the connect hint or the keyboard-armed announcement); `NetworkGraphProps` gained an optional `layoutKey`.
  - The layout reruns when the node set (ids, groups, radii), `seed`, size or `layoutKey` changes, **not** when edges are added or removed: a first version keyed on edges rearranged the whole picture each time a link was drawn. Pages that swap in a different network of the same nodes pass `layoutKey` or `positions`. `network.logic.ts` exports `layoutKey(nodes)` instead of a topology key.
  - Added `network.logic.ts` `edgeGeometry` (endpoints, control point, path); `edgePath` is a thin wrapper. Added `useConnectDrag.ts`, `NetworkLegend.tsx` (a legend of statuses present, hidden when all are healthy) and `NetworkGraphInner.tsx` (ParentSize wrapper pattern used by the other charts).
  - `home.test.mjs` requires `homeLabDesc_<camel id>` for every lab, so `homeLabDesc_systemicRisk` was added (EN and HU) to `Home.ts`/`Home.hu.ts`.
  - The stub sub-pages do not render the module About (only the root page does), and `test:seo` classes sub-pages as "lesson" with a 250-word floor. The `syrShockPlanned` / `syrEpPlanned` stub texts are therefore ~100 words each; plans 07/08 replace them with real pages. The EN `seoTitle` for the shocks page was shortened to "Contagion Simulator: Defaults, Fire Sales and Runs" (the plan's wording gave a 76-character title, limit 70).
  - `systemicRisk.url.ts` (`net`, `seed`, `edits`) is created but nothing reads it yet; plan 06 wires it.
- Verification: `tsc -b` fails only in plan 05's in-progress `engine/metrics.math.ts` (not touched); `build` was run as `vite build` in a temporary copy of the tree (junctioned `node_modules`, since the shared `dist/` was being rebuilt by other sessions). In that copy `test:seo` has no systemic-risk failure; its remaining failures are other packs' pages (gbm/definition, market-making desk, microstructure titles/descriptions/twins) and the initial-JS budget (1,022,698 B vs 1,000,000; the systemic EN strings add roughly 5 KB). `/systemic-risk/nope` shows React error #418 in smoke, identical to `/immunization/nope` on the same build (pre-existing). Layout audit (360/768/1280/1536, light/dark) shows only tap-target warnings (30 px zoom buttons at 360, same as the guide's); dark-theme and slider-input flags in that run came from another session sharing the audit browser. `test:challenges` fails on `avs-beat` (market-making, not this plan).
- Browser-checked on the preview: sample graph renders with all four status glyphs and legend, nodes drag, click selects, wheel zoom is non-passive and prevented, "Draw links" drag J→D adds a link without re-laying out, keyboard path (Enter, C, Enter on target, Esc) works.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/04-systemic-foundation.md`. Implement
> plan 04: promote the guide's force layout and viewport hook to shared files with re-export shims, build the
> generic `NetworkGraph` chart, and register the `systemic-risk` module with its router, three stub pages,
> shared URL keys, copy, styles, home tile and tests. Run the verification block (the guide graph must be
> unchanged), fill in Findings, append DONE to LOG.md, set plan 04 to `done`, and summarise.
