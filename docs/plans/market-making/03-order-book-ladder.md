# 03 — Order book lab I: live ladder, walk the book, predict

Status: done (2026-10-28, opus-spe; build/seo re-check pending) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: L

## Why
The order book is where every other market-making idea starts. The reader should *see* a live book move,
point at a price to say "take everything down to here", watch a market order eat level after level, and
feel that slippage cost grows faster than order size. This plan builds the lab's core; plan 04 adds your
own resting limit orders, queue position and the execution challenge on top.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01: `src/features/order-book/OrderBookView.tsx` is a stub (header + planned note); registry
  entry `order-book` (`/order-book`, `status: "planned"`, About + FAQ); copy table `src/Language/OrderBook.ts`
  /`.hu.ts` (`obkTitle`, `obkDesc`, `obkPlanned`); empty partial `src/styles/_order-book.scss` (already
  `@use`d in `main.scss`).
- After plan 02: `src/lib/market/` — `Book`, `FlowSpec`, `DEFAULT_FLOW`, `seedBook`, `fairPath`,
  `flowSchedule`, `applyTick`, `marketOrder`, `previewMarket`, `depth`, `bestBid/bestAsk/midTicks/spreadTicks`.
  Prices in integer ticks; convert with `ticks * spec.tick`.
- Primitives: `PageHeader` (`title`, `description`, `status`, `actions`), `Workspace` (`columns:
  "single" | "sidebar" | "split" | "thirds"`), `Panel`, `ChartContainer` (`title`, `actions`) from
  `src/components/layout`; `SegmentedControl`, `PredictReveal` (prop `input="plot"` = the lab sets the guess
  from its own figure), `usePredictReveal({ truth, tolerance, resetKey, challengeId })`, `PredictExplain`
  (`{ question, options: { text, feedback, correct? }[] }`), `StatCard`, `DataTable` from `src/components/ui`;
  `LineChart`, `ScatterChart`, `DragHandles` from `src/components/charts`; `useTicker(running, ms, tick,
  onStop)` and `prefersReducedMotion()` from `src/components/playback/useTicker.ts`; `SeedControl`
  (`src/components/SeedControl.tsx`, props `seed`, `setSeed`, `compact?`); `NumberStepper`
  (`src/components/NumberStepper.tsx`); URL helpers in `src/lib/urlState.ts` used through
  `src/components/useUrlState.ts` (see `src/features/capm/capm.url.ts` for a schema example).
- Do **not** use `src/components/game/*` panels here (they are styled for the amber `.gdesk` desk).

## Goal
1. A live price ladder you can play/pause/step, with a crowd placing, cancelling and taking liquidity.
2. Point-to-size: hovering or dragging on one side of the ladder previews a market order that takes
   everything to that row; send it and watch it walk the book.
3. Linked "depth before/after" and "slippage vs size" charts; Predict mode with a placed guess.

## Non-goals
- Your own resting limit orders, queue position, Challenge mode (plan 04). No edits to `src/lib/market`
  (if you need a helper there, add it in your folder and note it in Findings).

## Constraints
- README §2 interaction bar and house style. `.tsx` ≤ 150 lines; maths in `orderBook.math.ts`; copy in
  `OrderBook.ts`/`.hu.ts` (prefix `obk`); styles in `_order-book.scss`.
- Bids/buys `var(--positive)`, asks/sells `var(--negative)`, preview/your marks `var(--primary)`; every
  coloured number also has a sign or word.

## Steps
1. **Shared ladder helpers** — `src/lib/market/ladder.ts` (pure; the desk in plan 11 reuses it). If the file
   already exists (plan 11 may have created it first), import it and do not change its signatures; otherwise
   create it with exactly:
   ```ts
   export type LadderEntry = { price: number; bidSize: number; askSize: number; mine: { bid: number; ask: number };
     take: number; isBestBid: boolean; isBestAsk: boolean };
   /// Rows from centre + depth down to centre − depth (price-descending); `take` = shares a previewed market order consumes there.
   export function ladderRows(book: Book, depth: number, centre: number, preview?: { side: Side; size: number }): LadderEntry[];
   /// Ladder centre with hysteresis: keeps `prev` until |mid − prev| > band ticks.
   export function windowCentre(prev: number | null, mid: number, band = 3): number;
   ```
   (`mine` = your resting shares at that price, used by plan 04 and the desk.) Append a `CONTRACT` line to
   LOG.md when you create it. Test it in your test file.
