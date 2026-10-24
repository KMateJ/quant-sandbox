# 16 — Sandbox page: desks and challenges

Status: done (2026-10-24) · Depends on: 02 · Suggested model: Sonnet · Est. size: M

## Why
Desks and lab challenges are scattered across modules. `/sandbox` is one place that lists every desk (with
missions completed and best scores) and every lab challenge (with plays, hit rate and best streak), and
links to each. Every desk's command bar links here (`gkSandboxLink`).

## Current state (verified 2026-10-24, commit `349c0ca`)
- Registry `src/modules/registry.ts`: `ModuleDef` L37–58 (`category?` optional — "home has none"),
  `subNav?: ModuleSubNavItem[]`. The home entry (~L115) is the only module without a category today.
  `src/seo.routes.ts` L43 already handles a module without a category (no breadcrumb category);
  `src/components/layout/AppShell.tsx` L26 shows the sidebar only when there is an active category, so
  `/sandbox` renders full width with no sidebar.
- Desks are registry `subNav` items with `id: "desk"`: hedging (`/delta-hedging/desk`) today; ALM, rates,
  portfolio and retirement are added by plans 05/08/11/14 (they may land after this plan).
- Kit (plan 01): `readProgressKey(key)`, `progressKey(deskId)`, `readChallenges()`, `subscribeChallenges`,
  `CHALLENGES` (`{ id, area, moduleId, kind, tolerance }`), `ChallengeStats`. Kit (plan 02): `gdesk`
  theme, `CommandBar`, `QuoteStrip`, `gameFormat`. The Hedging Desk still uses key
  `qs.hedgingDesk.progress.v1` until plan 03 migrates it to `qs.game.hedging.progress.v1`.
- Design: canvas board `Main.dc.html` (the hub).

## Goal
A registry module `sandbox` at `/sandbox` (and `/hu/sandbox`), pre-rendered, in the sitemap, listing desks
and challenges with live saved scores.

## Non-goals
- No edits to desks, labs or the kit. No sandbox *mode* (free play) — only the page.

## Constraints
- Folder `src/features/sandbox/`; copy `src/Language/Sandbox.ts` (+ `.hu.ts`, prefix `sbx`); styles
  `src/styles/_sandbox.scss` (appended `@use` at the end of `main.scss`). The page sits inside `.gdesk`
  (amber terminal), like the canvas hub.
- Registry-driven: **do not hard-code desk paths or titles**. Derive desks from `modules` (`subNav` item
  `id === "desk"`); map module id → desk id in one small table.

## Steps
1. `src/features/sandbox/sandbox.data.ts` (pure):
   ```ts
   export const DESK_IDS: Record<string, string> = { "delta-hedging": "hedging", immunization: "alm",
     "yield-curve": "rates", "portfolio-lab": "portfolio", tvm: "retirement" };
   export const DESK_MISSIONS = 5;
   /// Old key read for the hedging desk until plan 03 lands.
   export const LEGACY_KEYS: Record<string, string> = { hedging: "qs.hedgingDesk.progress.v1" };
   ```
   and `sandbox.math.ts` (pure): `deskSummary(progress: ProgressMap) → { completed: number; best: number | null }`
   (best = max over missions — show "—" when null), `challengeSummary(stats?: ChallengeStats) → { played; hitRate; bestStreak }`,
   `groupChallenges(CHALLENGES) → Record<area, Challenge[]>` in area order stochastic, portfolio, rates, corporate.
2. `useSandboxData.ts`: desks from `modules` where `subNav?.some(i => i.id === "desk")` and `DESK_IDS[m.id]`
   exists; progress via `useSyncExternalStore` over `readProgressKey(progressKey(id))` (falling back to the
   legacy key when the new one is empty), subscribed to window `storage`; server snapshot = empty. Challenges via
   `useSyncExternalStore(subscribeChallenges, readChallenges, () => ({}))`. Cache snapshots so
   `getSnapshot` returns a stable object when storage has not changed (compare the raw string).
3. `SandboxView.tsx` (≤ 150 lines; split into `components/DeskTable.tsx`, `components/ChallengeTable.tsx`):
   `GameFrame` + `CommandBar` (ticker `QS Sandbox`, code `SBX <GO>`, title from `sbxTitle`); `QuoteStrip`
   (desks, missions completed of total, challenges played, overall hit rate); **Desks** table (desk name =
   the subNav label via `t(labelKey)`, module, missions done "n / 5", best, link "Open desk"); **Challenges**
   table grouped by area (challenge name `sbxCh_<id>` from copy, module link via the registry path,
   tolerance, played, hit rate, best streak; "Not played yet" when empty). Tables, not cards or pills.
4. Registry: append one entry (after the last corporate module, before stochastic is fine — keep other
   lines): `{ id: "sandbox", path: "/sandbox", navKey: "navSandbox", status: "beta", seo: { titleKey: "seoTitleSandbox", descKey: "seoDescSandbox" }, Component: lazy(() => import("../features/sandbox/SandboxView")) }`
   — no `category`, so it stays out of the sidebar and category lists. If any consumer assumes every
   non-home module has a category (check `modulesInCategory`, home cards, search, `seo.markdown.ts`), fix
   it with a guard and record it in Findings.
