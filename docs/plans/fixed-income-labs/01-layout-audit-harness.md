# 01 — Layout audit harness

Status: done (2026-10-19) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The owner wants FI pages to be "impeccable": no overlapping components, no misalignment. That is only
enforceable with a command that measures geometry at many widths and fails on defects. Every later plan
ends by running it.

## Current state (verified 2026-10-19)
- No layout checks exist. `scripts/` has node `--test` unit tests (`scripts/*.test.mjs`) and
  `scripts/lib/load-ts.mjs` (TS loader for tests). No Playwright/Puppeteer dependency; do not add one.
- A dependency-free CDP smoke script exists at
  `C:/Users/Máté/.claude/skills/planning-pack/scripts/cdp-smoke.mjs` (149 lines, Node 22+ global
  `WebSocket` + `fetch`, auto-detects Chrome then Edge). It is **not** in the repo yet.
- Node v24, Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`.
- FI routes: `/bond-pricing`, `/yield-curve`, `/duration-convexity`, `/treasury-futures` (and `/hu/…`).
  Module paths come from `src/modules/registry.ts` (`category: "fixed-income"`).
- A rough probe during planning showed: 0 px document overflow everywhere, but naïve sibling-overlap
  counts of 5–18 per page, all false positives: hidden `<p>` in collapsed `.intuition-on-demand` content
  (zero opacity / `display` tricks) and the yield-curve `.yc-quote-value` input with its `%` unit `<span>`
  deliberately positioned inside the input. Real defects (SVG tick collisions, labels over curves, clipped
  ticks) were only visible in screenshots. So the harness must check **SVG text** too and must ignore
  invisible elements.
- Theme: `src/theme.tsx` (check how it stores the choice: grep `localStorage` there) — the audit sets it
  before load to test dark mode.

## Goal
1. `scripts/cdp-smoke.mjs` copied into the repo unchanged.
2. `scripts/layout-audit.mjs`: for each (path × width × theme), report and fail on:
   - **overflow**: `documentElement.scrollWidth > clientWidth`;
   - **offscreen**: visible element whose right edge > viewport, unless inside an element with computed
     `overflow-x: auto|scroll` (a legitimate scroller);
   - **overlap**: two visible text-bearing boxes (HTML leaf text elements, form controls, buttons) that are
     not ancestor/descendant and intersect by > 2 px on both axes;
   - **svg-text-collision**: two visible `<text>` elements in the same `<svg>` whose `getBBox` (mapped via
     `getBoundingClientRect`) intersect by > 1 px;
   - **svg-text-clipped**: an SVG `<text>` whose client rect extends > 1 px outside its `<svg>`'s rect;
   - **text-clipped**: element with `overflow: hidden|clip` and `scrollWidth > clientWidth + 1` whose
     `text-overflow` is not `ellipsis` (ellipsis is an intentional truncation);
   - **tap-target**: on widths < 700, `button, a, input, select, [role=slider], [role=tab]` smaller than
     32 × 32 px (report as warning, fail only with `--strict`).
   - **left-border-accent**: element with `border-left-width ≥ 2px` and a non-transparent colour, while
     other borders are 0 (owner rule) — fail.
3. Visibility filter: skip elements with zero-size rect, `visibility:hidden`, `opacity` 0 on self or any
   ancestor, `aria-hidden="true"` ancestors, or `[data-layout-allow]` ancestors (escape hatch; value =
   reason, printed in the report).
4. Screenshots of every page (full height, capped at 6000 px) into an output dir; one JSON line per page
   plus a final summary; exit code 1 if any failure.

## Non-goals
Fixing any defect (plans 02/03). Visual-diff baselines. Non-FI groups beyond letting `--paths` take any list.

## Constraints
Plain `.mjs`, no dependencies, ≤ ~350 lines is fine (scripts are exempt from the 150-line `.tsx` rule but
keep `// #region` sections). Short comments only.