2. **Types/maths** (`orderBook.types.ts`, `orderBook.math.ts`):
   `type ObkMode = "simulate" | "predict"` (plan 04 adds `"challenge"`); `type Liquidity = "thin" | "normal"
   | "deep"`; `presetSpec(l: Liquidity): FlowSpec` (spread `DEFAULT_FLOW`; thin: `depthPerLevel` 150,
   `limitRate` 3; deep: 1,200, 10); `slippageBp(avg, mid)` = side-signed `(avg − mid)/mid × 1e4`;
   `sizeToRow(book, side, price)` (cumulative size from the touch to `price`); `slippageCurve(book, side,
   sizes)`; `predictRound(seed, book)` → `{ side, size }` with size a multiple of 100 that walks 3–6 levels.
3. **Sim hook** (`useOrderBookSim.ts`): `useReducer` over `{ t, book, centre, events, lastFill }` with actions
   `tick`, `send(side, size)`, `reset(seed, liquidity)`. Precompute `fairPath` and `flowSchedule` for 3,600
   seconds per seed. `tick` applies `applyTick` and keeps the last 12 events. Playback: `useTicker(running,
   250 / speed, …)` with speeds 1×/4×; under reduced motion start paused and show a "Step" button.
4. **Lab hook** (`useOrderBookLab.ts`) + `orderBook.url.ts` (`mode`, `liquidity`, `side`, `size`, `seed`):
   preview size (from ticket or pointer), the walk animation step (`walkIndex` advanced every 120 ms after
   `send`, skipped under reduced motion), predict state via `usePredictReveal({ truth: avgPrice, tolerance:
   0.4 tick, resetKey: round, challengeId: "obk-avg-price" })`. In Predict mode the flow is paused and the
   book frozen.
5. **Ladder** (`components/BookLadder.tsx`, `LadderRow.tsx`): a `<table>` of 10 ask rows, a spread row
   (mid, spread in ticks and ¢), 10 bid rows; each row shows size, price and a depth bar (width ∝ size, max
   row = 100%; CSS `transition: width 160ms` disabled under reduced motion). Pointer over the ask half
   previews a **buy** to that row (bid half → sell); rows to be consumed get a `var(--primary)` tint and a
   "take 453" label; click sends. Keyboard: ladder is one focusable region; ↑/↓ move the preview row, Enter
   sends, Esc clears. Changed sizes flash with a background tint for 300 ms (no motion).
6. **Ticket and readouts** (`OrderTicket.tsx`, `BookReadouts.tsx`, `FillSummary.tsx`): side `SegmentedControl`,
   size `NumberStepper` (step 100), Send button; readouts best bid/ask, depth within ±5 ticks, levels hit,
   average price (4 decimals), slippage in bp and $; after a send, a fill table (price, filled, cumulative).
7. **Charts** (`DepthChart.tsx`, `SlippageChart.tsx`): cumulative depth vs price for both sides, the
   pre-send book dashed and the current book solid; a vertical `DragHandles` x-handle on the depth chart
   sets the same preview as the ladder (one state, two views). Slippage vs size curve for the current book
   (sizes 100…max depth), a marker for the previewed order and dots for every order sent this session.
8. **Event log** (`BookEventLog.tsx`): last 12 events, monospace, "+ bid 99.99 × 300", "− ask 100.02",
   "MKT BUY 1,600" (copy keys with interpolation, no hard-coded words).
9. **Predict** (`PredictPanel.tsx`): prompt "A market buy of {{size}} arrives. Where will it average?"; the
   reader drags a marker on a thin price ruler beside the ask side (0.1-tick steps, arrows on keyboard) — that
   sets `guess`; `PredictReveal input="plot"` shows reveal/retry/history. Below it a `PredictExplain`: "You
   double the order size. What happens to the total slippage cost?" options *about double* / *about four
   times* (correct: the average gets worse **and** you trade twice the shares) / *unchanged*.