5. Copy: `navSandbox` in `Home.ts`/`.hu.ts`; `seoTitleSandbox`, `seoDescSandbox` in `Seo.ts`/`.hu.ts`;
   `Sandbox.ts`/`.hu.ts` for page copy and one `sbxCh_<id>` name per `CHALLENGES` entry (16).
6. Tests `scripts/sandbox.test.mjs`: `deskSummary`, `challengeSummary` (no plays → hit rate NaN shown "—"),
   `groupChallenges` covers every challenge once, every `CHALLENGES` id has `sbxCh_` copy in EN and HU, HU ≠ EN.
   `package.json`: `"test:sandbox": "node --test scripts/sandbox.test.mjs",`.

## Acceptance criteria
- `/sandbox` and `/hu/sandbox` pre-render, appear in the sitemap, pass `test:seo`; the hedging desk row
  shows completed missions from existing saved progress (play one mission, reload `/sandbox`).
- Desks added later appear without editing this page (only `DESK_IDS` lists them).
- Smoke and layout audit clean at 360/768/1280/1536; no `.tsx` over ~150 lines.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:sandbox && npm run test:game-kit
npm run build && npm run test:seo && ls dist/sandbox dist/hu/sandbox && grep -c "/sandbox" dist/sitemap.xml
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "/sandbox,/hu/sandbox,/"
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/sandbox"
```
Stop the server; confirm the port is free.

## Pitfalls
- **`useSyncExternalStore` snapshot identity:** returning a fresh parsed object each call loops forever.
- **Pre-render:** storage reads must be guarded; the server snapshot is empty and the client fills in after
  hydration (no hydration mismatch: render counts from the snapshot, not from `localStorage` during render).
- **Home and search:** a category-less module must not appear as a lab card on the home page; check.

## Findings (fill in during execution)
- Files: `src/features/sandbox/` (`SandboxView.tsx`, `components/DeskTable.tsx`, `components/ChallengeTable.tsx`,
  `useSandboxData.ts`, `sandbox.data.ts`, `sandbox.math.ts`), `src/styles/_sandbox.scss`, `src/Language/Sandbox*.ts`,
  registry entry `sandbox` (last in `modules`), `navSandbox` (Home tables), `seoTitleSandbox`/`seoDescSandbox` (Seo
  tables), `scripts/sandbox.test.mjs` + `test:sandbox`.
- Consumers that needed a no-category guard: none (search, home, top nav, sitemap and markdown twins already filter
  by category; the module has no `about`, so no markdown twin).
- Deviations: the desk table shows **which missions are completed** (e.g. "M1 M3") instead of one "best" score:
  best scores of different missions have different units and cannot be combined. `deskSummary` reads both the kit
  shape (`best`) and the legacy hedging shape (`bestPnl`); the hedging row falls back to `qs.hedgingDesk.progress.v1`
  while the new key is empty. Added an `sbxHowScores` sentence so the page clears the 400-word lab minimum.
- Verification: tsc clean; eslint clean on new files; `test:sandbox` 4/4; build pre-renders `dist/sandbox.html` and
  `dist/hu/sandbox.html` (h1 "Sandbox" / "Sandbox oldal"), both in the sitemap; `test:seo` 24/25. The one failure is
  the initial-JS budget (992 KB vs 955 KB), which is pack-wide (every desk adds EN copy to the initial table; GameKit
  + Sandbox are about 8 KB of it); logged for plan 18. cdp-smoke clean on `/sandbox`, `/hu/sandbox`, `/`.
  layout-audit (own preview port 4183, own DevTools port 9416) clean at 360/390/768/1024/1280/1536 in both themes
  apart from the `theme` check, which fails the same way on `/wacc` and `/delta-hedging/desk` (harness artefact).
- Parallel-session notes: preview port 4173 and the default DevTools port 9340 are shared by other sessions' audits;
  pass your own `--port` to preview and layout-audit. A `git worktree` with a junctioned `node_modules` builds into
  the **main** repo's `dist/` (vite resolves through the junction), so it cannot isolate a build here.
- Items awaiting owner approval: HU strings added: all of `src/Language/Sandbox.hu.ts` (incl. 16 challenge names and
  4 area names), `navSandbox` "Sandbox oldal", `seoTitleSandbox` "Quant Sandbox játékok: deskek és laborfeladatok",
  `seoDescSandbox`; desk order on the page follows the registry (owner decides, README §6).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/16-sandbox-hub.md`; confirm plan 02 is done. Implement plan
> 16: the registry-driven `/sandbox` page listing desks and lab challenges with saved scores, copy, styles and
> `test:sandbox`. Run the verification block, fill in Findings, append DONE to LOG.md, set plan 16 to `done`,
> and summarise. Do not stash or check out.
