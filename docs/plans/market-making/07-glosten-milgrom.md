# 07 — Glosten–Milgrom lab: Bayes maker and you-quote game

Status: done (2026-10-28, opus-glm) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
Glosten–Milgrom explains why a spread exists even with zero costs: the maker cannot tell informed traders
from noise traders, so every buy is a little bit of bad news for whoever sold. The reader should step
through trades one at a time, **flip any trade** to see the quotes re-learn, and then try to quote like the
Bayesian maker themselves.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: stub `src/features/glosten-milgrom/GlostenMilgromView.tsx`, registry entry
  `glosten-milgrom` (`status: "planned"`), copy `src/Language/GlostenMilgrom.ts`/`.hu.ts` (prefix `glm`),
  partial `src/styles/_glosten-milgrom.scss`. **Phase A below needs none of this and can start before 01.**
- Primitives: `usePlayback({ steps, initial?, durationMs?, loop? })` + `PlaybackControls({ playback, steps,
  label, formatStep?, showStepButtons?, showSpeed? })` in `src/components/playback`; `LineChart`,
  `DragHandles` (`frame`, `handles: DragHandle[]`, `onChange`, `onCommit?`; see `dragHandle.logic.ts`) in
  `src/components/charts`; `PredictReveal`, `usePredictReveal`, `PredictExplain`, `ChallengeRecord`,
  `SegmentedControl`, `StatCard` in `src/components/ui`; `SeedControl`; `makeRng` in `src/lib/math/random.ts`.
- No microstructure maths exists; this lab's model lives only in this folder.

## Goal
1. Watch mode: quotes, belief and spread after each trade for a generated sequence; play/step/scrub; the
   update formula with live numbers; **click any B/S tile to flip it** and see everything recompute.
2. You-quote mode: before each trade, drag bid and ask on a 0–1 ruler; a rival maker quotes the Bayes
   prices; you win the trade only when your quote is better; score your quotes against Bayes.
3. Predict (`glm-belief`) and Challenge (`glm-quote`).

## Non-goals
- No order book, no inventory, no elastic noise demand (keep the classic model: noise trades 50/50).

## Constraints
- README §2/§4. Values V ∈ {0, 1} (display "value 0" / "value 1"); prices are probabilities.

## Steps
**Phase A — maths and tests (own folder only; may start before plan 01).**
1. `glostenMilgrom.types.ts`: `type Trade = "B" | "S"`; `type GmParams = { pi: number; prior: number; trueV: 0 | 1;
   n: number }` (defaults `{ pi: 0.2, prior: 0.5, trueV: 1, n: 50 }`); `type GmStep = { trade: Trade; mu: number;
   ask: number; bid: number; next: number }`.
2. `glostenMilgrom.math.ts` (`///` docs, pure): `pBuy(v, pi) = v ? pi + (1 − pi)/2 : (1 − pi)/2`;
   `askAt(mu, pi) = mu·pBuy(1)/(mu·pBuy(1) + (1 − mu)·pBuy(0))`; `bidAt(mu, pi)` with sell probabilities;
   `update(mu, trade, pi)` = ask after B, bid after S; `gmPath(trades, pi, prior): GmStep[]`;
   `drawTrades(params, seed): Trade[]` (each trader informed with prob π and trades toward `trueV`, else
   50/50); `tradesToConfidence(path, level = 0.9)` (first index where the belief in the true value ≥ level,
   or null); `infoPerTrade(pi) = pi·ln((1 + pi)/(1 − pi))` (expected log-likelihood gain per trade).
3. Tests `scripts/micro-glosten.test.mjs`: ask ≥ mu ≥ bid; π = 0 ⇒ spread 0; π = 1 ⇒ first trade reveals V;
   the belief is a martingale under the maker's measure (E[next | mu] = mu, exact algebra on a grid);
   `gmPath` flips consistently (flipping tile k changes only steps ≥ k); `drawTrades` deterministic per seed;
   median trades to 0.9 at π = 0.2 is about a quarter of π = 0.1 (simulate 2,000 sequences each; accept a
   ratio of 0.2–0.35 and record it) — this backs the surprise question.

**Phase B — the lab (needs plan 01).**
4. `glostenMilgrom.url.ts` (`mode`, `pi`, `prior`, `trueV`, `n`, `seed`), `useGlostenMilgromLab.ts`: the
   trade list (generated, then possibly edited by flips), `gmPath`, a `usePlayback` cursor over trades,
   you-quote state, predict state.
5. **Watch mode** (`QuotePathChart.tsx`, `TradeStrip.tsx`, `BeliefBars.tsx`, `SpreadChart.tsx`,
   `StepThrough.tsx`, `GmFormula.tsx`): ask (`var(--negative)`), bid (`var(--positive)`) and belief (dashed)
   after each trade with a dashed true-value line; the region beyond the cursor dimmed. Below it a strip of
   square B/S tiles (buttons; B tinted positive, S negative, with the letter); **click a tile to flip it**
   (keyboard: focus a tile, Space flips, ←/→ moves); the edited tile gets a 1px outline. Belief bars
   P(V = 0)/P(V = 1); spread over time with "0.20 → 0.004" label; a step log (`trade 3: SELL, μ 0.600 →
   0.500`) and ◀ ▶ buttons via `PlaybackControls showStepButtons`; `GmFormula` shows `ask = E[V | buy] =
   …` with the current numbers. Readouts: belief, spread now, buys/sells, trades to 0.9.
