# 04 — Binomial: theme-safe lattice, label spacing, summary, URL state

Status: done (2026-10-21) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
The binomial tree is the page's only visual, and it is drawn with hard-coded dark colours: in the light
theme it shows navy boxes on a white page. Its node text lines touch (30 audit collisions at 1536 px),
and the same two probabilities are printed on all 40 edges. The summary labels the risk-neutral
probability "Q". None of this needs a redesign; it needs tokens, spacing and one label.

## Current state (verified 2026-10-21)
- `src/features/binomial/components/BinomialLattice.tsx` (53 lines):
  - edges L24: `stroke="#7c8aa0"`; probability text L26–28: `fontSize="11" fill="#94a3b8"` on **every**
    edge (desktop only);
  - nodes L33: `<rect rx={10|9} fill="#162235" stroke="#415269">`; label lines L34–47:
    `t=…` at `y+14` (`#e2e8f0`), primary at `y+26` (`#60a5fa`), secondary at `y+39` (`#fbbf24`), all
    `fontSize` 11 — the audit reports pairs like `text "t=0" x text "S=100.00"` and
    `text "S=100.00" x text "V=22.95"` (bounding boxes overlap by ~1–2 px).
- Geometry: `src/features/binomial/binomial.math.ts` L18–38 `createLayout(safeSteps)`: `hGap 150`,
  `vGap 54`, `nodeWidth 92`, `nodeHeight 48`, `leftPad 44`, `vMargin 28`; node `x`/`y` computed there
  (used at L191–192 and L331–332). Vertical (phone) layout: `src/features/binomial/binomial.layout.math.ts`
  L6–7 `nodeWidth 66`, `nodeHeight 44`, step pitch 92, column pitch 40.
- `BinomialEdge` (`binomial.types.ts` L67–73) has `fromId`, `toId`, `kind`, `probabilityLabel`;
  `BinomialNode` has `step`. The layout helper returns `edges` with coordinates only.
- `src/styles/binomial.scss`: L10–13 `.binomial-svg-wrap svg{min-width:min(760px,100%); height:520px}`;
  L18–23 `.stats-grid.binomial-summary-grid{… grid-auto-rows: minmax(128px, auto)}` (cards half empty
  at 1536 px); literal radii L54 (`.replication-item` 14px), L100 (`.summary-hero` 16px, with a
  `--primary`-tinted background L101–102), L134 (`.summary-tile` 12px), L153 (`.summary-replication`
  14px), L176 (`.repl-cell` 10px).
- `src/features/binomial/components/BinomialSummary.tsx` L17: `{ key: "q", label: "q", … }` → shown
  uppercase by `.stat-title`.
- `src/features/binomial/BinomialView.tsx` (after plan 02) renders a second `.card` with two
  `metric-button`s (`Stock prices` / `Option values`) that are independent show/hide toggles but look
  like a segmented choice; inline `style={{ marginTop: 20 }}`.
- `src/features/binomial/useBinomialView.ts` L10–50 hand-rolled URL parsing; keys and defaults:
  `mode` (`equity`|`rates`), `s0` 100 [20,200], `k` 100 [20,200], `u` 1.2 [1.01,2] 2dp, `d` 0.85
  [0.1,0.99] 2dp, `r` 0.05 [0,0.3] 2dp, `q` 0.5 [0,1] 2dp, `h` 0.18 [0.02,0.7] 2dp, `steps` 4 [1,8],
  `type` (`call`|`put`), `primary`/`secondary` written as `"0"` only when false.
  Shared replacement: `useUrlState(schema)` (`src/components/useUrlState.ts`) with `urlNumber`,
  `urlEnum`, `urlBool` from `src/lib/urlState.ts` (L14–41). `urlBool` writes `1`/`0`; defaults are omitted.
- Tokens available: `--surface-soft`, `--surface`, `--border`, `--rule-strong`, `--text`, `--muted`,
  `--chart-1`, `--chart-3`, `--radius-xs`.

