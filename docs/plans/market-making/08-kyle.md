# 08 — Kyle lab: trade as the insider, estimate λ

Status: done (2026-10-28, opus-glm) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Kyle's model flips the point of view: the market maker sees only the *total* order flow and moves the price
by λ per share; an insider who knows the true value hides among noise traders. The reader plays the
**insider**: they know the value, plan or trade their orders auction by auction, and watch how fast their
own buying gives the secret away. Then they switch to the maker's view and estimate λ from the data.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: stub `src/features/kyle/KyleView.tsx`, registry entry `kyle` (`status: "planned"`), copy
  `src/Language/Kyle.ts`/`.hu.ts` (prefix `kyl`), partial `src/styles/_kyle.scss`. **Phase A below needs
  none of this and can start before 01.**
- `DraggableBars` (`src/components/charts/DraggableBars.tsx`; props `values`, `onChange(index, value)`,
  `min`, `max`, `step?`, `shadows?: number[]` (ghost bars), `domain?`, `limits?`, `xLabels?`,
  `barAriaLabel(i)`, `valueFormat?`, `yFormat?`, `ariaLabel`, `colors?`, `height?`); `SketchLayer` with
  `mode="line"` and `ScatterChart`; see `src/features/capm/components/BetaTab.tsx` for a draw-a-line challenge
  (`capm-beta-draw`) to copy the interaction from. `src/lib/stats/regression.ts`: `linearRegression(xs, ys)`.
  `makeRng`, `nextNormal` in `src/lib/math/random.ts`; `subSeed` in `src/lib/game/seed.ts`.

## Model (decided; write it into the lab's About-adjacent formula panel)
- Value V ~ N(p₀, σ_v²), known to the insider only. N auctions. Noise order uₙ ~ N(0, s²) each auction.
  The maker sets pₙ = pₙ₋₁ + λ·(xₙ + uₙ) with **one constant λ** for the round.
- Against a constant λ, the insider's best order with m auctions left (including this one) is
  **xₙ = (V − pₙ₋₁) / (λ·(m + 1))**: each auction closes 1/(m + 1) of the gap in expectation. With
  cⱼ = j / (2(j + 1)), the expected insider profit from gap g = V − p₀ is
  **c_N·g²/λ + λ·s²·Σ_{j=1}^{N−1} cⱼ**, and noise traders lose λ·s² per auction.
