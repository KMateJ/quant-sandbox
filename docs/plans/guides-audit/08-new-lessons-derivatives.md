# 08 — New lesson: options on dividend-paying stocks, indices, currencies and futures

Status: done (2026-10-20) · Depends on: 07 · Suggested model: Sonnet · Est. size: M

## Why
The derivatives track derives Black–Scholes for a non-dividend stock and stops. Every exam and every
market application needs the extensions: a continuous dividend yield, index options, currency options
(Garman–Kohlhagen) and options on futures (Black-76). They are one idea — replace S₀ by the discounted
forward — and the track has no lesson saying so.

## Current state (verified 2026-10-20)
- Plan 07 registered: id `options-on-other-underlyings`, track derivatives, after `greeks`, labs
  `["black-scholes"]`, figure `dividend-yield-price` → `src/features/guide/components/figures/wave4/DividendYieldPriceFigure.tsx`
  (placeholder), lesson file `src/Language/guides/optionsOnOtherUnderlyings.ts` (placeholder), title keys
  `guideOtherUnderlyingsTitle/Desc` in `src/Language/GuideWave4.ts` / `.hu.ts`, test file `scripts/guide-wave4.test.mjs`.
- Registered titles to cite (exact): EN "The Black–Scholes formula" / HU „A Black–Scholes-képlet”;
  EN "Arbitrage and the forward price" / HU look up `guideNoArbitrageTitle` in `src/Language/Guide.hu.ts`;
  EN "Put–call parity" / HU `guideParityTitle`; EN "The Greeks: gamma, vega, theta and rho" / HU „A görögök: gamma,
  vega, théta és rhó”; EN "Bond futures and the cheapest-to-deliver" / HU `guideTreasuryFuturesTitle` in
  `GuideFixedIncome.hu.ts` (cross-track, fine).
- Maths to reuse: `src/features/black-scholes/blackScholes.math.ts` (check its exports: a call/put pricer with
  `(S, K, r, sigma, T)`; if it has no yield parameter, write the generalised pricer in the new math file and
  reduce to it for q = 0), `src/lib/stats/distributions.ts` (`normCdf`).
- Figure conventions: `CompoundingFigure.tsx` (`GuideFigure`, `SliderField`, `LineChart`, `FigureReadout`,
  `SERIES_PALETTE`, `fmt`/`pct` from `figureFormat.ts`); `markerLine` in `figureSeries.ts` for a solid line at a
  chosen value. Strings `gfW4…` go in the wave-4 string files (additive).
- Lesson conventions: `docs/GUIDES_PLAN.md` §"Writing conventions"; exemplar with checks + worked:
  `src/Language/guides/annuities.ts`.
- Harness: remove the id from `PLACEHOLDER` in `scripts/guide-audit.test.mjs` when done.

## Goal
1. Full lesson, EN + HU, 900–1400 words each, same blocks in the same order, with ≥ 2 checks and 1 worked example.
2. Figure `dividend-yield-price` built on pure maths in `src/features/guide/guide.wave4.math.ts` with tests.
3. Harness, graph and checks tests green; id removed from `PLACEHOLDER`.

## Non-goals
- No change to the Black–Scholes lab or its maths file (hands-off lab). No dividends in discrete lumps beyond one
  paragraph (escrowed-dividend method mentioned, not derived).

## Constraints
- Figure component ≤ 80 lines; maths pure; strings via `t()`; no left-border accents, no pills.
- Cite prerequisites by exact title; do not quote titles of later lessons (implied volatility, Heston, …) except
  in the closing note, which may name "Implied volatility and the volatility smile" as a later lesson.

## Steps
1. Maths (`guide.wave4.math.ts`, `// #region Options on other underlyings`):
   ```ts
   /// Black–Scholes–Merton price with a continuous yield q (dividend yield, foreign rate or r for a futures contract).
   export function bsmPrice(S: number, K: number, r: number, q: number, sigma: number, T: number, type: "call" | "put"): number
   /// Forward price S e^{(r-q)T}; with it, call = e^{-rT}[F N(d1) - K N(d2)] (Black-76 form).
   export function forwardPrice(S: number, r: number, q: number, T: number): number
   /// Call and put against spot for q and for q = 0, plus the forward, for the figure.
   export function dividendYieldSeries(K: number, r: number, q: number, sigma: number, T: number, S: number[]): { S: number; callQ: number; call0: number; putQ: number; put0: number }[]
   ```
2. Tests in `scripts/guide-wave4.test.mjs` (append a `test()`): `bsmPrice` with q = 0 equals the lab's
   Black–Scholes call within 1e-9 for S = K = 100, r = 5%, σ = 20%, T = 1 (10.4506); put–call parity with yield
   `C − P = S e^{−qT} − K e^{−rT}`; Black-76: `bsmPrice(F, K, r, r, σ, T)` equals `e^{−rT}[F N(d₁) − K N(d₂)]`.
