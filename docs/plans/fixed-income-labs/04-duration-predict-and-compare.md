# 04 — Duration: predict the shock, compare two bonds

Status: todo · Depends on: 01, 03 · Suggested model: Sonnet · Est. size: M

## Why
The duration lab shows the answer immediately. Learners retain more when they commit to a guess first
(predict–observe–explain, LABS_PLAN T3/W2). A second bond with the same duration but different convexity
makes "convexity is good" something you see, not read.

## Current state (verified 2026-10-19)
- `src/features/duration-convexity/`: `DurationConvexityView.tsx` (81 lines), `useDurationConvexity.ts`
  (model: bond via URL `bondUrlSchema`, `shockBp`, `curve`), `components/` `YieldShockControl`,
  `SensitivityChart` (Δy markers draggable/clickable, 5 bp snap), `ShockResult`, `ErrorChart`,
  `BondParamsPanel`, `sensitivitySeries.ts`; math `durationConvexity.math.ts` (80 lines).
- Pin & compare of the exact curve exists (`usePinnedScatter` + `PinButton`).
- Shared primitives (done): `usePredictReveal`, `PredictReveal`, `PredictExplain` (explain step with
  per-option feedback) in `src/components/ui/`. See a real use: grep `PredictExplain` in
  `src/features/capm` or `src/features/gbm` and copy the wiring pattern.
- Strings: `src/Language/DurationConvexity.ts` / `.hu.ts`, keys prefixed `dc`.
- Bond math: `src/lib/finance/bond.ts` (`bondPrice`, `modifiedDuration`, `convexity`, type `BondSpec`).

## Goal
1. **Predict mode** (toggle in the shock panel, `SegmentedControl` "Explore | Predict"): the lab picks a
   shock (±50…±250 bp, seeded random or "+100 bp" default), hides the exact result and the error chart,
   the reader enters ΔP/P (%) via number input **or by clicking on the chart at the shock's x** (y = guess).
   Reveal shows truth, duration-only and duration+convexity estimates as three markers vs the guess, and
   the error in bp of price. Then the explain step: "Why was the duration-only estimate too low/high?" with
   3 options (convexity / coupon / maturity) and feedback. "Next" draws a new shock. A small session tally
   (rounds, mean |error|) — no localStorage required.
2. **Compare bond B** ("Seesaw" panel): button "Add twin bond" creates bond B with the **same modified
   duration** but different convexity (barbell-like: solve coupon/maturity so D matches within 0.01 —
   e.g. zero-coupon with maturity solving D_mod). Both exact curves on the sensitivity chart; readout of
   price change for the current shock for A and B, the difference highlighted. One-line explanation
   (i18n): "Same duration, more convexity → gains more, loses less."
3. URL: `mode=predict` and `twin=1` in the URL via `useUrlState` (extend the module's schema).

## Non-goals
Changing existing explore-mode behaviour; persistent scoring; new chart types.

## Constraints
Math in `durationConvexity.math.ts`; view files ≤ 150 lines (new components: `PredictPanel.tsx`,
`TwinBondPanel.tsx`, hook `useDurationPredict.ts`). All text via i18n (`dc*` keys, both languages).

## Steps
1. Math (pure, documented, tested in a new `scripts/duration-lab.test.mjs`, add npm script
   `test:duration-lab`):
   ```ts
   /// Zero-coupon maturity (years) whose modified duration at `ytm` with `freq` equals `dMod`.
   export function zeroWithDuration(dMod: number, ytm: number, freq: number): number   // T = dMod·(1+y/f)
   /// Exact and approximate relative price changes for a shock.
   export function shockOutcomes(bond: BondSpec, shockBp: number): { exact: number; duration: number; durConvex: number }
   /// Seeded shock draw in bp, multiples of 25, |shock| in [50, 250].
   export function drawShock(seed: number): number
   ```
   Check `shockOutcomes` matches what `ShockResult` currently displays (reuse the existing code path; if a
   function already computes it, export that instead of writing a new one).
2. `useDurationPredict(model)`: wraps `usePredictReveal` with truth = `exact`; holds `round`, `seed`, tally.
3. Chart click-to-guess: in predict mode the `SensitivityChart` layer places a guess marker on click/drag
   (x locked to the shock). Reuse `DragHandles` with `axis: "y"`; keyboard arrows change the guess 0.1 %.
   Before reveal, hide exact / approximation series and the error chart (render a placeholder panel with
   the same height so the layout doesn't jump — audit-checked).
4. Twin bond: `TwinBondPanel` + second series in `sensitivitySeries` (colour from chart theme tokens,
   label `dcTwinLabel`). Keep the pin feature working alongside.
5. Strings EN + HU draft; list HU in Findings.

## Acceptance criteria
- Predict round works by keyboard only (tab to guess input, type, Enter reveal, choose explanation, Next).
- Truth hidden before reveal (no exact value anywhere in DOM text — check with cdp-smoke `--after`).
- `zeroWithDuration` test: modifiedDuration of the resulting zero equals target within 1e-6.
- Layout audit green, including after reveal (`--after` that clicks Reveal).
- No layout shift on reveal larger than 8 px in page height (measure `document.body.scrollHeight` before/after).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:duration-lab && npm run test:labs
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/duration-convexity?mode=predict,/duration-convexity?twin=1,/hu/duration-convexity?mode=predict"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --after "/duration-convexity?mode=predict|document.querySelector('main').innerText.includes('-16.71')"
# expect value false before reveal (the default bond's exact −16.71% for +150 bp must not leak; adjust number to the shown default shock)
```

## Pitfalls
- `usePinnedScatter` expects stable series identity; memoise the twin series.
- URL schema defaults are omitted from the query string; `mode` default `explore`.
- Don't reuse the seed across rounds: `seed = round` derived, so a shared link reproduces round 1.

## Findings (fill in during execution)
- …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/04-duration-predict-and-compare.md`; confirm plans 01 and
> 03 are done (stop if not). Implement plan 04: predict mode with chart click-to-guess, reveal and explain
> step, and the equal-duration twin bond comparison, with math tests and URL state. Run the verification
> commands, fill in Findings (HU drafts), set plan 04 to done in the README table, and summarise.
