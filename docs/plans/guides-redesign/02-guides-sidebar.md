# 02 — Guides sidebar

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
On guide pages the left sidebar is the reader's map of the curriculum. Today it lists long wrapping
titles with no sense of progress. The design keeps the owner's **book icon**, adds per-track progress
and makes the current and next lesson obvious — without colour floods or left bars.

## Current state (verified 2026-10-20)
- Guide tracks are registry modules built by `guideModule(trackId, seo)` in `src/modules/registry.ts`:
  `id: \`guide-${trackId}\``, `path: guideTrackPath(trackId)`, `navKey: track.titleKey`, `icon: "guide"`,
  `category: "guides"`, `subNav: guideNavItems(track)` (items `{ id: <lessonId>, labelKey, prefix: "01"…, to }`).
  The knowledge graph module is `guide-graph` (same category, no subNav).
- `src/components/layout/Sidebar.tsx` (67 lines, shared by every category) renders a head
  (`.side-section-label` + pin button), `nav.side-tree` with a sliding background `.side-indicator`
  (full-width, not a left bar) and one `SideModuleRow` per module, then `ConnectedGuides`.
- `src/components/layout/SideModuleRow.tsx`: `NavLink.side-row` with `.side-icon` (`<ModuleIcon id="guide"/>`
  = the book), `.side-label`, beta dot / planned badge, an expander button, and `<SideSubNav items>` when open.
  Only the active module is open by default.
- `src/components/layout/SideSubNav.tsx` (39): `Link.side-subrow` (`.active` for the current path) with
  `.side-sub-number` (prefix) and `.side-sub-label`; staggered fade-in via `--i`.
- Styles in `src/styles/_shell.scss` (`.side-row`, `.side-subrow` ~407–470, `.side-sub-number` ~458).
- Progress: `useGuideProgress().isRead(lessonId)` in `src/features/guide/useGuideProgress.ts`
  (empty before hydration); track lessons via `guideTrackById(id)` + `trackLessons(track)` in
  `src/features/guide/guide.meta.ts`.

## Goal
For modules in category `guides` only:
1. Track row: book icon, track name in `--font-display` 16–17px, right-aligned mono "read / total"
   (`--text-dim`), and under it a 1px `--rule-strong` line with a 3px `--accent` fill = read share.
   Open track row: background `--surface`, text `--text`.
2. Lesson rows: 13px/1.35, mono number (`--text-dim`), title `--muted`; **current** lesson =
   background `--surface-soft` + `--text`; **next unread** lesson's number in `--accent`; read lessons'
   numbers stay `--text-dim` (no ✓ icons, no green).
3. The knowledge-graph row uses a small graph glyph (three dots joined) instead of the book.
4. Lab categories render exactly as before.

## Non-goals
- No change to pinning, collapse behaviour, `ConnectedGuides`, or lab sidebars.

## Constraints
- Keep `Sidebar.tsx`, `SideModuleRow.tsx`, `SideSubNav.tsx` ≤150 lines each; put guide-specific
  logic in `src/features/guide/components/GuideSideProgress.tsx` and a hook, not in the shared files.

## Steps
1. `src/features/guide/useTrackProgress.ts`:
   `/// Read count, total and next unread lesson of the guide track behind a sidebar module id ("guide-<track>").`
   `export function useTrackProgress(moduleId: string): { read: number; total: number; nextId?: GuideId } | null`
   (returns null for non-track modules and before hydration totals are fine, `read` 0).
2. `GuideSideProgress.tsx`: renders the mono count and the progress line (props from the hook).
3. `SideModuleRow.tsx`: when `m.category === "guides" && m.subNav`, render `<GuideSideProgress moduleId={m.id} />`
   inside the row; pass to `SideSubNav` an optional `numberClass?: (itemId: string) => string | undefined`
   that returns `"next"` for `nextId`.
4. `SideSubNav.tsx`: accept the optional `numberClass` prop and add it to `.side-sub-number`.
5. `ModuleIcon`: add a `"graph"` glyph (three circles + two lines, stroke `currentColor`) and set
   `icon: "graph"` on the `guide-graph` module in `registry.ts`.
6. Styles in `_shell.scss`, scoped with a `.side-node.is-guide` class that `SideModuleRow` adds for
   guide modules: rules from Goal; `.side-sub-number.next { color: var(--accent); }`.

## Acceptance criteria
- On `/guide/portfolio/risk-aversion` the Portfolio track row shows "n / 8" and a line; the current lesson
  row has the tinted background; other tracks are collapsed.
- On `/black-scholes` the sidebar markup has no `.is-guide` nodes and looks unchanged.
- No `border-left`/`inset … 0 0` accent added (`git diff src/styles/_shell.scss | grep -n "border-left\|inset 2px"` → nothing).

## Verification
```bash
npx tsc -b && npx eslint src/components/layout src/features/guide && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/portfolio/risk-aversion,/black-scholes,/hu/guide/portfolio" \
  --after "/guide/portfolio/risk-aversion|document.querySelectorAll('.side-node.is-guide').length" \
  --after "/black-scholes|document.querySelectorAll('.side-node.is-guide').length"
# expect: no problems; first value ≥ 5; second value 0
```
Stop the server; check the port is free.

## Pitfalls
- `useGuideProgress` reads localStorage; the first render must match the pre-rendered HTML (read = 0).
- `SideSubNav` is also used by the Stochastic studio lessons; the new prop must be optional.

## Findings (fill in during execution)
- New `useTrackProgress.ts`, `GuideSideProgress.tsx`; `SideModuleRow` adds `.is-guide`, `SideSubNav` takes optional `numberClass`; `graph` glyph added to `ModuleIcon` and used by `guide-graph`. Scoped styles appended to `_shell.scss`.
- Smoke: `/guide/portfolio/risk-aversion` has 6 `.side-node.is-guide` (5 tracks + graph), `/black-scholes` has 0; no problems on EN/HU pages. The graph row has no progress line (not a track).
- No new HU strings.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/02-guides-sidebar.md`,
> and confirm plan 01 is done (stop if not). Run `git status` and stop if the sidebar files have changes you didn't
> make. Implement plan 02: per-track progress and next-lesson marking in the guides sidebar, a graph glyph for the
> knowledge graph row, all scoped to the `guides` category. Run the Verification commands and make them pass. Fill
> in Findings, set plan 02 to `done (<date>)` in the README table, and summarise.