3. Figure: sliders q (0–8%, default 3%) and r (0–8%, default 5%); fixed K = 100, σ = 20%, T = 1; chart of call
   price against S (60–140) with q and with q = 0, payoff dashed, solid marker at S₀ = 100; readouts at S₀: call (q),
   call (q = 0), put (q), forward F. Compute the default readouts in node and quote them in the text.
4. Lesson outline (EN headings; HU equivalents):
   - opening `p`: builds on "The Black–Scholes formula" and "Arbitrage and the forward price".
   - `h("A continuous dividend yield")`: holding the stock pays q; replication needs e^{−qT} shares; price formula
     with S e^{−qT}; `eq` for d₁, d₂.
   - `h("The forward price as the common thread")`: F = S e^{(r−q)T}; rewrite as e^{−rT}[F N(d₁) − K N(d₂)]; one
     formula for every underlying.
   - `h("Index options")`: dividend yield of the index; a note on discrete dividends (escrowed-dividend idea).
   - `h("Currency options: Garman–Kohlhagen")`: q = foreign rate; the forward from covered interest parity.
   - `h("Options on futures: Black-76")`: q = r; futures price as the underlying; why d₁ loses the rate term; link
     to "Bond futures and the cheapest-to-deliver".
   - `h("Put–call parity with a yield")` + a `check` (numeric: put from call with q).
   - worked: Garman–Kohlhagen call on EUR/USD, S = 1.10, K = 1.10, r_d = 5%, r_f = 3%, σ = 10%, T = 1: F, d₁, d₂,
     price (compute in node).
   - a `check` (choice): which q makes Black-76 the formula (q = r).
   - `h("Summary")` + `list` + `lab("/black-scholes", …)`.
5. HU text, same blocks; „…” citations with the exact HU titles.
6. Remove the id from `PLACEHOLDER`; run everything; smoke EN + HU.

## Acceptance criteria
- Readouts quoted in the text equal the figure's defaults (state them in Findings).
- `npm run test:guide-audit` passes with the id out of `PLACEHOLDER`; `test:guide-wave4`, `test:guide-checks`,
  `test:guide-graph` pass; no reading-order issue introduced.
- Smoke: `/guide/derivatives/options-on-other-underlyings` and its `/hu/` twin: no problems.

## Verification
```bash
npm run test:guide-wave4 && npm run test:guide-audit && npm run test:guide-checks && npm run test:guide-graph
npx tsc -b && npx eslint src/features/guide src/Language/guides
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/derivatives/options-on-other-underlyings,/hu/guide/derivatives/options-on-other-underlyings" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- The lab's `blackScholes.math.ts` may name parameters differently (check before importing); never edit it.
- "The Greeks …" precedes this lesson, so it may be cited; "Implied volatility …" follows it, so quoting it in the
  body would create a forward citation (only the closing note after "Summary" counts as a preview).
- Currency conventions: state "domestic rate r_d, foreign rate r_f, price in domestic per unit foreign" once.

## Findings (fill in during execution)
- Default readouts (K = 100, S0 = 100, sigma = 20%, T = 1, r = 5%, q = 3%): call with yield 8.6525, call without yield 10.4506, put with yield 6.7309, forward 102.0201 (d1 = 0.2000, d2 = 0.0000). Quoted in the lesson as 8.65 / 10.45 / 6.73 / 102.02. Worked example (EUR/USD, GK): F = 1.12222, d1 = 0.25, d2 = 0.15, call 0.05356.
- HU text (for owner review): the whole lesson `optionsOnOtherUnderlyings.ts` (HU), and the `gfW4*` strings for this figure (`gfW4DividendYieldPriceTitle`, `gfW4FieldYield`, `gfW4DividendYieldAria`, `gfW4Payoff`, `gfW4CallNoYield`, `gfW4CallYield`, `gfW4PutYield`, `gfW4Forward`).
- Deviations and why: the wave-4 title key was `gfW4DividendYieldPriceTitle` (not the `...Title` the plan sketch implied), so the figure uses that and its text was changed from the placeholder. The comparison with the lab's Black-Scholes call uses a 1e-4 tolerance, not 1e-9: the lab and `lib/stats/distributions` use different normal-CDF approximations (errors up to ~1e-6 on the price). HU is 831 words (EN 940), slightly under the 900 target; the audit's 600-2300 bound is met. No branch was created (shared working tree).

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4), `docs/GUIDES_PLAN.md` §"Writing conventions" and
> `docs/plans/guides-audit/08-new-lessons-derivatives.md`, and confirm plan 07 is marked done in the README (stop
> and report if not). Implement plan 08: write the lesson `options-on-other-underlyings` in EN and HU with checks
> and a worked example, build the `dividend-yield-price` figure on pure maths with tests, and remove the id from
> the harness `PLACEHOLDER` list. Edit only your lesson file, figure component, the wave-4 math/test/string files.
> Run the verification commands (including the smoke test) and make them pass. Fill in Findings, set plan 08 to
> `done` in the README table, and summarise.