- The maker's λ is set to break even against that insider:
  **λ* = (σ_v / s)·√(c_N / (N − Σ_{j=1}^{N−1} cⱼ))**. For N = 1 this is Kyle's one-shot λ = σ_v/(2s).
  (Kyle's 1985 multi-auction equilibrium lets λ change by auction; the lab says it uses one λ.)
- Defaults: p₀ = 100, σ_v = 4, s = 1,000 shares, N = 10; λ shown in ¢ per 100 shares.

## Goal
1. Insider play: the value card, a price path chasing V, order bars per auction (plan all, or live one at a
   time) with the optimal orders as ghost bars, and your profit vs the optimal insider on the same noise.
2. Maker's view toggle: only total order flow and price — your orders vanish into the noise.
3. λ estimation: a scatter of Δp vs total flow over many auctions; drag a line to estimate λ.
4. Predict and Challenge: `kyl-lambda` (draw) and `kyl-insider` (score).

## Non-goals
- No order book; no strategic noise traders; no full Kyle (1985) recursion.

## Steps
**Phase A — maths and tests (own folder only; may start before plan 01).**
1. `kyle.types.ts`: `KyleParams { p0; sigmaV; s; n }`, `KyleDraw { v: number; u: number[] }`,
   `AuctionRow { n; x; u; flow; pBefore; pAfter; profit }`.
2. `kyle.math.ts` (`///` docs): `cCoef(j)`, `lambdaStar(p)`, `optimalOrder(v, p, lambda, left)`,
   `drawRound(p, seed, minGap = 0)` (resample V with `subSeed` until |V − p₀| ≥ `minGap`),
   `runAuctions(orders | "optimal", draw, p, lambda): AuctionRow[]` (profit per auction = (V − pₙ)·xₙ;
   `"optimal"` computes each xₙ from the realised pₙ₋₁), `expectedOptimalProfit(gap, p, lambda)`,
   `lambdaSample(p, seed, auctions = 200)` → `{ flow, dp }[]` (insider playing optimally across 20 rounds,
   new V each round).
3. Tests `scripts/micro-kyle.test.mjs`: `cCoef` values (1/4, 1/3, 3/8); `lambdaStar` for N = 1 equals σ_v/(2s);
   brute-force check that the optimal first order beats ±10% perturbations in expectation (Monte Carlo 20,000
   noise draws, common random numbers); Monte Carlo mean profit of `"optimal"` within 3 s.e. of
   `expectedOptimalProfit`; at `lambdaStar` the maker's mean P&L (noise losses − insider profit) is within 3
   s.e. of 0; OLS slope of `lambdaSample` within 10% of λ; determinism.

**Phase B — the lab (needs plan 01).**
4. `kyle.url.ts` (`mode`, `view` = insider | maker, `play` = plan | live, `n`, `s`, `seed`), `useKyleLab.ts`.
5. **Insider screen** (`InsiderCard.tsx`, `AuctionChart.tsx`, `OrderBars.tsx`): a square card "You know the
   value: 104.20" (hidden in maker view); a price path p₀ → pₙ with a dashed V line and the gap shaded; in
   *plan* mode `DraggableBars` for all N orders (± up to 3·σ_v/λ shares, step 50) with `shadows` = the
   optimal orders for the current plan prefix, then "Run" reveals noise auction by auction (`useTicker`, 600
   ms per auction; reduced motion: instant); in *live* mode one bar (the current auction) plus a "Trade"
   button, the ghost shows the optimal order for the current gap. Readouts: auctions left, gap closed %,
   your profit, optimal profit on the same noise (with sign), "price impact so far".
6. **Maker's view** (`MakerView.tsx`): bars of total flow xₙ + uₙ (one colour, no split) and the price path;
   a one-line caption: "The maker sees 3,400 bought; your 900 is somewhere in there". A toggle in the
   header actions switches views without changing state.
7. **Profit compare** (`ProfitCompare.tsx`): cumulative profit by auction, you vs optimal (same draws), and
   the noise traders' loss; a short line naming the biggest mistake ("Auction 1: you closed 70% of the gap;
   the optimum closes 9%").
8. **λ estimation** (`LambdaScatter.tsx`): `ScatterChart` of `lambdaSample` (Δp vs flow), a line through the
   origin the reader drags (copy the CAPM beta-draw interaction); reveal shows the OLS line and λ*.
   `usePredictReveal({ truth: λ*, tolerance: 0.15·λ*, challengeId: "kyl-lambda" })` (kind draw).
   `PredictExplain`: "Noise traders double their volume. As the insider, do you make more or less?" (*more*:
   λ* halves and your expected profit doubles); "Should you trade the whole gap in the first auction?" (*no*:
   you pay your own impact on every share).
9. **Challenge** (`kyl-insider`, kind score): a live round with |V − p₀| ≥ σ_v; hit = your profit ≥ 85% of the
   optimal policy's profit on the same draws; `const CHALLENGE = "kyl-insider"`, `recordChallenge(...)`,
   `ChallengeRecord`. Calibrate the 85% by playing the optimal-with-noise policy rounded to 100 shares
   (should hit ≥ 90% of seeds) and a naive "all at once" policy (should miss); record in Findings.
10. **View** (`KyleView.tsx`): `PageHeader` actions = mode switch (Simulate · Predict · Challenge), view
    toggle, `SeedControl compact`; `Workspace columns="sidebar"`: left `Panel` with N, s, σ_v and the formula
    panel (above model text, numbers filled in); main: card + price path + order bars (dominant), then profit
    compare; Predict tab shows the λ scatter.
11. **Wiring**: rows `kyl-lambda` (draw, "±15%") and `kyl-insider` (score, "≥ 85% of optimal");
    `sbxCh_kyl-lambda` "Estimate Kyle's lambda" / HU "Becsüld meg Kyle lambdáját", `sbxCh_kyl-insider`
    "Trade like an insider" / HU "Kereskedj bennfentesként"; registry `status: "beta"`.

## Acceptance criteria
- Plan and live play both work by pointer and keyboard (`DraggableBars` already supports keys); ghost bars
  update as the gap changes; maker view hides your orders.
- Phase A tests pass on their own; the break-even λ test passes.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/kyle,/kyle?view=maker,/kyle?mode=predict,/kyle?mode=challenge,/hu/kyle"
node scripts/layout-audit.mjs   # /kyle at 360/768/1280/1536
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Common random numbers:** "you vs optimal" must reuse the same V and u; never redraw for the comparison.
- **Small gaps** make the 85% ratio meaningless; the challenge forces |V − p₀| ≥ σ_v.
- **Units:** keep λ in $ per share in maths; format as ¢ per 100 shares in copy.
- Don't claim this is Kyle's exact multi-period equilibrium; the copy says "one constant λ".

## Findings (fill in during execution)
- Challenge calibration (500 seeds, |V − p₀| ≥ σ_v): optimal-from-realised-price rounded to 100 shares hits 100%; all-at-once hits 0.4%. Threshold 85% kept.
- New HU keys for owner review: all `kyl*` keys in `src/Language/Kyle.hu.ts` (Bennfentes / Market maker nézet, Előre tervezve / Élőben, árhatás, zajvolumen, bezárt rés); `sbxCh_kyl-lambda` "Becsüld meg Kyle lambdáját", `sbxCh_kyl-insider` "Kereskedj bennfentesként".
- Deviations (Phase A done 2026-10-28, 5/5 tests): `KyleOrders` = `(number | null)[] | "optimal"` (null = optimal for the realised gap; used by the perturbation test and live play); added `totalProfit`, `noiseProfit`; `drawRound` discards the first mulberry32 output (first draws across nearby seeds have E[z²] ≈ 1.035, which broke the break-even test).
- **Phase B design issue:** with the maker's rule Δp = λ·flow, `lambdaSample` is an exact line (OLS = λ* with zero residual), so the `kyl-lambda` draw is trivial. Suggest the scatter use flow vs the change in the *value estimate* E[V | flow] or add the next-auction price noise; decide before building `LambdaScatter`. **Resolved (option b):** `lambdaSample` adds news noise ε ~ N(0, (0.4·λ·s)²) to Δp (`SAMPLE_PRICE_NOISE`); the game's own price rule stays exact.
- View toggle (Insider/Maker) sits in the main panel's actions, not the page header (header overflowed at 768px). Order bars range ±max(1,000, 1.2·|gap|/λ) rounded to 500 instead of ±3σ_v/λ (that range made optimal orders invisibly small); step 50. Plan-mode ghosts assume zero noise so far (`planGhosts`) so they do not leak the noise before Run; "Use optimal plan" fills them in. `LambdaScatter` is `LambdaPredict.tsx` (click the plot or use the slider to set the slope).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/08-kyle.md`. Phase A (maths + tests) may start
> now; confirm plan 01 is done before Phase B. Implement plan 08: the constant-λ Kyle maths with the optimal
> insider and break-even λ, insider play (plan/live) with ghost optimal bars, the maker's view, profit
> comparison, λ estimation, `kyl-lambda` and `kyl-insider`, and tests. Run the verification block, fill in
> Findings, append DONE to LOG.md, set plan 08 to `done`, and summarise.
