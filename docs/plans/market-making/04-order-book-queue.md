# 04 — Order book lab II: your limit order, queue, execution challenge

Status: done (2026-10-28, opus-spe; build/seo re-check pending) · Depends on: 03 · Suggested model: Sonnet · Est. size: M

## Why
A market order pays the spread and walks the book; a limit order earns the spread but waits in a queue and
may never fill, and the fills it does get tend to come right before the price moves against it. This plan
lets the reader rest their own order in the live book, watch their place in the FIFO queue shrink, and then
play an execution challenge: buy a block cheaper than one big market order.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 03, `src/features/order-book/` has `orderBook.types.ts` (`ObkMode = "simulate" | "predict"`),
  `orderBook.math.ts` (`presetSpec`, `slippageBp`, `sizeToRow`, `slippageCurve`, `predictRound`),
  `src/lib/market/ladder.ts` (`ladderRows` with `mine` shares per row, `windowCentre`), `useOrderBookSim.ts` (reducer with `tick`, `send`, `reset`; precomputed
  `fairPath`/`flowSchedule` per seed), `useOrderBookLab.ts`, `orderBook.url.ts`, `OrderBookView.tsx`, and
  components `BookLadder`, `LadderRow`, `OrderTicket`, `BookReadouts`, `FillSummary`, `DepthChart`,
  `SlippageChart`, `BookEventLog`, `PredictPanel`. **Re-read them first**; plan 03's Findings list deviations.
- `src/lib/market/book.ts` (plan 02): `addLimit(b, { side, price, size, owner, t })` rests at the back of
  the level; `cancel(b, id)`, `cancelOwner(b, "you")`, `ordersOf(b, "you")`, `queueAhead(b, id)`; crowd
  flow never cancels `you` orders; fills carry `makerOwner`.
- `src/lib/math/random.ts`: `makeRng`, `nextPoisson`, `nextExponential` (plan 02). Normal CDF:
  `normCdf(x)` in `src/lib/stats/distributions.ts` (also `normPdf`, `normInv`); reuse it.
- Challenge plumbing: `ChallengeKind` includes `"score"` (plan 01); `recordChallenge(id, hit, now)` in
  `src/lib/game/challengeScores.ts`; `ChallengeRecord` + `useChallengeStats(id)` in `src/components/ui`.

## Goal
1. Limit ticket: click a ladder row to rest your order; your shares show inside the level's depth bar and in
   a queue strip with "shares ahead" and an estimated fill chance and wait.
2. Cancel and rejoin (you go to the back), fills from your order flagged, with a 10-second markout.
3. Challenge mode: buy 5,000 shares within 120 seconds; score = implementation shortfall vs arrival mid,
   compared on the same seed with "one market order" and "TWAP 10 slices".

## Non-goals
- No changes to `src/lib/market` (add helpers in this folder). No desk features (inventory P&L, quoting both
  sides — that is plan 05 and the desk).

## Constraints
- As plan 03. Your order colour `var(--primary)`; queue blocks square, 1px gaps, no rounded capsules.

## Steps
1. **Types/maths**: add `"challenge"` to `ObkMode`; `type TicketKind = "market" | "limit"`. New
   `queue.math.ts`: `queueBlocks(book, price, side)` → `{ id, size, mine }[]` front→back;
   `fillOdds(ahead, spec, horizon)` — opposite market volume over `horizon` seconds is compound Poisson with
   rate `marketRate × P(side)` and exponential sizes (mean m, second moment 2m²) plus cancels ahead at
   `cancelRate × ahead` per second; normal approximation `P(fill) = 1 − Φ((ahead + 1 − μ)/σ)` with
   `μ = horizon·(rate·m + cancelRate·ahead)`, `σ² = horizon·rate·2m²`; `expectedWait(ahead, spec)` = ahead /
   (rate·m + cancelRate·ahead); `markout(fill, midAt, 10)` (side-signed ¢).
2. **Execution maths** (`execution.math.ts`): `type ExecPolicy = "oneShot" | "twap10"`;
   `shortfallBp(fills, arrivalMid, side)`; `runExecutionPolicy(seed, spec, policy, target = 5000, deadline =
   120)` replays the same `fairPath`/`flowSchedule` from a fresh `seedBook` with the policy's market orders
   (oneShot at t = 0; twap10 = 500 every 12 s) and returns `{ shortfallBp, fills }`; `forceComplete` buys any
   remainder with a market order at the deadline. Hit rule: your shortfall ≤ 0.6 × oneShot shortfall
   (record the factor in Findings after trying 10 seeds; adjust so a sensible limit-order strategy can win).
3. **Reducer** (`useOrderBookSim.ts`): actions `placeLimit(side, price, size)`, `cancelMine(id)`,
   `cancelAllMine`; keep your fills (`makerOwner === "you"` or your market orders) in `myFills` with the mid at
   fill time; a `challenge` slice `{ startT, target, deadline, done, filled }` started by `startChallenge`
   (resets to a fresh `seedBook` for the seed so the policies can replay the same market).
4. **Ladder** (`LadderRow.tsx`): in limit mode a click rests your order at that row (bid side = buy, ask side
   = sell; rows on the wrong side of the touch become marketable and fill immediately — say so in the
   preview label); your shares draw as a `var(--primary)` segment at the correct queue offset inside the depth
   bar, with "you 400 · 1,260 ahead". Keep the file ≤ 150 lines (extract `DepthBar.tsx` if needed).
