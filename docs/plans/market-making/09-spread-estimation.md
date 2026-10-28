# 09 — Spread estimation lab: tape, Roll, decomposition

Status: done (2026-10-28, opus-spe; build/seo re-check pending) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Researchers rarely see quotes; they see a tape of trade prices. This lab makes the reader a detective:
classify trades as buys or sells by eye, see the bid–ask bounce as negative autocorrelation, **draw** the
slope of Δpₜ vs Δpₜ₋₁ to get Roll's estimate, and discover the surprise: when traders are informed, Roll's
estimate falls below the true spread while the effective spread does not.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: stub `src/features/spread-estimation/SpreadEstimationView.tsx`, registry entry
  `spread-estimation` (`status: "planned"`), copy `src/Language/SpreadEstimation.ts`/`.hu.ts` (prefix `spe`),
  partial `src/styles/_spread-estimation.scss`. **Phase A below needs none of this and can start before 01.**
- `src/lib/stats/moments.ts`: `mean`, `covariance(xs, ys)`, `stdDev`; `src/lib/stats/regression.ts`:
  `linearRegression(xs, ys)`; `makeRng`, `nextNormal` in `src/lib/math/random.ts`.
- Charts: `ScatterChart` + `useScatterDrag`, `SketchLayer mode="line"` (see `src/features/capm/components/
  BetaTab.tsx` for a drawn-slope challenge), `LineChart`, `CapitalSplitBar` (`src/components/charts/
  CapitalSplitBar.tsx`; draggable split handles over segments — read its props before use), `Histogram`.

## Model (decided)
- Trade direction Qₜ = ±1 (buy/sell, 50/50). Efficient price mₜ = mₜ₋₁ + α·(S/2)·Qₜ + εₜ, εₜ ~ N(0, σ²).
  Trade price pₜ = mₜ₋₁ + (S/2)·Qₜ (the quote midpoint before the trade is mₜ₋₁).
- Then Δpₜ = (S/2)·Qₜ − (1 − α)(S/2)·Qₜ₋₁ + εₜ₋₁ and cov(Δpₜ, Δpₜ₋₁) = −(1 − α)·S²/4, so **Roll's estimate
  2√(−cov) converges to S·√(1 − α)**, not S. The effective spread 2·|pₜ − mₜ₋₁| equals S.
- Two-way Huang–Stoll regression with the true Q: Δpₜ = β₁·ΔQₜ + β₂·Qₜ₋₁ + e gives β₁ = S/2 and
  β₂ = α·S/2, so the adverse-selection share is β₂/β₁ = α; the rest is "order processing and inventory"
  (this lab does not separate those two; say so).
- Defaults: S = 10¢, σ = 2.5¢ per trade, α ("informed share of the spread") = 0.35, 120 trades; m₀ = 100.

## Goal
1. A tape view: trade prints over time with the hidden efficient price revealable; the bid/ask bounce visible.
2. Classify game: tap B/S for each print (quotes hidden); compare your accuracy with the tick test.
3. Slope view: scatter Δpₜ vs Δpₜ₋₁ with a draggable line; Roll's estimate from your slope and from the data.
4. Decomposition: drag split handles to guess "adverse selection" vs "order processing and inventory", reveal
   the estimate and the truth; estimate-vs-sample-size convergence.
5. Predict and Challenge: `spe-roll` (guess) and `spe-classify` (score).

## Non-goals
- No three-way decomposition, no intraday quotes, no Lee–Ready with quotes (the tick test only).

## Steps
**Phase A — maths and tests (own folder only; may start before plan 01).**
1. `spreadEstimation.types.ts`: `SpeParams { S; sigma; alpha; n }`, `Print { t; p; q: 1 | −1; m: number /* mid before */ }`.
2. `spreadEstimation.math.ts` (`///` docs): `simulateTape(params, seed)`; `diffs(prints)`; `rollEstimate(prints)`
   (returns `{ s, cov }`, `s = NaN` and a flag when cov ≥ 0 — Roll is undefined then); `rollFromSlope(slope,
   varDp)` (s = 2√(−slope·var(Δp))); `effectiveSpread(prints)` (mean 2|p − m|); `tickTest(prints)` (uptick →
   buy, downtick → sell, zero tick → previous sign; first print buy); `classifyAccuracy(guesses, prints)`;
   `huangStoll(prints)` → `{ halfSpread, adverseShare }` via `linearRegression` on the two regressors
   (implement the 2-regressor OLS explicitly; `linearRegression` is one-regressor); `convergence(params, seed,
   sizes = [20, 40, 80, 160, 320, 640])` → `{ n, roll, effective }[]`.
3. Tests `scripts/micro-spread.test.mjs`: with α = 0 and 50,000 trades Roll ≈ S (±3%); with α = 0.35 Roll ≈
   S·√0.65 (±3%) while effective = S exactly; `huangStoll` recovers S/2 and α (±3%) on 50,000 trades; tick-test
   accuracy falls as σ/S rises; `rollEstimate` flags positive covariance; determinism.

**Phase B — the lab (needs plan 01).**
4. `spreadEstimation.url.ts` (`mode`, `tab` = tape | slope | split, `S`, `sigma`, `alpha`, `n`, `seed`),
   `useSpreadEstimationLab.ts`.
