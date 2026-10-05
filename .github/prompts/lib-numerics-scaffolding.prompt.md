---
mode: agent
description: Scaffold the shared src/lib numerics/stats/finance layer (pure TS, no React)
---

# Task: Build the shared `src/lib/` numerics layer

You are working in the **Quant Sandbox** repo (interactive quant/finance learning app).
Read [`CLAUDE.md`](../../CLAUDE.md) and `docs/EXPANSION_PLAN.md` §6 **before** writing code.

## Objective

Create the shared, framework-free math/number library under `src/lib/` that upcoming
modules (Portfolio & Risk, Fixed Income, Corporate Finance) will depend on. Today this
logic is duplicated or inlined inside feature `*.math.ts` files. Centralise it.

## Hard rules (from CLAUDE.md — non-negotiable)

- **Pure TypeScript only.** No React, no imports from `src/components`, `src/features`,
  or any `.tsx`. These files must be unit-testable in isolation.
- **DRY.** Do not re-implement helpers that already exist — search first.
- **Separation of concerns.** Only numerics/stats/finance here.
- `.ts` files are exempt from the 150-line limit but keep each module cohesive and
  single-purpose.
- Use `///` doc comments on every exported function so the description shows on hover.
- Match existing code style. Localise nothing here (no user-facing strings in lib).

## Scope boundaries (IMPORTANT — avoid merge conflicts)

**Only create NEW files under `src/lib/`.** Do **NOT** edit:
- anything in `src/components/`, `src/styles/`, `src/modules/registry.ts`, `src/App.tsx`
  (another agent is actively refactoring the app shell and charts there),
- existing `src/features/**` files (leave the current feature math untouched for now —
  migration to use `src/lib` is a later, separate step).

If you believe a feature should consume the new lib, note it in your final report rather
than editing the feature.

## Required structure

```
src/lib/
  math/
    index.ts        # re-exports
    interpolate.ts  # linear interp, clamp, lerp, linspace, range
    roots.ts        # bisection, Newton–Raphson (with maxIter + tol guards)
  stats/
    index.ts
    distributions.ts # standard normal pdf/cdf (Abramowitz–Stegun), inverse normal cdf
    moments.ts       # mean, variance (sample+pop), stdDev, covariance, correlation
  finance/
    index.ts
    discount.ts     # pv, fv, discountFactor, continuous vs discrete compounding
    returns.ts      # simpleReturns, logReturns, cumulativeReturn, annualise
  index.ts          # top-level re-export (math, stats, finance)
```

## Guidance per module

- `stats/distributions.ts`: implement `normPdf(x)`, `normCdf(x)` (rational
  approximation, max abs error ~1e-7), and `normInv(p)` (Acklam's algorithm). These are
  the backbone of Black–Scholes/VaR — verify against known values in your head
  (`normCdf(0)=0.5`, `normCdf(1.96)≈0.975`).
- `math/roots.ts`: generic `bisection(f, a, b, {tol, maxIter})` and
  `newton(f, df, x0, {tol, maxIter})`. Return the root; guard against non-convergence.
- `finance/discount.ts`: support both continuous (`e^{-rt}`) and discrete
  (`1/(1+r)^t`) compounding via a mode flag or separate functions.
- `finance/returns.ts`: accept `number[]` price series, return return series; annualise
  helper takes a `periodsPerYear` argument.

## Definition of done

1. All files above exist and compile (`npm run build` is green — run it).
2. No `.tsx`/React imports anywhere under `src/lib/`.
3. Every exported function has a `///` doc comment.
4. No existing files modified outside `src/lib/`.
5. Report back: list of exported functions per module, any numerical-accuracy notes,
   and which existing feature `*.math.ts` files could later be refactored to consume
   these helpers (do NOT refactor them now).