5. **Queue panel** (`QueueStrip.tsx`, `FillOdds.tsx`): blocks front→back for your level (width ∝ size; your
   block outlined with a 1px `var(--primary)` border and tinted background, not a left bar); incoming fills
   shrink the front block, cancels remove blocks; a small curve of `fillOdds` vs shares ahead (0…3× current)
   with a marker at your position ("1,260 ahead → 35% in 60 s") and expected wait; buttons Cancel, Cancel &
   rejoin (re-places at the same price, back of the queue), and a stepper to move your price ±1 tick
   (= cancel + replace).
6. **Your fills** (`MyFills.tsx`): table time, side, price, size, 10-s markout (side-signed, with sign);
   footer average markout. A `PredictExplain` above it: "Your bid at the touch finally fills. What usually
   happens to the price next?" options *keeps rising* / *falls through your price* (correct: you are filled
   when sellers push through your level — adverse selection) / *nothing on average*.
7. **Challenge panel** (`ExecutionPanel.tsx`, `ExecutionResult.tsx`): rules text, a progress bar (filled /
   5,000, square), timer (seconds left), live shortfall; at the end (or on Finish) a result table — you,
   one market order, TWAP 10 — with shortfall in bp and $, then hit/miss saved via
   `const CHALLENGE = "obk-execution"` + `recordChallenge(CHALLENGE, hit, Date.now())`, and a
   `ChallengeRecord` for the saved stats.
8. **Wiring**: append `{ id: "obk-execution", area: "microstructure", moduleId: "order-book", kind: "score",
   tolerance: "≤ 60% of one order" }` (update the text if the factor changed) and `sbxCh_obk-execution`
   EN "Execution challenge" / HU "Végrehajtási kihívás".
9. **Tests** `scripts/micro-order-book-queue.test.mjs`: `queueBlocks` order matches FIFO; `fillOdds` decreases
   in `ahead` and lies in [0, 1]; `expectedWait` formula; `runExecutionPolicy` deterministic per seed;
   `forceComplete` always reaches the target; shortfall sign convention (paying above mid is positive cost).

## Acceptance criteria
- Clicking a row rests your order; your segment sits at the right offset and moves forward as fills and
  cancels happen; cancel & rejoin visibly sends you to the back.
- Challenge: same seed ⇒ same oneShot/TWAP numbers; a patient limit-order strategy can beat the threshold on
  most seeds (record 10-seed results in Findings).
- `npm run test:challenges` green (both `obk-*` ids used once).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/order-book,/order-book?mode=challenge,/hu/order-book?mode=challenge,/sandbox"
node scripts/layout-audit.mjs   # /order-book?mode=challenge at 360/768/1280/1536
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Replace = lose priority.** Moving your price must cancel and re-add (back of queue); never edit price in place.
- **Marketable limits:** a buy limit at or above the best ask executes immediately (it is a taker); label it.
- **Policy replay must start from the same book:** `startChallenge` resets to `seedBook` for the seed, or the
  comparison with oneShot/TWAP is unfair.
- `fillOdds` is an approximation; label it "estimate" in the copy and keep the exact queue in the strip.

## Findings (fill in during execution)
- Hit factor chosen and 10-seed results (you-style limit strategy vs oneShot vs TWAP): factor **0.6** kept.
  Normal book, shortfall bp (oneShot / TWAP / passive = 1,000-share bid at the touch, refreshed every 10 s):
  s1 4.95/2.43/1.10, s2 4.55/0.27/−0.79, s3 5.25/5.14/3.58 (miss), s4 3.95/−2.07/−2.23, s5 4.35/0.24/−0.77,
  s6 4.46/−0.99/−1.81, s7 4.95/3.61/1.79, s8 4.65/−0.89/−1.64, s9 4.55/2.04/0.47, s10 4.91/3.72/1.81 →
  passive hits 9/10 (asserted ≥ 6/10 in the test). On the deep book a single market order already matches
  the oneShot baseline exactly (replay check in the browser).
- New HU keys for owner review: new `obk*` keys in `OrderBook.hu.ts` (Limitáras, Beállás a legjobb bidre,
  A helyed a sorban, Javítás / Hátrálás 1 tickkel, markout kept English, Végrehajtási kihívás, végrehajtási
  hiány), `sbxCh_obk-execution`.
- Deviations: (1) `fillOdds` as written in step 1 counted cancels as `cancelRate × ahead` *per second* of
  extra volume, which made the odds **rise** with shares ahead over long horizons; implemented instead as the
  queue thinning to `ahead·e^(−cancelRate·horizon)` (test pins monotonicity). The UI uses a 10 s horizon (at
  60 s everything is ~100%) and feeds it `sharesInFront` = better-priced levels + your queue (new helper), not
  just the queue at your price. (2) The reducer moved into `simReducer.ts` (pure, tested directly);
  `useOrderBookSim.ts` wraps it. (3) The limit side comes from the ticket's Buy/Sell switch; clicking any row
  rests a limit at that price, and rows that cross the touch are labelled marketable. (4) The sim starts
  paused and runs 1.5 s per simulated second at 1× (owner request, see LOG). (5) Only buy fills count toward
  the challenge. Verified on the dev server (limit placement, queue strip, deep-book challenge result,
  layout audit 360–1536 EN/HU dark: 0 failing); full build/test:seo pending (shared tree).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/04-order-book-queue.md`; confirm plan 03 is
> done and read its Findings. Implement plan 04: your resting limit orders in the ladder, the queue strip
> with fill odds, cancel & rejoin, your fills with markout, and the 5,000-share execution challenge
> (`obk-execution`) compared with one-shot and TWAP on the same seed, plus tests. Run the verification
> block, fill in Findings, append DONE to LOG.md, set plan 04 to `done`, and summarise.
