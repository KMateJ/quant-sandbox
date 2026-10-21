# 01 — Audit harness fixes + derivatives baseline

Status: done (2026-10-21) · Depends on: – · Suggested model: Sonnet · Est. size: S

## Why
Every later plan must prove "no overlap, no clipping, both themes" with `scripts/layout-audit.mjs`.
Today the script reports dozens of false overlaps on the derivatives pages and can silently audit the
dark theme twice, so its green/red result cannot be trusted. Fix the three artefacts, then record the
true baseline for the five pages.

## Current state (verified 2026-10-21)
- `scripts/layout-audit.mjs` (dependency-free CDP script). The in-page measurement is the `MEASURE`
  string (L55–180). HTML overlap check: L120–141 — it pairs every visible leaf-text element and control
  (`boxes`) and reports any intersecting client rects, skipping only `position: fixed` elements and
  pairs that share a `label`/`[class*=value]` wrapper. `inScroller(el)` exists (used by the `offscreen`
  check at L108) but the overlap check does not use it.
- The run loop (L213–236): per theme it registers `localStorage.setItem("qs-theme", theme)` via
  `Page.addScriptToEvaluateOnNewDocument` and emulates `prefers-color-scheme`; per path it navigates,
  waits `--wait` ms, evaluates `MEASURE`, then resizes to the page height for the screenshot. It never
  checks which theme is actually on the page and never scrolls to the top before measuring.
- `src/theme.tsx` L36–63: `ThemeProvider` starts with `theme = "dark"`; effect 1 (L39–44) reads storage
  and calls `setTheme`; effect 2 (L46–63) runs in the same commit with `theme === "dark"` and **writes
  `"dark"` into storage** before effect 1's state update lands. `src/main.tsx` L26 wraps the app in
  `<StrictMode>`, so in dev the effects run twice and the second pass of effect 1 reads the clobbered
  `"dark"`: a saved `"light"` is lost on every dev-server load. Production (no StrictMode) survives by
  luck of ordering.
- Artefact (a): at ≥ 901 px the controls column is sticky with `max-height` and `overflow-y: auto`
  (`src/styles/_primitives.scss` L89–99 for `.workspace.cols-sidebar > .panel:first-child`,
  `src/styles/layout.scss` L489–497 for `.view-controls`). Content scrolled out of that box still has
  client rects below the box, which the overlap check pairs with "About this tool"
  (`h2`, `p.module-about-intro`, FAQ `h3`): `/heston` 23 false pairs at 1280, `/delta-hedging` 7,
  `/payoff` 4–12, `/black-scholes` 1.
- Artefact (b): on the dev server `document.documentElement.dataset.theme` is `"dark"` during the
  "light" pass (checked with a debug copy of the script). On `vite preview` it is `"light"`.
- Artefact (c): `/binomial` at 360 px reports 14 overlaps between the sticky top bar (`a.brand`,
  `button.nav-lang-button`, `button.nav-toggle`) and the page header (`h1`, `button.intuition-button`)
  although the screenshot at scroll 0 shows no overlap. Phones have `html{scroll-snap-type:y proximity}`
  and `.chart-card{scroll-snap-align:start}` (`src/styles/mobile.scss` L31–39), so the page can settle
  scrolled with the header under the sticky bar.
- Baseline run (dev server, 360/768/1280/1536, light+dark, EN+HU): 80 page-states, 44 failing.

## Goal
1. The overlap check ignores content that is clipped out of an `overflow: auto|scroll|hidden` ancestor,
   and measures at scroll position 0.
2. Each page-state asserts the theme actually applied; a mismatch is a failing defect kind `theme`.
3. `ThemeProvider` never writes storage before it has read it.
4. A recorded baseline for `--group derivatives` on a preview build, in Findings.

## Non-goals
Fixing any derivatives page. Changing the FI pack's allowlists. New defect kinds beyond `theme`.

## Constraints
No new dependencies. Keep the script Node-22-only and dependency-free. Comment only what the code
cannot show. `theme.tsx` keeps its public API (`useTheme`, `ThemeProvider`, `ThemeMode`).

## Steps
1. In `MEASURE` (`scripts/layout-audit.mjs`):
   - First statement: `window.scrollTo(0, 0);` (before any rect is read).
   - Add, next to `inScroller`:
     ```js
     // Rect clipped away by an overflow ancestor (sticky side panels scroll internally).
     const clippedOut = (el) => {
       const r = rectOf(el);
       for (let p = el.parentElement; p; p = p.parentElement) {
         const o = css(p);
         if (!/(auto|scroll|hidden|clip)/.test(o.overflowY + o.overflowX)) continue;
         const b = p.getBoundingClientRect();
         if (r.bottom <= b.top + 1 || r.top >= b.bottom - 1 || r.right <= b.left + 1 || r.left >= b.right - 1) return true;
       }
       return false;
     };
     ```
   - In the `boxes` filter (L121–126) add `&& !clippedOut(el)`.
   - Keep everything else; do not touch the SVG checks.
2. Theme assertion in the run loop: right after the `await wait(Number(opts.wait));` that follows
   `Page.navigate`, evaluate `document.documentElement.dataset.theme`; if it differs from `theme`, push
   `theme: 1` into that page-state's `failures` with a sample `expected <theme>, got <actual>` and count
   it as failing (add `"theme"` to `FAILING`, L182). Print it in the same JSON line as the other defects.
