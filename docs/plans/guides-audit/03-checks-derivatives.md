# 03 — Checks and worked examples: derivatives (14 lessons)

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: L

## Why
Only 2 of the 16 derivatives lessons (american-options, stochastic-volatility) have retrieval checks and a
worked example, so the derivatives track page's "Check yourself" section and the review queue cover a
fraction of what the reader studied. The other tracks got these blocks in a later wave; derivatives, the
largest track, was skipped.

## Current state (verified 2026-10-20)
- Lessons without checks and without a worked block (all in `src/Language/guides/`):
  `instruments.ts`, `strategies.ts`, `noArbitrage.ts`, `putCallParity.ts`, `oneStepBinomial.ts`, `riskNeutral.ts`,
  `multiStepTrees.ts`, `deltaHedging.ts`, `gbm.ts`, `blackScholes.ts` (id `toward-black-scholes`), `greeks.ts`,
  `impliedVolatility.ts`, `staticReplication.ts`, `exoticOptions.ts`.
- Block formats (`src/features/guide/guide.content.types.ts`):
  ```ts
  { kind: "check"; id: string; prompt: string; answer: GuideCheckAnswer; explain: string }
  // GuideCheckAnswer = { type: "number"; value: number; tolerance: number; unit?: string }
  //                  | { type: "choice"; options: string[]; correct: number }
  { kind: "worked"; title: string; steps: { text: string; tex?: string; result?: { value: number; tolerance: number; unit?: string } }[] }
  ```
  `id` is `<lessonId>/<slug>` and identical in EN and HU; numeric answers identical; options count and `correct`
  identical. `maxFadeLevel(steps) >= 2` is required, i.e. **at least two steps with a `result`**.
- Exemplar with both kinds: `src/Language/guides/annuities.ts` (check at line ~31, worked at ~48; HU at ~113/130).
- Where blocks go: a `check` directly after the section it tests (before the next `h`), never after the Summary;
  the `worked` block inside the section whose formula it exercises. The track page collects them
  (`GuideTrackChecks.tsx`); the lesson page only shows a count link. Nothing else to wire.
- `scripts/guide-checks.test.mjs` validates the formats across languages and asserts totals (`≥ 10` checks,
  `≥ 2` worked overall). Its test "practice answers agree with the formulas" lists specific ids; add yours there
  only if the answer is a formula the test can recompute (optional).
- Lesson maths already in the repo to reuse when computing answers: `src/features/black-scholes/blackScholes.math.ts`
  (`blackScholesCall`, greeks), `src/features/guide/guide.pricing.math.ts` (binomial, parity), `guide.wave2.math.ts`
  (implied vol, BL density), `guide.wave3.math.ts` (exotics MC), `src/lib/stats/distributions.ts` (`normCdf`).
- Harness allowlists to shrink: `NO_CHECKS` and `NO_WORKED` in `scripts/guide-audit.test.mjs` (remove the 14 ids).

## Goal
1. Each of the 14 lessons gets **2 checks** (one numeric, one choice where sensible) and **1 worked example**
   with ≥ 2 result steps, in EN and HU, same ids/answers.
2. Every numeric answer is computed in node from the repo's maths and quoted with a tolerance that absorbs
   rounding (e.g. 0.01 on prices, 0.5 on percentages shown with one decimal).
3. The 14 ids leave `NO_CHECKS` and `NO_WORKED`.

## Non-goals
- No changes to the lessons' existing prose, headings, figures or notes (except inserting the new blocks).
- No new figures, no shared-file edits, no touching the derivatives labs.

## Constraints
- One editor per lesson file. Do not edit lessons outside the list.
- `check.prompt`/`explain` are inline text: `$tex$`, `**bold**` allowed; escape backslashes.
- Keep each lesson's EN word count under 2300 (the harness checks it); checks add ~60–120 words each.

