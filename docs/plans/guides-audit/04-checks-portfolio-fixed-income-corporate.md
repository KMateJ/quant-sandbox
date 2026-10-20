# 04 — Checks and worked examples: portfolio, fixed income, corporate (10 lessons)

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Eight first-wave lessons in these tracks have neither checks nor a worked example, and two later lessons
have checks but no worked example. Their track pages' "Check yourself" sections therefore skip the
foundations (returns, diversification, the frontier, CAPM, bond pricing, duration, the yield curve, compounding).

## Current state (verified 2026-10-20)
- No checks and no worked block: `returnsVolatility.ts`, `diversification.ts`, `efficientFrontier.ts`, `capm.ts`
  (portfolio); `bondPricing.ts`, `durationConvexity.ts`, `yieldCurve.ts` (fixed income); `interestDiscounting.ts`
  (corporate; also the shortest lesson at 592 EN words — the new blocks lift it over the 600 floor, after which
  it can stay in `ROOT_LESSONS` only for the "cites nothing" rule).
- Checks present, no worked block: `realOptions.ts` (2 checks), `factorModels.ts` (2 checks).
- Block formats and placement rules: see plan 03 "Current state" (same `check` / `worked` shapes; `worked` needs
  ≥ 2 steps with `result`; ids `<lessonId>/<slug>` identical in EN/HU; checks inside sections, not after Summary).
- Exemplar: `src/Language/guides/annuities.ts`.
- Maths to reuse: `src/lib/finance/bond.ts` (`BondSpec`, price/duration helpers), `src/features/guide/guide.markets.math.ts`
  (frontier, CML, SML series), `guide.processes.math.ts` (compounding), `guide.wave3.math.ts` (`realOption`,
  single-index), `src/features/yield-curve/yieldCurve.math.ts` (bootstrap, forwards).
- Harness allowlists to shrink in `scripts/guide-audit.test.mjs`: remove the 8 ids from `NO_CHECKS`, the 10 ids
  from `NO_WORKED`.

## Goal
1. The 8 lessons get 2 checks + 1 worked example; `real-options` and `factor-models` get 1 worked example.
2. All numbers computed in node from repo maths; EN and HU in step.
3. The ids leave the allowlists; `interest-discounting` ≥ 600 EN words.

## Non-goals
- No prose rewrites, no figure changes, no shared-file edits, no edits to lessons outside the list.

## Constraints
- As plan 03. One editor per file.