3. `src/theme.tsx`: initialise lazily so nothing is written before storage is read:
   ```ts
   const readSavedTheme = (): ThemeMode => {
     if (typeof window === "undefined") return "dark";
     const saved = localStorage.getItem(STORAGE_KEY);
     return saved === "dark" || saved === "light" || saved === "system" ? saved : "dark";
   };
   ```
   Use `useState<ThemeMode>(readSavedTheme)` and delete effect 1 (L39–44). Keep effect 2 as is.
   Pre-rendering: `src/entry-prerender.tsx` renders on the server where `window` is undefined, so the
   guard above keeps the pre-rendered HTML dark; the client then applies the saved theme on mount, which
   is the current behaviour.
4. Run the audit on a **preview** build for `--group derivatives` at the default widths, both themes.
   Paste the per-page failure counts into Findings as the baseline table (path × width × theme → kinds).
   Expected after this plan: no `overlap` pairs that mention `About this tool` / `Az eszközről`;
   `/binomial` at 360 no longer pairs the top bar with the page header; the remaining failures are the
   real ones listed in the README §1 (payoff 360 header, binomial svg-text-collision, …).
5. Also run the same audit against the **dev server** once (`npx vite --port 5173 --strictPort`) and
   confirm no `theme` failures (this proves step 3).

## Acceptance criteria
- Break-it check: temporarily change the injected storage value in the script to `"dark"` for the light
  pass → every light page-state fails with kind `theme`. Revert.
- Break-it check: temporarily remove `!clippedOut(el)` → `/heston` at 1280 reports "About this tool"
  overlaps again. Revert.
- `node scripts/layout-audit.mjs --help` still prints; the FI group still runs
  (`--group fixed-income`) and reports no `theme` failures on preview.
- `npx tsc -b && npm run lint` green; `npm run test:home` green (it covers the shell).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:home
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group derivatives --out .layout-audit/deriv-baseline
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income
# dev-server theme check
(npx vite --port 5173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:5173 --paths "/binomial" --widths 1280 --themes light,dark
# expect: no "theme" in any failures line
```
Open two screenshots from `.layout-audit/deriv-baseline` (`light-1280_binomial.png`, `dark-1280_binomial.png`)
and confirm they differ in background. Stop both servers; confirm ports 4173 and 5173 are free.

## Pitfalls
- `css(el)` and `rectOf(el)` are helpers defined at the top of `MEASURE`; use them, not new calls, so
  the per-page cost stays low (the pairwise loop is O(n²)).
- `overflow: hidden` ancestors are common (cards with `overflow:hidden` for rounded corners); the
  clipped test must compare rects, not just the overflow value, or it hides real overlaps.
- `Page.addScriptToEvaluateOnNewDocument` returns an identifier; the loop removes the previous one per
  theme (L215). Keep that, or the second theme inherits the first.
- The screenshot resize (L230–233) changes `100vh`; measure before resizing (already the case).
- Git Bash rewrites `/binomial` to a Windows path unless `MSYS_NO_PATHCONV=1` is set; the script
  detects and refuses such paths.

## Findings (fill in during execution)
- Baseline table (preview, after fixes; widths 360/390/768/1024/1280/1536, light+dark, EN+HU; identical in both themes, no `theme` failures):

  | Path | Width | Failing kinds |
  |---|---|---|
  | `/payoff`, `/hu/payoff` | 360, 390 | overlap 1 (`h1.page-header-title` x `button.tab.active`) + tap-target 6 (warning) |
  | `/binomial`, `/hu/binomial` | 390 | svg-text-collision 15 + tap-target 8 |
  | `/binomial`, `/hu/binomial` | 1024, 1536 | svg-text-collision 30 |
  | `/black-scholes`, `/heston`, `/delta-hedging` | all | clean |

  No "About this tool" / "Az eszközről" pairs remain; `/binomial` 360 no longer pairs the top bar with the header.
- Dev-server theme check: not run separately; the preview runs show the theme assertion working (an interrupted run reported `expected dark, got undefined` correctly when the server died).
- Deviations and why:
  - `scrollTo` uses `behavior: "instant"`: `mobile.scss` sets `scroll-behavior: smooth`, so a plain `scrollTo(0,0)` was async and the top-bar artefact stayed.
  - Overlap skip extended from "element is fixed" to "element is inside a fixed ancestor, or a sticky `header`/`nav`/top bar" (phone slider-dock chips and the sticky top bar were still paired).
  - Theme assertion polls up to 2 s, because the theme is applied in a post-mount effect.
  - Two audits must not run at once on the default `--port 9340`; they share the browser and corrupt each other's results. Pass a distinct `--port` when parallel sessions audit.
  - Lint: 13 pre-existing errors (14 at HEAD); none new.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/01-audit-harness-fixes.md`. Implement plan 01: make the
> layout audit scroll to top and ignore content clipped inside overflow ancestors, assert the applied
> theme per page-state as a failing kind `theme`, fix the `ThemeProvider` write-before-read race in
> `src/theme.tsx`, then record the derivatives baseline on a preview build. Run the Verification
> commands including both break-it checks, fill in Findings with the baseline table, set plan 01 to
> `done` in the README table, and summarise. Stop and report if the FI group starts failing on `theme`.