## Goal
1. Lattice colours come from tokens and look right in both themes; node corners are square.
2. Zero `svg-text-collision` at 1280/1536 with 8 steps and both metrics shown.
3. Probability labels only on the two edges leaving the root.
4. Summary: "q (risk-neutral)" label, no fixed row height, square tiles, no primary-tinted hero.
5. URL state via `useUrlState` with identical keys/defaults.

## Non-goals
Node clicking, stepping, American exercise, convergence charts (all on hold). Changing the tree math.

## Constraints
CLAUDE.md; `binomial.math.ts` stays pure; SVG styling via classes in `binomial.scss`, not inline hex.

## Steps
1. **Classes instead of hex.** In `BinomialLattice.tsx` replace colour attributes with classes:
   `.bn-edge` (`stroke: var(--rule-strong)`), `.bn-edge-label` (`fill: var(--muted)`), `.bn-node`
   (`fill: var(--surface-soft); stroke: var(--border)`), `.bn-node-step` (`fill: var(--text)`),
   `.bn-node-primary` (`fill: var(--chart-1)`), `.bn-node-secondary` (`fill: var(--chart-3)`).
   `rx`/`ry` → 2. Add the rules to `binomial.scss` (SVG `fill`/`stroke` accept CSS variables).
2. **Spacing.** `createLayout`: `nodeHeight 48 → 56`, `vGap 54 → 62` (so 8-step trees keep ≥ 6 px
   between rows: row pitch = vGap, node height 56 … check `height`/`topPad` still derive from it).
   Text baselines: step label `y+15`, primary `y+30`, secondary `y+45` when both metrics show; `y+32`
   for a single metric. Font size stays 11 (12 px line boxes fit a 14–15 px pitch). Vertical layout:
   `nodeHeight 44 → 52`, pitch 92 → 100, same baselines.
   Make these numbers constants at the top of `binomial.layout.math.ts` (`LINE_PITCH = 15`) and have
   `BinomialLattice` read line offsets from the layout result rather than literals.
3. **Edge labels at the root only.** In `buildBinomialChartLayout` include `fromStep` on each edge
   (look up `tree.nodes` by `edge.fromId`); in `BinomialLattice` render the label only when
   `fromStep === 0`. Keep `probabilityLabel` in the type (tooltips may use it later).
4. **SVG height.** `.binomial-svg-wrap svg{height: clamp(420px, 56vh, 640px)}`; phone rule unchanged.
5. **Summary.** Key `binomialRiskNeutralProb: "q (risk-neutral)"` / HU `"q (kockázatsemleges)"`;
   use it in `BinomialSummary.tsx` L17. Remove `grid-auto-rows` (L21) and the `!important`s if the
   grid still lays out correctly without them (test at 1536 and 900 px). Radii L54/100/134/153/176 →
   `var(--radius-xs)`; `.summary-hero` background → `var(--surface-soft)`, border `var(--border)`.
6. **Toggle card.** Give the two buttons `aria-pressed` and wrap them in `ControlGroup`
   (`label={t("binomialShowLabel")}`, key `"Show on nodes"` / HU `"Csomópontokon"`); move the inline
   margin to a class `.binomial-display-card{margin-top: var(--space-5)}`. Keep `.metric-button`.
7. **URL state.** New `src/features/binomial/binomial.url.ts` exporting a module-level
   `BINOMIAL_URL: UrlSchema<BinomialUrlState>` built from `urlEnum`/`urlNumber`/`urlBool` with the
   keys and ranges above (`primary`/`secondary` default `true`). Rewrite `useBinomialView.ts` on
   `useUrlState(BINOMIAL_URL)`; expose the same return shape (`sliders`, `tree`, setters as
   `(v) => set({ k: v })` …). Delete the local `clamp`/`parseNumber`/`formatNumber`.
   `createBinomialSliders` (`binomial.controls.ts`) keeps its signature.

