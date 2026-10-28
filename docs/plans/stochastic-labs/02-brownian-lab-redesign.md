# 02 — Brownian Motion main page redesign

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The owner called the Brownian visualisations poor. The main page is the hub of the area and should look
like a professional instrument.

## Current state (verified 2026-10-28)
`src/features/brownian-motion/BrownianMotionView.tsx` (123 lines), `brownianMotion.math.ts`
(`simulateBrownian`, `simulateBrownianCloud`, `brownianTerminalLaw`), `brownianMotion.url.ts`,
`components/BarrierPanel.tsx` (90), `components/BarrierPredict.tsx`. Strings: `src/Language/BrownianMotion(.hu).ts`.
Layout at 1280: Parameters panel (drift, vol, T, #paths 1–8, resample, metrics) | "Sample paths" chart with
**six rainbow paths** + dashed mean; below "Distribution of 400 paths" (play/time slider, quantile fan as a
solid blue cloud, draggable level, terminal histogram); below "Barrier and first passage" (cloud, draggable
barrier, hitting-time histogram, predict box).
Defects: rainbow colours carry no meaning; histogram of hitting times is ragged (few hits); the label
"Median hitting time" is clipped at the right edge; the sample-path chart and the fan chart show the same
thing twice; the drift slider has no visible effect explanation; layout-audit fails at 1280 dark.

## Goal
1. One dominant chart: path cloud (muted, low-opacity, single hue) + **one highlighted path** (accent) +
   mean line μt + ±1σ/±2σ bands (theory), with the time cursor; terminal histogram with theoretical
   N(μT, σ²T) density **docked to the right edge** of the same chart (shared y-axis), like the Increment
   lesson's "restart at zero" chart.
2. Remove the separate six-path chart; "Number of paths" becomes cloud size (100/400/1000/2000).
3. Barrier panel: hitting-time histogram uses all cloud paths, overlays the theoretical first-passage
   density (μ = 0) as a line; labels never clipped (move "median" label inside, anchor `end`).
4. Metrics strip under the chart: empirical vs theory mean and sd at T, share above level.
5. Passes layout-audit at 360/768/1280 light+dark EN+HU.

## Non-goals
Lesson sub-pages (plans 01/03). `BrownianMotionPages.tsx` and `lessons/` (plan 01 owns them).

## Constraints
`.tsx` ≤ ~150 lines – split into `components/PathCloudChart.tsx`, `components/TerminalDock.tsx`, etc.
Math in `brownianMotion.math.ts` (add `firstPassageDensity(b, sigma, t)` there; pure). Reuse charts from
`src/components/charts` (check `index.ts` for scatter/line/histogram primitives) and the fan/cloud code the
increment lesson uses (`IncrementFanChart.tsx`, after plan 01 under `features/brownian-motion/lessons/` or
`src/components/lesson/`) – extract shared pieces rather than copying. Colours from CSS tokens
(`--chart-1…`, `--muted`, `--primary`); never undefined tokens (`--text-muted` does not exist).

## Steps
1. Measure baseline: layout-audit for `/brownian-motion` (README §4); note failures in Findings.
2. Math: `bandsAt(mu, sigma, t, k)`; `firstPassageDensity`; keep existing functions.
3. Build the cloud chart (canvas or SVG paths with `opacity ≈ 0.08`, one `--primary` path), docked histogram.
4. Rework the view layout: controls panel left, chart dominant right, metrics row below, barrier panel below.
5. Fix barrier panel labels and density overlay.
6. URL state: drop `paths` 1–8 param semantics → cloud size; keep old param tolerated.
7. Strings EN+HU.

## Acceptance criteria
- No rainbow series; one accent path.
- layout-audit 0 failures for `/brownian-motion` and `/hu/brownian-motion` at 360/768/1280 light+dark.
- `tsc -b`, eslint on changed files clean.

## Verification
README §4 audit with `--paths "/brownian-motion,/hu/brownian-motion"`; Read the 1280 and 360 screenshots.

## Pitfalls
- Plan 01 may move this module's route to `BrownianMotionPages`; this plan only edits the view, so both merge.
- 2000 SVG paths × 200 steps is slow – render the cloud on `<canvas>` or downsample to ≤ 100 points/path.

## Findings (fill in during execution)
- Baseline audit not taken separately; the redesigned page passes layout-audit at 360/768/1280 light+dark, EN+HU (12/12 ok, private build on port 4192). The only initial failure was the cursor handle label clipped at the right edge at 360, fixed by starting the cursor at 0.75T. Tap-target warnings (brand link, slider inputs) are global and also appear on other pages.
- New: `components/BrownianCloud.tsx` (cloud + one `--primary` path + mean + ±1σ/±2σ bands + draggable time cursor), `TerminalDock.tsx` (histogram + N(μt,σ²t) docked right, shared y-axis), `BrownianMetrics.tsx` (simulated / theory mean, sd, share above 0 at the cursor); styles in `src/styles/_brownian-motion.scss` (`bro-` prefix, since `bm-` is taken by bond.scss).
- Math: `firstPassageDensity`, `bandsAt`, `CLOUD_SIZES`/`snapCloudSize`; removed unused `simulateBrownian` and `brownianMotion.types.ts`. `paths` URL param is now cloud size (default 400, slider over 100/400/1000/2000); legacy 1-8 values snap to 100.
- Barrier panel: now uses the whole cloud, adaptive bin count for the hitting-time histogram, median marker label dropped (it was clipped; the value stays in the readout). The shared Histogram marker label anchor was not changed. The theory density overlay is shown for mu = 0 only.
- The separate six-path chart and the PathEnsemble section were removed from this page (PathEnsemble itself untouched).

## Prompt to hand off
> Read `CLAUDE.md`, `docs/plans/stochastic-labs/README.md` §4 and `02-brownian-lab-redesign.md`. Implement
> plan 02 (redesign `/brownian-motion` main page). Verify with the layout audit and look at screenshots. Fill
> Findings, mark 02 done, summarise.
