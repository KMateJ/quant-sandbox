# 05 — Itô lab: new sub-pages

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: L

## Why
Studio chapters 4 and 6 (stochastic integration, martingales, change of measure) were empty and only linked
here. The Itô lab has a single page.

## Current state (verified 2026-10-28)
- `src/features/ito-process/ItoProcessView.tsx` (120 lines) with `components/ItoStepper.tsx`,
  `ItoBothSides.tsx`, `ItoBothSidesErrors.tsx`; `itoProcess.math.ts`; `itoProcess.url.ts`.
- Registry entry `id: "ito-process"`: no `subNav`, Component `ItoProcessView`.
- Sub-page pattern: `src/features/yield-curve/YieldCurvePages.tsx` + `subNav` on `yield-curve` in
  `src/modules/registry.ts` (`{ id: "lab", labelKey, to: base }, { id, labelKey, descKey, to }`).
- Guide math to promote (do not copy): `src/features/guide/guide.interactive.martingaleBetting.math.ts`.
- Strings: `src/Language/ItoProcess(.hu).ts`.

## Goal
Sub-pages under `/ito-process/`:
1. `ito-integral` – one path; left-point, midpoint and right-point Riemann sums of ∫W dW as n grows, against
   (W_T² − T)/2 (Itô) and W_T²/2 (Stratonovich); difference converges to T/2. Chart: sums vs log n.
2. `itos-lemma` – pick f (x², eˣ, sin x); compare f(W_T) with f(W_0)+∫f'dW+½∫f''dt along the path; show the
   naive chain rule missing the ½f'' term (error bar).
3. `martingales` – betting strategies (constant, doubling, stop at +1) on a fair walk: mean of wealth stays
   flat; histogram reveals the ruin tail (optional stopping).
4. `girsanov` – cloud of BM with drift θ; reweight paths by the Radon–Nikodym density; reweighted histogram
   matches the driftless law; ESS readout shows weight degeneracy as θ grows.

## Constraints
README §4. Math pure in `features/ito-process/*.math.ts` (promote shared guide math to `src/lib/stochastic/`
and import it from both places). Each `.tsx` ≤ ~150 lines. Registry: edit only the `ito-process` entry
(`subNav`, Component → `ItoProcessPages`). Test `scripts/ito-pages.test.mjs`.

## Steps
1. Math + tests (left sum → (W²−T)/2; midpoint − left ≈ T/2; Girsanov weights mean ≈ 1).
2. `ItoProcessPages.tsx` (pattern above) with the existing view at the root.
3. Four page components + controls; strings EN+HU.
4. Registry subNav.

## Acceptance criteria
Tests pass; audit clean on `/ito-process` and the four sub-pages (+`/hu`) at 360/768/1280 light+dark.

## Verification
`node --test scripts/ito-pages.test.mjs && npx tsc -b`; README §4 audit; cdp-smoke on the five paths.

## Pitfalls
`App.tsx` mounts `${path}/*` only when `subNav` exists – add it or sub-pages 404.

## Findings (fill in during execution)
- Added `ItoProcessPages.tsx`, `pages/{ItoIntegral,ItosLemma,Martingales,Girsanov}Page.tsx`, `components/{ItoLemmaParts,GirsanovHistograms}.tsx`, math in `itoIntegral.math.ts`, `martingales.math.ts`, `girsanov.math.ts`, URL schemas in `itoPages.url.ts`. Strings appended to `ItoProcess(.hu).ts` (nav and SEO keys included, no index edits). Registry: only the `ito-process` entry (subNav + Component).
- Betting maths promoted to `src/lib/stochastic/martingaleBetting.math.ts`; the guide file re-exports it (guide test still passes).
- The Itô lemma page reuses `ItoBothSides` and `itoBothSides` rows; the parts chart is derived from them.
- `scripts/ito-pages.test.mjs`: 5 tests pass. `tsc -b` shows no errors in Itô files (other sessions have unrelated errors in gbm/sde). eslint clean on changed files.
- Layout audit on private build (port 4193, DevTools 9354), 5 paths x EN/HU x 360/768/1280 x light/dark: no failures after dropping the overlapping Mean marker label on the martingale histogram. Only generic tap-target warnings (brand link, slider inputs).
- `vite build` client output is fine, but the SEO plugin reports every page pre-rendered empty (also `/`, so caused by another session in-progress state, not these pages). `--outDir` must be inside the repo (a mktemp path breaks the SEO plugin). cdp-smoke not run.

## Prompt to hand off
> Read `CLAUDE.md`, the README §4 and `05-ito-pages.md`. Add the four Itô sub-pages. Verify, fill Findings,
> mark 05 done, summarise.