6. **You-quote mode** (`QuoteRuler.tsx`, `YouQuotePanel.tsx`): a vertical 0–1 ruler with two square drag
   handles (bid below, ask above; ↑/↓ moves the focused handle by 0.01, Shift by 0.05) and a ghost of the
   current public belief; "Quote" commits, then the next trade is revealed: if it is a B and your ask <
   Bayes ask, you sell at your ask (you win the trade); if your ask > Bayes ask the rival takes it; ties
   split (no trade for you). Same for S with bids. After each trade show your quote vs Bayes and the
   running mean absolute error; after 20 trades reveal V and your P&L on the trades you won (with sign).
   Help line: "Quote tighter than Bayes and you win more trades, but informed traders pick you off."
7. **Predict** (`glm-belief`, kind guess): show 12 trades (no chart), π and prior; the reader types or drags a
   guess of P(V = 1); `usePredictReveal({ truth, tolerance: 0.05, resetKey: round, challengeId: "glm-belief" })`.
   `PredictExplain` items: "Set π to 0. What happens to the spread?" (*zero* — nothing to fear);
   "π doubles from 10% to 20%. Trades needed to reach 90% confidence: about the same / about half / about a
   quarter?" (*a quarter*: information per trade ≈ 2π²).
8. **Challenge** (`glm-quote`, kind score): a 20-trade you-quote round; hit = mean absolute quote error vs
   Bayes ≤ 0.03; `const CHALLENGE = "glm-quote"`, `recordChallenge(CHALLENGE, hit, Date.now())`,
   `ChallengeRecord`.
9. **View** (`GlostenMilgromView.tsx`): `PageHeader` actions = mode switch, New seed; `Workspace
   columns="sidebar"`: left `Panel` with π, prior, true value (`SegmentedControl` 0/1), trades n, formula;
   main: quote chart + tile strip (dominant), then spread chart and belief bars side by side, step log.
10. **Wiring**: rows `glm-belief` (guess, "±0.05") and `glm-quote` (score, "error ≤ 0.03");
    `sbxCh_glm-belief` "Maker's belief" / HU "Az árjegyző hiedelme", `sbxCh_glm-quote` "Quote like Bayes" /
    HU "Jegyezz, mint Bayes"; registry `status: "beta"`.

## Acceptance criteria
- Flipping any tile recomputes later quotes only; playback and scrub work by pointer and keyboard.
- You-quote round plays 20 trades and saves a challenge round; predict saves a round per reveal.
- Phase A tests pass on their own (`node --test scripts/micro-glosten.test.mjs`).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/glosten-milgrom,/glosten-milgrom?mode=challenge,/glosten-milgrom?pi=0,/hu/glosten-milgrom"
node scripts/layout-audit.mjs   # /glosten-milgrom at 360/768/1280/1536
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Edited sequences:** once a tile is flipped, the sequence is no longer the seeded one; show "edited" and a
  Reset button; URL state keeps only the seed (not edits).
- **Rounding:** display 3 decimals, compute in full precision; at π near 1 the belief jumps to 0/1 in one
  trade, guard divisions.
- The tile strip for n = 50 must wrap or scroll horizontally inside its panel at 360px (no page overflow).

## Findings (fill in during execution)
- Trades-to-0.9 ratio (π 0.2 vs 0.1): 0.286 (median over 2,000 seeds each; Phase A done 2026-10-28).
- New HU keys for owner review: all `glm*` keys in `src/Language/GlostenMilgrom.hu.ts` (modes Szimuláció/Tipp/Kihívás, Ask (eladási ár)/Bid (vételi ár), VÉTEL/ELADÁS, hiedelem); `sbxCh_glm-belief` "Az árjegyző hiedelme", `sbxCh_glm-quote` "Jegyezz, mint Bayes".
- Deviations: `tradesToConfidence(path, trueV, level)` takes `trueV` (the belief "in the true value" needs it); returns a 1-based trade count. `DEFAULT_GM_PARAMS` exported from the types file. Simulate has a Watch / You quote sub-switch; Challenge is the scored 20-trade you-quote round (practice and scored rounds keep separate state). Spread chart and belief bars sit side by side under the step log. `npm run build`'s `tsc -b` was red from other sessions' gbm/monte-carlo edits; verified with filtered `tsc` + `vite build`. test:seo failures were only in other plans' pages (desk, gbm, ito).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/07-glosten-milgrom.md`. Phase A (maths + tests)
> may start now; confirm plan 01 is done before Phase B. Implement plan 07: the Glosten–Milgrom maths,
> watch mode with flippable trade tiles and step-through, the you-quote game against a Bayes rival,
> `glm-belief` and `glm-quote`, and tests. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 07 to `done`, and summarise.
