# 04 — Random Walk lab main page

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
After plan 01, `/random-walk` shows the old "Symmetric random walk" lesson at its root. The module needs a
real lab page that covers what the four sub-pages build on, without duplicating them.

## Current state (verified 2026-10-28)
- After plan 01: `src/features/random-walk/` holds `RandomWalkLesson/Experiment/Controls/Mathematics`,
  `RescaledWalk*`, `WhySqrt*` (`SqrtPrediction`, `ScalingChart`), `Clt*`, `lessons.ts`, `RandomWalkPages.tsx`.
- Registry `random-walk` `subNav`: root + `rescaled-walk`, `why-sqrt-t`, `clt`.

## Goal
1. Root page `RandomWalkView.tsx`: a **Galton-board style** lab – step probability p, step size, n steps;
   animated walkers falling into a terminal-position histogram with the binomial pmf and its normal
   approximation; a path panel showing a handful of walks with one highlighted; metrics E[S_n]=n(2p−1),
   Var=4np(1−p). Drift appears when p ≠ ½ (bridge to Brownian drift).
2. The old symmetric-walk lesson stays reachable as sub-page `/random-walk/symmetric` (rename id; add
   redirect `/random-walk/random-walk` is not needed – update plan 01's redirect for
   `/stochastic-models/random-walk` → `/random-walk/symmetric`).
3. Layout-audit clean.

## Constraints
README §4. Math in `features/random-walk/randomWalk.math.ts` (binomial pmf, seeded walker sim); test in
`scripts/random-walk.test.mjs`. Reuse `usePlayback`/`PlaybackControls` from `src/components/playback/`.

## Steps
1. Math + test (pmf sums to 1; mean/var match formulas; sim mean within tolerance).
2. View + components (`GaltonChart.tsx`, `WalkPaths.tsx`, controls), ≤150 lines each.
3. Wire root in `RandomWalkPages.tsx`; add `symmetric` entry to `lessons.ts`; update subNav labels and the
   redirect in `registry.ts` (own lines only).
4. Strings EN+HU in a new `src/Language/RandomWalk(.hu).ts` registered in `index.en.ts`/`index.hu.ts`.

## Acceptance criteria
Test passes; audit clean for `/random-walk`, `/random-walk/symmetric` (+`/hu`) at 360/768/1280 light+dark.

## Verification
`node --test scripts/random-walk.test.mjs && npx tsc -b`, then README §4 audit.

## Pitfalls
Animating thousands of SVG nodes is slow – cap visible walkers (~200) and update the histogram from counts.

## Findings (fill in during execution)
- Root `/random-walk` is `RandomWalkView.tsx` + `lab/` (GaltonChart, WalkPaths, WalkMetrics, WalkControls); math in
  `randomWalk.math.ts` (log-space binomial pmf, normal density, uniforms reused across p/h so p slides smoothly),
  URL state in `randomWalk.url.ts`, styles `_random-walk.scss`, strings `RandomWalk(.hu).ts`.
- 400 walkers are simulated, only 12 drawn as paths; the histogram is built from per-site counts (no per-walker SVG).
- Playback cursor = step: the histogram builds up as the step advances, with pmf dots and normal line in density units.
- `Histogram` got an additive optional `dots` prop (points drawn over bars); nothing else in shared charts changed.
- Symmetric lesson is `/random-walk/symmetric` (first sub-page in `lessons.ts`); redirects updated in
  `stochasticRedirects.ts` and `vercel.json` (EN, /hu, `?lesson=`). Registry entry unchanged; only the
  `navRandomWalkLab` string became "Random Walk lab" / "Bolyongás-labor".
- Tests: `node --test scripts/random-walk.test.mjs` 5/5. Audit (EN+HU, 360/768/1280, light+dark, 4 paths): failing=0.
  Fixed on the way: clipped y-tick labels at 360 (2-decimal format), pmf dots on the axis edge, upper-cased formula labels.
- `tsc -b` errors remaining are only in `brownian-motion/lessons` (plan 03, parallel work).

## Prompt to hand off
> Read `CLAUDE.md`, the README §4 and `04-random-walk-lab.md`; confirm plan 01 is done. Build the Random Walk
> main lab page. Verify, fill Findings, mark 04 done, summarise.