5. **Tape** (`TapeChart.tsx`, `ClassifyBar.tsx`): line + dots of prints; the hidden efficient price toggled by
   "Reveal efficient price" (dashed); dots coloured by true side only after reveal (before: neutral). In
   classify play the newest print pulses once (background tint, not motion under reduced motion) and the
   reader taps Buy / Sell (keys B / S, ← to undo); 30 prints per game; at the end a table: your accuracy,
   tick test accuracy, and the prints you got wrong highlighted on the chart.
6. **Slope** (`SlopeScatter.tsx`): `ScatterChart` of (Δpₜ₋₁, Δpₜ) with a draggable line through the origin;
   readout "your slope −0.47 → Roll s = 9.8¢"; reveal shows the OLS slope and Roll from data with the true S;
   a note when the covariance is positive ("Roll undefined for this sample").
7. **Split** (`SpreadSplit.tsx`): a single horizontal bar of the spread with one draggable boundary between
   "adverse selection" and "order processing and inventory" (`CapitalSplitBar` if it fits, else
   `DragHandles` on a bar); reveal shows the Huang–Stoll estimate and the generator's truth α side by side;
   a convergence `LineChart` (estimate vs sample size, true S dashed) with Roll and effective spread lines.
8. **Predict** (`spe-roll`, kind guess): a fresh 120-print tape with S hidden (random 4–16¢); the reader
   guesses S; `usePredictReveal({ truth: S, tolerance: 1, resetKey: round, challengeId: "spe-roll" })`.
   `PredictExplain`: "Raise the informed share α. Does Roll's estimate get closer to the true spread or fall
   below it?" (*falls below*: prices keep part of each trade's move, so the bounce is weaker); "Add
   efficient-price volatility. Does Roll get more or less accurate on 120 trades?" (*less*: more noise in the
   covariance; the convergence chart shows it).
9. **Challenge** (`spe-classify`, kind score): one 30-print classify game with σ/S = 0.25; hit = accuracy ≥
   80%; `const CHALLENGE = "spe-classify"`, `recordChallenge(...)`, `ChallengeRecord`.
10. **View** (`SpreadEstimationView.tsx`): `PageHeader` actions = mode switch, New seed; `Workspace
    columns="sidebar"`: left `Panel` (true market: S, σ, α, n; estimator formulas with numbers); main:
    `ChartContainer` with `Tabs` Tape / Slope / Split; readout row (Roll, error %, autocorrelation, effective).
11. **Wiring**: rows `spe-roll` (guess, "±1¢") and `spe-classify` (score, "≥ 80% correct");
    `sbxCh_spe-roll` "Spread from a tape" / HU "Spread a kötéslistából", `sbxCh_spe-classify` "Classify the
    tape" / HU "Osztályozd a kötéseket"; registry `status: "beta"`.

## Acceptance criteria
- Each tab's main figure is manipulated directly (tap, drag the line, drag the split); reveals show you vs
  estimator vs truth.
- The α surprise is reproducible: α 0 → Roll ≈ S, α 0.5 → Roll ≈ 0.71 S on long samples (convergence chart).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/spread-estimation,/spread-estimation?tab=slope,/spread-estimation?tab=split,/spread-estimation?mode=challenge,/hu/spread-estimation"
node scripts/layout-audit.mjs   # /spread-estimation at 360/768/1280/1536
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Positive sample covariance** happens on short, noisy tapes; never take √ of a negative number — show
  the flag.
- **Timing of the midpoint:** the trade prints at mₜ₋₁ ± S/2 (the quote before the update); using mₜ breaks the
  formulas above. The tests pin it.
- The classify game must not show true colours until the game ends.

## Findings (fill in during execution)
- Simulated Roll/effective/H–S values vs theory (50,000 trades, S = 10¢, σ = 2.5¢): α 0 → Roll 9.99¢,
  effective 10.00¢, H–S half 5.00¢ / share 0.001; α 0.35 → Roll 8.05¢ (theory 8.06¢), effective 10.00¢,
  H–S 5.00¢ / 0.351; α 0.5 → Roll 7.06¢ (theory 7.07¢), H–S 0.501. Tick-test accuracy on the challenge
  market (σ/S = 0.25) is ~97%, so the 80% target is reachable by eye.
- New HU keys for owner review: all `spe*` keys in `src/Language/SpreadEstimation.hu.ts` (modes "Szimuláció /
  Tipp / Kihívás", "Kötéslista", "Kontraszelekció", "Megbízáskezelés és készlet", "tick teszt" kept English),
  `sbxCh_spe-roll`, `sbxCh_spe-classify`.
- Deviations: prices, S and σ are in **cents** throughout (M0 = 10000¢), formatted at the edges. Simulate mode
  has a Watch / Classify switch on the Tape tab (classify practice, unrecorded); the recorded classify game
  lives in Challenge mode, and the Predict tape shows no estimator readouts (they would give S away). The
  second PredictExplain (volatility) sits on the Split tab under the convergence chart. The split bar reuses
  `CapitalSplitBar` (tones debt/equity). Verified on the dev server (smoke + layout audit 360/1280 dark, a
  played challenge game and a split reveal, no console problems); full `npm run build`/`test:seo` could not run
  while the stochastic-labs pack had the shared tree red (74 tsc errors, pre-render empty everywhere).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/09-spread-estimation.md`. Phase A (maths +
> tests) may start now; confirm plan 01 is done before Phase B. Implement plan 09: the tape simulator, Roll,
> effective spread, tick test and two-way Huang–Stoll maths; the tape/classify, drawn-slope and drag-split
> views with convergence; `spe-roll` and `spe-classify`; and tests. Run the verification block, fill in
> Findings, append DONE to LOG.md, set plan 09 to `done`, and summarise.