## Steps
Per lesson, in this order (suggested content; keep numbers consistent with the lesson's own examples):
1. **instruments** — check: payoff of a long put with K = 100 at S_T = 85 (15); choice: which position has
   unlimited loss (short call). Worked: P&L of a long call bought for 4.2 at K = 100 across S_T = 90/100/110/120.
2. **strategies** — check: max profit of a bull call spread 100/110 bought for 4 (6); choice: payoff shape of a
   straddle at S_T = K. Worked: butterfly 90/100/110 payoff at 95, 100, 105 and the net cost.
3. **no-arbitrage** — check: forward price with S₀ = 50, r = 4% continuous, T = 0.5 (51.01); choice: which trade
   if F > S₀e^{rT} (sell forward, buy spot). Worked: cash-and-carry profit when F = 52.
4. **put-call-parity** — check: put from call 7.2, S₀ = 100, K = 100, r = 5%, T = 1 (2.32); choice: parity holds
   for European options only. Worked: build the synthetic forward and check parity with the lesson's numbers.
5. **one-step-binomial** — check: Δ for u = 1.2, d = 0.8, K = 100, S₀ = 100 (0.5); choice: the bond position sign
   for a call (borrow). Worked: replicate the call, price it, compare with discounted expectation.
6. **risk-neutral** — check: q with u = 1.1, d = 0.9, r = 2% simple one period (0.6); choice: does q depend on
   the real p (no). Worked: price a put via q and via replication.
7. **multi-step-trees** — check: CRR u for σ = 20%, Δt = 0.25 (1.1052); choice: number of terminal nodes in a
   recombining n-step tree (n + 1). Worked: two-step tree call price by backward induction.
8. **delta-hedging** — check: shares to hedge 100 short calls with Δ = 0.6 (60); choice: gamma sign of a long
   call (positive). Worked: one rebalance step P&L using Δ and Γ from `blackScholes.math.ts` defaults.
9. **gbm** — check: median of S_T for S₀ = 100, μ = 8%, σ = 20%, T = 1 (106.18); choice: distribution of ln S_T
   (normal). Worked: mean, median and a 95% interval of S_T.
10. **toward-black-scholes** — check: call price for S₀ = K = 100, r = 5%, σ = 20%, T = 1 (10.45, tol 0.02);
    choice: meaning of N(d₂) (risk-neutral probability of finishing in the money). Worked: d₁, d₂, N(d₁), N(d₂),
    price.
11. **greeks** — check: theta sign of a long ATM call (negative; choice); numeric: vega per 1 pp for the lesson's
    default option. Worked: price change from a 1-vol-point and a 1-day move using Greeks, compare with the exact
    repricing.
12. **implied-volatility** — check: choice "if the market price is above the BS price at 20%, implied vol is
    (higher)"; numeric: implied vol via one bisection on the lesson's quoted example (use `guide.wave2.math.ts`).
    Worked: two Newton steps from σ = 20%.
13. **static-replication** — check: the Breeden–Litzenberger second derivative identity (choice); numeric: density
    from a narrow butterfly with the lesson's numbers. Worked: Carr–Madan decomposition of a payoff into strikes.
14. **exotic-options** — check: up-and-out call is worth less than vanilla (choice); numeric: digital call price
    e^{-rT}N(d₂) for the lesson's defaults. Worked: digital price step by step.

Then: compute every number in node (`node -e` with `importSrc` from `scripts/lib/load-ts.mjs`, or a scratch
`.mjs`), paste values with tolerances, write the HU versions, run the tests, remove the 14 ids from the two
allowlists.

## Acceptance criteria
- `npm run test:guide-audit` passes with the 14 ids removed from `NO_CHECKS` and `NO_WORKED`.
- `npm run test:guide-checks` passes (formats, cross-language parity).
- Each check id is unique and scoped (`instruments/long-put-payoff` …).
- The derivatives track page lists checks for all 16 lessons: smoke `/guide/derivatives` and
  `/hu/guide/derivatives` without problems.

## Verification
```bash
npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/derivatives,/hu/guide/derivatives,/guide/derivatives/greeks" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- A `check` placed after the lesson's last `h` ("Summary") counts as a preview in the citation logic and breaks
  the reading-order test if its text quotes a later lesson: keep checks inside sections.
- Quoting another lesson's title inside a check creates a graph edge; only cite lessons read earlier.
- Numeric answers: `tolerance` is absolute, in the displayed unit; with `unit: "%"` the value is in percent.
- HU numbers use a decimal comma in prose (`10,45`) but `value` stays a JS number.

## Findings (fill in during execution)
- Numbers computed in node (scratch script importing `blackScholes.math.ts` and `guide.wave2.math.ts` via `importSrc`;
  shown rounded, tolerance in brackets):
  - instruments: long-put-payoff 15 [0.01]; worked -4.2, -4.2, 5.8, 15.8, break-even 104.2.
  - strategies: bull-spread-max-profit 6 [0.01]; worked butterfly payoffs 5, 10, 5, net cost 2.5 (assumed premiums
    13 / 6.5 / 2.5), best profit 7.5.
  - no-arbitrage: forward-price 50e^0.02 = 51.01007 [0.01]; worked 51.01, 52 - 51.01 = 0.98993, PV 0.97033.
  - put-call-parity: put-from-call 7.2 - 100 + 100e^-0.05 = 2.32294 [0.01]; worked Ke^-rT 95.12294, 4.88, BS C - P =
    10.45057 - 5.57352 = 4.877, payoff at 120 = 20.
  - one-step-binomial: delta 0.5 [0.005]; worked (u 1.2, d 0.8, r 2%) B = -39.21569, C0 = 10.78431 (equals
    q-pricing with q = 0.55), up-state check 20.
  - risk-neutral: q-value 0.6 [0.005]; worked put P0 = 5.88235 via q, Delta -0.33333, B 39.21569.
  - multi-step-trees: crr-up-factor e^0.1 = 1.10517 [0.0005]; worked two-step put u 1.15191, q 0.55391,
    P20 24.63617, P10 10.71865, P0 4.66344; parity 9.54 - 4.877 = 4.66294.
  - delta-hedging: hedge-shares 60; worked Delta N(0.35) 0.63683, Gamma 0.01876, 0.5*Gamma*4 = 0.03752, exact
    C(102) - C(100) - 2Delta = 0.03683, new Delta 0.67329.
  - gbm: median 100e^0.06 = 106.18365 [0.01]; worked (S0 50, mu 10%, sigma 30%, T 2) mean 61.07014, median 55.8139,
    95% range 24.29973 [0.02] to 128.19859 [0.05].
  - toward-black-scholes: atm-call 10.45057 [0.02]; worked (S0 110, K 100, r 5%, sigma 25%, T 0.5) d1 0.76897,
    d2 0.59219, N(d1) 0.77904, N(d2) 0.72314, C0 15.16639 (matches `bsPrice`).
  - greeks: vega-per-point 27.47432/100 = 0.2747 [0.002]; worked vega prediction 0.2747, exact 25%->26% 0.27481,
    theta/365 -0.02578, exact one-day repricing -0.02581.
  - implied-volatility: quote-nine `impliedVol` = 16.109% [0.1, unit %] (bisection midpoint 15% prices at 8.59166,
    10% at 6.80496); worked Newton from 20%: vega 37.52403, sigma1 16.134%, C(sigma1) 9.00951, vega 36.96454,
    sigma2 16.109%.
  - static-replication: butterfly-density 95/100/105 cost 0.46672, /25 = 0.01867 (= `butterflyPrice`), q(100) =
    e^0.05 * 0.01867 = 0.01963 [0.0002]; worked Carr–Madan around F = 105.12711: f(F) 5.12711, bonds 4.87706,
    P(100) 5.57352, C(110) 6.04007, total 4.4105 = C(100) - C(110) 4.4105.
  - exotic-options: digital-price e^-0.05 N(0.15) = 0.53232 [0.002]; worked K = 110: d2 -0.32655, N(d2) 0.372,
    D0 0.35386.
- HU strings written (awaiting owner review): every check and worked block in the HU half of all 14 lessons —
  instruments/long-put-payoff, instruments/unlimited-loss; strategies/bull-spread-max-profit, strategies/straddle-at-strike;
  no-arbitrage/forward-price, no-arbitrage/which-trade; put-call-parity/put-from-call, put-call-parity/european-only;
  one-step-binomial/delta, one-step-binomial/bond-sign; risk-neutral/q-value, risk-neutral/depends-on-p;
  multi-step-trees/terminal-nodes, multi-step-trees/crr-up-factor; delta-hedging/hedge-shares, delta-hedging/gamma-sign;
  gbm/log-distribution, gbm/median; toward-black-scholes/meaning-nd2, toward-black-scholes/atm-call;
  greeks/theta-sign, greeks/vega-per-point; implied-volatility/above-model-price, implied-volatility/quote-nine;
  static-replication/bl-identity, static-replication/butterfly-density; exotic-options/digital-price,
  exotic-options/up-and-out-cheaper; plus the one worked block (untitled id) in each of the 14 lessons.
- Deviations and why:
  - Several lessons already worked the plan's suggested example in prose (BS 10.45, GBM 106.18, tree call 9.54, IV
    24.11%), so the worked blocks use fresh inputs instead (ITM BS call, 2-year GBM, two-step put, IV quote 9.00) to
    avoid repeating the prose.
  - one-step-binomial worked: no comparison with the discounted q-expectation, because q is introduced only in the
    next lesson; the last step checks the up-state payoff instead (the q route gives the same 10.78).
  - implied-volatility numeric check uses a new quote (9.00 → 16.11%) rather than repeating the prose's 12.00.
  - strategies butterfly net cost uses assumed premiums (the lesson quotes none).
  - "practice answers agree with the formulas" list in `scripts/guide-checks.test.mjs` not extended (optional).
  - Smoke: all three paths render with h1/title; each reports React #418 (hydration) and a 404 for
    /_vercel/insights. #418 also appears on other track and lesson pages (e.g. portfolio-risk, annuities), so it is
    not caused by these blocks.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`). Read `CLAUDE.md`, `docs/plans/guides-audit/README.md`
> (section 4) and `docs/plans/guides-audit/03-checks-derivatives.md`, and confirm plan 01 is marked done in the
> README (stop and report if not). Implement plan 03: add two `check` blocks and one `worked` block (EN and HU,
> identical ids and answers, every number computed in node) to each of the 14 listed derivatives lessons, then
> remove their ids from `NO_CHECKS` and `NO_WORKED` in `scripts/guide-audit.test.mjs`. Run the verification
> commands and make them pass. Fill in Findings, set plan 03 to `done` in the README table, and summarise.