## Steps
1. Copy the smoke script: `cp "C:/Users/Máté/.claude/skills/planning-pack/scripts/cdp-smoke.mjs" scripts/`.
2. Create `scripts/layout-audit.mjs`. Reuse the browser-launch / CDP-`send` pattern from cdp-smoke (copy
   the ~30 lines; it is a standalone script, a shared module isn't worth it). CLI:
   ```
   --base <url>          required
   --paths <a,b>         explicit list, OR
   --group fixed-income  read registry paths: grep `path: "/…"` entries whose block has
                         `category: "fixed-income"` in src/modules/registry.ts (regex over the file text;
                         don't import TS). Adds the `/hu` variant of each.
   --widths 360,390,768,1024,1280,1536   (default)
   --themes light,dark   (default both)
   --out <dir>           screenshots (default: .layout-audit/ — add to .gitignore)
   --strict              tap-target warnings become failures
   --after "<js>"        expression run after load (e.g. click a tab) before measuring; repeatable,
                         each produces its own measurement labelled with the index
   --wait <ms>           default 2500
   ```
3. Per width: `Emulation.setDeviceMetricsOverride {width, height: 900, deviceScaleFactor: 1, mobile: width < 700}`;
   for dark: set the theme storage key via `Page.addScriptToEvaluateOnNewDocument` before navigation and
   also `Emulation.setEmulatedMedia {features:[{name:"prefers-color-scheme", value:"dark"}]}`.
4. Run the measurement as one `Runtime.evaluate` with an IIFE returning JSON. Scope: `document.body`
   (header, sidebar, main, footer all count). Cap reported items at 10 per kind, but count all.
5. Screenshot: read `Page.getLayoutMetrics().cssContentSize.height`, override height to it (≤ 6000),
   `Page.captureScreenshot {format:"png"}`, file `<out>/<theme>-<width><path with / → _>.png`.
6. Output: one line per run `{path, width, theme, step, failures:{kind:count}, samples:{kind:[…]}}`, then
   `SUMMARY pages=N failing=M`, exit 1 if M > 0.
7. `package.json` scripts: `"audit:layout": "node scripts/layout-audit.mjs"`.
8. Add `.layout-audit/` to `.gitignore`.
9. Run it against FI and paste the baseline counts per page into Findings (expect failures: that is the
   backlog for 02/03). Do **not** add `data-layout-allow` anywhere in this plan.

## Acceptance criteria
- `node scripts/layout-audit.mjs --help` prints usage.
- Running on FI produces 4 paths × 2 langs × 6 widths × 2 themes = 96 lines + summary and PNGs.
- Break it on purpose: temporarily add `style="width:2000px"` to a div in `PageHeader.tsx` → `overflow`
  failures reported; revert. Temporarily add `border-left:3px solid red` to `.panel` → `left-border-accent`
  fails; revert.
- The duration 360 px run reports the "Duration: tangent slope" label collision or the clipped `+200` tick
  (both visible in planning screenshots). If not, the SVG checks are wrong: fix before finishing.
- The yield-curve `%` unit inside `.yc-quote-value` must **not** be counted (it sits inside the input box
  by design): handle it by treating an element positioned absolutely inside a form-control wrapper as part
  of the control (ignore overlaps between an `input` and a sibling inside the same `label`/wrapper whose
  class contains `value` or `unit`), and say in Findings which rule you used.

## Verification
```bash
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --group fixed-income
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/duration-convexity"
# stop preview, then: netstat -ano | grep :4173   → nothing LISTENING
```

## Pitfalls
- Git Bash rewrites `/paths` → needs `MSYS_NO_PATHCONV=1`.
- `vite preview` serves the pre-rendered build; dev server works too but is slower and shows HMR overlays.
- `getBoundingClientRect` on `<text>` in a scaled SVG is already in CSS px; don't multiply by viewBox.
- Recharts is being removed; some charts are visx SVG, `PathCloudChart` uses `<canvas>` (skip canvas).
- Kill Chrome in `finally`, otherwise the next run's DevTools port is busy.

## Findings (fill in during execution)
- Baseline (dev server, 96 runs = 4 paths × 2 langs × 6 widths × 2 themes, 43 failing; EN+HU merged). Widths where the kind fired:
  - bond-pricing: svg-text-collision 360,390; overflow+offscreen 360,390,768; svg-text-clipped 1280,1536.
  - yield-curve: left-border-accent all widths (`.yc-quote-row.is-selected`); svg-text-collision 360,390; overflow+offscreen 768; svg-text-clipped 768,1536.
  - duration-convexity: svg-text-clipped 360,390,768,1024,1536 (`+200` tick, "Yield change Δy (bp)"); overflow+offscreen 768.
  - treasury-futures: overflow+offscreen 768,1536. The 360 px cash-flow tick collision from planning was not flagged by the default load (chart/tab not visible at load; use `--after` to open it in plan 03).
  - tap-target warnings are everywhere on phones (tabs 27 px, sliders 6–8 px, info buttons 18 px); they fail only with `--strict`.
- Deviations: ran against `vite` dev (port 5200) because `npm run build` was blocked by another session's tsc errors; build/preview not exercised. Added to the spec: closed `<details>` content is invisible; overlap compares per-line `getClientRects` (wrapped inline links otherwise collide falsely); left-border-accent fires when the left border is ≥ 2 px and wider than the others (panels have 1 px borders); `send` has a 30 s timeout. Input/unit rule: overlaps between two elements inside the same `label` or a class containing `value`/`unit` are ignored. Break-it checks done: 2000 px div → overflow + offscreen; `border-left:3px` on `.panel` → left-border-accent. Pre-render pages are not audited separately.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/01-layout-audit-harness.md`. Implement plan 01: copy
> cdp-smoke.mjs into scripts/, write scripts/layout-audit.mjs with the checks, CLI and output described,
> add the npm script and .gitignore entry. Run the verification commands, do the break-it-on-purpose
> checks, record the baseline in Findings, set plan 01 to done in the README table, and summarise. Do not
> fix layout defects in this plan.