10. **View** (`OrderBookView.tsx`): `PageHeader` with `actions` = mode `SegmentedControl`, liquidity
   `SegmentedControl`, `SeedControl compact`, Reset; `Workspace columns="thirds"` — left ticket + book shape,
   centre ladder (dominant, ≥ 50% width on desktop), right readouts + fill table + event log (or Predict panel);
   below, a `Workspace columns="split"` with the two charts. Phone (≤ 640px): ladder first, then ticket,
   readouts, charts.
11. **Wiring**: append `{ id: "obk-avg-price", area: "microstructure", moduleId: "order-book", kind: "place",
    tolerance: "±0.4¢" }` to `CHALLENGES`; `sbxCh_obk-avg-price` EN "Average fill price" / HU "Átlagos
    teljesítési ár" in `Sandbox.ts`/`.hu.ts`; set the registry entry's `status` to `"beta"`.
12. **Tests** `scripts/micro-order-book.test.mjs`: `ladderRows` take amounts sum to the previewed size and match
    `previewMarket`; `sizeToRow` ∘ preview round-trips; slippage curve is non-decreasing; `windowCentre`
    hysteresis; `predictRound` deterministic and walks 3–6 levels; presets produce valid specs.

## Acceptance criteria
- With the flow running, the ladder updates without layout jumps; pointing at a row previews exactly the
  rows that `previewMarket` would consume; sending animates the walk (instant under reduced motion).
- Dragging the depth-chart handle and pointing at the ladder drive the same preview.
- Predict saves one round per reveal (visible on `/sandbox` after plan 01's area exists).
- Smoke and layout audit clean; full keyboard path works (Tab → ladder → arrows → Enter).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:microstructure && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/order-book,/order-book?mode=predict,/order-book?liquidity=thin,/hu/order-book"
node scripts/layout-audit.mjs   # /order-book at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Jumping ladder:** if the ladder recentres on every mid change, rows slide under the pointer and clicks hit
  the wrong price. Use `windowCentre` hysteresis and key rows by price.
- **Re-render cost:** keep the sim in one reducer; don't store per-tick history beyond what is drawn; memoise
  `ladderRows` on `book`.
- **Preview vs truth:** the walk must use `marketOrder` on the *current* book at send time, not the previewed
  rows (the book may have changed in between); show the real fill table.
- Predict freezes the flow; switching back to Simulate resumes from the same `t`.
- The challenge test requires `challengeId: "obk-avg-price"` to appear exactly once in `src/features/**`.

## Findings (fill in during execution)
- Liquidity preset values used: thin `depthPerLevel` 150 / `limitRate` 3; normal = `DEFAULT_FLOW` (450 / 6);
  deep 1,200 / 10 (`presetSpec` in `orderBook.math.ts`).
- New HU keys for owner review: all new `obk*` keys in `src/Language/OrderBook.hu.ts` (e.g. "Árlétra",
  "Megbízási jegy", "Csúszás", "Vékony / Átlagos / Mély", "PIACI VÉTEL"), `sbxCh_obk-avg-price`.
- Deviations: `src/lib/market/ladder.ts` already existed (plan 11) and is used unchanged. The predict
  "price ruler" is a native range input (0.1-tick steps, arrow keys) in the Predict panel rather than a custom
  SVG ruler beside the ladder; "Try again" after a reveal starts a new question. The ladder panel does not use
  `Panel dominant` (that spans all grid columns); instead `_order-book.scss` widens the centre column to 2.2fr.
  The depth chart labels every other price tick (avoids label collisions), share axes use 2k-style labels, and
  page-header actions wrap via `.page-header-actions:has(.obk-actions)`. Verified on the dev server (smoke,
  a ladder-click send, a predict reveal, layout audit 360/768/1280/1536 EN+HU dark: 0 failing); full
  `npm run build`/`test:seo` pending while the stochastic-labs pack keeps the shared tree red.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/03-order-book-ladder.md`; confirm plans 01 and
> 02 are done (stop and report if not). Implement plan 03: the live order-book ladder with point-to-size
> previews, the animated walk, linked depth/slippage charts, Predict mode, the `obk-avg-price` challenge and
> tests. Run the verification block, fill in Findings, append DONE to LOG.md, set plan 03 to `done` in the
> README table, and summarise.