## Acceptance criteria
- Audit `/binomial`, `/hu/binomial` at 360/390/768/1024/1280/1536, both themes: 0 `svg-text-collision`,
  0 `overlap`; also run with `--after` setting 8 steps (below).
- Light screenshot: nodes are light boxes with dark text.
- `grep -n "#[0-9a-f]\{6\}" src/features/binomial/components/BinomialLattice.tsx` → nothing.
- Loading `/binomial?steps=6&u=1.3&type=put&primary=0` shows 6 steps, u 1.30, Put, stock prices hidden.
- Changing a slider rewrites the URL with the same key names; defaults are omitted (note in Findings).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:url-state
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 \
  --paths "/binomial,/hu/binomial,/binomial?steps=8,/binomial?mode=rates&steps=8" --widths 360,390,768,1024,1280,1536
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/binomial,/hu/binomial" \
  --after "/binomial?steps=6&u=1.3&type=put&primary=0|(()=>({steps:document.querySelectorAll('.binomial-svg-wrap text').length, search:location.search}))()"
# expect: no problems; search unchanged after load
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `useUrlState` returns defaults while hydrating (pre-rendered HTML); the tree is recomputed right
  after. Do not read `window.location` directly.
- `urlBool` writes `"1"/"0"`; the old code wrote `primary=0` only when false — reading both forms works
  with `urlBool` (`"0"` → false), so old links keep working.
- `binomial.math.ts` is also imported by guide figures? Run `grep -rn "binomial.math" src` before
  changing `createLayout`; if a guide uses `tree.width/height`, the geometry change is harmless but
  check its figure in the smoke.
- The vertical phone lattice sets `height: auto` on the SVG; the new clamp applies to desktop only.
- `.stats-grid.binomial-summary-grid` uses `!important` to beat `.stats-grid` from `_primitives.scss`
  L756; if you drop them, keep the 3-column rule specific enough (`.binomial-summary-grid.stats-grid`).

## Findings (fill in during execution)
- Audit (preview, `/binomial`, `/hu/binomial`, `?steps=8`, `?mode=rates&steps=8`; 360/390/768/1024/1280/1536; light+dark): 48 page-states, 0 `svg-text-collision`, 0 `overlap` (before: 30 collisions at 1024/1536, 15 at 390). One failing state was the harness `theme` check reading `undefined` on a page captured before CSS loaded (flake, passes on rerun); remaining reports are `tap-target` warnings only.
- Light screenshot (`light-1280_binomial_steps_8.png`): light node boxes, dark text, no navy.
- Smoke: `/binomial?steps=6&u=1.3&type=put&primary=0` loads with 58 SVG texts (primary hidden), search string unchanged; EN/HU/guide paths clean.
- Defaults are no longer written into the URL (as planned); `primary=0` / `secondary=0` still read.
- HU drafts: `binomialRiskNeutralProb` "q (kockázatsemleges)", `binomialShowLabel` "Csomópontokon".
- Deviations:
  - `buildBinomialChartLayout` takes `showPrimary`/`showSecondary` and returns `lines` (baselines), so the lattice has no literals.
  - `scripts/layout-audit.mjs`: screenshot filenames now replace `?`, `=`, `&` (paths with a query crashed on Windows, which the plan's own verification command uses).
  - `controlsOpen` was removed by plan 02 while this ran; the hook no longer has it.
  - At 8 steps the tree is small at 1280 (SVG viewBox scaling, unchanged); the taller clamp leaves some empty frame below it. Left as is (no redesign).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/04-binomial-polish.md`; confirm plans 01 and 02 are
> `done` (stop if not). Implement plan 04: token-based classes and square corners for the SVG lattice,
> larger node/line pitch so no texts collide, probability labels only on the root edges, the summary
> fixes (q label, no fixed row height, square tiles, neutral hero), and `useUrlState` for the binomial
> state with identical keys. Run the Verification commands, fill in Findings, set plan 04 to `done` in
> the README table, and summarise. Do not add node clicking or stepping.
