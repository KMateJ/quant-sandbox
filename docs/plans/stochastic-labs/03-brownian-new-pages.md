# 03 — Brownian: transformations, quadratic variation, bridge

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: L

## Why
Three lessons were planned in the studio but never built (2.4–2.6). They are new content, not moved content.

## Current state (verified 2026-10-28)
- After plan 01: Brownian sub-pages are listed in `src/features/brownian-motion/lessons/lessons.ts`
  (`{ id, titleKey, descKey, Component }`) and rendered by `BrownianMotionPages.tsx`; shared scaffold
  `src/components/lesson/LessonFrame.tsx` (title, question, objective, Explore/Mathematics tabs).
- Planned keys already exist in `src/Language/StochasticModels(.hu).ts`: `stochLessonTransformations(Desc)`,
  `stochLessonQV(Desc)`, `stochLessonBridge(Desc)` (grep to confirm exact names).
- Guide figures with reusable math: `src/features/guide/components/figures/stochastic/BmTransformationsFigure.tsx`,
  guide math files `src/features/guide/guide.interactive.*.math.ts` – promote pure functions to
  `src/lib/stochastic/` instead of copying.
- Pattern to follow: `IncrementLesson.tsx` / `IncrementExplore.tsx` / `IncrementMathematics.tsx`.

## Goal
Three sub-pages under `/brownian-motion/`:
1. `transformations` – one seeded path W and its transforms side by side: −W, c^{-1/2}W(ct) (slider c),
   tW(1/t), W(t+s)−W(s). Overlay their empirical variance-vs-t from a cloud against the line t: all collapse
   onto it. Predict: "is −W a Brownian motion?" style choice.
2. `quadratic-variation` – partition slider n (2…4096, log): plot Σ(ΔW)² converging to T (with band) and
   Σ|ΔW| diverging (∝√n) on twin small charts; a zoom strip showing the path stays rough at every scale.
3. `brownian-bridge` – pin the endpoint (drag a handle at T); cloud of bridges, theoretical mean line and
   ±√(t(T−t)/T) band; variance-vs-t parabola chart (empirical dots vs theory).

## Constraints
README §4. `.math.ts` pure with `///` docs; `.tsx` ≤ ~150 lines; EN+HU strings in `BrownianFundamentals(.hu).ts`
(append a block at the end). Seeded RNG from `src/lib/math/random.ts`.

## Steps
1. Math files: `transformations.math.ts`, `quadraticVariation.math.ts`, `bridge.math.ts` in
   `features/brownian-motion/lessons/`. Add `scripts/brownian-lessons.test.mjs` (node:test, load via
   `scripts/lib` loader like `clt.test.mjs`): QV sum → T within 5% at n=4096; bridge endpoint exact; scaled
   path variance ≈ t.
2. Explore + Mathematics components per lesson (KaTeX via existing math component used by
   `IncrementMathematics.tsx`).
3. Append three entries to `lessons.ts` (after `covariance`).
4. Strings EN+HU.

## Acceptance criteria
- Three pages reachable from the sidebar; new test passes; layout-audit clean at 360/768/1280 light+dark EN+HU.

## Verification
```bash
node --test scripts/brownian-lessons.test.mjs && npx tsc -b
```
README §4 audit on `/brownian-motion/transformations,/brownian-motion/quadratic-variation,/brownian-motion/brownian-bridge` (+ `/hu/`).

## Pitfalls
- Σ|ΔW| grows without bound – use a log y-axis or normalise by √n, otherwise the chart is flat.
- Time-inversion tW(1/t) blows up near 0 numerically – start at t ≥ 0.02.

## Findings (fill in during execution)
- Added transformations, quadratic-variation, brownian-bridge pages (Explore + Mathematics) under lessons/, appended to lessons.ts.
  Math: transformations.math.ts, quadraticVariation.math.ts, bridge.math.ts (reuse simulateBrownian; no copies). Shared MathSteps.tsx and MiniSeriesChart.tsx; styles appended as .bl-* region in _stochastic-models.scss.
- Existing planned keys were stochLessonTransforms / QuadVar / Bridge; new strings appended to BrownianFundamentals(.hu).ts. Added "stochTrEx" to ExplainPrefix in components/lesson/predictRound.ts (predict: is t W(1/t) a BM).
- Tests: scripts/brownian-lessons.test.mjs (5 pass). tsc -b and eslint clean.
- Audit on private build (port 4196), 360/768/1280 light+dark EN+HU: 0 failing after fixes (drag-handle label clipped at the right edge -> short label + wider x-domain; QV chart starts at n=8 because the band at tiny n is huge). Remaining tap-target notes at 360 (sliders, brand link) are the same as on other pages.

## Prompt to hand off
> Read `CLAUDE.md`, `docs/plans/stochastic-labs/README.md` §4 and `03-brownian-new-pages.md`; confirm plan 01
> is done. Implement the three Brownian sub-pages with tests. Verify, fill Findings, mark 03 done, summarise.