## Steps
Suggested content (numbers must come from the repo maths at the lesson's own example values):
1. **interest-discounting** — check: PV of 1,000 in 5 years at 6% annual (747.26); choice: continuous vs annual
   compounding at the same nominal rate (continuous gives more). Worked: effective annual rate from 6% compounded
   monthly, then the 5-year discount factor.
2. **returns-volatility** — check: annualised vol from daily σ = 1.2% (19.05%, 252 days); choice: log vs simple
   return of a 50% drop (log is more negative). Worked: mean and σ of a 4-value return sample, annualised.
3. **diversification** — check: σ of a 50/50 portfolio with σ₁ = 20%, σ₂ = 30%, ρ = 0.2 (19.49%); choice: ρ at
   which diversification removes all risk for some weights (−1). Worked: portfolio σ for ρ = 1, 0, −1.
4. **efficient-frontier** — check: Sharpe ratio of μ = 9%, σ = 15%, r_f = 2% (0.467); choice: the tangency
   portfolio maximises (Sharpe). Worked: CML expected return at σ = 10% given the tangency point.
5. **capm** — check: expected return for β = 1.3, r_f = 2%, E[R_m] = 8% (9.8%); choice: alpha above the SML
   means (undervalued). Worked: β from covariance and market variance, then the SML return.
6. **bond-pricing** — check: price of a 3-year 5% annual coupon bond at y = 6% (97.33); choice: price vs par when
   coupon < yield (below). Worked: discount each cash flow and sum.
7. **duration-convexity** — check: modified duration from Macaulay 4.2 at y = 5% annual (4.0); choice: sign of
   the convexity correction (positive, price higher than the duration estimate). Worked: ΔP/P for Δy = +100 bp
   with duration only and with convexity.
8. **yield-curve** — check: implied 1-year forward rate between z₁ = 3% and z₂ = 4% (5.01%); choice: when the
   forward curve lies above the spot curve (spot curve rising). Worked: bootstrap a 2-year spot rate from a par
   bond.
9. **real-options** — worked: the lesson's 3-step tree: u, d, q, then the expanded NPV at the root (results from
   `realOption()` in `guide.wave3.math.ts` with the figure's defaults).
10. **factor-models** — worked: systematic and specific variance of a stock with β = 1.2, σ_M = 20%, σ_ε = 25%,
    then the share of variance that is systematic.

Compute, paste, write HU, run tests, shrink allowlists.

## Acceptance criteria
- `npm run test:guide-audit` passes with the ids removed from `NO_CHECKS` / `NO_WORKED`.
- `npm run test:guide-checks` passes.
- Smoke of `/guide/portfolio`, `/guide/fixed-income`, `/hu/guide/corporate` has no problems.

## Verification
```bash
npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/portfolio,/guide/fixed-income,/hu/guide/corporate,/guide/corporate/interest-discounting" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- Bond conventions in the lessons: face 100, annual coupons unless stated; `D_mod = D / (1 + y)`.
- `yieldCurve.math.ts` may use continuous compounding in places; match the lesson's stated convention.
- Keep checks inside sections (see plan 03 pitfalls).

## Findings (fill in during execution)
- Numbers computed (node, repo formulas; `realOption()` copied verbatim from `guide.wave3.math.ts`):
  - interest-discounting: 1000/1.06^5 = 747.26; e^0.3 = 1.34986 vs 1.06^5 = 1.33823; EAR (1+0.06/12)^12−1 = 6.1678%; (1.005)^−60 = 0.7414. EN words now 762.
  - returns-volatility: 1.2%·√252 = 19.05%; ln 0.5 = −69.31%; sample {1,−2,3,2}%: mean 1%, s = 2.1602%, ×12 = 12%, ×√12 = 7.4833%.
  - diversification: 50/50, σ 20/30, ρ 0.2 → √0.0385 = 19.62% (plan's 19.49% was wrong); lesson assets 15/30 at ρ = 1, 0, −1 → 22.5%, 16.77%, 7.5%.
  - efficient-frontier: 7/15 = 0.4667; tangency μ 8.4706%, σ 16.5544%, SR 0.3909; y = 0.6041, μ(σ=10%) = 5.9087%.
  - capm: 2 + 1.3·6 = 9.8%; β = 0.0018/0.0016 = 1.125; 3 + 1.125·5 = 8.625%.
  - bond-pricing: 3y 5% at 6% = 97.327; worked 3y 4% at 5%: 3.8095 + 3.6281 + 89.8391 = 97.2768.
  - duration-convexity: 4.2/1.05 = 4.0; lesson bond D 8.1078, D_mod 7.7217, C 74.998; −7.722% + 0.375% = −7.347% (true −7.360%).
  - yield-curve (continuous, as the lesson): f(1,2) = 2·4 − 3 = 5.00% (plan's 5.01% is the annual-compounding figure); par bond 4.5%: P(0,2) = 0.915167, r(2) = 4.4324%.
  - real-options: u 1.34986, d 0.74082, q 0.44206, expanded NPV 19.2806.
  - factor-models: 0.0576 + 0.0625 = 0.1201, systematic share 47.96%.
- HU strings written (for owner review, awaiting owner review): checks `interest-discounting/continuous-vs-annual`, `/present-value-annual`; `returns-volatility/log-of-a-halving`, `/annualise-daily`; `diversification/fifty-fifty-volatility`, `/riskless-correlation`; `efficient-frontier/sharpe-ratio`, `/tangency-maximises`; `capm/required-return`, `/positive-alpha`; `bond-pricing/three-year-price`, `/coupon-below-yield`; `duration-convexity/modified-from-macaulay`, `/convexity-sign`; `yield-curve/one-year-forward`, `/forward-above-spot`. Worked blocks (by HU title) in all 10 lessons, plus the bridging sentences below.
- Deviations and why: diversification and yield-curve numbers differ from the plan's suggestions (see above). Bond-pricing worked uses a 3y 4% bond at 5% so it does not duplicate the check. One bridging sentence added before the worked block in interest-discounting (effective annual rate formula) and yield-curve (par bonds); in duration-convexity the sentence "Now shift the yield…" was split off into its own paragraph after the new worked block. `interest-discounting` stays in `ROOT_LESSONS` for the cites-nothing rule. Harness still fails, but only on plan 03's stale allowlist entries (and eslint only on plan 03's `strategies.ts`).

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`). Read `CLAUDE.md`, `docs/plans/guides-audit/README.md`
> (section 4) and `docs/plans/guides-audit/04-checks-portfolio-fixed-income-corporate.md`, and confirm plan 01
> is marked done in the README (stop and report if not). Implement plan 04: add checks and worked examples (EN and
> HU, identical ids and answers, numbers computed in node) to the 10 listed lessons and remove their ids from the
> harness allowlists. Run the verification commands and make them pass. Fill in Findings, set plan 04 to `done`
> in the README table, and summarise.
